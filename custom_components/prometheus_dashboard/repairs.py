"""Repair issue raised while a Prometheus server is unreachable."""

from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import issue_registry as ir

from .const import DOMAIN

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry


def issue_id(entry_id: str) -> str:
    return f"unreachable_{entry_id}"


@callback
def async_update_connection_issue(
    hass: HomeAssistant, entry: ConfigEntry, success: bool, error: BaseException | None
) -> None:
    """Create or delete the "server unreachable" repair issue."""
    if success:
        ir.async_delete_issue(hass, DOMAIN, issue_id(entry.entry_id))
        return
    ir.async_create_issue(
        hass,
        DOMAIN,
        issue_id(entry.entry_id),
        is_fixable=False,
        is_persistent=False,
        severity=ir.IssueSeverity.WARNING,
        translation_key="unreachable",
        translation_placeholders={"name": entry.title, "error": str(error) if error else "-"},
    )
