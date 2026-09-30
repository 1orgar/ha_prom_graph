"""Notifications of firing alerts: system (persistent) notifications and push via `notify.*`.

Every poll the coordinator passes a snapshot of all firing alerts (local PromQL rules and,
when the alerts sensor is on, Prometheus rules), grouped per rule / alertname:

- one persistent notification per group, updated while its series change, dismissed when resolved;
- one push per group and poll for newly firing series (and for resolved ones), sent to the
  configured `notify` services; `critical` severity -> critical push on iOS / alarm stream on Android.

The notifier state is saved with the alert state: after a restart only what changed while
Home Assistant was down is pushed. Without saved state (first start) the first snapshot only
syncs the persistent notifications.
"""

from __future__ import annotations

from dataclasses import dataclass, field
import logging
import secrets
from typing import Any

from homeassistant.components import persistent_notification
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.util import dt as dt_util

from .alertmanager import silenced_by
from .const import (
    ACTION_SILENCE_PREFIX,
    CONF_NOTIFY_CRITICAL,
    CONF_NOTIFY_PERSISTENT,
    CONF_NOTIFY_REPEAT,
    CONF_NOTIFY_REPEAT_SEVERITIES,
    CONF_NOTIFY_RESOLVED,
    CONF_NOTIFY_SERVICES,
    CONF_NOTIFY_SEVERITIES,
    CONF_NOTIFY_SOURCES,
    CONF_SILENCE_DURATION,
    DEFAULT_SILENCE_DURATION,
    DOMAIN,
    NOTIFY_SOURCES,
    SEVERITIES,
    SEVERITY_OTHER,
    SOURCE_PROMETHEUS,
)

_LOGGER = logging.getLogger(__name__)

DEFAULT_NOTIFY_SEVERITIES = ["critical", "warning", SEVERITY_OTHER]
DEFAULT_REPEAT_SEVERITIES = ["critical"]
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



ACTION_LABELS = {"en": "Silence for {m} min", "ru": "Заглушить на {m} мин"}
TEST_TEXT = {
    "en": ("Test notification", "Alert notifications of {server} work"),
    "ru": ("Тестовое уведомление", "Уведомления об алертах сервера {server} работают"),
}
MAX_ACTIONS = 50  # remembered "Silence" buttons (newest)


def _lang(hass: HomeAssistant) -> str:
    return (hass.config.language or "en").split("-")[0].lower()


def match_labels(group: AlertGroup, series: AlertSeries) -> dict[str, str]:
    """Labels an Alertmanager silence is matched against (like the ALERTS series of Prometheus)."""
    labels = {"alertname": group.name}
    if group.severity:
        labels["severity"] = group.severity
    return {**labels, **series.labels}


def _group_as_dict(group: AlertGroup) -> dict[str, Any]:
    return {
        "name": group.name,
        "source": group.source,
        "severity": group.severity,
        "series": [{"labels": s.labels, "summary": s.summary} for s in group.series],
    }


def _group_from_dict(key: str, data: dict[str, Any]) -> AlertGroup:
    return AlertGroup(
        key=key,
        name=str(data["name"]),
        source=str(data["source"]),
        severity=data.get("severity"),
        series=[AlertSeries(dict(s["labels"]), s.get("summary")) for s in data.get("series", [])],
    )


