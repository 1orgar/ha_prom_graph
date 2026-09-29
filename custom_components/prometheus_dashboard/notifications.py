"""Notifications of firing alerts: system (persistent) notifications and push via `notify.*`.

Every poll the coordinator passes a snapshot of all firing alerts (local PromQL rules and,
when the alerts sensor is on, Prometheus rules), grouped per rule / alertname:

- one persistent notification per group, updated while its series change, dismissed when resolved;
- one push per group and poll for newly firing series (and for resolved ones), sent to the
  configured `notify` services; `critical` severity -> critical push on iOS / alarm stream on Android.

The first snapshot after setup only syncs the persistent notifications: a Home Assistant restart
or a reload of the integration must not push alerts that were already firing.
"""

from __future__ import annotations

from dataclasses import dataclass, field
import logging
from typing import Any

from homeassistant.components import persistent_notification
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from .const import (
    CONF_NOTIFY_CRITICAL,
    CONF_NOTIFY_PERSISTENT,
    CONF_NOTIFY_RESOLVED,
    CONF_NOTIFY_SERVICES,
    CONF_NOTIFY_SEVERITIES,
    CONF_NOTIFY_SOURCES,
    DOMAIN,
    NOTIFY_SOURCES,
    SEVERITIES,
    SEVERITY_OTHER,
    SOURCE_PROMETHEUS,
)

_LOGGER = logging.getLogger(__name__)

DEFAULT_NOTIFY_SEVERITIES = ["critical", "warning", SEVERITY_OTHER]
MAX_LINES = 10  # series listed in one notification
HIDDEN_LABELS = {"alertname", "severity"}

SeriesKey = tuple[tuple[str, str], ...]


@dataclass
class AlertSeries:
    labels: dict[str, str]
    summary: str | None = None

    @property
    def key(self) -> SeriesKey:
        return tuple(sorted(self.labels.items()))

    def describe(self) -> str:
        labels = ", ".join(f"{k}={v}" for k, v in sorted(self.labels.items()) if k not in HIDDEN_LABELS)
        if self.summary and labels:
            return f"{self.summary} ({labels})"
        return self.summary or labels or "-"


@dataclass
class AlertGroup:
    """Firing series of one local rule (`local:<subentry>`) or one Prometheus alertname (`prometheus:<name>`)."""

    key: str
    name: str
    source: str
    severity: str | None = None
    series: list[AlertSeries] = field(default_factory=list)


def severity_class(severity: str | None) -> str:
    return severity if severity in SEVERITIES else SEVERITY_OTHER


def prometheus_groups(alerts: list[dict[str, Any]]) -> list[AlertGroup]:
    """Firing alerts of the Prometheus `/api/v1/alerts` response grouped by alertname."""
    groups: dict[str, AlertGroup] = {}
    for alert in alerts:
        if alert.get("state") != "firing" or alert.get("source") == "home_assistant":
            continue
        labels = dict(alert.get("labels") or {})
        name = labels.get("alertname") or "alert"
        group = groups.setdefault(
            name,
            AlertGroup(key=f"{SOURCE_PROMETHEUS}:{name}", name=name, source=SOURCE_PROMETHEUS,
                       severity=labels.get("severity")),
        )
        annotations = alert.get("annotations") or {}
        group.series.append(AlertSeries(labels, annotations.get("summary") or annotations.get("description")))
    return list(groups.values())


def _lines(series: list[AlertSeries]) -> list[str]:
    lines = [s.describe() for s in series[:MAX_LINES]]
    if len(series) > MAX_LINES:
        lines.append(f"… +{len(series) - MAX_LINES}")
    return lines



