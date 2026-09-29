"""Prometheus Dashboard - backend for the Prometheus Graph Cards.

The integration stores Prometheus connections and exposes a websocket API
(`prometheus_dashboard/*`) that proxies PromQL queries. Dashboard cards live in a
separate repository: https://github.com/1orgar/ha_prom_graph_cards
"""

from __future__ import annotations

from dataclasses import dataclass

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .api import PrometheusClient
from .const import CONF_CACHE_TTL, DEFAULT_CACHE_TTL, DOMAIN
from .coordinator import PrometheusCoordinator
from .repairs import async_update_connection_issue
from .websocket import async_register_websocket_commands

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
PLATFORMS: list[Platform] = [Platform.BINARY_SENSOR, Platform.SENSOR]


@dataclass
class PrometheusRuntimeData:
    """Objects shared by the websocket API and entities of one server."""

    client: PrometheusClient
    coordinator: PrometheusCoordinator


type PrometheusConfigEntry = ConfigEntry[PrometheusRuntimeData]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the websocket API once, independent of config entries."""
    async_register_websocket_commands(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: PrometheusConfigEntry) -> bool:
    """Set up a Prometheus server from a config entry."""
    ttl = float(entry.options.get(CONF_CACHE_TTL, DEFAULT_CACHE_TTL))
    client = PrometheusClient(hass, entry.data, cache_ttl=ttl)
    coordinator = PrometheusCoordinator(hass, entry, client)
    client.coordinator = coordinator
    entry.runtime_data = PrometheusRuntimeData(client=client, coordinator=coordinator)

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
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)


async def async_remove_entry(hass: HomeAssistant, entry: PrometheusConfigEntry) -> None:
    """Remove repair issues of a deleted server."""
    async_update_connection_issue(hass, entry, True, None)
