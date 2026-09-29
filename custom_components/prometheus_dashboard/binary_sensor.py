"""PromQL alerts: one binary sensor (device class `problem`) per `alert` subentry."""

from __future__ import annotations

from typing import Any

from homeassistant.components.binary_sensor import BinarySensorDeviceClass, BinarySensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from . import PrometheusConfigEntry
from .alerting import STATE_FIRING, AlertRule
from .const import CONF_QUERY, MAX_ALERT_SERIES_ATTRIBUTE, SUBENTRY_ALERT
from .coordinator import PrometheusCoordinator
from .sensor import device_info


async def async_setup_entry(
    hass: HomeAssistant,
    entry: PrometheusConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data.coordinator
    for subentry in entry.subentries.values():
        if subentry.subentry_type != SUBENTRY_ALERT:
            continue
        async_add_entities(
            [PrometheusAlertBinarySensor(coordinator, entry, subentry.subentry_id)],
            config_subentry_id=subentry.subentry_id,
        )


class PrometheusAlertBinarySensor(CoordinatorEntity[PrometheusCoordinator], BinarySensorEntity):
    """On while at least one series of the query is firing (active for longer than `for`)."""

    _attr_has_entity_name = True
    _attr_name = None
    _attr_device_class = BinarySensorDeviceClass.PROBLEM
    # the series list changes often and can be long: keep it out of the recorder
    _unrecorded_attributes = frozenset({"series", "pending_series"})

    def __init__(self, coordinator: PrometheusCoordinator, entry: PrometheusConfigEntry, subentry_id: str) -> None:
        super().__init__(coordinator)
        subentry = entry.subentries[subentry_id]
        self._subentry_id = subentry_id
        self._query = subentry.data.get(CONF_QUERY)
        self._rule = AlertRule.from_subentry(subentry.title, dict(subentry.data))
        self._attr_unique_id = f"{entry.entry_id}_{subentry_id}"
        self._attr_device_info = device_info(entry, subentry_id, f"{entry.title} {subentry.title}", model="PromQL alert")

    @property
    def available(self) -> bool:
        data = self.coordinator.data
        result = data.queries.get(self._subentry_id) if data else None
        return super().available and result is not None and result.error is None

    @property
    def is_on(self) -> bool:
        return self.coordinator.alert_tracker.state(self._subentry_id) == STATE_FIRING

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        instances = self.coordinator.alert_tracker.instances(self._subentry_id)
        firing = [i for i in instances if i.state == STATE_FIRING]
        pending = [i for i in instances if i.state != STATE_FIRING]

        def row(i) -> dict[str, Any]:
            return {
                "labels": i.labels,
                "value": i.value,
                "active_since": i.active_since.isoformat(),
                "summary": self._rule.render_summary(i.labels, i.value),
            }

        return {
            "state": self.coordinator.alert_tracker.state(self._subentry_id),
            "query": self._query,
            "condition": self._rule.condition
            if self._rule.threshold is None
            else f"{self._rule.condition} {self._rule.threshold:g}",
            "for": int(self._rule.for_seconds),
            "severity": self._rule.severity,
            "firing_count": len(firing),
            "pending_count": len(pending),
            "series": [row(i) for i in firing[:MAX_ALERT_SERIES_ATTRIBUTE]],
            "pending_series": [row(i) for i in pending[:MAX_ALERT_SERIES_ATTRIBUTE]],
        }
