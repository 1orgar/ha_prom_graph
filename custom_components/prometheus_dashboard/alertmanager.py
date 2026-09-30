"""Alertmanager API v2: active silences and creating a silence.

Used by notifications (silenced series are not pushed), the Alerts card (silenced alerts are
marked) and the "Silence" button of a push notification.
"""

from __future__ import annotations

from collections.abc import Mapping
from datetime import datetime, timedelta
import re
from typing import Any

import aiohttp
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.util import dt as dt_util

from .api import CannotConnect, ConnectionTimeout, InvalidAuth, PrometheusError, QueryError, auth_headers, normalize_url
from .const import CONF_PASSWORD, CONF_USERNAME, CONF_VERIFY_SSL, REQUEST_TIMEOUT


def _matches(matcher: Mapping[str, Any], labels: Mapping[str, str]) -> bool:
    value = labels.get(matcher.get("name", ""), "")
    expected = str(matcher.get("value", ""))
    if matcher.get("isRegex"):
        try:
            hit = re.fullmatch(expected, value) is not None
        except re.error:
            return False
    else:
        hit = value == expected
    # `isEqual: false` = `!=` / `!~`
    return hit if matcher.get("isEqual", True) else not hit


def silenced_by(silences: list[dict[str, Any]], labels: Mapping[str, str]) -> dict[str, Any] | None:
    """First active silence whose matchers all match `labels`."""
    for silence in silences:
        matchers = silence.get("matchers") or []
        if matchers and all(_matches(m, labels) for m in matchers):
            return silence
    return None


class AlertmanagerClient:
    """Minimal client for `/api/v2/silences` (same credentials as the Prometheus connection)."""

    def __init__(self, hass: HomeAssistant, url: str, config: Mapping[str, Any]) -> None:
        self._session = async_get_clientsession(hass)
        self.base_url = normalize_url(url)
        self._verify_ssl = config.get(CONF_VERIFY_SSL, True)
        self._headers = auth_headers(config)
        self._auth = None
        if config.get(CONF_USERNAME) and "Authorization" not in self._headers:
            self._auth = aiohttp.BasicAuth(config[CONF_USERNAME], config.get(CONF_PASSWORD) or "")

    async def _call(self, method: str, path: str, payload: Any = None) -> Any:
        try:
            async with self._session.request(
                method,
                f"{self.base_url}{path}",
                json=payload,
                auth=self._auth,
                headers=self._headers or None,
                ssl=self._verify_ssl,
                timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT),
            ) as response:
                if response.status in (401, 403):
                    raise InvalidAuth(f"Alertmanager HTTP {response.status}")
                if response.status >= 400:
                    raise QueryError(f"Alertmanager HTTP {response.status}: {(await response.text())[:200]}")
                return await response.json(content_type=None)
        except PrometheusError:
            raise
        except TimeoutError as err:
            raise ConnectionTimeout("Alertmanager did not respond") from err
        except (aiohttp.ClientError, ValueError) as err:
            raise CannotConnect(f"Alertmanager: {err or err.__class__.__name__}") from err

    async def active_silences(self) -> list[dict[str, Any]]:
        data = await self._call("GET", "/api/v2/silences")
        return [s for s in data or [] if (s.get("status") or {}).get("state") == "active"]

    async def create_silence(
        self, labels: Mapping[str, str], minutes: float, comment: str, created_by: str = "Home Assistant"
    ) -> str:
        """Silence exactly this label set for `minutes`; returns the silence id."""
        now: datetime = dt_util.utcnow()
        payload = {
            "matchers": [
                {"name": k, "value": v, "isRegex": False, "isEqual": True} for k, v in sorted(labels.items())
            ],
            "startsAt": now.isoformat(),
            "endsAt": (now + timedelta(minutes=minutes)).isoformat(),
            "createdBy": created_by,
            "comment": comment,
        }
        data = await self._call("POST", "/api/v2/silences", payload)
        return str((data or {}).get("silenceID", ""))
