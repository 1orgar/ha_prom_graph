"""Subentry flow: add / edit a sensor based on a PromQL instant query."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components.sensor import SensorDeviceClass, SensorStateClass
from homeassistant.config_entries import ConfigSubentryFlow, SubentryFlowResult
from homeassistant.const import CONF_NAME
from homeassistant.helpers.selector import (
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
    TextSelectorConfig,
)

from .api import PrometheusClient, PrometheusError, aggregate, result_values
from .const import AGGREGATES, CONF_AGGREGATE, CONF_DEVICE_CLASS, CONF_PRECISION, CONF_QUERY, CONF_STATE_CLASS, CONF_UNIT


def sensor_schema() -> vol.Schema:
    return vol.Schema(
        {
            vol.Required(CONF_NAME): str,
            vol.Required(CONF_QUERY): TextSelector(TextSelectorConfig(multiline=True)),
            vol.Optional(CONF_AGGREGATE, default="first"): SelectSelector(
                SelectSelectorConfig(options=AGGREGATES, mode=SelectSelectorMode.DROPDOWN, translation_key="aggregate")
            ),
            vol.Optional(CONF_UNIT): str,
            vol.Optional(CONF_DEVICE_CLASS): SelectSelector(
                SelectSelectorConfig(
                    options=sorted(dc.value for dc in SensorDeviceClass),
                    mode=SelectSelectorMode.DROPDOWN,
                    sort=True,
                )
            ),
            vol.Optional(CONF_STATE_CLASS): SelectSelector(
                SelectSelectorConfig(
                    options=[sc.value for sc in SensorStateClass],
                    mode=SelectSelectorMode.DROPDOWN,
                )
            ),
            vol.Optional(CONF_PRECISION): NumberSelector(
                NumberSelectorConfig(min=0, max=6, step=1, mode=NumberSelectorMode.BOX)
            ),
        }
    )


class PromQLSensorSubentryFlow(ConfigSubentryFlow):
    """The query is executed before saving, so broken PromQL is caught in the dialog."""

    async def _validate(self, user_input: dict[str, Any]) -> tuple[dict[str, str], dict[str, str]]:
        entry = self._get_entry()
        runtime = getattr(entry, "runtime_data", None)
        client: PrometheusClient = runtime.client if runtime else PrometheusClient(self.hass, entry.data)
        try:
            payload = await client.request("/api/v1/query", {"query": user_input[CONF_QUERY]}, use_cache=False)
        except PrometheusError as err:
            reason = err.reason if err.reason != "unknown" else "query_error"
            return {CONF_QUERY: reason}, {"error_detail": str(err)}
        series = result_values(payload)
        if not series:
            return {CONF_QUERY: "empty_result"}, {"error_detail": "-"}
        value = aggregate([v for _, v in series], user_input.get(CONF_AGGREGATE, "first"))
        return {}, {"series": str(len(series)), "value": "-" if value is None else f"{value:g}"}

    @staticmethod
    def _clean(user_input: dict[str, Any]) -> dict[str, Any]:
        data = {k: v for k, v in user_input.items() if v not in (None, "") and k != CONF_NAME}
        if CONF_PRECISION in data:
            data[CONF_PRECISION] = int(data[CONF_PRECISION])
        return data

    def _form(self, step_id: str, suggested: dict[str, Any], errors: dict[str, str], placeholders: dict[str, str]):
        return self.async_show_form(
            step_id=step_id,
            data_schema=self.add_suggested_values_to_schema(sensor_schema(), suggested),
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
