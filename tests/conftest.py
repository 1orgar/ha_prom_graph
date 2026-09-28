"""Shared fixtures: a fake Prometheus served through aioclient_mock."""

from __future__ import annotations

from typing import Any

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from custom_components.prometheus_dashboard.const import CONF_NAME, CONF_PROMETHEUS_URL, CONF_VERIFY_SSL, DOMAIN

URL = "http://prom.test:9090"


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Allow loading custom_components/ in every test."""
    yield


@pytest.fixture(autouse=True)
async def unload_entries(hass):
    """Unload all entries after each test so coordinator timers do not linger."""
    yield
    await hass.async_block_till_done()
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.state.recoverable:
            await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


def vector(*items: tuple[dict[str, str], float]) -> dict[str, Any]:
    return {
        "status": "success",
        "data": {
            "resultType": "vector",
            "result": [{"metric": m, "value": [1700000000, str(v)]} for m, v in items],
        },
    }


@pytest.fixture
def prometheus(aioclient_mock: AiohttpClientMocker) -> AiohttpClientMocker:
    """A healthy Prometheus with 3 targets (2 up) and two alerts."""
    aioclient_mock.get(
        f"{URL}/api/v1/status/buildinfo",
        json={"status": "success", "data": {"version": "2.53.0"}},
    )
    aioclient_mock.get(f"{URL}/api/v1/query?query=count(up)", json=vector(({}, 3)))
    aioclient_mock.get(f"{URL}/api/v1/query?query=sum(up)", json=vector(({}, 2)))
    aioclient_mock.get(
        f"{URL}/api/v1/query?query=node_load1",
        json=vector(({"instance": "a"}, 1.5), ({"instance": "b"}, 0.5)),
    )
    aioclient_mock.get(f"{URL}/api/v1/query?query=absent_metric", json=vector())
    aioclient_mock.get(
        f"{URL}/api/v1/query?query=bad(",
        status=400,
        json={"status": "error", "errorType": "bad_data", "error": "parse error"},
    )
    aioclient_mock.get(
        f"{URL}/api/v1/alerts",
        json={
            "status": "success",
            "data": {
                "alerts": [
                    {"labels": {"alertname": "HighLoad", "severity": "warning"}, "state": "firing",
                     "annotations": {"summary": "load"}, "activeAt": "2026-01-01T00:00:00Z"},
                    {"labels": {"alertname": "DiskFull"}, "state": "pending", "annotations": {}},
                ]
            },
        },
    )
    return aioclient_mock


@pytest.fixture
def entry_data() -> dict[str, Any]:
    return {CONF_PROMETHEUS_URL: URL, CONF_NAME: "Home", CONF_VERIFY_SSL: True}


@pytest.fixture
def config_entry(entry_data) -> MockConfigEntry:
    return MockConfigEntry(domain=DOMAIN, title="Home", data=entry_data, version=1)
