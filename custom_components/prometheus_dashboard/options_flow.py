"""Options flow: polling, cache, alerts sensor, alert notifications, Alertmanager.

The form uses sections; options are stored flat (`entry.options[key]`).
"""

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
    TextSelector,
    TextSelectorConfig,
    TextSelectorType,
)

from .alertmanager import AlertmanagerClient
from .api import PrometheusError, normalize_url
from .const import (
    CONF_ALERTMANAGER_URL,
    CONF_ALERTS,
    CONF_CACHE_TTL,
    CONF_NOTIFY_CRITICAL,
    CONF_NOTIFY_PERSISTENT,
    CONF_NOTIFY_REPEAT,
    CONF_NOTIFY_REPEAT_SEVERITIES,
    CONF_NOTIFY_RESOLVED,
    CONF_NOTIFY_SERVICES,
    CONF_NOTIFY_SEVERITIES,
    CONF_NOTIFY_SOURCES,
    CONF_SCAN_INTERVAL,
    CONF_SILENCE_DURATION,
    DEFAULT_CACHE_TTL,
    DEFAULT_SCAN_INTERVAL,
    DEFAULT_SILENCE_DURATION,
    NOTIFY_SEVERITIES,
    NOTIFY_SOURCES,
)
from .notifications import DEFAULT_NOTIFY_SEVERITIES, DEFAULT_REPEAT_SEVERITIES

SECTION_NOTIFICATIONS = "notifications"
SECTION_ALERTMANAGER = "alertmanager"
# legacy notify services that are not push targets
_SKIP_SERVICES = {"send_message", "persistent_notification"}
_INT_KEYS = {CONF_SCAN_INTERVAL, CONF_CACHE_TTL, CONF_NOTIFY_REPEAT, CONF_SILENCE_DURATION}


def notify_services(hass: HomeAssistant) -> list[SelectOptionDict]:
    """`notify.*` services, mobile app devices first."""
    names = sorted(s for s in hass.services.async_services_for_domain("notify") if s not in _SKIP_SERVICES)
    names.sort(key=lambda s: not s.startswith("mobile_app_"))
    return [SelectOptionDict(value=s, label=f"notify.{s}") for s in names]


def _number(max_value: int, unit: str, min_value: int = 0) -> NumberSelector:
    return NumberSelector(
        NumberSelectorConfig(min=min_value, max=max_value, step=1, mode=NumberSelectorMode.BOX, unit_of_measurement=unit)
    )


def _multi(options: list[str], translation_key: str) -> SelectSelector:
    return SelectSelector(
        SelectSelectorConfig(options=options, multiple=True, mode=SelectSelectorMode.LIST, translation_key=translation_key)
    )


def section_fields(hass: HomeAssistant) -> dict[str, dict[Any, Any]]:
    """Fields of every form section (`""` = top level) with their defaults."""
    return {
        "": {
            vol.Optional(CONF_SCAN_INTERVAL, default=DEFAULT_SCAN_INTERVAL): _number(3600, "s", 5),
            vol.Optional(CONF_CACHE_TTL, default=DEFAULT_CACHE_TTL): _number(300, "s"),
            vol.Optional(CONF_ALERTS, default=False): BooleanSelector(),
        },
        SECTION_NOTIFICATIONS: {
            vol.Optional(CONF_NOTIFY_PERSISTENT, default=True): BooleanSelector(),
            vol.Optional(CONF_NOTIFY_SERVICES, default=[]): SelectSelector(
                SelectSelectorConfig(
                    options=notify_services(hass), multiple=True, custom_value=True, mode=SelectSelectorMode.DROPDOWN
                )
            ),
            vol.Optional(CONF_NOTIFY_SEVERITIES, default=DEFAULT_NOTIFY_SEVERITIES): _multi(
                NOTIFY_SEVERITIES, "notify_severity"
            ),
            vol.Optional(CONF_NOTIFY_SOURCES, default=NOTIFY_SOURCES): _multi(NOTIFY_SOURCES, "notify_source"),
            vol.Optional(CONF_NOTIFY_CRITICAL, default=True): BooleanSelector(),
            vol.Optional(CONF_NOTIFY_RESOLVED, default=True): BooleanSelector(),
            vol.Optional(CONF_NOTIFY_REPEAT, default=0): _number(1440, "min"),
            vol.Optional(CONF_NOTIFY_REPEAT_SEVERITIES, default=DEFAULT_REPEAT_SEVERITIES): _multi(
                NOTIFY_SEVERITIES, "notify_severity"
            ),
        },
        SECTION_ALERTMANAGER: {
            vol.Optional(CONF_ALERTMANAGER_URL): TextSelector(TextSelectorConfig(type=TextSelectorType.URL)),
            vol.Optional(CONF_SILENCE_DURATION, default=DEFAULT_SILENCE_DURATION): _number(10080, "min", 1),
        },
    }


