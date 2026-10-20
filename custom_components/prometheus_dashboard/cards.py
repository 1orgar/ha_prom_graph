"""Dashboard cards shipped with the integration (`www/`, built from `frontend/`).

The bundle is served from the integration's own static path and registered as a dashboard
resource, so the cards work right after installing the integration - nothing is copied to
`/config/www` and no separate HACS plugin is needed.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir
from homeassistant.loader import async_get_integration

from .const import CARDS_FILENAME, CARDS_URL_BASE, DOMAIN, ISSUE_LEGACY_CARDS, LEGACY_CARDS_MARKER

_LOGGER = logging.getLogger(__name__)

WWW_DIR = Path(__file__).parent / "www"
LOVELACE_DATA = "lovelace"
DATA_CARDS_URL = f"{DOMAIN}_cards_url"


def cards_url(version: str) -> str:
    """URL of the bundle; the version busts the browser cache after an update."""
    return f"{CARDS_URL_BASE}/{CARDS_FILENAME}?v={version}"


def _is_ours(url: str) -> bool:
    return url.split("?", 1)[0] == f"{CARDS_URL_BASE}/{CARDS_FILENAME}"


def _storage_resources(hass: HomeAssistant) -> Any | None:
    """Resource collection of the dashboards in storage mode (None in YAML mode)."""
    data = hass.data.get(LOVELACE_DATA)
    resources = getattr(data, "resources", None)
    return resources if hasattr(resources, "async_create_item") else None


async def _async_loaded_items(resources: Any) -> list[dict[str, Any]]:
    if not getattr(resources, "loaded", True):
        await resources.async_load()
        resources.loaded = True
    return list(resources.async_items() or [])


async def async_register_cards(hass: HomeAssistant) -> None:
    """Serve `www/` and add (or update) the dashboard resource of the cards."""
    if hass.data.get(DATA_CARDS_URL):
        return
    integration = await async_get_integration(hass, DOMAIN)
    url = cards_url(str(integration.version))
    hass.data[DATA_CARDS_URL] = url

    if hass.http is not None:
        await hass.http.async_register_static_paths([StaticPathConfig(CARDS_URL_BASE, str(WWW_DIR), True)])

    resources = _storage_resources(hass)
    if resources is None:
        # dashboards in YAML mode: resources can't be edited -> load the module on every frontend page
        try:
            from homeassistant.components.frontend import add_extra_js_url

            add_extra_js_url(hass, url)
        except (ImportError, KeyError):
            _LOGGER.warning("Add %s as a dashboard resource (type module) to use the cards", url)
        return

    items = await _async_loaded_items(resources)
    legacy = [i for i in items if LEGACY_CARDS_MARKER in str(i.get("url", ""))]
    ours = [i for i in items if _is_ours(str(i.get("url", "")))]
    if not ours:
        await resources.async_create_item({"res_type": "module", "url": url})
        _LOGGER.info("Registered dashboard resource %s", url)
    elif ours[0].get("url") != url:
        await resources.async_update_item(ours[0]["id"], {"res_type": "module", "url": url})
    # the separate card plugin of earlier versions defines the same elements: ask to remove it
    if legacy:
        ir.async_create_issue(
            hass,
            DOMAIN,
            ISSUE_LEGACY_CARDS,
            is_fixable=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key=ISSUE_LEGACY_CARDS,
            translation_placeholders={"url": str(legacy[0].get("url"))},
        )
    else:
        ir.async_delete_issue(hass, DOMAIN, ISSUE_LEGACY_CARDS)


async def async_unregister_cards(hass: HomeAssistant) -> None:
    """Last server removed: drop the dashboard resource (the static path stays until restart)."""
    hass.data.pop(DATA_CARDS_URL, None)
    ir.async_delete_issue(hass, DOMAIN, ISSUE_LEGACY_CARDS)
    if (resources := _storage_resources(hass)) is None:
        return
    for item in await _async_loaded_items(resources):
        if _is_ours(str(item.get("url", ""))):
            await resources.async_delete_item(item["id"])
