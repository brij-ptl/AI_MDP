"""File validation and naming helpers used by the upload-report and OCR modules."""
from __future__ import annotations
import uuid
from pathlib import Path

from fastapi import UploadFile

from app.core.config import settings
from app.core.exceptions import ValidationException


def validate_upload(file: UploadFile, contents: bytes) -> str:
    """Validates extension + size. Returns the lowercase file extension (with dot)."""
    ext = Path(file.filename or "").suffix.lower()
    if ext not in settings.ALLOWED_UPLOAD_EXTENSIONS:
        raise ValidationException(
            f"Unsupported file type '{ext}'. Allowed: {', '.join(settings.ALLOWED_UPLOAD_EXTENSIONS)}"
        )
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > settings.MAX_UPLOAD_SIZE_MB:
        raise ValidationException(f"File too large ({size_mb:.1f}MB). Max is {settings.MAX_UPLOAD_SIZE_MB}MB.")
    return ext


def generate_unique_filename(ext: str) -> str:
    return f"{uuid.uuid4().hex}{ext}"
