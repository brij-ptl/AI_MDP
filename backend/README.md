# Nidaan+ — Backend

FastAPI backend for the Nidaan+ AI Precision Healthcare Platform.

> **Full project documentation:** [../README.md](../README.md)
> **API reference:** [../docs/API.md](../docs/API.md)
> **Architecture:** [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)

---

## Quick Start

```bash
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env               # defaults work out of the box (SQLite, dev-mode email)

# Train + save all 16 disease models (~30 seconds; downloads 3 public datasets)
python -m app.ml.training.train_all

# Seed the Disease reference table + a default admin account
python -m app.database.seed

# Run
uvicorn app.main:app --reload --port 8000
```

Interactive API docs: **http://localhost:8000/api/docs**

Default admin account:

```
email: admin@precisionhealth.ai
password: Admin@12345
```

> Change the admin password immediately in any non-development deployment.

---

## Data Source Disclosure

Of the 16 disease modules:

| Data Source | Diseases |
|---|---|
| **Real public dataset** | `heart` (UCI Cleveland), `diabetes` (Pima Indians), `breast_cancer` (Wisconsin, sklearn-bundled) |
| **Synthetic demo data** | `stroke`, `hypertension`, `kidney`, `liver`, `fatty_liver`, `lung_cancer`, `cervical_cancer`, `prostate_cancer`, `thyroid`, `parkinsons`, `alzheimers`, `anemia`, `obesity` |

Synthetic models are generated from medically-informed feature ranges and risk-factor weightings. They are internally consistent and give sensible, explainable predictions — but they are **not trained on real patient records** and must not be presented as clinically validated.

Every disease's `data_source` field is visible via `GET /api/v1/prediction/diseases`, in admin accuracy reports, and in every prediction's `warnings` field.

Before using this for anything beyond a course/competition demo, replace synthetic modules with real datasets. The training pipeline is fully modular — swapping in a real CSV requires only updating that disease's `config.json` (`dataset_url`) and rerunning `train_all.py`.

---

## Running Tests

```bash
pip install pytest httpx
pytest tests/ -v
```

---

## Architecture

See [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) for the full architecture reference.

Key design decisions:

- **Compulsory sign-in:** Enforced centrally via `get_current_user` `Depends()` on every protected route. HttpOnly JWT cookie — no token management required on the frontend.
- **Config-driven ML:** Every disease is a `config.json`. Adding disease #17 = new config + training data. No new prediction code.
- **2-free-then-paywall:** `subscription/service.py` enforces `FREE_PREDICTIONS_LIMIT` / `FREE_SYMPTOM_CHECKS_LIMIT` (both default to 2) and raises HTTP 402 once exhausted.
- **OCR pipeline:** `pdfplumber` for digital PDFs, `pytesseract + pdf2image` for scanned documents. See [../docs/OCR_PIPELINE.md](../docs/OCR_PIPELINE.md).
- **Deterministic explanations:** Every prediction includes a doctor-voice explanation built from per-prediction feature importances. No external LLM call required. Fully reproducible offline.
- **Explainable AI:** Fast feature-importance on every request. Optional SHAP/LIME available for admin "AI Model Monitoring".

---

## Payments (Razorpay)

Uses **Razorpay test-mode keys** by default. To test the checkout flow:

1. Sign up for a free [Razorpay account](https://dashboard.razorpay.com)
2. Put your test Key ID/Secret in `.env`
3. Use Razorpay's [test card numbers](https://razorpay.com/docs/payments/payments/test-card-upi-details/)

The webhook endpoint (`POST /api/v1/payment/webhook`) verifies the `X-Razorpay-Signature` header. Configure `RAZORPAY_WEBHOOK_SECRET` in `.env`.

---

## Frontend Integration Notes

- All responses follow `{ success, message, data }` (see `app/utils/response.py`)
- Auth endpoints return `{ success, message, user }` (TokenResponse)
- File downloads stream the raw file directly
- Errors: `{ success: false, error_code, message, details }` with matching HTTP status (401/402/403/404/409/422/429/500)
- Auth is via HttpOnly cookies — send requests with `credentials: "include"`; no manual token management
- Bearer token header (`Authorization: Bearer <token>`) is accepted as a fallback
- Full endpoint list + schemas: `/api/docs` (Swagger) or `/api/redoc`
