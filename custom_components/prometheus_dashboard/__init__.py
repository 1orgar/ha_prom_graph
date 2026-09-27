import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN
from .websocket import async_register_websocket_commands

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Prometheus Dashboard from a config entry."""
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = entry.data

    # Register websocket commands only once
    if "ws_registered" not in hass.data[DOMAIN]:
        async_register_websocket_commands(hass)
        hass.data[DOMAIN]["ws_registered"] = True

        # Register static path for frontend JS
        frontend_path = Path(__file__).parent / "frontend"
        if frontend_path.exists():
            await hass.http.async_register_static_paths(
                [
                    StaticPathConfig(
                        "/prometheus_dashboard/frontend",
                        str(frontend_path),
                        cache_headers=False,
                    )
                ]
            )
            _LOGGER.info("Registered static path for Prometheus Dashboard frontend")
        else:
            _LOGGER.warning("Frontend path %s does not exist", frontend_path)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    if entry.entry_id in hass.data.get(DOMAIN, {}):
        hass.data[DOMAIN].pop(entry.entry_id)

    return True
