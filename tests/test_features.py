"""v0.6: restore after restart, reminders, keep_firing_for, Alertmanager, auth headers, retry,
`query` action, test buttons, alerts from cards."""

from __future__ import annotations

from datetime import timedelta

import pytest
from homeassistant.components import persistent_notification
from homeassistant.config_entries import ConfigSubentryData
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.prometheus_dashboard.alerting import STATE_FIRING, AlertRule, AlertTracker
from custom_components.prometheus_dashboard.api import PrometheusClient, auth_headers
from custom_components.prometheus_dashboard.const import DOMAIN

from .conftest import URL, vector

AM = "http://am.test:9093"


def _entry(entry_data, options=None, **rule) -> MockConfigEntry:
    return MockConfigEntry(
        domain=DOMAIN,
        title="Home",
        data=entry_data,
        options={"cache_ttl": 0, "notify_services": ["mobile_app_phone"], **(options or {})},
        subentries_data=[
            ConfigSubentryData(
                subentry_type="alert",
                title="High load",
                unique_id=None,
                data={"query": "node_load1", "condition": "gt", "threshold": 1, "severity": "critical", **rule},
            )
        ],
    )


def _load(prometheus, *items) -> None:
    prometheus.clear_requests()
    prometheus.get(f"{URL}/api/v1/query?query=node_load1", json=vector(*items))


