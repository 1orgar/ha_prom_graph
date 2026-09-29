"""Websocket API used by the dashboard cards."""

from __future__ import annotations

import logging
from collections.abc import Awaitable, Callable
from functools import wraps
from typing import Any
from urllib.parse import quote

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback

from .api import PrometheusClient, PrometheusError
from .const import CONF_NAME, CONF_PROMETHEUS_URL, DEFAULT_NAME, DOMAIN

_LOGGER = logging.getLogger(__name__)

ENTRY_ID = vol.Optional("entry_id")

Handler = Callable[[dict[str, Any], PrometheusClient], Awaitable[Any]]


def _get_client(hass: HomeAssistant, entry_id: str | None) -> PrometheusClient:
    """Return the client for `entry_id`, or the first loaded entry if not given."""
    entries = [e for e in hass.config_entries.async_entries(DOMAIN) if e.state is ConfigEntryState.LOADED]
    if entry_id:
        for entry in entries:
            if entry.entry_id == entry_id:
                return entry.runtime_data.client
        raise LookupError(f"Prometheus server {entry_id} is not configured or not loaded")
    if not entries:
        raise LookupError("No Prometheus server configured. Add the Prometheus Dashboard integration first")
    return entries[0].runtime_data.client


def _proxy(handler: Handler):
    """Resolve the client, run the handler and translate errors to websocket errors."""

    @wraps(handler)
    async def wrapper(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
        try:
            client = _get_client(hass, msg.get("entry_id") or None)
        except LookupError as err:
            connection.send_error(msg["id"], "not_found", str(err))
            return
        try:
            result = await handler(msg, client)
        except PrometheusError as err:
            connection.send_error(msg["id"], err.reason, str(err))
            return
        except Exception as err:  # noqa: BLE001
            _LOGGER.exception("Unexpected error in %s", msg["type"])
            connection.send_error(msg["id"], "unknown_error", str(err))
            return
        connection.send_result(msg["id"], result)

    return wrapper


@callback
def async_register_websocket_commands(hass: HomeAssistant) -> None:
    """Register websocket commands."""
    for command in (
        ws_query,
        ws_query_range,
        ws_labels,
        ws_label_values,
        ws_series,
        ws_metadata,
        ws_alerts,
        ws_entries,
    ):
        websocket_api.async_register_command(hass, command)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "prometheus_dashboard/query",
        ENTRY_ID: str,
        vol.Required("query"): str,
        vol.Optional("time"): vol.Coerce(str),
    }
)
@websocket_api.async_response
@_proxy
async def ws_query(msg: dict[str, Any], client: PrometheusClient) -> dict[str, Any]:
    """Instant query."""
    params = {"query": msg["query"]}
    if "time" in msg:
        params["time"] = msg["time"]
    return await client.request("/api/v1/query", params)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "prometheus_dashboard/query_range",
        ENTRY_ID: str,
        vol.Required("query"): str,
        vol.Required("start"): vol.Coerce(str),
        vol.Required("end"): vol.Coerce(str),
        vol.Required("step"): vol.Coerce(str),
    }
)
@websocket_api.async_response
@_proxy
async def ws_query_range(msg: dict[str, Any], client: PrometheusClient) -> dict[str, Any]:
    """Range query."""
    params = {key: msg[key] for key in ("query", "start", "end", "step")}
    return await client.request("/api/v1/query_range", params)


@websocket_api.websocket_command({vol.Required("type"): "prometheus_dashboard/labels", ENTRY_ID: str})
@websocket_api.async_response
@_proxy
async def ws_labels(msg: dict[str, Any], client: PrometheusClient) -> dict[str, Any]:
    """List label names."""
    return await client.request("/api/v1/labels")


@websocket_api.websocket_command(
    {
        vol.Required("type"): "prometheus_dashboard/label_values",
        ENTRY_ID: str,
        vol.Required("label"): str,
    }
)
@websocket_api.async_response
@_proxy
async def ws_label_values(msg: dict[str, Any], client: PrometheusClient) -> dict[str, Any]:
    """List values of a label."""
    return await client.request(f"/api/v1/label/{quote(msg['label'], safe='')}/values")


@websocket_api.websocket_command(
    {
        vol.Required("type"): "prometheus_dashboard/series",
        ENTRY_ID: str,
        vol.Optional("match"): [str],
    }
)
@websocket_api.async_response
@_proxy
async def ws_series(msg: dict[str, Any], client: PrometheusClient) -> dict[str, Any]:
    """Find series by matchers."""
    params = {"match[]": msg["match"]} if msg.get("match") else None
    return await client.request("/api/v1/series", params)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "prometheus_dashboard/metadata",
        ENTRY_ID: str,
        vol.Optional("metric"): str,
    }
)
@websocket_api.async_response
@_proxy
async def ws_metadata(msg: dict[str, Any], client: PrometheusClient) -> dict[str, Any]:
    """Metric metadata."""
    params = {"metric": msg["metric"]} if msg.get("metric") else None
    return await client.request("/api/v1/metadata", params)


@websocket_api.websocket_command({vol.Required("type"): "prometheus_dashboard/alerts", ENTRY_ID: str})
@websocket_api.async_response
@_proxy
async def ws_alerts(msg: dict[str, Any], client: PrometheusClient) -> dict[str, Any]:
    """Active alerts of the server + PromQL alerts evaluated by Home Assistant."""
    alerts = await client.alerts()
    coordinator = getattr(client, "coordinator", None)
    if coordinator is not None:
        alerts = [*alerts, *coordinator.local_alerts()]
    return {"alerts": alerts}


@websocket_api.websocket_command({vol.Required("type"): "prometheus_dashboard/entries"})
@callback
def ws_entries(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """List configured Prometheus servers."""
    connection.send_result(
        msg["id"],
        [
            {
                "entry_id": entry.entry_id,
                "name": entry.title or entry.data.get(CONF_NAME, DEFAULT_NAME),
                "url": entry.data.get(CONF_PROMETHEUS_URL),
                "loaded": entry.state is ConfigEntryState.LOADED,
                "cache": entry.runtime_data.client.cache.stats()
                if entry.state is ConfigEntryState.LOADED
                else None,
            }
            for entry in hass.config_entries.async_entries(DOMAIN)
        ],
    )
