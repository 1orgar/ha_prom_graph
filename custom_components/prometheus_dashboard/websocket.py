import logging
from typing import Any
from urllib.parse import urlencode

import aiohttp
import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import CONF_PASSWORD, CONF_PROMETHEUS_URL, CONF_USERNAME, CONF_VERIFY_SSL, DOMAIN

_LOGGER = logging.getLogger(__name__)


async def _proxy_prometheus(
    hass: HomeAssistant, entry_id: str, path: str, params: dict[str, Any] | None = None
) -> dict[str, Any]:
    """Proxy request to Prometheus."""
    if entry_id not in hass.data.get(DOMAIN, {}):
        raise ValueError(f"Unknown entry_id: {entry_id}")

    config = hass.data[DOMAIN][entry_id]
    base_url = config[CONF_PROMETHEUS_URL].rstrip("/")
    url = f"{base_url}{path}"
    
    if params:
        url = f"{url}?{urlencode(params, doseq=True)}"

    auth = None
    if config.get(CONF_USERNAME) and config.get(CONF_PASSWORD):
        auth = aiohttp.BasicAuth(config[CONF_USERNAME], config[CONF_PASSWORD])

    session = async_get_clientsession(hass)
    try:
        async with session.get(
            url, auth=auth, ssl=config.get(CONF_VERIFY_SSL, True), timeout=15
        ) as response:
            response.raise_for_status()
            return await response.json()
    except aiohttp.ClientError as err:
        _LOGGER.error("Error communicating with Prometheus at %s: %s", url, err)
        raise


@callback
def async_register_websocket_commands(hass: HomeAssistant) -> None:
    """Register websocket commands."""
    websocket_api.async_register_command(hass, ws_query)
    websocket_api.async_register_command(hass, ws_query_range)
    websocket_api.async_register_command(hass, ws_labels)
    websocket_api.async_register_command(hass, ws_label_values)
    websocket_api.async_register_command(hass, ws_series)
    websocket_api.async_register_command(hass, ws_metadata)
    websocket_api.async_register_command(hass, ws_entries)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "prometheus_dashboard/query",
        vol.Required("entry_id"): str,
        vol.Required("query"): str,
        vol.Optional("time"): vol.Coerce(str),
    }
)
@websocket_api.async_response
async def ws_query(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Handle prometheus_dashboard/query websocket command."""
    entry_id = msg["entry_id"]
    params = {"query": msg["query"]}
    if "time" in msg:
        params["time"] = msg["time"]

    try:
        result = await _proxy_prometheus(hass, entry_id, "/api/v1/query", params)
        connection.send_result(msg["id"], result)
    except Exception as err:
        connection.send_error(msg["id"], "unknown_error", str(err))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "prometheus_dashboard/query_range",
        vol.Required("entry_id"): str,
        vol.Required("query"): str,
        vol.Required("start"): vol.Coerce(str),
        vol.Required("end"): vol.Coerce(str),
        vol.Required("step"): vol.Coerce(str),
    }
)
@websocket_api.async_response
async def ws_query_range(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Handle prometheus_dashboard/query_range websocket command."""
    entry_id = msg["entry_id"]
    params = {
        "query": msg["query"],
        "start": msg["start"],
        "end": msg["end"],
        "step": msg["step"],
    }

    try:
        result = await _proxy_prometheus(hass, entry_id, "/api/v1/query_range", params)
        connection.send_result(msg["id"], result)
    except Exception as err:
        connection.send_error(msg["id"], "unknown_error", str(err))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "prometheus_dashboard/labels",
        vol.Required("entry_id"): str,
    }
)
@websocket_api.async_response
async def ws_labels(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Handle prometheus_dashboard/labels websocket command."""
    entry_id = msg["entry_id"]
    try:
        result = await _proxy_prometheus(hass, entry_id, "/api/v1/labels")
        connection.send_result(msg["id"], result)
    except Exception as err:
        connection.send_error(msg["id"], "unknown_error", str(err))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "prometheus_dashboard/label_values",
        vol.Required("entry_id"): str,
        vol.Required("label"): str,
    }
)
@websocket_api.async_response
async def ws_label_values(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Handle prometheus_dashboard/label_values websocket command."""
    entry_id = msg["entry_id"]
    label = msg["label"]
    try:
        result = await _proxy_prometheus(hass, entry_id, f"/api/v1/label/{label}/values")
        connection.send_result(msg["id"], result)
    except Exception as err:
        connection.send_error(msg["id"], "unknown_error", str(err))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "prometheus_dashboard/series",
        vol.Required("entry_id"): str,
        vol.Optional("match"): [str],
    }
)
@websocket_api.async_response
async def ws_series(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Handle prometheus_dashboard/series websocket command."""
    entry_id = msg["entry_id"]
    params = {}
    if "match" in msg:
        params["match[]"] = msg["match"]

    try:
        result = await _proxy_prometheus(hass, entry_id, "/api/v1/series", params)
        connection.send_result(msg["id"], result)
    except Exception as err:
        connection.send_error(msg["id"], "unknown_error", str(err))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "prometheus_dashboard/metadata",
        vol.Required("entry_id"): str,
        vol.Optional("metric"): str,
    }
)
@websocket_api.async_response
async def ws_metadata(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Handle prometheus_dashboard/metadata websocket command."""
    entry_id = msg["entry_id"]
    params = {}
    if "metric" in msg:
        params["metric"] = msg["metric"]

    try:
        result = await _proxy_prometheus(hass, entry_id, "/api/v1/metadata", params)
        connection.send_result(msg["id"], result)
    except Exception as err:
        connection.send_error(msg["id"], "unknown_error", str(err))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "prometheus_dashboard/entries",
    }
)
@websocket_api.async_response
async def ws_entries(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Handle prometheus_dashboard/entries websocket command."""
    try:
        entries = hass.data.get(DOMAIN, {})
        result = [
            {
                "entry_id": entry_id,
                "name": config.get("name", "Prometheus"),
                "url": config.get(CONF_PROMETHEUS_URL),
            }
            for entry_id, config in entries.items()
        ]
        connection.send_result(msg["id"], result)
    except Exception as err:
        connection.send_error(msg["id"], "unknown_error", str(err))
