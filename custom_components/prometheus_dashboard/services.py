"""`prometheus_dashboard.query` action: run PromQL from automations / scripts and use the result.

```yaml
action: prometheus_dashboard.query
data:
  query: sum(rate(node_network_receive_bytes_total[5m]))
response_variable: result   # result.series: [{labels, value}], result.value: first value
```
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv

from .api import PrometheusError, aggregate, result_values
from .const import AGGREGATES, DOMAIN, SERVICE_QUERY

ATTR_ENTRY_ID = "entry_id"
ATTR_QUERY = "query"
ATTR_TIME = "time"
ATTR_AGGREGATE = "aggregate"

QUERY_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_ENTRY_ID): cv.string,
        vol.Required(ATTR_QUERY): cv.string,
        vol.Optional(ATTR_TIME): vol.Any(cv.datetime, vol.Coerce(float)),
        vol.Optional(ATTR_AGGREGATE, default="first"): vol.In(AGGREGATES),
    }
)


def _entry(hass: HomeAssistant, entry_id: str | None):
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    if entry_id:
        entries = [e for e in entries if e.entry_id == entry_id]
    if not entries:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="server_not_found",
            translation_placeholders={"entry_id": entry_id or "-"},
        )
    return entries[0]


async def _async_query(call: ServiceCall) -> ServiceResponse:
    hass = call.hass
    entry = _entry(hass, call.data.get(ATTR_ENTRY_ID))
    params: dict[str, Any] = {"query": call.data[ATTR_QUERY]}
    if (at := call.data.get(ATTR_TIME)) is not None:
        params["time"] = at.timestamp() if hasattr(at, "timestamp") else at
    try:
        payload = await entry.runtime_data.client.request("/api/v1/query", params)
    except PrometheusError as err:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="query_failed",
            translation_placeholders={"error": str(err)},
        ) from err
    series = result_values(payload)
    return {
        "server": entry.title,
        "result_type": (payload.get("data") or {}).get("resultType"),
        "series": [{"labels": labels, "value": value} for labels, value in series],
        "value": aggregate([v for _l, v in series], call.data[ATTR_AGGREGATE]),
    }


def async_register_services(hass: HomeAssistant) -> None:
    hass.services.async_register(
        DOMAIN, SERVICE_QUERY, _async_query, schema=QUERY_SCHEMA, supports_response=SupportsResponse.ONLY
    )
