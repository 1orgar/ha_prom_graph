"""Config flow: connection test, result menu, errors, duplicates, reconfigure, options."""

from __future__ import annotations

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType

from custom_components.prometheus_dashboard.const import (
    CONF_ALERTS,
    CONF_CACHE_TTL,
    CONF_PROMETHEUS_URL,
    CONF_SCAN_INTERVAL,
    DOMAIN,
)

from .conftest import URL

USER_INPUT = {"prometheus_url": "prom.test:9090/", "name": "Home", "verify_ssl": True}


async def test_user_flow_test_then_save(hass: HomeAssistant, prometheus) -> None:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(result["flow_id"], USER_INPUT)
    assert result["type"] is FlowResultType.MENU
    assert result["step_id"] == "test_result"
    assert result["description_placeholders"]["version"] == "2.53.0"
    assert result["description_placeholders"]["targets"] == "2 / 3"
    assert "save" in result["menu_options"] and "2.53.0" in result["menu_options"]["save"]

    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "save"})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Home"
    # URL is normalised (scheme added, trailing slash removed)
    assert result["data"][CONF_PROMETHEUS_URL] == URL


async def test_user_flow_back_to_edit(hass: HomeAssistant, prometheus) -> None:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], USER_INPUT)
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "user"})
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"


async def test_user_flow_cannot_connect(hass: HomeAssistant, aioclient_mock) -> None:
    aioclient_mock.get(f"{URL}/api/v1/status/buildinfo", exc=__import__("aiohttp").ClientConnectionError("refused"))
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], USER_INPUT)
    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"base": "cannot_connect"}
    assert "refused" in result["description_placeholders"]["error_detail"]


async def test_user_flow_invalid_auth(hass: HomeAssistant, aioclient_mock) -> None:
    aioclient_mock.get(f"{URL}/api/v1/status/buildinfo", status=401, text="")
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], USER_INPUT)
    assert result["errors"] == {"base": "invalid_auth"}


async def test_user_flow_not_prometheus(hass: HomeAssistant, aioclient_mock) -> None:
    aioclient_mock.get(f"{URL}/api/v1/status/buildinfo", text="<html></html>")
    aioclient_mock.get(f"{URL}/api/v1/query?query=count(up)", text="<html></html>")
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], USER_INPUT)
    assert result["errors"] == {"base": "not_prometheus"}


async def test_duplicate_url_aborts(hass: HomeAssistant, prometheus, config_entry) -> None:
    config_entry.add_to_hass(hass)
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], USER_INPUT)
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"


async def test_reconfigure(hass: HomeAssistant, prometheus, config_entry) -> None:
    config_entry.add_to_hass(hass)
    await hass.config_entries.async_setup(config_entry.entry_id)
    result = await config_entry.start_reconfigure_flow(hass)
    assert result["step_id"] == "reconfigure"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {**USER_INPUT, "name": "Renamed"})
    assert result["type"] is FlowResultType.MENU
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "reconfigure_save"})
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "reconfigure_successful"
    assert config_entry.title == "Renamed"


async def test_options_flow(hass: HomeAssistant, prometheus, config_entry) -> None:
    config_entry.add_to_hass(hass)
    await hass.config_entries.async_setup(config_entry.entry_id)
    result = await hass.config_entries.options.async_init(config_entry.entry_id)
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            CONF_SCAN_INTERVAL: 60,
            CONF_CACHE_TTL: 10,
            CONF_ALERTS: True,
            "notifications": {"notify_services": ["notify.mobile_app_phone"], "notify_severities": ["critical"]},
        },
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert config_entry.options == {
        CONF_SCAN_INTERVAL: 60,
        CONF_CACHE_TTL: 10,
        CONF_ALERTS: True,
        "notify_persistent": True,
        "notify_services": ["mobile_app_phone"],  # `notify.` prefix dropped
        "notify_severities": ["critical"],
        "notify_sources": ["local", "prometheus"],
        "notify_critical": True,
        "notify_resolved": True,
        "notify_repeat": 0,
        "notify_repeat_severities": ["critical"],
        "silence_duration": 60,
    }
