# AI-Enabled Multi-Disease Prediction and Precision Healthcare Platform — Backend

FastAPI backend for the platform described in the project proposal: 16 disease-prediction
modules, an AI symptom analyzer, medical report OCR upload, PDF report generation with a
doctor-style explanation, cookie-tracked mandatory-login access, a 2-free-then-paywall
subscription business model (Razorpay), and an admin panel.

## ⚠️ Honest data-source disclosure (read before presenting to your guide)

Of the 16 disease modules:

| Data source | Diseases | Notes |
|---|---|---|
| **Real public dataset** | `heart`, `diabetes`, `breast_cancer` | Heart = UCI Cleveland heart disease dataset. Diabetes = Pima Indians Diabetes dataset. Breast cancer = the Wisconsin Diagnostic Breast Cancer dataset (bundled with scikit-learn). |
| **Synthetic demo data** | `stroke`, `hypertension`, `kidney`, `liver`, `fatty_liver`, `lung_cancer`, `cervical_cancer`, `prostate_cancer`, `thyroid`, `parkinsons`, `alzheimers`, `anemia`, `obesity` | Generated from medically-informed feature ranges and risk-factor weightings (see `app/ml/training/train_all.py::generate_synthetic_dataset`). These models are internally consistent and give sensible, explainable predictions — but they are **not trained on real patient records** and must not be presented as clinically validated. |

Every disease's `data_source` field (visible via `GET /api/v1/prediction/diseases`, in the
admin accuracy reports, and in every prediction's `warnings`) tells you which is which.
**Before using this for anything beyond a course/competition demo, replace the synthetic
modules with real datasets** — the training pipeline is fully modular, so swapping in a
real CSV just means updating that disease's `config.json` (`dataset_url`) and adding a
column-mapping if the real dataset's columns differ from the current feature schema.

## Quick start

```bash
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env               # defaults work out of the box (SQLite, dev-mode email)

# Train + save all 16 disease models (takes ~30s, downloads 3 public datasets from GitHub)
python -m app.ml.training.train_all

# Seed the Disease reference table + a default admin account
python -m app.database.seed

# Run
uvicorn app.main:app --reload --port 8000
```

Then open **http://localhost:8000/api/docs** for interactive Swagger docs.

Default admin login (change the password after first login):
```
email: admin@precisionhealth.ai
password: Admin@12345
```

## Running tests

```bash
pip install pytest httpx
pytest tests/ -v
```

## Architecture

The folder layout matches the specified architecture exactly — see the project tree.
Key design decisions worth knowing about:

- **Compulsory sign-in**: enforced centrally in `app/core/dependencies.py::get_current_user`
  (checked via HttpOnly JWT cookie), used as a `Depends()` on every protected router. A
  second defense-in-depth layer lives in `app/middleware/auth.py`.
- **Tracking cookie**: a non-HttpOnly `phc_tracking_id` cookie is set on a visitor's very
  first request (`get_or_set_tracking_id`), independent of login state, for basic funnel
  analytics — and is linked to the user record at signup.
- **2-free-then-paywall**: `app/modules/subscription/service.py` enforces
  `FREE_PREDICTIONS_LIMIT` / `FREE_SYMPTOM_CHECKS_LIMIT` (both default to 2, configurable
  in `.env`) and raises HTTP 402 once exhausted for non-premium users.
- **Document upload for prediction**: `app/modules/ocr` extracts text from PDF/image lab
  reports (pdfplumber for digital PDFs, pytesseract+pdf2image as OCR fallback for scanned
  documents/images) and regex-matches lab values against each disease's `ocr_aliases`, so
  a user can upload a report instead of filling the form by hand.
- **Doctor-style explanation + figure**: every prediction gets a deterministic, doctor-voice
  natural-language explanation (`app/modules/prediction/response_builder.py`) built from
  the model's per-prediction feature importances — no external LLM call, so it's fully
  reproducible offline. The downloadable PDF report additionally embeds a matplotlib
  bar-chart figure of "what influenced this result most" (`app/modules/reports/pdf_generator.py`).
- **One generic prediction engine, not 16 bespoke ones**: every disease is driven by a
  `config.json` (feature schema, risk factors, doctor content, OCR aliases) under
  `app/ml/diseases/<slug>/`. Adding disease #17 means adding one config file and training
  data — no new prediction code. This was explicitly recommended in the project proposal
  itself.
- **Explainability**: fast, always-on feature-importance is used on every request
  (`app/ml/explainable_ai/feature_importance.py`). Deeper SHAP/LIME breakdowns are
  available on-demand for the admin "AI Model Monitoring" screen if those optional
  packages are installed.

## Payments (Razorpay)

Uses **Razorpay test-mode keys** by default (`.env.example`). To test the real checkout
flow, sign up for a free Razorpay account, put your test Key ID/Secret in `.env`, and use
Razorpay's [test card numbers](https://razorpay.com/docs/payments/payments/test-card-upi-details/).
The webhook endpoint (`POST /api/v1/payment/webhook`) verifies the `X-Razorpay-Signature`
header — configure your webhook secret in `.env` too.

## Notes for whoever builds the frontend

- All responses follow `{ success, message, data }` (see `app/utils/response.py`), except
  auth endpoints which return `{ success, message, user }` and file downloads which stream
  the raw file.
- Errors follow `{ success: false, error_code, message, details }` with the matching HTTP
  status code (401/402/403/404/409/422/429/500 etc. — see `app/core/exceptions.py`).
- Auth is via HttpOnly cookies (`access_token` / `refresh_token`), so the frontend must
  send requests with `credentials: "include"` and doesn't need to manage tokens manually.
  A Bearer-token header is also accepted as a fallback.
- Full endpoint list + request/response schemas: `/api/docs` (Swagger) or `/api/redoc`.
