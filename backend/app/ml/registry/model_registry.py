"""In-memory registry of all disease modules available to the platform, built from
app/ml/diseases/*/config.json. Used by the prediction module, dashboard, and admin panel."""
from __future__ import annotations
from pathlib import Path
import json
from functools import lru_cache

from app.core.config import settings
from app.ml.registry.model_loader import load_disease_config
from app.ml.evaluation.evaluator import get_model_metadata


@lru_cache(maxsize=1)
def list_disease_slugs() -> list[str]:
    root = Path(settings.ML_CONFIG_DIR)
    return sorted(p.parent.name for p in root.glob("*/config.json"))


def get_disease_summary(slug: str) -> dict:
    cfg = load_disease_config(slug)
    meta = get_model_metadata(slug)
    return {
        "slug": cfg["slug"],
        "name": cfg["name"],
        "category": cfg["category"],
        "icon": cfg.get("icon"),
        "short_description": cfg.get("short_description"),
        "risk_factors": cfg.get("risk_factors", []),
        "common_symptoms": cfg.get("common_symptoms", []),
        "recommended_tests": cfg.get("recommended_tests", []),
        "recommended_specialist": cfg.get("recommended_specialist"),
        "feature_schema": cfg.get("feature_schema", []),
        "data_source": cfg.get("data_source"),
        "model_available": meta is not None,
        "model_accuracy": meta["metrics"]["accuracy"] if meta else None,
        "model_version": meta.get("model_version") if meta else None,
        "trained_at": meta.get("trained_at") if meta else None,
    }


def list_all_disease_summaries() -> list[dict]:
    return [get_disease_summary(s) for s in list_disease_slugs()]
