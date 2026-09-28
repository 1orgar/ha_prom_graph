"""Polling coordinator for PromQL sensors and Prometheus alerts (one per server)."""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass, field
from datetime import timedelta
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .api import PrometheusClient, PrometheusError, result_values
from .const import (
    CONF_ALERTS,
    CONF_QUERY,
    CONF_SCAN_INTERVAL,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
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

    queries: dict[str, QueryResult] = field(default_factory=dict)  # subentry_id -> result
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

    @property
    def has_work(self) -> bool:
        return bool(self.sensor_queries()) or self.alerts_enabled

    async def _async_update_data(self) -> PrometheusData:
        queries = self.sensor_queries()
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
        return data

    async def _fetch_alerts(self, data: PrometheusData) -> None:
        try:
            data.alerts = await self.client.alerts()
        except PrometheusError as err:
            data.alerts_error = str(err)
            if err.reason in ("cannot_connect", "timeout", "invalid_auth", "ssl_error"):
                raise
