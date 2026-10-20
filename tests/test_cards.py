"""Dashboard cards shipped with the integration: static path + dashboard resource."""

from __future__ import annotations

import json
from pathlib import Path

from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir
from homeassistant.setup import async_setup_component

from custom_components.prometheus_dashboard.cards import WWW_DIR, cards_url
from custom_components.prometheus_dashboard.const import CARDS_FILENAME, CARDS_URL_BASE, DOMAIN, ISSUE_LEGACY_CARDS

MANIFEST = Path(__file__).parents[1] / "custom_components" / DOMAIN / "manifest.json"
VERSION = json.loads(MANIFEST.read_text())["version"]
URL = cards_url(VERSION)


def _resources(hass: HomeAssistant) -> list[dict]:
    return list(hass.data["lovelace"].resources.async_items())


async def _setup(hass: HomeAssistant, config_entry, lovelace: dict | None = None) -> None:
    assert await async_setup_component(hass, "http", {})
    assert await async_setup_component(hass, "lovelace", {"lovelace": lovelace or {}})
    config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()


def test_bundle_is_shipped() -> None:
    """The built cards are part of the integration folder (HACS installs only that)."""
    bundle = WWW_DIR / CARDS_FILENAME
    assert bundle.is_file() and bundle.stat().st_size > 50_000
    assert f'__PROM_CARDS_VERSION__="{VERSION}"' in bundle.read_text(), "rebuild: cd frontend && npm run build"


async def test_resource_registered_and_served(hass: HomeAssistant, hass_client, prometheus, config_entry) -> None:
    await _setup(hass, config_entry)
    assert [(r["type"], r["url"]) for r in _resources(hass)] == [("module", URL)]
    assert URL.startswith(f"{CARDS_URL_BASE}/{CARDS_FILENAME}?v=")

    client = await hass_client()
    resp = await client.get(URL)
    assert resp.status == 200
    assert "prometheus-stat-card" in await resp.text()


async def test_resource_updated_not_duplicated(hass: HomeAssistant, hass_storage, prometheus, config_entry) -> None:
    """After an update the version in the URL changes; user resources are kept."""
    hass_storage["lovelace_resources"] = {
        "version": 1,
        "key": "lovelace_resources",
        "data": {
            "items": [
                {"id": "old", "type": "module", "url": f"{CARDS_URL_BASE}/{CARDS_FILENAME}?v=0.0.1"},
                {"id": "mine", "type": "module", "url": "/local/my-card.js"},
            ]
        },
    }
    await _setup(hass, config_entry)
    assert sorted(r["url"] for r in _resources(hass)) == sorted([URL, "/local/my-card.js"])


async def test_legacy_plugin_reported(hass: HomeAssistant, hass_storage, prometheus, config_entry) -> None:
    hass_storage["lovelace_resources"] = {
        "version": 1,
        "key": "lovelace_resources",
        "data": {"items": [{"id": "x", "type": "module", "url": "/hacsfiles/ha_prom_graph_cards/ha_prom_graph_cards.js?hacstag=1"}]},
    }
    await _setup(hass, config_entry)
    issue = ir.async_get(hass).async_get_issue(DOMAIN, ISSUE_LEGACY_CARDS)
    assert issue is not None and issue.translation_key == ISSUE_LEGACY_CARDS
    # the old resource is not touched (HACS manages it), ours is added next to it
    assert len(_resources(hass)) == 2


async def test_yaml_dashboards_load_module(hass: HomeAssistant, prometheus, config_entry) -> None:
    """Resources in YAML can't be edited: the module is loaded on every frontend page instead."""
    from homeassistant.components.frontend import DATA_EXTRA_MODULE_URL

    hass.data[DATA_EXTRA_MODULE_URL] = set()  # frontend itself is not set up in tests
    await _setup(hass, config_entry, {"resource_mode": "yaml"})
    assert URL in hass.data[DATA_EXTRA_MODULE_URL]


async def test_resource_removed_with_last_server(hass: HomeAssistant, prometheus, config_entry) -> None:
    await _setup(hass, config_entry)
    assert _resources(hass)
    await hass.config_entries.async_remove(config_entry.entry_id)
    await hass.async_block_till_done()
    assert _resources(hass) == []