async def _poll(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    await entry.runtime_data.coordinator.async_refresh()
    await hass.async_block_till_done()


# ---------------------------------------------------------------- keep_firing_for


def test_keep_firing_for() -> None:
    from homeassistant.util import dt as dt_util

    t0 = dt_util.utcnow()
    rule = AlertRule(name="x", keep_firing_seconds=120)
    tracker = AlertTracker()
    assert [t.state for t in tracker.update("r", rule, [({"i": "a"}, 1.0)], t0)] == [STATE_FIRING]
    # a short dip: still firing, no "resolved"
    assert tracker.update("r", rule, [], t0 + timedelta(seconds=60)) == []
    assert tracker.state("r") == STATE_FIRING
    # back again: the window is cancelled, no second "firing"
    assert tracker.update("r", rule, [({"i": "a"}, 1.0)], t0 + timedelta(seconds=90)) == []
    assert tracker.update("r", rule, [], t0 + timedelta(seconds=100)) == []
    # gone for longer than the window -> resolved
    assert [t.state for t in tracker.update("r", rule, [], t0 + timedelta(seconds=221))] == ["resolved"]


# ---------------------------------------------------------------- restore after restart


async def test_state_restored_after_restart(hass: HomeAssistant, prometheus, entry_data, hass_storage) -> None:
    calls = async_mock_service(hass, "notify", "mobile_app_phone")
    entry = _entry(entry_data, **{"for": {"minutes": 5}})
    entry.add_to_hass(hass)
    _load(prometheus, ({"instance": "a"}, 2))
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    since = entry.runtime_data.coordinator.alert_tracker.instances(entry.runtime_data.coordinator.alert_rules().popitem()[0])[0].active_since

    # "restart": state saved on unload, restored by the next setup
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    coordinator = entry.runtime_data.coordinator
    rule_id = next(iter(coordinator.alert_rules()))
    inst = coordinator.alert_tracker.instances(rule_id)
    assert inst and inst[0].active_since == since  # the pending window goes on
    assert f"{DOMAIN}.{entry.entry_id}" in hass_storage
    assert calls == []


async def test_old_state_is_not_restored(hass: HomeAssistant, prometheus, entry_data, hass_storage) -> None:
    entry = _entry(entry_data)
    hass_storage[f"{DOMAIN}.{entry.entry_id}"] = {
        "version": 1,
        "key": f"{DOMAIN}.{entry.entry_id}",
        "data": {"saved_at": 0, "alerts": {"x": [{"labels": {}, "value": 1, "active_since": "2020-01-01T00:00:00+00:00"}]}},
    }
    entry.add_to_hass(hass)
    _load(prometheus)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.runtime_data.coordinator.alert_tracker.as_dict() == {}


# ---------------------------------------------------------------- reminders


async def test_reminder_for_still_firing_critical(hass: HomeAssistant, prometheus, entry_data, freezer) -> None:
    calls = async_mock_service(hass, "notify", "mobile_app_phone")
    entry = _entry(entry_data, {"notify_repeat": 30})
    entry.add_to_hass(hass)
    _load(prometheus)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    _load(prometheus, ({"instance": "a"}, 2))
    await _poll(hass, entry)
    assert len(calls) == 1 and calls[0].data["message"].startswith("FIRING")

    freezer.tick(timedelta(minutes=10))
    await _poll(hass, entry)
    assert len(calls) == 1  # not yet

    freezer.tick(timedelta(minutes=21))
    await _poll(hass, entry)
    assert len(calls) == 2
    assert calls[1].data["message"].startswith("STILL FIRING")
    assert calls[1].data["data"]["push"]["interruption-level"] == "critical"


# ---------------------------------------------------------------- Alertmanager


def _json_response(method, url, payload, status=200):
    from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMockResponse

    return AiohttpClientMockResponse(method, url, status=status, json=payload)


async def test_alertmanager_silences_and_silence_button(hass: HomeAssistant, prometheus, entry_data) -> None:
    calls = async_mock_service(hass, "notify", "mobile_app_phone")
    silences: list[dict] = []
    created: list[dict] = []

    async def post_silence(method, url, data):
        created.append(data)
        silences.append({"status": {"state": "active"}, "matchers": data["matchers"], "endsAt": data["endsAt"]})
        return _json_response(method, url, {"silenceID": "s1"})

    async def get_silences(method, url, data):
        return _json_response(method, url, silences)

    def mock_am() -> None:
        prometheus.get(f"{AM}/api/v2/silences", side_effect=get_silences)
        prometheus.post(f"{AM}/api/v2/silences", side_effect=post_silence)

    entry = _entry(entry_data, {"alertmanager_url": AM})
    entry.add_to_hass(hass)
    _load(prometheus)
    mock_am()
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    _load(prometheus, ({"instance": "a"}, 2))
    mock_am()
    await _poll(hass, entry)
    assert len(calls) == 1
    action = calls[0].data["data"]["actions"][0]
    assert action["action"].startswith("PROMDASH_SILENCE_")

    # "Silence" pressed on the phone -> silence in Alertmanager for exactly this series
    hass.bus.async_fire("mobile_app_notification_action", {"action": action["action"]})
    await hass.async_block_till_done()
    assert {m["name"]: m["value"] for m in created[0]["matchers"]} == {
        "alertname": "High load",
        "severity": "critical",
        "instance": "a",
    }
    # silenced: the system notification is removed, no "resolved" push when it recovers
    notes = persistent_notification._async_get_or_create_notifications(hass)
    assert not [n for n in notes.values() if "High load" in n["title"]]
    _load(prometheus)
    mock_am()
    await _poll(hass, entry)
    assert len(calls) == 1

    # the Alerts card gets `silenced: true`
    coordinator = entry.runtime_data.coordinator
    marked = coordinator.mark_silenced([{"labels": {"alertname": "High load", "severity": "critical", "instance": "a"}}])
    assert marked[0]["silenced"] is True


# ---------------------------------------------------------------- auth headers + retry


def test_auth_headers() -> None:
    assert auth_headers({"bearer_token": " abc ", "org_id": "team-1"}) == {
        "Authorization": "Bearer abc",
        "X-Scope-OrgID": "team-1",
    }
    assert auth_headers({}) == {}


async def test_headers_sent_and_gateway_error_retried(hass: HomeAssistant, aioclient_mock, monkeypatch) -> None:
    monkeypatch.setattr("custom_components.prometheus_dashboard.api.RETRY_DELAYS", (0, 0))
    attempts = []

    async def flaky(method, url, data):
        attempts.append(url)
        if len(attempts) < 3:
            return _json_response(method, url, {"status": "error"}, status=503)
        return _json_response(method, url, vector(({}, 1)))

    aioclient_mock.get(f"{URL}/api/v1/query", side_effect=flaky)
    client = PrometheusClient(hass, {"prometheus_url": URL, "bearer_token": "t", "org_id": "o", "username": "u"})
    payload = await client.query("up")
    assert payload["status"] == "success"
    assert len(attempts) == 3
    headers = aioclient_mock.mock_calls[-1][3]
    assert headers["Authorization"] == "Bearer t" and headers["X-Scope-OrgID"] == "o"


async def test_query_errors_are_not_retried(hass: HomeAssistant, prometheus) -> None:
    client = PrometheusClient(hass, {"prometheus_url": URL})
    with pytest.raises(Exception):
        await client.query("bad(")
    assert len([c for c in prometheus.mock_calls if "bad" in str(c[1])]) == 1



# ---------------------------------------------------------------- query action, buttons, create_alert


async def test_query_action(hass: HomeAssistant, prometheus, config_entry) -> None:
    config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    result = await hass.services.async_call(
        DOMAIN, "query", {"query": "node_load1", "aggregate": "sum"}, blocking=True, return_response=True
    )
    assert result["value"] == 2.0
    assert result["series"][0] == {"labels": {"instance": "a"}, "value": 1.5}
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(DOMAIN, "query", {"query": "bad("}, blocking=True, return_response=True)


async def test_test_notification_buttons(hass: HomeAssistant, prometheus, entry_data) -> None:
    calls = async_mock_service(hass, "notify", "mobile_app_phone")
    entry = _entry(entry_data)
    entry.add_to_hass(hass)
    _load(prometheus)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    await hass.services.async_call(
        "button", "press", {"entity_id": "button.home_send_critical_test_notification"}, blocking=True
    )
    await hass.async_block_till_done()
    assert len(calls) == 1
    assert calls[0].data["data"]["push"]["interruption-level"] == "critical"
    assert "actions" not in calls[0].data["data"]


async def test_create_alert_from_card(hass: HomeAssistant, hass_ws_client, prometheus, config_entry) -> None:
    config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {
            "type": "prometheus_dashboard/create_alert",
            "name": "Load",
            "query": "node_load1",
            "condition": "gt",
            "threshold": 1,
            "for": "5m",
            "severity": "warning",
        }
    )
    msg = await client.receive_json()
    assert msg["success"], msg
    assert msg["result"]["series"] == 2 and msg["result"]["active"] == 1
    await hass.async_block_till_done()
    sub = next(s for s in config_entry.subentries.values() if s.subentry_type == "alert")
    assert sub.title == "Load"
    assert dict(sub.data) == {
        "query": "node_load1",
        "condition": "gt",
        "threshold": 1.0,
        "for": "5m",
        "severity": "warning",
    }
    assert hass.states.get("binary_sensor.home_load") is not None

    await client.send_json_auto_id({"type": "prometheus_dashboard/create_alert", "name": "Bad", "query": "bad("})
    msg = await client.receive_json()
    assert not msg["success"] and msg["error"]["code"] == "query_error"

