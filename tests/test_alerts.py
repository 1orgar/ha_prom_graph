"""PromQL alert subentries: binary sensor, events, websocket, config flow."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.config_entries import ConfigSubentryData
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_capture_events

from custom_components.prometheus_dashboard.const import DOMAIN, EVENT_ALERT


def _entry_with_alert(entry_data, **data) -> MockConfigEntry:
    return MockConfigEntry(
        domain=DOMAIN,
        title="Home",
        data=entry_data,
        subentries_data=[
            ConfigSubentryData(
                subentry_type="alert",
                title="High load",
                unique_id=None,
                data={"query": "node_load1", "condition": ">", "threshold": 1, "severity": "critical", **data},
            )
        ],
    )


async def test_alert_binary_sensor_event_and_websocket(
    hass: HomeAssistant, hass_ws_client, prometheus, entry_data, freezer
) -> None:
    events = async_capture_events(hass, EVENT_ALERT)
    entry = _entry_with_alert(entry_data, **{"for": {"minutes": 1}})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    state = hass.states.get("binary_sensor.home_high_load")
    assert state is not None
    assert state.state == "off"  # instance a (1.5) is pending, b (0.5) does not match
    assert state.attributes["device_class"] == "problem"
    assert state.attributes["pending_count"] == 1
    assert state.attributes["state"] == "pending"

    # after the firing window the next poll fires the alert
    freezer.tick(timedelta(minutes=2))
    await entry.runtime_data.coordinator.async_refresh()
    await hass.async_block_till_done()
    state = hass.states.get("binary_sensor.home_high_load")
    assert state.state == "on"
    assert state.attributes["firing_count"] == 1
    assert state.attributes["series"][0]["labels"] == {"instance": "a"}
    assert [(e.data["alert"], e.data["state"], e.data["labels"]) for e in events] == [
        ("High load", "firing", {"instance": "a"})
    ]

    # the Alerts card gets the Prometheus alerts + the local ones
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "prometheus_dashboard/alerts"})
    msg = await client.receive_json()
    alerts = msg["result"]["alerts"]
    local = [a for a in alerts if a.get("source") == "home_assistant"]
    assert len(alerts) == 3
    assert local[0]["labels"] == {"alertname": "High load", "instance": "a", "severity": "critical"}
    assert local[0]["state"] == "firing"


async def test_alert_subentry_flow(hass: HomeAssistant, prometheus, config_entry) -> None:
    config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(config_entry.entry_id)

    result = await hass.config_entries.subentries.async_init((config_entry.entry_id, "alert"), context={"source": "user"})
    assert result["type"] is FlowResultType.FORM

    # a comparison needs a threshold
    result = await hass.config_entries.subentries.async_configure(
        result["flow_id"], {"name": "Load", "query": "node_load1", "condition": ">"}
    )
    assert result["errors"] == {"threshold": "threshold_required"}

    result = await hass.config_entries.subentries.async_configure(
        result["flow_id"], {"name": "Bad", "query": "bad(", "condition": "any"}
    )
    assert result["errors"] == {"query": "query_error"}

    # an empty result is valid for alerts (nothing is wrong right now)
    result = await hass.config_entries.subentries.async_configure(
        result["flow_id"],
        {"name": "Missing", "query": "absent_metric", "condition": "any", "threshold": 5, "for": {"minutes": 5}},
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()

    sub = next(s for s in config_entry.subentries.values() if s.subentry_type == "alert")
    assert sub.data == {"query": "absent_metric", "condition": "any", "for": {"minutes": 5}}  # threshold dropped
    assert hass.states.get("binary_sensor.home_missing").state == "off"
