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
import os
import re
import shutil
from typing import Any

from PIL import Image, ImageFilter, ImageOps
from app.core.exceptions import ValidationException
from app.ml.registry.model_loader import load_disease_config


_TESSERACT_VERIFIED = False

def verify_and_configure_tesseract():
    global _TESSERACT_VERIFIED
    if _TESSERACT_VERIFIED:
        return
        
    import pytesseract
    tess_path = shutil.which("tesseract")
    
    if not tess_path and os.name == 'nt':
        common_paths = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Tesseract-OCR\tesseract.exe"),
            r"c:\Users\hp\OneDrive\1 iwill\AI_MDP\backend\tess_extracted\tesseract.exe"
        ]
        for p in common_paths:
            if os.path.exists(p):
                tess_path = p
                break
                
    if not tess_path:
        raise ValidationException(
            "Tesseract-OCR is not installed. Windows users: download the installer from "
            "UB Mannheim (https://github.com/UB-Mannheim/tesseract/wiki). "
            "Linux users: run 'sudo apt-get install tesseract-ocr'."
        )
        
    pytesseract.pytesseract.tesseract_cmd = tess_path
    _TESSERACT_VERIFIED = True

def enhance_image_for_ocr(image: Image.Image) -> Image.Image:
    # 1. Grayscale
    img = image.convert('L')
    
    # 2. Resize (upscale 2x for better DPI OCR accuracy)
    img = img.resize((img.width * 2, img.height * 2), Image.Resampling.LANCZOS)
    
    # 3. Noise reduction (median filter)
    img = img.filter(ImageFilter.MedianFilter(size=3))
    
    # 4. Thresholding (basic binarization)
    img = img.point(lambda p: 0 if p < 140 else 255)
    
    # 5. Deskew / rotation via OSD
    try:
        import pytesseract
        osd = pytesseract.image_to_osd(img)
        match = re.search(r'(?<=Rotate: )\d+', osd)
        if match:
            angle = int(match.group(0))
            if angle != 0:
                img = img.rotate(-angle, expand=True, resample=Image.Resampling.BICUBIC)
    except Exception:
        # Ignore OSD errors if it can't detect orientation
        pass
        
    return img

def extract_text_from_pdf(file_bytes: bytes) -> str:
    import pdfplumber
    text_chunks = []
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                text_chunks.append(page_text)
        text = "\n".join(text_chunks).strip()
        if text:
            return text
    except Exception as e:
        raise ValidationException(f"Unsupported file or corrupted PDF: {e}")

    # Scanned (image-only) PDF: fall back to OCR page-by-page.
    verify_and_configure_tesseract()
    try:
        from pdf2image import convert_from_bytes
        import pytesseract
        # Poppler is still required for pdf2image to convert scanned PDFs to images
        images = convert_from_bytes(file_bytes)
        
        extracted = []
        for img in images:
            enhanced = enhance_image_for_ocr(img)
            extracted.append(pytesseract.image_to_string(enhanced))
            
        full_text = "\n".join(extracted).strip()
        if not full_text:
            raise ValidationException("OCR extracted no readable text. Image quality may be too poor.")
        return full_text
    except ValidationException:
        raise
    except Exception as e:
        raise ValidationException(
            "Could not extract text from this scanned PDF. Ensure poppler is installed "
            f"and image quality is sufficient: {e}"
        )


def extract_text_from_image(file_bytes: bytes) -> str:
    verify_and_configure_tesseract()
    try:
        import pytesseract
        image = Image.open(io.BytesIO(file_bytes))
        enhanced = enhance_image_for_ocr(image)
        text = pytesseract.image_to_string(enhanced).strip()
        
        if not text:
            raise ValidationException("OCR extracted no readable text. Image quality may be too poor.")
        return text
    except ValidationException:
        raise
    except Exception as e:
        raise ValidationException(f"Unsupported file format or unreadable image: {e}")


def extract_raw_text(file_bytes: bytes, ext: str) -> str:
    if ext.lower() == ".pdf":
        return extract_text_from_pdf(file_bytes)
    elif ext.lower() in [".png", ".jpg", ".jpeg"]:
        return extract_text_from_image(file_bytes)
    raise ValidationException("Unsupported file type. Please upload a PDF, PNG, JPG, or JPEG.")


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
