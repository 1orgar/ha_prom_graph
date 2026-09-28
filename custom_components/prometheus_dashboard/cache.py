"""Request de-duplication and short-lived response cache.

Several cards (and several browser tabs) often ask the same PromQL at the same
moment. `RequestCache` makes sure only one HTTP request is sent:

* concurrent identical requests await the same in-flight future;
* completed responses are reused for `ttl` seconds.
"""

from __future__ import annotations

import asyncio
import time
from collections import OrderedDict
from collections.abc import Awaitable, Callable
from typing import Any

from .const import MAX_CACHE_ENTRIES


class RequestCache:
    """Coalesce identical requests and cache their results for a short time."""

    def __init__(self, ttl: float, max_entries: int = MAX_CACHE_ENTRIES) -> None:
        self.ttl = ttl
        self._max = max_entries
        self._data: OrderedDict[str, tuple[float, Any]] = OrderedDict()
        self._inflight: dict[str, asyncio.Future[Any]] = {}
        self.hits = 0
        self.misses = 0
        self.coalesced = 0

    @staticmethod
    def make_key(path: str, params: dict[str, Any] | None) -> str:
        if not params:
            return path
        items = []
        for key in sorted(params):
            value = params[key]
            if isinstance(value, (list, tuple)):
                value = ",".join(map(str, value))
            items.append(f"{key}={value}")
        return f"{path}?{'&'.join(items)}"

    def _get_fresh(self, key: str) -> tuple[bool, Any]:
        entry = self._data.get(key)
        if entry is None:
            return False, None
        stored_at, value = entry
        if time.monotonic() - stored_at > self.ttl:
            self._data.pop(key, None)
            return False, None
        self._data.move_to_end(key)
        return True, value

    def _store(self, key: str, value: Any) -> None:
        self._data[key] = (time.monotonic(), value)
        self._data.move_to_end(key)
        while len(self._data) > self._max:
            self._data.popitem(last=False)

    async def get(self, key: str, fetch: Callable[[], Awaitable[Any]]) -> Any:
        """Return a cached value, join an in-flight request or call `fetch`."""
        if self.ttl > 0:
            found, value = self._get_fresh(key)
            if found:
                self.hits += 1
                return value

        if (future := self._inflight.get(key)) is not None:
            self.coalesced += 1
            # shield: a cancelled waiter must not cancel the shared request
            return await asyncio.shield(future)

        self.misses += 1
        loop = asyncio.get_running_loop()
        future = loop.create_future()
        self._inflight[key] = future
        try:
            value = await fetch()
        except BaseException as err:
            if not future.done():
                future.set_exception(err)
                # avoid "exception was never retrieved" when nobody else waited
                future.exception()
            raise
        else:
            if self.ttl > 0:
                self._store(key, value)
            if not future.done():
                future.set_result(value)
            return value
        finally:
            self._inflight.pop(key, None)

    def clear(self) -> None:
        self._data.clear()

    def stats(self) -> dict[str, Any]:
        return {
            "ttl": self.ttl,
            "entries": len(self._data),
            "hits": self.hits,
            "misses": self.misses,
            "coalesced": self.coalesced,
        }
