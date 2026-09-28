"""Options flow: polling interval, cache TTL, alerts sensor."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.config_entries import ConfigFlowResult, OptionsFlow
from homeassistant.helpers.selector import BooleanSelector, NumberSelector, NumberSelectorConfig, NumberSelectorMode

from .const import CONF_ALERTS, CONF_CACHE_TTL, CONF_SCAN_INTERVAL, DEFAULT_CACHE_TTL, DEFAULT_SCAN_INTERVAL

OPTIONS_SCHEMA = vol.Schema(
    {
        vol.Optional(CONF_SCAN_INTERVAL, default=DEFAULT_SCAN_INTERVAL): NumberSelector(
            NumberSelectorConfig(min=5, max=3600, step=1, mode=NumberSelectorMode.BOX, unit_of_measurement="s")
        ),
        vol.Optional(CONF_CACHE_TTL, default=DEFAULT_CACHE_TTL): NumberSelector(
            NumberSelectorConfig(min=0, max=300, step=1, mode=NumberSelectorMode.BOX, unit_of_measurement="s")
        ),
        vol.Optional(CONF_ALERTS, default=False): BooleanSelector(),
    }
)


class PrometheusOptionsFlow(OptionsFlow):
    """Polling interval, cache TTL and alerts sensor."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(
                data={
                    CONF_SCAN_INTERVAL: int(user_input[CONF_SCAN_INTERVAL]),
                    CONF_CACHE_TTL: int(user_input[CONF_CACHE_TTL]),
                    CONF_ALERTS: bool(user_input[CONF_ALERTS]),
                }
            )
        return self.async_show_form(
            step_id="init",
            data_schema=self.add_suggested_values_to_schema(OPTIONS_SCHEMA, dict(self.config_entry.options)),
        )