class AlertNotifier:
    """Diffs alert snapshots of one server and sends notifications."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.hass = hass
        self.entry = entry
        self._groups: dict[str, AlertGroup] = {}  # firing groups of the last snapshot
        self._persistent: dict[str, str] = {}  # notification id -> last message (skip unchanged)
        self._primed = False

    def _opt(self, key: str, default: Any) -> Any:
        return self.entry.options.get(key, default)

    @property
    def services(self) -> list[str]:
        return [s.removeprefix("notify.") for s in self._opt(CONF_NOTIFY_SERVICES, []) if s]

    def notification_id(self, group_key: str) -> str:
        return f"{DOMAIN}_{self.entry.entry_id}_{group_key}"

    @staticmethod
    def _title(group: AlertGroup, resolved: bool = False) -> str:
        sev = f" [{group.severity.upper()}]" if group.severity else ""
        return f"{'✅' if resolved else '🔴'} {group.name}{sev}"

    async def async_update(self, groups: list[AlertGroup], failed_sources: set[str] | None = None) -> None:
        """New snapshot of firing alerts; groups of `failed_sources` keep their previous state."""
        sources = set(self._opt(CONF_NOTIFY_SOURCES, NOTIFY_SOURCES))
        failed = failed_sources or set()
        current = {g.key: g for g in groups if g.source in sources and g.series}
        # a source that could not be fetched this time: no false "resolved"
        for key, group in self._groups.items():
            if group.source in failed and key not in current:
                current[key] = group
        push = self._primed
        self._primed = True

        for key, group in current.items():
            before = {s.key for s in self._groups[key].series} if key in self._groups else set()
            now = {s.key for s in group.series}
            self._sync_persistent(group)
            if not push:
                continue
            if added := [s for s in group.series if s.key not in before]:
                await self._push(group, added, resolved=False, whole_group=False)
            if key in self._groups and (gone := [s for s in self._groups[key].series if s.key not in now]):
                await self._push(group, gone, resolved=True, whole_group=False)

        for key, group in self._groups.items():
            if key in current:
                continue
            self._dismiss(self.notification_id(key))
            if push:
                await self._push(group, group.series, resolved=True, whole_group=True)
        self._groups = current

    # ---- persistent notifications (sidebar) ----
    def _sync_persistent(self, group: AlertGroup) -> None:
        if not self._opt(CONF_NOTIFY_PERSISTENT, True):
            return
        nid = self.notification_id(group.key)
        message = "\n".join(
            [f"**{len(group.series)}** firing · {self.entry.title}", "", *(f"- {line}" for line in _lines(group.series))]
        )
        if self._persistent.get(nid) == message:
            return  # unchanged: a notification dismissed by the user does not come back
        self._persistent[nid] = message
        persistent_notification.async_create(self.hass, message, title=self._title(group), notification_id=nid)

    def _dismiss(self, nid: str) -> None:
        if self._persistent.pop(nid, None) is not None:
            persistent_notification.async_dismiss(self.hass, nid)

    def async_dismiss_all(self) -> None:
        """Integration unloaded / removed: remove its notifications."""
        for nid in list(self._persistent):
            self._dismiss(nid)

    # ---- push (notify services, e.g. mobile_app_<phone>) ----
    def payload(self, group: AlertGroup, series: list[AlertSeries], resolved: bool, whole_group: bool) -> dict[str, Any]:
        nid = self.notification_id(group.key)
        # same `tag`: the "resolved" push replaces the "firing" one on the phone
        tag = nid if not resolved or whole_group else f"{nid}_resolved"
        data: dict[str, Any] = {"tag": tag, "group": DOMAIN}
        if not resolved and group.severity == "critical" and self._opt(CONF_NOTIFY_CRITICAL, True):
            data.update(
                {
                    # iOS: critical alert, plays a sound in silent / focus mode
                    "push": {"interruption-level": "critical", "sound": {"name": "default", "critical": 1, "volume": 1.0}},
                    # Android: delivered at once, rings through the alarm stream
                    "ttl": 0,
                    "priority": "high",
                    "channel": "alarm_stream",
                }
            )
        elif not resolved and group.severity in ("critical", "warning"):
            data.update({"ttl": 0, "priority": "high", "push": {"interruption-level": "time-sensitive"}})
        state = "RESOLVED" if resolved else "FIRING"
        message = "\n".join([f"{state} · {self.entry.title}", *_lines(series)])
        return {"title": self._title(group, resolved), "message": message, "data": data}

    async def _push(self, group: AlertGroup, series: list[AlertSeries], resolved: bool, whole_group: bool) -> None:
        services = self.services
        if not services or severity_class(group.severity) not in self._opt(CONF_NOTIFY_SEVERITIES, DEFAULT_NOTIFY_SEVERITIES):
            return
        if resolved and not self._opt(CONF_NOTIFY_RESOLVED, True):
            return
        payload = self.payload(group, series, resolved, whole_group)
        for service in services:
            try:
                await self.hass.services.async_call("notify", service, payload, blocking=False)
            except HomeAssistantError as err:
                _LOGGER.warning("Cannot send alert %s to notify.%s: %s", group.name, service, err)

