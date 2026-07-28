# Nidaan+ — OCR Pipeline

> How medical report uploads are processed, text is extracted, and prediction forms are auto-filled.

---

## Overview

The OCR pipeline allows users to upload a medical lab report (PDF, PNG, or JPG) instead of manually entering values into a prediction form. The platform extracts text from the document, matches recognized lab parameter names against the disease's expected feature names, and returns pre-populated values for the user to review before running a prediction.

**Important:** The user always reviews and can correct the extracted values before prediction. The OCR output is a starting point, not a final input.

---

## Supported File Formats

| Format | Extraction Method |
|---|---|
| `.pdf` (digital / text-layer) | pdfplumber — direct text extraction, no OCR binary needed |
| `.pdf` (scanned / image-only) | pdf2image + pytesseract (requires Tesseract + Poppler) |
| `.png` | pytesseract with image preprocessing |
| `.jpg` / `.jpeg` | pytesseract with image preprocessing |

Maximum file size: `10 MB` (configurable via `MAX_UPLOAD_SIZE_MB`)

---

## Pipeline Stages

### Stage 1: Upload and Validation

```
POST /api/v1/ocr/upload
  multipart/form-data:
    file: <binary>
    disease: "diabetes"  (optional)
```

Checks:
- File extension is in `[.pdf, .png, .jpg, .jpeg]`
- File size does not exceed `MAX_UPLOAD_SIZE_MB`
- File is saved temporarily to `app/uploads/`

---

### Stage 2: Text Extraction

The extraction strategy is determined by the file type:

#### Digital PDF (most lab reports)

```python
with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
    for page in pdf.pages:
        text += page.extract_text() or ""
```

If `pdfplumber` returns non-empty text, the pipeline proceeds directly to parameter extraction. No Tesseract binary is needed for digital PDFs.

#### Scanned PDF or Image

If the PDF produces empty text (scanned document), or if the file is a PNG/JPG:

**Image Preprocessing (before OCR):**

```
1. Convert to grayscale (L mode)
2. Resize 2x (upscale for better DPI accuracy)
3. Apply median filter (size=3) for noise reduction
4. Binarize: pixels < 140 -> 0 (black), >= 140 -> 255 (white)
5. Auto-deskew: pytesseract OSD detects rotation angle and corrects it
   (skipped if OSD fails — e.g. insufficient text regions)
```

**OCR:**

```python
text = pytesseract.image_to_string(preprocessed_image)
```

For scanned PDFs, `pdf2image.convert_from_bytes()` converts each page to a PIL Image first (requires Poppler on the server).

---

### Stage 3: Parameter Extraction

The raw extracted text is matched against the disease's `ocr_aliases` configuration:

```json
// In config.json feature_schema entry:
{
  "name": "glucose",
  "label": "Blood Glucose",
  "type": "numeric",
  "ocr_aliases": ["glucose", "blood glucose", "fasting glucose", "bgl"]
}
```

For each feature:

```python
for alias in feature["ocr_aliases"]:
    pattern = re.escape(alias.lower()) + r"[:\-\s]{1,3}(\d+\.?\d*)"
    match = re.search(pattern, raw_text_lower)
    if match:
        extracted[feature["name"]] = float(match.group(1))
        break
else:
    notes.append(f"Could not find '{feature['label']}'; please enter manually.")
```

Only numeric features (`"type": "numeric"`) are extracted. Categorical features (e.g. gender, smoking status) must be entered manually.

---

### Stage 4: Response

```json
{
  "success": true,
  "message": "Document processed. Please review the extracted values before predicting.",
  "data": {
    "raw_text": "PATIENT: ...\nGlucose: 126 mg/dL\nBMI: 28.5\n...",
    "parameters": {
      "glucose": 126.0,
      "bmi": 28.5
    },
    "notes": [
      "Could not find 'insulin' in the document; please enter it manually.",
      "Could not find 'skin_thickness' in the document; please enter it manually."
    ]
  }
}
```

The frontend auto-populates the prediction form with `parameters` values, leaving unmatched fields blank for manual entry.

---

### Stage 5: User Verification and Prediction

The user reviews the auto-filled values, corrects any errors, fills in missing fields, and clicks "Verify and Predict". This triggers a normal `POST /api/v1/prediction/{slug}` call — the OCR output is not saved and does not directly affect the prediction.

---

## Tesseract Configuration

On startup, the service checks for the Tesseract binary in this order:

```python
# 1. Check system PATH
tess_path = shutil.which("tesseract")

# 2. Windows: check common installation paths
if not tess_path and os.name == "nt":
    common_paths = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Tesseract-OCR\tesseract.exe"),
    ]
    for path in common_paths:
        if os.path.exists(path):
            tess_path = path
            break

# 3. Raise a ValidationException (HTTP 422) if not found
if not tess_path:
    raise ValidationException("Tesseract-OCR is not installed...")

pytesseract.pytesseract.tesseract_cmd = tess_path
```

The `TESSERACT_CMD` environment variable can be set to specify a custom path.

---

## Error Handling

| Condition | HTTP Status | Message |
|---|---|---|
| Invalid file extension | 422 | "Unsupported file type..." |
| File too large | 422 | "File size exceeds limit..." |
| Tesseract not installed | 422 | "Tesseract-OCR is not installed..." |
| OCR extracts no text | 422 | "OCR extracted no readable text. Image quality may be too poor." |
| Corrupted PDF | 422 | "Unsupported file or corrupted PDF: ..." |
| Scanned PDF without Poppler | 422 | "Could not extract text from this scanned PDF. Ensure poppler is installed..." |

---

## Installation Requirements

### Tesseract OCR

Required for image files and scanned PDFs.

**Windows:** [UB Mannheim installer](https://github.com/UB-Mannheim/tesseract/wiki)

**Linux:**
```bash
sudo apt-get install tesseract-ocr tesseract-ocr-eng
```

**macOS:**
```bash
brew install tesseract
```

### Poppler (for scanned PDFs only)

Required only if users will upload scanned (image-based) PDFs.

**Windows:** [poppler for Windows](https://github.com/oschwartz10612/poppler-windows/releases)

**Linux:**
```bash
sudo apt-get install poppler-utils
```

**macOS:**
```bash
brew install poppler
```

---

## Limitations

1. **OCR accuracy depends on image quality.** Low-resolution or skewed scans may produce poor text extraction.
2. **Only numeric features are auto-extracted.** Categorical inputs (gender, blood group, etc.) must be entered manually.
3. **Regex matching is format-dependent.** Lab reports with unusual formatting or non-standard parameter names may not be matched. The `ocr_aliases` list in each disease config can be extended to improve coverage.
4. **Poppler is an additional system dependency** for scanned PDF support and must be installed separately.
