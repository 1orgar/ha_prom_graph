"""Websocket API and request de-duplication / cache."""

from __future__ import annotations

import asyncio

from homeassistant.core import HomeAssistant

from custom_components.prometheus_dashboard.cache import RequestCache

from .conftest import URL


async def test_ws_query_and_default_entry(hass: HomeAssistant, hass_ws_client, prometheus, config_entry) -> None:
    config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    client = await hass_ws_client(hass)

    # no entry_id -> first configured server
    await client.send_json_auto_id({"type": "prometheus_dashboard/query", "query": "node_load1"})
    msg = await client.receive_json()
    assert msg["success"]
    assert len(msg["result"]["data"]["result"]) == 2

    await client.send_json_auto_id({"type": "prometheus_dashboard/alerts", "entry_id": config_entry.entry_id})
    msg = await client.receive_json()
    assert msg["success"]
    assert len(msg["result"]["alerts"]) == 2

    await client.send_json_auto_id({"type": "prometheus_dashboard/entries"})
    msg = await client.receive_json()
    assert msg["result"][0]["entry_id"] == config_entry.entry_id
    assert msg["result"][0]["loaded"] is True


async def test_ws_query_error_and_unknown_entry(hass: HomeAssistant, hass_ws_client, prometheus, config_entry) -> None:
    config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id({"type": "prometheus_dashboard/query", "query": "bad("})
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "query_error"
    assert "parse error" in msg["error"]["message"]

    await client.send_json_auto_id({"type": "prometheus_dashboard/query", "entry_id": "nope", "query": "up"})
    msg = await client.receive_json()
    assert msg["error"]["code"] == "not_found"


async def test_identical_requests_hit_prometheus_once(hass: HomeAssistant, prometheus, config_entry) -> None:
    config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    client = config_entry.runtime_data.client
    before = prometheus.call_count

    results = await asyncio.gather(*(client.query("node_load1") for _ in range(5)))
    assert all(r == results[0] for r in results)
    # 5 concurrent identical queries -> 1 HTTP request, then served from cache
    assert prometheus.call_count - before == 1
    await client.query("node_load1")
    assert prometheus.call_count - before == 1
    stats = client.cache.stats()
    assert stats["coalesced"] + stats["hits"] >= 5


async def test_cache_ttl_zero_still_coalesces() -> None:
    calls = 0

    async def fetch():
        nonlocal calls
        calls += 1
        await asyncio.sleep(0.01)
        return {"ok": calls}

    cache = RequestCache(ttl=0)
    results = await asyncio.gather(*(cache.get("k", fetch) for _ in range(3)))
    assert calls == 1 and results == [{"ok": 1}] * 3
    # nothing stored with ttl=0 -> next call fetches again
    assert await cache.get("k", fetch) == {"ok": 2}


async def test_cache_error_is_shared_not_cached() -> None:
    calls = 0

    async def fetch():
        nonlocal calls
        calls += 1
        await asyncio.sleep(0.01)
        raise ValueError("boom")

    cache = RequestCache(ttl=60)
    results = await asyncio.gather(*(cache.get("k", fetch) for _ in range(3)), return_exceptions=True)
    assert calls == 1 and all(isinstance(r, ValueError) for r in results)
    # errors are not cached
    await asyncio.gather(cache.get("k", fetch), return_exceptions=True)
    assert calls == 2


def test_cache_key_is_order_independent() -> None:
    a = RequestCache.make_key("/q", {"query": "up", "time": "1"})
    b = RequestCache.make_key("/q", {"time": "1", "query": "up"})
    assert a == b
    assert URL not in a
