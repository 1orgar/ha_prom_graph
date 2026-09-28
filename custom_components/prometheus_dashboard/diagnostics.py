"""Diagnostics (Settings -> Integration -> ⋮ -> Download diagnostics)."""

from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.core import HomeAssistant

from . import PrometheusConfigEntry
from .const import CONF_PASSWORD, CONF_USERNAME

TO_REDACT = {CONF_PASSWORD, CONF_USERNAME}


async def async_get_config_entry_diagnostics(hass: HomeAssistant, entry: PrometheusConfigEntry) -> dict[str, Any]:
    runtime = entry.runtime_data
    coordinator = runtime.coordinator
    data = coordinator.data
    return {
        "entry": {
            "title": entry.title,
            "data": async_redact_data(dict(entry.data), TO_REDACT),
            "options": dict(entry.options),
            "subentries": [
                {"type": sub.subentry_type, "title": sub.title, "data": dict(sub.data)}
                for sub in entry.subentries.values()
            ],
        },
        "cache": runtime.client.cache.stats(),
        "coordinator": {
            "last_update_success": coordinator.last_update_success,
            "last_exception": str(coordinator.last_exception) if coordinator.last_exception else None,
            "update_interval": coordinator.update_interval.total_seconds() if coordinator.update_interval else None,
        },
        "queries": {
            sub_id: {"error": res.error, "series": len(res.series)}
            for sub_id, res in (data.queries.items() if data else [])
        },
        "alerts": None if not data or data.alerts is None else len(data.alerts),
    }
