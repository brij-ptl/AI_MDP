"""Loads a trained pipeline (+ its config) from disk for a given disease slug."""
from __future__ import annotations
import json
from pathlib import Path
from functools import lru_cache

import joblib

from app.core.config import settings
from app.ml.common.exceptions import ModelNotFoundError


def _paths(slug: str):
    model_dir = Path(settings.TRAINED_MODELS_DIR) / slug
    return model_dir / "model.joblib", model_dir / "metadata.json"


@lru_cache(maxsize=32)
def load_model_bundle(slug: str) -> dict:
    model_path, meta_path = _paths(slug)
    if not model_path.exists():
        raise ModelNotFoundError(
            f"No trained model found for '{slug}'. Run: python -m app.ml.training.train_all --disease {slug}"
        )
    bundle = joblib.load(model_path)
    metadata = json.loads(meta_path.read_text()) if meta_path.exists() else {}
    bundle["metadata"] = metadata
    return bundle


@lru_cache(maxsize=32)
def load_disease_config(slug: str) -> dict:
    cfg_path = Path(settings.ML_CONFIG_DIR) / slug / "config.json"
    if not cfg_path.exists():
        raise ModelNotFoundError(f"No disease config found for '{slug}'.")
    return json.loads(cfg_path.read_text())


def clear_cache():
    load_model_bundle.cache_clear()
    load_disease_config.cache_clear()
