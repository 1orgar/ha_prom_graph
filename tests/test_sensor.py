"""PromQL sensor subentries, alerts sensor, repairs, diagnostics."""

from __future__ import annotations

from homeassistant.config_entries import ConfigSubentryData
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import issue_registry as ir
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.components.diagnostics import get_diagnostics_for_config_entry

from custom_components.prometheus_dashboard.const import CONF_ALERTS, DOMAIN

from .conftest import URL


def _entry_with_sensor(entry_data, **options) -> MockConfigEntry:
    return MockConfigEntry(
        domain=DOMAIN,
        title="Home",
        data=entry_data,
        options=options,
        subentries_data=[
            ConfigSubentryData(
                subentry_type="sensor",
                title="Load",
                unique_id=None,
                data={"query": "node_load1", "aggregate": "sum", "unit_of_measurement": "load"},
            )
        ],
    )


async def test_sensor_value_and_attributes(hass: HomeAssistant, prometheus, entry_data) -> None:
    entry = _entry_with_sensor(entry_data)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    state = hass.states.get("sensor.home_load")
    assert state is not None
    assert float(state.state) == 2.0  # 1.5 + 0.5 (sum)
    assert state.attributes["unit_of_measurement"] == "load"
    assert state.attributes["series_count"] == 2
    assert {s["labels"]["instance"] for s in state.attributes["series"]} == {"a", "b"}


async def test_alerts_sensor(hass: HomeAssistant, prometheus, entry_data) -> None:
    entry = _entry_with_sensor(entry_data, **{CONF_ALERTS: True})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    state = hass.states.get("sensor.home_firing_alerts")
    assert state is not None
    assert state.state == "1"
    assert state.attributes["pending"] == 1
    assert state.attributes["alerts"][0]["name"] == "HighLoad"


async def test_subentry_flow_validates_query(hass: HomeAssistant, prometheus, config_entry) -> None:
    config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(config_entry.entry_id)

    result = await hass.config_entries.subentries.async_init(
        (config_entry.entry_id, "sensor"), context={"source": "user"}
    )
    assert result["type"] is FlowResultType.FORM

    result = await hass.config_entries.subentries.async_configure(
        result["flow_id"], {"name": "Bad", "query": "bad("}
    )
    assert result["errors"] == {"query": "query_error"}
    assert "parse error" in result["description_placeholders"]["error_detail"]

    result = await hass.config_entries.subentries.async_configure(
        result["flow_id"], {"name": "Empty", "query": "absent_metric"}
    )
    assert result["errors"] == {"query": "empty_result"}

    result = await hass.config_entries.subentries.async_configure(
        result["flow_id"], {"name": "Load", "query": "node_load1", "aggregate": "max", "precision": 2}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()

    sub = next(iter(config_entry.subentries.values()))
    assert sub.title == "Load"
    assert sub.data == {"query": "node_load1", "aggregate": "max", "precision": 2}
    # the update listener reloads the entry -> the new sensor exists
    assert float(hass.states.get("sensor.home_load").state) == 1.5


async def test_unreachable_creates_repair_issue(hass: HomeAssistant, aioclient_mock, entry_data) -> None:
    import aiohttp

    aioclient_mock.get(f"{URL}/api/v1/query?query=node_load1", exc=aiohttp.ClientConnectionError("down"))
    entry = _entry_with_sensor(entry_data)
    entry.add_to_hass(hass)
    # setup must still succeed so cards keep working
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    assert hass.states.get("sensor.home_load").state == "unavailable"
    issue = ir.async_get(hass).async_get_issue(DOMAIN, f"unreachable_{entry.entry_id}")
    assert issue is not None
    assert issue.translation_placeholders["name"] == "Home"


async def test_diagnostics_redacts_credentials(hass: HomeAssistant, hass_client, prometheus, entry_data) -> None:
    entry = _entry_with_sensor({**entry_data, "username": "admin", "password": "secret"})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    diag = await get_diagnostics_for_config_entry(hass, hass_client, entry)
    assert diag["entry"]["data"]["password"] == "**REDACTED**"
    assert diag["entry"]["data"]["username"] == "**REDACTED**"
    assert diag["queries"]
    assert "hits" in diag["cache"]
