"""Alert notifications: system (persistent) notifications and push via notify services."""

from __future__ import annotations

from homeassistant.components import persistent_notification
from homeassistant.config_entries import ConfigSubentryData
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.prometheus_dashboard.const import DOMAIN

from .conftest import URL, vector


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
                data={
                    "query": "node_load1", "condition": "gt", "threshold": 1, "severity": "critical",
                    "summary": "load {{ $value }} on {{ $labels.instance }}", **rule,
                },
            )
        ],
    )


def _notifications(hass: HomeAssistant) -> dict:
    return persistent_notification._async_get_or_create_notifications(hass)


async def _poll(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    await entry.runtime_data.coordinator.async_refresh()
    await hass.async_block_till_done()


async def test_critical_alert_push_and_system_notification(hass: HomeAssistant, prometheus, entry_data) -> None:
    calls = async_mock_service(hass, "notify", "mobile_app_phone")
    entry = _entry(entry_data)
    entry.add_to_hass(hass)
    # first poll after setup: fires at once (no `for`), but only syncs - no push after a restart
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    notes = _notifications(hass)
    assert len(notes) == 1
    note = next(iter(notes.values()))
    assert note["title"] == "🔴 High load [CRITICAL]"
    assert "load 1.5 on a (instance=a)" in note["message"]
    assert calls == []

    # a new series starts firing -> one push, critical for iOS and Android
    prometheus.clear_requests()
    prometheus.get(
        f"{URL}/api/v1/query?query=node_load1",
        json=vector(({"instance": "a"}, 1.5), ({"instance": "b"}, 3.0)),
    )
    await _poll(hass, entry)
    assert len(calls) == 1
    push = calls[0].data
    assert push["title"] == "🔴 High load [CRITICAL]"
    assert push["message"] == "FIRING · Home\nload 3 on b (instance=b)"
    assert push["data"]["push"]["interruption-level"] == "critical"
    assert push["data"]["push"]["sound"]["critical"] == 1
    assert push["data"]["channel"] == "alarm_stream"
    assert push["data"]["priority"] == "high" and push["data"]["ttl"] == 0
    assert "**2** firing" in next(iter(_notifications(hass).values()))["message"]

    # everything recovers -> resolved push with the same tag, system notification removed
    prometheus.clear_requests()
    prometheus.get(f"{URL}/api/v1/query?query=node_load1", json=vector(({"instance": "a"}, 0.2)))
    await _poll(hass, entry)
    assert len(calls) == 2
    resolved = calls[1].data
    assert resolved["title"] == "✅ High load [CRITICAL]"
    assert resolved["data"]["tag"] == push["data"]["tag"]
    assert "push" not in resolved["data"]  # resolved is never critical
    assert _notifications(hass) == {}


async def test_notification_filters(hass: HomeAssistant, prometheus, entry_data) -> None:
    calls = async_mock_service(hass, "notify", "mobile_app_phone")
    # push only for critical alerts, no system notifications
    entry = _entry(entry_data, {"notify_severities": ["critical"], "notify_persistent": False}, severity="warning")
    entry.add_to_hass(hass)
    prometheus.clear_requests()
    prometheus.get(f"{URL}/api/v1/query?query=node_load1", json=vector())
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    prometheus.clear_requests()
    prometheus.get(f"{URL}/api/v1/query?query=node_load1", json=vector(({"instance": "a"}, 5)))
    await _poll(hass, entry)
    assert hass.states.get("binary_sensor.home_high_load").state == "on"
    assert calls == []
    assert _notifications(hass) == {}


async def test_prometheus_rules_and_unload(hass: HomeAssistant, prometheus, entry_data) -> None:
    """Firing Prometheus alerts (alerts sensor on) are notified too; unloading removes the notifications."""
    entry = MockConfigEntry(domain=DOMAIN, title="Home", data=entry_data, options={"alerts_enabled": True})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    titles = [n["title"] for n in _notifications(hass).values()]
    assert titles == ["🔴 HighLoad [WARNING]"]  # the pending DiskFull alert is not notified

    assert await hass.config_entries.async_unload(entry.entry_id)
    assert _notifications(hass) == {}
