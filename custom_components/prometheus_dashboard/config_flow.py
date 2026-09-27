import logging
from typing import Any

import aiohttp
import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import (
    CONF_NAME,
    CONF_PASSWORD,
    CONF_PROMETHEUS_URL,
    CONF_USERNAME,
    CONF_VERIFY_SSL,
    DOMAIN,
)

_LOGGER = logging.getLogger(__name__)

STEP_USER_DATA_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_PROMETHEUS_URL): str,
        vol.Optional(CONF_NAME, default="Prometheus"): str,
        vol.Optional(CONF_USERNAME): str,
        vol.Optional(CONF_PASSWORD): str,
        vol.Optional(CONF_VERIFY_SSL, default=True): bool,
    }
)


async def validate_input(hass: HomeAssistant, data: dict[str, Any]) -> dict[str, Any]:
    """Validate the user input allows us to connect."""
    session = async_get_clientsession(hass)
    url = f"{data[CONF_PROMETHEUS_URL].rstrip('/')}/api/v1/status/buildinfo"

    auth = None
    if data.get(CONF_USERNAME) and data.get(CONF_PASSWORD):
        auth = aiohttp.BasicAuth(data[CONF_USERNAME], data[CONF_PASSWORD])

    try:
        async with session.get(url, auth=auth, ssl=data.get(CONF_VERIFY_SSL, True), timeout=10) as response:
            response.raise_for_status()
    except aiohttp.ClientError as err:
        _LOGGER.error("Cannot connect to Prometheus: %s", err)
        raise CannotConnect from err
    except Exception as err:
        _LOGGER.error("Unknown error connecting to Prometheus: %s", err)
        raise UnknownError from err

    return {"title": data.get(CONF_NAME, "Prometheus")}


class ConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Prometheus Dashboard."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> config_entries.ConfigFlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}
        if user_input is not None:
            try:
                info = await validate_input(self.hass, user_input)
            except CannotConnect:
                errors["base"] = "cannot_connect"
            except Exception:  # pylint: disable=broad-except
                errors["base"] = "unknown"
            else:
                return self.async_create_entry(title=info["title"], data=user_input)

        return self.async_show_form(
            step_id="user",
            data_schema=STEP_USER_DATA_SCHEMA,
            errors=errors,
        )


class CannotConnect(Exception):
    """Error to indicate we cannot connect."""


class UnknownError(Exception):
    """Error to indicate there is an unknown error."""
