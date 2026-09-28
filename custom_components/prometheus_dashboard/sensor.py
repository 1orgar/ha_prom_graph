"""PromQL sensors (one per `sensor` subentry) and the alerts sensor."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity, SensorStateClass
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from . import PrometheusConfigEntry
from .api import aggregate
from .const import (
    CONF_AGGREGATE,
    CONF_DEVICE_CLASS,
    CONF_PRECISION,
    CONF_QUERY,
    CONF_STATE_CLASS,
    CONF_UNIT,
    DOMAIN,
    SUBENTRY_SENSOR,
)
from .coordinator import PrometheusCoordinator

MAX_SERIES_ATTRIBUTE = 20
MAX_ALERTS_ATTRIBUTE = 50


def device_info(entry: PrometheusConfigEntry, subentry_id: str | None = None, name: str | None = None) -> DeviceInfo:
    """Server device for entry-level entities; one device per sensor subentry.

    A device belongs to exactly one config subentry in current Home Assistant,
    so subentry sensors must not share the server device.
    """
    identifier = entry.entry_id if subentry_id is None else f"{entry.entry_id}_{subentry_id}"
    return DeviceInfo(
        identifiers={(DOMAIN, identifier)},
        name=name or entry.title,
        manufacturer="Prometheus",
        model="PromQL sensor" if subentry_id else "Prometheus server",
        entry_type=DeviceEntryType.SERVICE,
        configuration_url=entry.runtime_data.client.base_url,
    )


async def async_setup_entry(
    hass: HomeAssistant,
    entry: PrometheusConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data.coordinator
    if coordinator.alerts_enabled:
        async_add_entities([PrometheusAlertsSensor(coordinator, entry)])
    for subentry in entry.subentries.values():
        if subentry.subentry_type != SUBENTRY_SENSOR:
            continue
        async_add_entities(
            [PrometheusQuerySensor(coordinator, entry, subentry.subentry_id)],
            config_subentry_id=subentry.subentry_id,
        )


class PrometheusQuerySensor(CoordinatorEntity[PrometheusCoordinator], SensorEntity):
    """Value of a PromQL instant query."""

    _attr_has_entity_name = True
    _attr_name = None  # entity name == device name ("<server> <sensor title>")

    def __init__(self, coordinator: PrometheusCoordinator, entry: PrometheusConfigEntry, subentry_id: str) -> None:
        super().__init__(coordinator)
        subentry = entry.subentries[subentry_id]
        self._subentry_id = subentry_id
        self._conf = dict(subentry.data)
        self._attr_unique_id = f"{entry.entry_id}_{subentry_id}"
        self._attr_device_info = device_info(entry, subentry_id, f"{entry.title} {subentry.title}")
        self._attr_native_unit_of_measurement = self._conf.get(CONF_UNIT) or None
        if device_class := self._conf.get(CONF_DEVICE_CLASS):
            self._attr_device_class = SensorDeviceClass(device_class)
        if state_class := self._conf.get(CONF_STATE_CLASS):
            self._attr_state_class = SensorStateClass(state_class)
        if (precision := self._conf.get(CONF_PRECISION)) not in (None, ""):
            self._attr_suggested_display_precision = int(precision)

    @property
    def _result(self):
        data = self.coordinator.data
        return data.queries.get(self._subentry_id) if data else None

    @property
    def available(self) -> bool:
        result = self._result
        return super().available and result is not None and result.error is None

    @property
    def native_value(self) -> float | None:
        result = self._result
        if result is None or not result.series:
            return None
        value = aggregate([v for _, v in result.series], self._conf.get(CONF_AGGREGATE, "first"))
        if value is None:
            return None
        return int(value) if self._conf.get(CONF_AGGREGATE) == "count" else value

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        result = self._result
        attrs: dict[str, Any] = {"query": self._conf.get(CONF_QUERY)}
        if result is None:
            return attrs
        attrs["series_count"] = len(result.series)
        if len(result.series) == 1:
            attrs["labels"] = result.series[0][0]
        elif result.series:
            attrs["series"] = [
                {"labels": labels, "value": value} for labels, value in result.series[:MAX_SERIES_ATTRIBUTE]
            ]
        return attrs


class PrometheusAlertsSensor(CoordinatorEntity[PrometheusCoordinator], SensorEntity):
    """Number of firing alerts; the alert list is exposed as attributes."""

    _attr_has_entity_name = True
    _attr_translation_key = "alerts"
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_icon = "mdi:bell-alert"

    def __init__(self, coordinator: PrometheusCoordinator, entry: PrometheusConfigEntry) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{entry.entry_id}_alerts"
        self._attr_device_info = device_info(entry)

    @property
    def available(self) -> bool:
        data = self.coordinator.data
        return super().available and data is not None and data.alerts is not None

    def _alerts(self) -> list[dict[str, Any]]:
        data = self.coordinator.data
        return list(data.alerts or []) if data else []

    @property
    def native_value(self) -> int:
        return sum(1 for a in self._alerts() if a.get("state") == "firing")

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        alerts = self._alerts()
        pending = sum(1 for a in alerts if a.get("state") == "pending")
        return {
            "pending": pending,
            "alerts": [
                {
                    "name": a.get("labels", {}).get("alertname"),
                    "state": a.get("state"),
                    "severity": a.get("labels", {}).get("severity"),
                    "summary": (a.get("annotations") or {}).get("summary"),
                    "active_at": a.get("activeAt"),
                    "labels": a.get("labels"),
                }
                for a in alerts[:MAX_ALERTS_ATTRIBUTE]
            ],
        }