class AlertNotifier:
    """Diffs alert snapshots of one server and sends notifications.

    - silenced series (Alertmanager) are neither shown nor pushed, and do not push "resolved";
    - a still firing alert is pushed again every `notify_repeat` minutes (reminder);
    - pushes of firing alerts carry a "Silence" button when Alertmanager is configured.
    """

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry, alertmanager: Any = None) -> None:
        self.hass = hass
        self.entry = entry
        self.alertmanager = alertmanager  # AlertmanagerClient | None
        self._groups: dict[str, AlertGroup] = {}  # firing groups of the last snapshot
        self._muted: dict[str, set[SeriesKey]] = {}  # silenced series of these groups
        self._persistent: dict[str, str] = {}  # notification id -> last message (skip unchanged)
        self._last_push: dict[str, float] = {}  # group key -> time of the last firing / reminder push
        self._actions: dict[str, dict[str, Any]] = {}  # "Silence" button token -> series to silence
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

    def _muted_keys(self, group: AlertGroup, silences: list[dict[str, Any]] | None) -> set[SeriesKey]:
        if silences is None:
            # Alertmanager could not be asked this time: keep the previous silences
            known = {s.key for s in group.series}
            return self._muted.get(group.key, set()) & known
        return {s.key for s in group.series if silenced_by(silences, match_labels(group, s))}

    def _reminder_due(self, group: AlertGroup, now: float) -> bool:
        repeat = float(self._opt(CONF_NOTIFY_REPEAT, 0) or 0)
        if repeat <= 0 or severity_class(group.severity) not in self._opt(
            CONF_NOTIFY_REPEAT_SEVERITIES, DEFAULT_REPEAT_SEVERITIES
        ):
            return False
        last = self._last_push.setdefault(group.key, now)
        return now - last >= repeat * 60


    async def async_update(
        self,
        groups: list[AlertGroup],
        failed_sources: set[str] | None = None,
        silences: list[dict[str, Any]] | None = None,
    ) -> None:
        """New snapshot of firing alerts.

        `failed_sources`: sources that could not be fetched (their groups keep the previous state).
        `silences`: active Alertmanager silences, `None` = unknown (keep the previous ones).
        """
        now = dt_util.utcnow().timestamp()
        sources = set(self._opt(CONF_NOTIFY_SOURCES, NOTIFY_SOURCES))
        failed = failed_sources or set()
        current = {g.key: g for g in groups if g.source in sources and g.series}
        # a source that could not be fetched this time: no false "resolved"
        for key, group in self._groups.items():
            if group.source in failed and key not in current:
                current[key] = group
        muted = {key: self._muted_keys(group, silences) for key, group in current.items()}
        push = self._primed
        self._primed = True

        for key, group in current.items():
            prev = self._groups.get(key)
            prev_muted = self._muted.get(key, set())
            before = {s.key for s in prev.series} if prev else set()
            now_keys = {s.key for s in group.series}
            active = [s for s in group.series if s.key not in muted[key]]
            self._sync_persistent(group, active)
            if not push:
                if active:
                    self._last_push.setdefault(key, now)
                continue
            # new series, and series whose silence ended while they were still firing
            added = [s for s in active if s.key not in before or s.key in prev_muted]
            gone = [s for s in prev.series if s.key not in now_keys and s.key not in prev_muted] if prev else []
            if added:
                await self._push(group, added)
                self._last_push[key] = now
            elif active and self._reminder_due(group, now):
                await self._push(group, active, reminder=True)
                self._last_push[key] = now
            if gone:
                await self._push(group, gone, resolved=True)

        for key, group in self._groups.items():
            if key in current:
                continue
            self._dismiss(self.notification_id(key))
            self._last_push.pop(key, None)
            unmuted = [s for s in group.series if s.key not in self._muted.get(key, set())]
            if push and unmuted:
                await self._push(group, unmuted, resolved=True, whole_group=True)
        self._groups = current
        self._muted = muted

    # ---- persistence: no repeated pushes and no lost "resolved" after a restart ----
    def as_dict(self) -> dict[str, Any]:
        return {
            "groups": {k: _group_as_dict(g) for k, g in self._groups.items()},
            "muted": {k: [list(map(list, key)) for key in v] for k, v in self._muted.items() if v},
            "persistent": self._persistent,
            "last_push": self._last_push,
            "actions": self._actions,
        }

    def restore(self, data: dict[str, Any]) -> None:
        try:
            self._groups = {k: _group_from_dict(k, g) for k, g in (data.get("groups") or {}).items()}
            self._muted = {
                k: {tuple(tuple(p) for p in key) for key in v} for k, v in (data.get("muted") or {}).items()
            }
        except (KeyError, TypeError, ValueError):
            self._groups, self._muted = {}, {}
            return
        self._persistent = dict(data.get("persistent") or {})
        self._last_push = {k: float(v) for k, v in (data.get("last_push") or {}).items()}
        self._actions = dict(data.get("actions") or {})
        # the state is known: the next snapshot pushes only what changed while HA was down
        self._primed = True


    # ---- persistent notifications (sidebar) ----
    def _sync_persistent(self, group: AlertGroup, active: list[AlertSeries]) -> None:
        nid = self.notification_id(group.key)
        if not self._opt(CONF_NOTIFY_PERSISTENT, True):
            return
        if not active:
            self._dismiss(nid)  # everything silenced
            return
        message = "\n".join(
            [f"**{len(active)}** firing · {self.entry.title}", "", *(f"- {line}" for line in _lines(active))]
        )
        if self._persistent.get(nid) == message:
            return  # unchanged: a notification dismissed by the user does not come back
        self._persistent[nid] = message
        persistent_notification.async_create(self.hass, message, title=self._title(group), notification_id=nid)

    def _dismiss(self, nid: str) -> None:
        if self._persistent.pop(nid, None) is not None:
            persistent_notification.async_dismiss(self.hass, nid)

    def async_dismiss_all(self) -> None:
        """Integration removed: remove its notifications."""
        for nid in list(self._persistent):
            self._dismiss(nid)

    # ---- push (notify services, e.g. mobile_app_<phone>) ----
    def _silence_action(self, group: AlertGroup, series: list[AlertSeries]) -> dict[str, str] | None:
        """"Silence" button of a firing push (Alertmanager configured, one series per button)."""
        if self.alertmanager is None or len(series) != 1:
            return None
        token = secrets.token_hex(6)
        self._actions[token] = {"labels": match_labels(group, series[0]), "alert": group.name}
        while len(self._actions) > MAX_ACTIONS:
            self._actions.pop(next(iter(self._actions)))
        minutes = int(self._opt(CONF_SILENCE_DURATION, DEFAULT_SILENCE_DURATION))
        label = ACTION_LABELS.get(_lang(self.hass), ACTION_LABELS["en"]).format(m=minutes)
        return {"action": f"{ACTION_SILENCE_PREFIX}{token}", "title": label}

    def payload(
        self,
        group: AlertGroup,
        series: list[AlertSeries],
        resolved: bool = False,
        whole_group: bool = False,
        reminder: bool = False,
    ) -> dict[str, Any]:
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
        if not resolved and (action := self._silence_action(group, series)):
            data["actions"] = [action]
        state = "RESOLVED" if resolved else ("STILL FIRING" if reminder else "FIRING")
        message = "\n".join([f"{state} · {self.entry.title}", *_lines(series)])
        return {"title": self._title(group, resolved), "message": message, "data": data}

    async def _push(
        self,
        group: AlertGroup,
        series: list[AlertSeries],
        resolved: bool = False,
        whole_group: bool = False,
        reminder: bool = False,
    ) -> None:
        if severity_class(group.severity) not in self._opt(CONF_NOTIFY_SEVERITIES, DEFAULT_NOTIFY_SEVERITIES):
            return
        if resolved and not self._opt(CONF_NOTIFY_RESOLVED, True):
            return
        if self.services:
            await self._send(self.payload(group, series, resolved, whole_group, reminder), group.name)

    async def _send(self, payload: dict[str, Any], what: str) -> None:
        for service in self.services:
            try:
                await self.hass.services.async_call("notify", service, payload, blocking=False)
            except HomeAssistantError as err:
                _LOGGER.warning("Cannot send %s to notify.%s: %s", what, service, err)

    async def async_send_test(self, critical: bool = False) -> int:
        """Test push to all configured services (+ a system notification); returns the number of services."""
        title, text = TEST_TEXT.get(_lang(self.hass), TEST_TEXT["en"])
        group = AlertGroup(key="test", name=title, source="test", severity="critical" if critical else "info")
        payload = self.payload(group, [AlertSeries({}, text.format(server=self.entry.title))])
        payload["data"].pop("actions", None)
        persistent_notification.async_create(
            self.hass, payload["message"], title=payload["title"], notification_id=self.notification_id("test")
        )
        await self._send(payload, "test notification")
        return len(self.services)

    def pop_action(self, token: str) -> dict[str, Any] | None:
        """Series of a pressed "Silence" button (each button works once)."""
        return self._actions.pop(token, None)

