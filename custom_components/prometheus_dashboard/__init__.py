"""Prometheus Dashboard - backend for the Prometheus Graph Cards.

The integration stores Prometheus connections and exposes a websocket API
(`prometheus_dashboard/*`) that proxies PromQL queries. Dashboard cards live in a
separate repository: https://github.com/1orgar/ha_prom_graph_cards
"""

from __future__ import annotations

from dataclasses import dataclass

from homeassistant.components import persistent_notification
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_STOP, Platform
from homeassistant.core import Event, HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .api import PrometheusClient
from .const import ACTION_SILENCE_PREFIX, CONF_CACHE_TTL, DEFAULT_CACHE_TTL, DOMAIN, EVENT_MOBILE_APP_ACTION
from .coordinator import PrometheusCoordinator
from .repairs import async_update_connection_issue
from .services import async_register_services
from .storage import AlertStateStore
from .websocket import async_register_websocket_commands

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
PLATFORMS: list[Platform] = [Platform.BINARY_SENSOR, Platform.BUTTON, Platform.SENSOR]


@dataclass
class PrometheusRuntimeData:
    """Objects shared by the websocket API and entities of one server."""

    client: PrometheusClient
    coordinator: PrometheusCoordinator


type PrometheusConfigEntry = ConfigEntry[PrometheusRuntimeData]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the websocket API, the `query` action and the notification action listener once."""
    async_register_websocket_commands(hass)
    async_register_services(hass)

    async def _on_mobile_action(event: Event) -> None:
        """"Silence" button of a push notification (mobile app)."""
        action = str(event.data.get("action") or "")
        if not action.startswith(ACTION_SILENCE_PREFIX):
            return
        for entry in hass.config_entries.async_loaded_entries(DOMAIN):
            if await entry.runtime_data.coordinator.async_handle_action(action):
                return

    hass.bus.async_listen(EVENT_MOBILE_APP_ACTION, _on_mobile_action)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: PrometheusConfigEntry) -> bool:
    """Set up a Prometheus server from a config entry."""
    ttl = float(entry.options.get(CONF_CACHE_TTL, DEFAULT_CACHE_TTL))
    client = PrometheusClient(hass, entry.data, cache_ttl=ttl)
    coordinator = PrometheusCoordinator(hass, entry, client)
    client.coordinator = coordinator
    entry.runtime_data = PrometheusRuntimeData(client=client, coordinator=coordinator)

    # alert state of the previous run (pending windows, firing alerts, sent notifications)
    await coordinator.async_restore_state()

    async def _save_on_stop(_event: Event) -> None:
        await coordinator.async_save_state()

    entry.async_on_unload(hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, _save_on_stop))

    if coordinator.has_work:
        # Do not fail setup when Prometheus is down: cards/websocket must keep working
        # and entities become available as soon as the server answers.
        await coordinator.async_refresh()
        async_update_connection_issue(hass, entry, coordinator.last_update_success, coordinator.last_exception)
        entry.async_on_unload(
            coordinator.async_add_listener(
                lambda: async_update_connection_issue(
                    hass, entry, coordinator.last_update_success, coordinator.last_exception
                )
            )
        )

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    # options / subentries changed -> reload to rebuild sensors and polling
    entry.async_on_unload(entry.add_update_listener(_async_reload))
    return True


async def _async_reload(hass: HomeAssistant, entry: PrometheusConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: PrometheusConfigEntry) -> bool:
    """Unload a config entry."""
    if unloaded := await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        # reload (options / subentries changed): the state is restored by the next setup, so
        # system notifications stay and firing alerts are not pushed again
        await entry.runtime_data.coordinator.async_save_state()
    return unloaded


async def async_remove_entry(hass: HomeAssistant, entry: PrometheusConfigEntry) -> None:
    """Deleted server: remove its notifications, saved alert state and repair issues."""
    async_update_connection_issue(hass, entry, True, None)
    store = AlertStateStore(hass, entry.entry_id)
    data = await store.async_load() or {}
    for nid in (data.get("notifier") or {}).get("persistent") or {}:
        persistent_notification.async_dismiss(hass, nid)
    await store.async_remove()
