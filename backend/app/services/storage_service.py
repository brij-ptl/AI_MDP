"""
Local filesystem storage backend. Kept behind a small interface so it can be swapped for
S3 / GCS later without touching calling code in the modules.
"""
from __future__ import annotations
import shutil
from pathlib import Path

from app.core.config import settings


def save_upload(file_bytes: bytes, subfolder: str, filename: str) -> str:
    """Saves raw bytes under app/uploads/<subfolder>/<filename>. Returns the relative path."""
    target_dir = Path(settings.UPLOAD_DIR) / subfolder
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = target_dir / filename
    with open(target_path, "wb") as f:
        f.write(file_bytes)
    return str(target_path)


def save_generated_file(file_bytes: bytes, filename: str) -> str:
    """Saves generated artifacts (e.g. PDF reports) under app/static/generated_reports/."""
    target_dir = Path(settings.GENERATED_REPORTS_DIR)
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = target_dir / filename
    with open(target_path, "wb") as f:
        f.write(file_bytes)
    return str(target_path)


def delete_file(path: str) -> None:
    p = Path(path)
    if p.exists():
        p.unlink()


def read_file(path: str) -> bytes:
    with open(path, "rb") as f:
        return f.read()
