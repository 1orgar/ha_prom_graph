"""Subentry flow: add / edit a PromQL alert rule (evaluated by Home Assistant)."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.config_entries import ConfigEntry, ConfigSubentryFlow, SubentryFlowResult
from homeassistant.const import CONF_NAME
from homeassistant.core import HomeAssistant
from homeassistant.helpers.selector import (
    BooleanSelector,
    DurationSelector,
    DurationSelectorConfig,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
    TextSelectorConfig,
)

from .alerting import AlertRule
from .api import PrometheusClient, PrometheusError, result_values
from .const import (
    CONDITION_ANY,
    CONDITIONS,
    CONF_CONDITION,
    CONF_FOR,
    CONF_KEEP_FIRING_FOR,
    CONF_NOTIFY,
    CONF_QUERY,
    CONF_SEVERITY,
    CONF_SUMMARY,
    CONF_THRESHOLD,
    SEVERITIES,
)


def alert_schema() -> vol.Schema:
    return vol.Schema(
        {
            vol.Required(CONF_NAME): str,
            vol.Required(CONF_QUERY): TextSelector(TextSelectorConfig(multiline=True)),
            vol.Optional(CONF_CONDITION, default=CONDITION_ANY): SelectSelector(
                SelectSelectorConfig(options=CONDITIONS, mode=SelectSelectorMode.DROPDOWN, translation_key="condition")
            ),
            vol.Optional(CONF_THRESHOLD): NumberSelector(NumberSelectorConfig(mode=NumberSelectorMode.BOX, step="any")),
            vol.Optional(CONF_FOR): DurationSelector(DurationSelectorConfig(enable_day=True)),
            vol.Optional(CONF_KEEP_FIRING_FOR): DurationSelector(DurationSelectorConfig(enable_day=False)),
            vol.Optional(CONF_SEVERITY): SelectSelector(
                SelectSelectorConfig(
                    options=SEVERITIES, mode=SelectSelectorMode.DROPDOWN, custom_value=True, translation_key="severity"
                )
            ),
            vol.Optional(CONF_SUMMARY): TextSelector(TextSelectorConfig(multiline=True)),
            vol.Optional(CONF_NOTIFY, default=True): BooleanSelector(),
        }
    )


def clean_alert_data(user_input: dict[str, Any]) -> dict[str, Any]:
    """Subentry data of an alert (no name, no empty values, no threshold for "any")."""
    data = {k: v for k, v in user_input.items() if v not in (None, "", {}) and k != CONF_NAME}
    if data.get(CONF_CONDITION, CONDITION_ANY) == CONDITION_ANY:
        data.pop(CONF_THRESHOLD, None)
    return data


async def async_validate_alert(
    hass: HomeAssistant, entry: ConfigEntry, user_input: dict[str, Any]
) -> tuple[dict[str, str], dict[str, str]]:
    """Run the query of an alert once. Returns (errors, placeholders with series / active counts)."""
    condition = user_input.get(CONF_CONDITION, CONDITION_ANY)
    if condition != CONDITION_ANY and user_input.get(CONF_THRESHOLD) in (None, ""):
        return {CONF_THRESHOLD: "threshold_required"}, {}
    runtime = getattr(entry, "runtime_data", None)
    client: PrometheusClient = runtime.client if runtime else PrometheusClient(hass, entry.data)
    try:
        payload = await client.request("/api/v1/query", {"query": user_input[CONF_QUERY]}, use_cache=False)
    except PrometheusError as err:
        reason = err.reason if err.reason != "unknown" else "query_error"
        return {CONF_QUERY: reason}, {"error_detail": str(err)}
    # an empty result is fine for alerts (`up == 0` returns nothing while all is well)
    series = result_values(payload)
    rule = AlertRule.from_subentry(user_input[CONF_NAME], clean_alert_data(user_input))
    active = sum(1 for _labels, value in series if rule.matches(value))
    return {}, {"series": str(len(series)), "active": str(active)}


class PromQLAlertSubentryFlow(ConfigSubentryFlow):
    """The query is executed before saving; the dialog reports how many series would be active now."""

    async def _validate(self, user_input: dict[str, Any]) -> tuple[dict[str, str], dict[str, str]]:
        return await async_validate_alert(self.hass, self._get_entry(), user_input)

    @staticmethod
    def _clean(user_input: dict[str, Any]) -> dict[str, Any]:
        return clean_alert_data(user_input)

    def _form(self, step_id: str, suggested: dict[str, Any], errors: dict[str, str], placeholders: dict[str, str]):
        return self.async_show_form(
            step_id=step_id,
            data_schema=self.add_suggested_values_to_schema(alert_schema(), suggested),
            errors=errors,
            description_placeholders={"error_detail": "-", **placeholders},
        )

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> SubentryFlowResult:
        errors: dict[str, str] = {}
        placeholders: dict[str, str] = {}
        if user_input is not None:
            errors, placeholders = await self._validate(user_input)
            if not errors:
                return self.async_create_entry(title=user_input[CONF_NAME], data=self._clean(user_input))
        return self._form("user", user_input or {}, errors, placeholders)

    async def async_step_reconfigure(self, user_input: dict[str, Any] | None = None) -> SubentryFlowResult:
        subentry = self._get_reconfigure_subentry()
        errors: dict[str, str] = {}
        placeholders: dict[str, str] = {}
        if user_input is not None:
            errors, placeholders = await self._validate(user_input)
            if not errors:
                return self.async_update_and_abort(
                    self._get_entry(), subentry, title=user_input[CONF_NAME], data=self._clean(user_input)
                )
        suggested = user_input or {CONF_NAME: subentry.title, **subentry.data}
        return self._form("reconfigure", suggested, errors, placeholders)