def options_schema(hass: HomeAssistant) -> vol.Schema:
    fields = section_fields(hass)
    schema: dict[Any, Any] = dict(fields[""])
    for name, sub in fields.items():
        if name:
            # optional with an empty default: a section missing in the input gets its defaults
            schema[vol.Optional(name, default={})] = section(
                vol.Schema(sub), {"collapsed": name == SECTION_ALERTMANAGER}
            )
    return vol.Schema(schema)


def _clean(key: str, value: Any) -> Any:
    if key in _INT_KEYS:
        return int(value or 0)
    if key == CONF_NOTIFY_SERVICES:
        return [s.removeprefix("notify.") for s in value or []]
    if key == CONF_ALERTMANAGER_URL:
        return normalize_url(value or "")
    return list(value) if isinstance(value, list) else value


def flatten(user_input: dict[str, Any], fields: dict[str, dict[Any, Any]]) -> dict[str, Any]:
    """Sectioned form input -> flat options (missing fields get their default)."""
    options: dict[str, Any] = {}
    for name, sub in fields.items():
        values = user_input if not name else user_input.get(name, {})
        for marker in sub:
            key = str(marker)
            if key in values:
                options[key] = _clean(key, values[key])
            elif marker.default is not vol.UNDEFINED:
                options[key] = _clean(key, marker.default())
    if not options.get(CONF_ALERTMANAGER_URL):
        options.pop(CONF_ALERTMANAGER_URL, None)
    return options


def unflatten(options: dict[str, Any], fields: dict[str, dict[Any, Any]]) -> dict[str, Any]:
    """Flat options -> values of the sectioned form."""
    out: dict[str, Any] = {}
    for name, sub in fields.items():
        values = {str(m): options[str(m)] for m in sub if str(m) in options}
        if name:
            out[name] = values
        else:
            out.update(values)
    return out


class PrometheusOptionsFlow(OptionsFlow):
    """Polling interval, cache TTL, alerts sensor, alert notifications and Alertmanager."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        placeholders = {"error_detail": "-"}
        fields = section_fields(self.hass)
        if user_input is not None:
            options = flatten(user_input, fields)
            if url := options.get(CONF_ALERTMANAGER_URL):
                if err := await self._test_alertmanager(url):
                    errors["base"] = "alertmanager_error"
                    placeholders["error_detail"] = err
            if not errors:
                return self.async_create_entry(data=options)
        suggested = user_input or unflatten(dict(self.config_entry.options), fields)
        return self.async_show_form(
            step_id="init",
            data_schema=self.add_suggested_values_to_schema(options_schema(self.hass), suggested),
            errors=errors,
            description_placeholders=placeholders,
        )

    async def _test_alertmanager(self, url: str) -> str | None:
        """Error text when Alertmanager does not answer, None when it works."""
        try:
            await AlertmanagerClient(self.hass, url, self.config_entry.data).active_silences()
        except PrometheusError as err:
            return str(err)
        return None

