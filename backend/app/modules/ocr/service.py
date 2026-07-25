"""
Extracts raw text from an uploaded medical report (PDF or image) and then parses out the
specific lab parameters a chosen disease module needs, using each feature's `ocr_aliases`
from its config.json. This lets a user upload a blood test / lab report PDF instead of
filling the prediction form by hand — the extracted values simply pre-fill that form,
which the user can review and correct before running the prediction (see proposal's OCR
Pipeline: Upload -> OCR -> Extract -> Normalize -> Auto-fill -> User Verification -> Predict).

Extraction strategy (no paid OCR API required):
  - Digital/text-based PDFs: parsed directly with pdfplumber (no external binary needed).
  - Image files (png/jpg) or scanned PDFs: parsed with pytesseract, which requires the
    `tesseract-ocr` system binary to be installed on the host (see README).
"""
from __future__ import annotations
import io
import re
from typing import Any

from app.core.exceptions import ValidationException
from app.ml.registry.model_loader import load_disease_config


def extract_text_from_pdf(file_bytes: bytes) -> str:
    import pdfplumber
    text_chunks = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            text_chunks.append(page_text)
    text = "\n".join(text_chunks).strip()
    if text:
        return text

    # Scanned (image-only) PDF: fall back to OCR page-by-page.
    try:
        from pdf2image import convert_from_bytes
        import pytesseract
        images = convert_from_bytes(file_bytes)
        return "\n".join(pytesseract.image_to_string(img) for img in images)
    except Exception as e:
        raise ValidationException(
            "Could not extract text from this PDF. It may be a scanned document requiring "
            f"the poppler + tesseract system packages, which failed to run: {e}"
        )


def extract_text_from_image(file_bytes: bytes) -> str:
    try:
        import pytesseract
        from PIL import Image
        image = Image.open(io.BytesIO(file_bytes))
        return pytesseract.image_to_string(image)
    except Exception as e:
        raise ValidationException(
            f"Could not run OCR on this image. Ensure the tesseract-ocr system package is "
            f"installed on the server: {e}"
        )


def extract_raw_text(file_bytes: bytes, ext: str) -> str:
    if ext == ".pdf":
        return extract_text_from_pdf(file_bytes)
    return extract_text_from_image(file_bytes)


_NUMBER_RE = r"[:\-\s]{1,3}(\d+\.?\d*)"


def extract_parameters(raw_text: str, disease_slug: str) -> dict[str, Any]:
    """Regex-matches each feature's OCR aliases against the raw report text."""
    cfg = load_disease_config(disease_slug)
    text_lower = raw_text.lower()
    extracted: dict[str, Any] = {}
    notes: list[str] = []

    for feature in cfg["feature_schema"]:
        if feature["type"] != "numeric":
            continue
        for alias in feature.get("ocr_aliases", [feature["label"].lower()]):
            pattern = re.escape(alias.lower()) + _NUMBER_RE
            match = re.search(pattern, text_lower)
            if match:
                try:
                    value = float(match.group(1))
                    extracted[feature["name"]] = value
                    break
                except ValueError:
                    continue
        else:
            notes.append(f"Could not find '{feature['label']}' in the document; please enter it manually.")

    return {"parameters": extracted, "notes": notes}
