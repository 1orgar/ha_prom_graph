"""Prometheus Dashboard - backend for the Prometheus Graph Cards.

The integration stores Prometheus connections and exposes a websocket API
(`prometheus_dashboard/*`) that proxies PromQL queries. Dashboard cards live in a
separate repository: https://github.com/1orgar/ha_prom_graph_cards
"""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .api import PrometheusClient
from .const import DOMAIN
from .websocket import async_register_websocket_commands

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

PrometheusConfigEntry = ConfigEntry[PrometheusClient]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the websocket API once, independent of config entries."""
    async_register_websocket_commands(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: PrometheusConfigEntry) -> bool:
    """Set up a Prometheus server from a config entry."""
    entry.runtime_data = PrometheusClient(hass, entry.data)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: PrometheusConfigEntry) -> bool:
    """Unload a config entry."""
    return True
