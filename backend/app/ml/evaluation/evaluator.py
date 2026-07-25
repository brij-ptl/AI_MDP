"""Loads a persisted model's metadata.json for the admin 'Accuracy Reports' screen."""
import json
from pathlib import Path

from app.core.config import settings


def get_model_metadata(slug: str) -> dict | None:
    path = Path(settings.TRAINED_MODELS_DIR) / slug / "metadata.json"
    if not path.exists():
        return None
    return json.loads(path.read_text())


def get_all_model_metadata() -> list[dict]:
    root = Path(settings.TRAINED_MODELS_DIR)
    out = []
    for meta_file in sorted(root.glob("*/metadata.json")):
        out.append(json.loads(meta_file.read_text()))
    return out
