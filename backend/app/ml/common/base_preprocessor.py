"""Shared helpers for turning a raw feature dict into a model-ready ordered vector."""
from __future__ import annotations
from typing import Any, Dict, List


def coerce_and_order_features(raw: Dict[str, Any], feature_schema: List[dict]) -> Dict[str, Any]:
    """
    Applies type coercion + defaults based on a disease's feature_schema (from config.json).
    Returns a dict of {feature_name: coerced_value} in schema order.
    Missing numeric fields default to the schema's 'default' or midpoint of range.
    Missing categorical fields default to the first category.
    """
    out: Dict[str, Any] = {}
    for f in feature_schema:
        name = f["name"]
        value = raw.get(name, None)
        if f["type"] == "numeric":
            if value is None or value == "":
                value = f.get("default", (f.get("min", 0) + f.get("max", 1)) / 2)
            try:
                value = float(value)
            except (TypeError, ValueError):
                value = f.get("default", 0.0)
            lo, hi = f.get("min"), f.get("max")
            if lo is not None:
                value = max(lo, value)
            if hi is not None:
                value = min(hi, value)
        elif f["type"] == "categorical":
            categories = f.get("categories", [])
            if value is None or value not in categories:
                value = f.get("default", categories[0] if categories else None)
        out[name] = value
    return out
