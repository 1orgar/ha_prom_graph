"""Polling coordinator for PromQL sensors and Prometheus alerts (one per server)."""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass, field
from datetime import timedelta
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .alerting import AlertRule, AlertTracker
from .api import PrometheusClient, PrometheusError, result_values
from .const import (
    CONF_ALERTS,
    CONF_QUERY,
    CONF_SCAN_INTERVAL,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    EVENT_ALERT,
    SUBENTRY_ALERT,
    SUBENTRY_SENSOR,
)

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry

_LOGGER = logging.getLogger(__name__)


@dataclass
class QueryResult:
    """Result of one sensor query."""

    series: list[tuple[dict[str, str], float]] = field(default_factory=list)
    error: str | None = None


@dataclass
class PrometheusData:
    """Snapshot produced by one coordinator update."""

    queries: dict[str, QueryResult] = field(default_factory=dict)  # subentry_id -> result (sensors + alert rules)
    alerts: list[dict[str, Any]] | None = None
    alerts_error: str | None = None


class PrometheusCoordinator(DataUpdateCoordinator[PrometheusData]):
    """Fetch all sensor queries (+ alerts) of one server in one cycle."""

    config_entry: ConfigEntry

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry, client: PrometheusClient) -> None:
        interval = int(entry.options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL))
        super().__init__(
            hass,
            _LOGGER,
            config_entry=entry,
            name=f"{DOMAIN} {entry.title}",
            update_interval=timedelta(seconds=max(5, interval)),
        )
        self.client = client
        self.alert_tracker = AlertTracker()

    @property
    def alerts_enabled(self) -> bool:
        return bool(self.config_entry.options.get(CONF_ALERTS, False))

    def sensor_queries(self) -> dict[str, str]:
        """subentry_id -> PromQL for all sensor subentries."""
        return {
            sub_id: sub.data[CONF_QUERY]
            for sub_id, sub in self.config_entry.subentries.items()
            if sub.subentry_type == SUBENTRY_SENSOR and sub.data.get(CONF_QUERY)
        }

    def alert_rules(self) -> dict[str, tuple[str, AlertRule]]:
        """subentry_id -> (PromQL, rule) for all alert subentries."""
        return {
            sub_id: (sub.data[CONF_QUERY], AlertRule.from_subentry(sub.title, dict(sub.data)))
            for sub_id, sub in self.config_entry.subentries.items()
            if sub.subentry_type == SUBENTRY_ALERT and sub.data.get(CONF_QUERY)
        }

    @property
    def has_work(self) -> bool:
        return bool(self.sensor_queries()) or bool(self.alert_rules()) or self.alerts_enabled

    def local_alerts(self) -> list[dict[str, Any]]:
        """Pending / firing PromQL alerts of Home Assistant in the Prometheus `/alerts` format."""
        out: list[dict[str, Any]] = []
        for sub_id, (_query, rule) in self.alert_rules().items():
            out.extend(self.alert_tracker.as_prometheus(sub_id, rule))
        return out

    def _evaluate_alerts(self, data: PrometheusData, rules: dict[str, tuple[str, AlertRule]]) -> None:
        now = dt_util.utcnow()
        self.alert_tracker.remove_missing(rules)
        for sub_id, (_query, rule) in rules.items():
            result = data.queries.get(sub_id)
            if result is None or result.error is not None:
                # keep the previous state while the query fails (no false "resolved")
                continue
            for t in self.alert_tracker.update(sub_id, rule, result.series, now):
                self.hass.bus.async_fire(
                    EVENT_ALERT,
                    {
                        "entry_id": self.config_entry.entry_id,
                        "alert": rule.name,
                        "state": t.state,
                        "severity": rule.severity,
                        "labels": t.labels,
                        "value": t.value,
                        "summary": rule.render_summary(t.labels, t.value) if t.value is not None else None,
                    },
                )

    async def _async_update_data(self) -> PrometheusData:
        queries = self.sensor_queries()
        rules = self.alert_rules()
        queries.update({sub_id: query for sub_id, (query, _rule) in rules.items()})
        data = PrometheusData()

        async def run(sub_id: str, promql: str) -> None:
            try:
                payload = await self.client.query(promql)
                data.queries[sub_id] = QueryResult(series=result_values(payload))
            except PrometheusError as err:
                # one broken query must not make the others unavailable
                data.queries[sub_id] = QueryResult(error=str(err))
                if err.reason in ("cannot_connect", "timeout", "invalid_auth", "ssl_error"):
                    raise

        tasks = [run(sub_id, q) for sub_id, q in queries.items()]
        if self.alerts_enabled:
            tasks.append(self._fetch_alerts(data))

        try:
            await asyncio.gather(*tasks)
        except PrometheusError as err:
            raise UpdateFailed(f"Prometheus {self.client.base_url}: {err}") from err
        self._evaluate_alerts(data, rules)
        return data

    async def _fetch_alerts(self, data: PrometheusData) -> None:
        try:
            data.alerts = await self.client.alerts()
        except PrometheusError as err:
            data.alerts_error = str(err)
            if err.reason in ("cannot_connect", "timeout", "invalid_auth", "ssl_error"):
                raise
