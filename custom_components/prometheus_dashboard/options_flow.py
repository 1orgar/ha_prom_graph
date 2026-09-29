"""Options flow: polling interval, cache TTL, alerts sensor."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.config_entries import ConfigFlowResult, OptionsFlow
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import section
from homeassistant.helpers.selector import (
    BooleanSelector,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
)

from .const import (
    CONF_ALERTS,
    CONF_CACHE_TTL,
    CONF_NOTIFY_CRITICAL,
    CONF_NOTIFY_PERSISTENT,
    CONF_NOTIFY_RESOLVED,
    CONF_NOTIFY_SERVICES,
    CONF_NOTIFY_SEVERITIES,
    CONF_NOTIFY_SOURCES,
    DEFAULT_CACHE_TTL,
    DEFAULT_SCAN_INTERVAL,
    CONF_SCAN_INTERVAL,
    NOTIFY_SEVERITIES,
    NOTIFY_SOURCES,
)
from .notifications import DEFAULT_NOTIFY_SEVERITIES

SECTION_NOTIFICATIONS = "notifications"
NOTIFY_KEYS = (
    CONF_NOTIFY_PERSISTENT,
    CONF_NOTIFY_SERVICES,
    CONF_NOTIFY_SEVERITIES,
    CONF_NOTIFY_SOURCES,
    CONF_NOTIFY_CRITICAL,
    CONF_NOTIFY_RESOLVED,
)
# legacy notify services that are not push targets
_SKIP_SERVICES = {"send_message", "persistent_notification"}


def notify_services(hass: HomeAssistant) -> list[SelectOptionDict]:
    """`notify.*` services, mobile app devices first."""
    names = sorted(s for s in hass.services.async_services_for_domain("notify") if s not in _SKIP_SERVICES)
    names.sort(key=lambda s: not s.startswith("mobile_app_"))
    return [SelectOptionDict(value=s, label=f"notify.{s}") for s in names]


def options_schema(hass: HomeAssistant) -> vol.Schema:
    return vol.Schema(
        {
            vol.Optional(CONF_SCAN_INTERVAL, default=DEFAULT_SCAN_INTERVAL): NumberSelector(
                NumberSelectorConfig(min=5, max=3600, step=1, mode=NumberSelectorMode.BOX, unit_of_measurement="s")
            ),
            vol.Optional(CONF_CACHE_TTL, default=DEFAULT_CACHE_TTL): NumberSelector(
                NumberSelectorConfig(min=0, max=300, step=1, mode=NumberSelectorMode.BOX, unit_of_measurement="s")
            ),
            vol.Optional(CONF_ALERTS, default=False): BooleanSelector(),
            vol.Required(SECTION_NOTIFICATIONS): section(
                vol.Schema(
                    {
                        vol.Optional(CONF_NOTIFY_PERSISTENT, default=True): BooleanSelector(),
                        vol.Optional(CONF_NOTIFY_SERVICES, default=[]): SelectSelector(
                            SelectSelectorConfig(
                                options=notify_services(hass), multiple=True, custom_value=True,
                                mode=SelectSelectorMode.DROPDOWN,
                            )
                        ),
                        vol.Optional(CONF_NOTIFY_SEVERITIES, default=DEFAULT_NOTIFY_SEVERITIES): SelectSelector(
                            SelectSelectorConfig(
                                options=NOTIFY_SEVERITIES, multiple=True, mode=SelectSelectorMode.LIST,
                                translation_key="notify_severity",
                            )
                        ),
                        vol.Optional(CONF_NOTIFY_SOURCES, default=NOTIFY_SOURCES): SelectSelector(
                            SelectSelectorConfig(
                                options=NOTIFY_SOURCES, multiple=True, mode=SelectSelectorMode.LIST,
                                translation_key="notify_source",
                            )
                        ),
                        vol.Optional(CONF_NOTIFY_CRITICAL, default=True): BooleanSelector(),
                        vol.Optional(CONF_NOTIFY_RESOLVED, default=True): BooleanSelector(),
                    }
                ),
                {"collapsed": False},
            ),
        }
    )


class PrometheusOptionsFlow(OptionsFlow):
    """Polling interval, cache TTL, alerts sensor and alert notifications."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            notify = user_input.get(SECTION_NOTIFICATIONS, {})
            return self.async_create_entry(
                data={
                    CONF_SCAN_INTERVAL: int(user_input[CONF_SCAN_INTERVAL]),
                    CONF_CACHE_TTL: int(user_input[CONF_CACHE_TTL]),
                    CONF_ALERTS: bool(user_input[CONF_ALERTS]),
                    CONF_NOTIFY_PERSISTENT: bool(notify.get(CONF_NOTIFY_PERSISTENT, True)),
                    CONF_NOTIFY_SERVICES: [s.removeprefix("notify.") for s in notify.get(CONF_NOTIFY_SERVICES, [])],
                    CONF_NOTIFY_SEVERITIES: list(notify.get(CONF_NOTIFY_SEVERITIES, DEFAULT_NOTIFY_SEVERITIES)),
                    CONF_NOTIFY_SOURCES: list(notify.get(CONF_NOTIFY_SOURCES, NOTIFY_SOURCES)),
                    CONF_NOTIFY_CRITICAL: bool(notify.get(CONF_NOTIFY_CRITICAL, True)),
                    CONF_NOTIFY_RESOLVED: bool(notify.get(CONF_NOTIFY_RESOLVED, True)),
                }
            )
        options = dict(self.config_entry.options)
        suggested = {
            **{k: v for k, v in options.items() if k not in NOTIFY_KEYS},
            SECTION_NOTIFICATIONS: {k: options[k] for k in NOTIFY_KEYS if k in options},
        }
        return self.async_show_form(
            step_id="init",
            data_schema=self.add_suggested_values_to_schema(options_schema(self.hass), suggested),
        )
