"""Alert state in `.storage/prometheus_dashboard.<entry_id>`: survives restarts of Home Assistant.

Saved (debounced) after every poll and on shutdown / unload:
- instances of PromQL alert rules (pending / firing, active since, keep_firing_for timers);
- notifier state (what was notified, reminders, "Silence" buttons of sent pushes).

State older than RESTORE_MAX_AGE is dropped: after a long outage alerts are evaluated from scratch.
"""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import DOMAIN, RESTORE_MAX_AGE, STORAGE_VERSION

_LOGGER = logging.getLogger(__name__)
SAVE_DELAY = 10  # seconds


class AlertStateStore:
    def __init__(self, hass: HomeAssistant, entry_id: str) -> None:
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, f"{DOMAIN}.{entry_id}")

    async def async_load(self) -> dict[str, Any] | None:
        """Saved state, or None when missing, unreadable or too old."""
        try:
            data = await self._store.async_load()
        except Exception:  # noqa: BLE001 - a broken file must not break setup
            _LOGGER.warning("Cannot read the saved alert state, starting from scratch", exc_info=True)
            return None
        if not data:
            return None
        age = dt_util.utcnow().timestamp() - float(data.get("saved_at") or 0)
        if age > RESTORE_MAX_AGE:
            _LOGGER.info("Saved alert state is %d min old, not restored", age // 60)
            return None
        return data

    def async_schedule_save(self, build: Any) -> None:
        """Debounced save; `build()` returns the state (called when the save happens)."""
        self._store.async_delay_save(lambda: {**build(), "saved_at": dt_util.utcnow().timestamp()}, SAVE_DELAY)

    async def async_save_now(self, state: dict[str, Any]) -> None:
        await self._store.async_save({**state, "saved_at": dt_util.utcnow().timestamp()})

    async def async_remove(self) -> None:
        await self._store.async_remove()
