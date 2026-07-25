"""
Simple in-memory TTL cache used for lightweight caching (e.g. dashboard analytics,
disease summary lists). For a multi-worker production deployment, swap the backing
dict for Redis without changing the call sites (get/set/delete interface is preserved).
"""
from __future__ import annotations
import time
import threading

_lock = threading.Lock()
_store: dict[str, tuple[float, object]] = {}


def cache_get(key: str):
    with _lock:
        entry = _store.get(key)
        if not entry:
            return None
        expires_at, value = entry
        if expires_at < time.time():
            del _store[key]
            return None
        return value


def cache_set(key: str, value, ttl_seconds: int = 60) -> None:
    with _lock:
        _store[key] = (time.time() + ttl_seconds, value)


def cache_delete(key: str) -> None:
    with _lock:
        _store.pop(key, None)


def cache_clear() -> None:
    with _lock:
        _store.clear()
