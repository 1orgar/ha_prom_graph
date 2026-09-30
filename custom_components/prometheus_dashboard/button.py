"""Buttons on the server device: send a test alert notification (normal / critical)."""

from __future__ import annotations

from homeassistant.components.button import ButtonEntity
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import PrometheusConfigEntry
from .sensor import device_info


async def async_setup_entry(
    hass: HomeAssistant,
    entry: PrometheusConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    async_add_entities([TestNotificationButton(entry, critical=False), TestNotificationButton(entry, critical=True)])


class TestNotificationButton(ButtonEntity):
    """Sends a test push to the configured notify services and a system notification."""

    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, entry: PrometheusConfigEntry, critical: bool) -> None:
        self._entry = entry
        self._critical = critical
        key = "test_notification_critical" if critical else "test_notification"
        self._attr_translation_key = key
        self._attr_unique_id = f"{entry.entry_id}_{key}"
        self._attr_device_info = device_info(entry)

    async def async_press(self) -> None:
        await self._entry.runtime_data.coordinator.notifier.async_send_test(critical=self._critical)
