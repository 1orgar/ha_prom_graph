"""Config flow for Prometheus Dashboard.

The form's submit button is "Test connection". After a successful test a menu
shows the result (version, latency, targets) and lets the user save the
connection or go back and edit the settings.
"""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.config_entries import ConfigFlow, ConfigFlowResult
from homeassistant.helpers.selector import TextSelector, TextSelectorConfig, TextSelectorType

from .api import ConnectionTestResult, PrometheusClient, PrometheusError, normalize_url
from .const import (
    CONF_NAME,
    CONF_PASSWORD,
    CONF_PROMETHEUS_URL,
    CONF_USERNAME,
    CONF_VERIFY_SSL,
    DEFAULT_NAME,
    DOMAIN,
)

_LOGGER = logging.getLogger(__name__)

DATA_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_PROMETHEUS_URL): TextSelector(TextSelectorConfig(type=TextSelectorType.URL)),
        vol.Optional(CONF_NAME, default=DEFAULT_NAME): str,
        vol.Optional(CONF_USERNAME): str,
        vol.Optional(CONF_PASSWORD): TextSelector(TextSelectorConfig(type=TextSelectorType.PASSWORD)),
        vol.Optional(CONF_VERIFY_SSL, default=True): bool,
    }
)


class PrometheusDashboardConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Prometheus Dashboard."""

    VERSION = 1

    def __init__(self) -> None:
        self._data: dict[str, Any] = {}
        self._test: ConnectionTestResult | None = None

    async def _async_test(self, user_input: dict[str, Any]) -> tuple[dict[str, str], dict[str, str]]:
        """Test the connection. Returns (errors, description placeholders)."""
        data = {k: v for k, v in user_input.items() if v not in (None, "")}
        data[CONF_PROMETHEUS_URL] = normalize_url(data[CONF_PROMETHEUS_URL])
        data.setdefault(CONF_NAME, DEFAULT_NAME)
        self._data = data
        try:
            self._test = await PrometheusClient(self.hass, data).async_test_connection()
        except PrometheusError as err:
            _LOGGER.debug("Connection test to %s failed: %s", data[CONF_PROMETHEUS_URL], err)
            return {"base": err.reason}, {"error_detail": err.detail or "-"}
        except Exception:  # noqa: BLE001
            _LOGGER.exception("Unexpected error testing Prometheus connection")
            return {"base": "unknown"}, {"error_detail": "-"}
        return {}, {}

    def _result_placeholders(self) -> dict[str, str]:
        test = self._test
        assert test is not None
        if test.targets_total is None:
            targets = "?"
        else:
            up = test.targets_up if test.targets_up is not None else "?"
            targets = f"{up} / {test.targets_total}"
        return {
            "url": self._data[CONF_PROMETHEUS_URL],
            "version": test.version,
            "latency": str(test.latency_ms),
            "targets": targets,
        }

    def _form(self, step_id: str, errors: dict[str, str], placeholders: dict[str, str]) -> ConfigFlowResult:
        return self.async_show_form(
            step_id=step_id,
            data_schema=self.add_suggested_values_to_schema(DATA_SCHEMA, self._data),
            errors=errors,
            description_placeholders={"error_detail": "-", **placeholders},
        )

    # ------------------------------------------------------------------ setup

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Enter the connection settings and test them."""
        errors: dict[str, str] = {}
        placeholders: dict[str, str] = {}
        if user_input is not None:
            url = normalize_url(user_input[CONF_PROMETHEUS_URL])
            self._async_abort_entries_match({CONF_PROMETHEUS_URL: url})
            errors, placeholders = await self._async_test(user_input)
            if not errors:
                return await self.async_step_test_result()
        return self._form("user", errors, placeholders)

    async def async_step_test_result(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Show the result of a successful test and offer to save or edit."""
        return self.async_show_menu(
            step_id="test_result",
            menu_options=["save", "user"],
            description_placeholders=self._result_placeholders(),
        )

    async def async_step_save(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Create the config entry."""
        return self.async_create_entry(title=self._data[CONF_NAME], data=self._data)

    # ------------------------------------------------------------ reconfigure

    async def async_step_reconfigure(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Change the settings of an existing server (with connection test)."""
        if not self._data:
            self._data = dict(self._get_reconfigure_entry().data)
        errors: dict[str, str] = {}
        placeholders: dict[str, str] = {}
        if user_input is not None:
            errors, placeholders = await self._async_test(user_input)
            if not errors:
                return await self.async_step_reconfigure_result()
        return self._form("reconfigure", errors, placeholders)

    async def async_step_reconfigure_result(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Show the test result for reconfigure."""
        return self.async_show_menu(
            step_id="reconfigure_result",
            menu_options=["reconfigure_save", "reconfigure"],
            description_placeholders=self._result_placeholders(),
        )

    async def async_step_reconfigure_save(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Save reconfigured settings."""
        return self.async_update_reload_and_abort(
            self._get_reconfigure_entry(), title=self._data[CONF_NAME], data=self._data
        )

