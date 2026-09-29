"""Small async client for the Prometheus HTTP API."""

from __future__ import annotations

import asyncio
import time
from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any
from urllib.parse import urlencode

import aiohttp
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .cache import RequestCache
from .const import (
    CONF_PASSWORD,
    CONF_PROMETHEUS_URL,
    CONF_USERNAME,
    CONF_VERIFY_SSL,
    REQUEST_TIMEOUT,
    TEST_TIMEOUT,
)


class PrometheusError(Exception):
    """Base error. `reason` is a translation key used by the config flow."""

    reason = "unknown"

    def __init__(self, detail: str = "") -> None:
        super().__init__(detail or self.reason)
        self.detail = detail


class CannotConnect(PrometheusError):
    reason = "cannot_connect"


class InvalidAuth(PrometheusError):
    reason = "invalid_auth"


class ConnectionTimeout(PrometheusError):
    reason = "timeout"


class SSLError(PrometheusError):
    reason = "ssl_error"


class NotPrometheus(PrometheusError):
    reason = "not_prometheus"


class QueryError(PrometheusError):
    reason = "query_error"


@dataclass
class ConnectionTestResult:
    """Information shown to the user after a successful connection test."""

    version: str
    latency_ms: int
    targets_up: int | None
    targets_total: int | None


def normalize_url(url: str) -> str:
    """Normalize the base URL (strip spaces, trailing slash, add scheme)."""
    url = url.strip().rstrip("/")
    if url and "://" not in url:
        url = f"http://{url}"
    return url


class PrometheusClient:
    """Performs requests to one Prometheus server."""

    def __init__(self, hass: HomeAssistant, config: Mapping[str, Any], cache_ttl: float = 0) -> None:
        self._session = async_get_clientsession(hass)
        self._base_url = normalize_url(config[CONF_PROMETHEUS_URL])
        self._verify_ssl = config.get(CONF_VERIFY_SSL, True)
        self._auth = None
        if config.get(CONF_USERNAME):
            self._auth = aiohttp.BasicAuth(config[CONF_USERNAME], config.get(CONF_PASSWORD) or "")
        self.cache = RequestCache(cache_ttl)
        # set by async_setup_entry: PromQL alerts of Home Assistant are added to `/alerts`
        self.coordinator: Any = None

    @property
    def base_url(self) -> str:
        return self._base_url

    async def request(
        self,
        path: str,
        params: Mapping[str, Any] | None = None,
        timeout: float = REQUEST_TIMEOUT,
        *,
        use_cache: bool = True,
    ) -> dict[str, Any]:
        """GET `path` (de-duplicated + cached) and return the Prometheus JSON envelope."""
        if not use_cache:
            return await self._request(path, params, timeout)
        key = RequestCache.make_key(path, dict(params) if params else None)
        return await self.cache.get(key, lambda: self._request(path, params, timeout))

    async def query(self, promql: str) -> dict[str, Any]:
        """Instant query."""
        return await self.request("/api/v1/query", {"query": promql})

    async def alerts(self) -> list[dict[str, Any]]:
        """Active alerts (`/api/v1/alerts`)."""
        payload = await self.request("/api/v1/alerts")
        return list(payload.get("data", {}).get("alerts", []))

    async def _request(
        self,
        path: str,
        params: Mapping[str, Any] | None,
        timeout: float,
    ) -> dict[str, Any]:
        url = f"{self._base_url}{path}"
        if params:
            url = f"{url}?{urlencode(params, doseq=True)}"

        try:
            async with self._session.get(
                url,
                auth=self._auth,
                ssl=self._verify_ssl,
                timeout=aiohttp.ClientTimeout(total=timeout),
            ) as response:
                if response.status in (401, 403):
                    raise InvalidAuth(f"HTTP {response.status}")
                try:
                    payload = await response.json(content_type=None)
                except (ValueError, aiohttp.ContentTypeError) as err:
                    raise NotPrometheus(f"HTTP {response.status}: response is not JSON") from err
                if not isinstance(payload, dict) or "status" not in payload:
                    raise NotPrometheus(f"HTTP {response.status}: unexpected response")
                if payload.get("status") != "success":
                    raise QueryError(payload.get("error") or f"HTTP {response.status}")
                return payload
        except PrometheusError:
            raise
        except asyncio.TimeoutError as err:
            raise ConnectionTimeout(f"no response in {timeout:.0f}s") from err
        except (aiohttp.ClientSSLError, aiohttp.ClientConnectorCertificateError) as err:
            raise SSLError(str(err)) from err
        except aiohttp.InvalidURL as err:
            raise CannotConnect(f"invalid URL: {err}") from err
        except aiohttp.ClientError as err:
            raise CannotConnect(str(err) or err.__class__.__name__) from err

    async def async_test_connection(self) -> ConnectionTestResult:
        """Check that the server is reachable and is a Prometheus-compatible API."""
        started = time.monotonic()
        try:
            buildinfo = await self.request("/api/v1/status/buildinfo", timeout=TEST_TIMEOUT, use_cache=False)
            version = str(buildinfo.get("data", {}).get("version") or "?")
        except (NotPrometheus, QueryError):
            # Some compatible backends (Thanos, VictoriaMetrics, Mimir) have no buildinfo
            version = "?"
        latency_ms = int((time.monotonic() - started) * 1000)

        # A real query proves that the query API works and gives useful info
        result = await self.request("/api/v1/query", {"query": "count(up)"}, timeout=TEST_TIMEOUT, use_cache=False)
        total = _scalar(result)
        up_result = await self.request("/api/v1/query", {"query": "sum(up)"}, timeout=TEST_TIMEOUT, use_cache=False)
        up = _scalar(up_result)

        return ConnectionTestResult(
            version=version,
            latency_ms=latency_ms,
            targets_up=up,
            targets_total=total,
        )


def result_values(payload: dict[str, Any]) -> list[tuple[dict[str, str], float]]:
    """Instant query result -> [(labels, value)] (handles vector and scalar results)."""
    data = payload.get("data") or {}
    result_type = data.get("resultType")
    result = data.get("result")
    out: list[tuple[dict[str, str], float]] = []
    if result_type in ("scalar", "string") and isinstance(result, list) and len(result) == 2:
        try:
            out.append(({}, float(result[1])))
        except (TypeError, ValueError):
            pass
        return out
    for item in result or []:
        try:
            out.append((dict(item.get("metric") or {}), float(item["value"][1])))
        except (KeyError, IndexError, TypeError, ValueError):
            continue
    return out


def aggregate(values: list[float], how: str) -> float | None:
    """Reduce several series to one number (for sensors)."""
    finite = [v for v in values if v == v and v not in (float("inf"), float("-inf"))]
    if how == "count":
        return float(len(values))
    if not finite:
        return None
    if how == "sum":
        return sum(finite)
    if how == "avg":
        return sum(finite) / len(finite)
    if how == "min":
        return min(finite)
    if how == "max":
        return max(finite)
    return finite[0]


def _scalar(payload: dict[str, Any]) -> int | None:
    """Extract a single number from an instant-query vector result."""
    try:
        result = payload["data"]["result"]
        if not result:
            return 0
        return int(float(result[0]["value"][1]))
    except (KeyError, IndexError, TypeError, ValueError):
        return None
