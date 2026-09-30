"""Brand images shipped in `brand/` are served by the Home Assistant brands API (HA 2026.3+)."""

from __future__ import annotations

from pathlib import Path

from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component

from custom_components.prometheus_dashboard.const import DOMAIN

BRAND = Path(__file__).parent.parent / "custom_components" / DOMAIN / "brand"


async def test_brand_images_are_served_locally(hass: HomeAssistant, hass_client) -> None:
    assert await async_setup_component(hass, "brands", {})
    client = await hass_client()
    icon = (BRAND / "icon.png").read_bytes()
    # dark_icon.png falls back to icon.png; icon@2x.png is its own file
    for image, expected in (("icon.png", icon), ("dark_icon.png", icon), ("icon@2x.png", (BRAND / "icon@2x.png").read_bytes())):
        resp = await client.get(f"/api/brands/integration/{DOMAIN}/{image}")
        assert resp.status == 200, image
        assert await resp.read() == expected, image
