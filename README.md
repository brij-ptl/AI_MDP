# Nidaan+ — AI Precision Healthcare Platform

> **AI-powered multi-disease risk prediction, medical report OCR analysis, symptom checking, and precision healthcare recommendations — with a complete subscription business model.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.5-F7931E?style=flat-square&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-CC0000?style=flat-square)](https://www.sqlalchemy.org/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-02042B?style=flat-square&logo=razorpay&logoColor=white)](https://razorpay.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

[![CI/CD Pipeline](https://github.com/your-org/AI_MDP/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/AI_MDP/actions/workflows/ci.yml)
[![Docker Build](https://github.com/your-org/AI_MDP/actions/workflows/docker.yml/badge.svg)](https://github.com/your-org/AI_MDP/actions/workflows/docker.yml)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Project Metrics](#project-metrics)
- [Technology Stack](#technology-stack)
- [High-Level Architecture](#high-level-architecture)
- [Request Lifecycle](#request-lifecycle)
- [Folder Structure](#folder-structure)
- [Installation Guide](#installation-guide)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [AI Models & Disease Modules](#ai-models--disease-modules)
- [OCR Pipeline](#ocr-pipeline)
- [Payment Flow](#payment-flow)
- [Admin Panel](#admin-panel)
- [Screenshots](#screenshots)
- [Deployment Preparation](#deployment-preparation)
- [Troubleshooting](#troubleshooting)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

**Nidaan+** is a full-stack, production-grade AI healthcare platform that enables individuals to perform preliminary disease risk screenings from their own health data or medical lab reports without needing to visit a doctor for a first-pass assessment.

### Problem Statement

Preventable diseases kill millions annually. Early detection dramatically improves outcomes, but specialist consultations are expensive, time-consuming, and inaccessible for a large portion of the population. Most people ignore warning signs until symptoms become severe.

### Solution

Nidaan+ provides:

1. **Self-service disease risk prediction** across 16 major disease categories using clinically-grounded ML models
2. **Medical report upload** — users can photograph or upload a lab report; the platform OCR-extracts the values and auto-fills the prediction form
3. **AI symptom analysis** — free-text symptom description processed by a rule-based analyzer
4. **Clinician-style PDF reports** — every prediction generates a downloadable report with a doctor-voice explanation and feature importance chart
5. **Tiered subscription model** — 2 free predictions then Razorpay-gated access

### Target Audience

- Individual users performing self-health screening
- Healthcare institutions wanting a white-label decision-support tool
- Developers and researchers studying healthcare ML productization

---

## Key Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | JWT via HttpOnly cookies + Bearer token fallback. Bcrypt password hashing. Email verification flow. |
| 👥 **Role-Based Access** | `user` and `admin` roles. RBAC enforced at the API dependency level. |
| 🧠 **Disease Prediction** | 16 disease modules. Random Forest / Logistic Regression. Config-driven — no bespoke prediction code per disease. |
| 🤖 **AI Symptom Checker** | Free-text symptom input → rule-based analysis → possible conditions + recommendations. |
| 📄 **OCR Medical Report** | Upload PDF/PNG/JPG lab reports → Tesseract OCR → regex parameter extraction → auto-fill prediction form. |
| 📊 **Health Analytics** | Personal health trend tracking across prediction history. |
| 📋 **PDF Reports** | Downloadable clinical report per prediction with matplotlib feature importance chart. |
| 📁 **History** | Full prediction history with filtering, pagination, and detail views. |
| 💳 **Subscription System** | 4 plans (Starter / Care+ / Family / Annual). 2 free predictions before paywall. HTTP 402 enforcement. |
| 💰 **Razorpay Payments** | Order creation → Razorpay checkout → HMAC signature verification → subscription activation. Webhook supported. |
| 🛡️ **Admin Dashboard** | User management, disease module toggling, prediction token management, system logs, payment records, AI model accuracy reports, platform analytics. |
| 🌓 **Dark / Light Mode** | Full theme support, persisted in user session. |
| 📱 **Responsive UI** | Mobile-first design. Bottom navigation for mobile, sidebar for desktop. |
| ⚡ **Rate Limiting** | 60 requests/minute per IP. |
| 🔍 **Explainable AI** | Per-prediction feature importance. Optional SHAP/LIME deep analysis in admin panel. |

---

## Project Metrics

| Metric | Value |
|---|---|
| Disease modules | 16 |
| API endpoints | 40+ |
| Database entities | 11 |
| Frontend pages (user) | 12 |
| Frontend pages (admin) | 9 |
| ML algorithms | Random Forest, Logistic Regression |
| Supported file types (OCR) | PDF, PNG, JPG, JPEG |
| Subscription plans | 4 |
| Rate limit | 60 req/min |
| Free prediction quota | 2 per user |
| JWT access token lifetime | 30 minutes |
| Refresh token lifetime | 7 days |

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15.3 | React framework with App Router |
| React | 18.3 | UI library |
| TypeScript | 5.5 | Type safety |
| Tailwind CSS | 3.4 | Utility-first styling |
| Framer Motion | 11.3 | Animations |
| Recharts | 2.12 | Health analytics charts |
| Lucide React | 0.427 | Icon system |
| js-cookie | 3.0 | Cookie management |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| FastAPI | 0.115 | REST API framework |
| Python | 3.11 | Runtime |
| SQLAlchemy | 2.0 | ORM |
| Pydantic v2 | 2.10 | Schema validation |
| Uvicorn | 0.32 | ASGI server |
| python-jose | 3.3 | JWT handling |
| passlib / bcrypt | 1.7 / 4.2 | Password hashing |

### Machine Learning

| Technology | Version | Purpose |
|---|---|---|
| scikit-learn | 1.5 | ML models (RandomForest, LogisticRegression) |
| pandas | 2.2 | Data processing |
| numpy | 1.26 | Numerical operations |
| joblib | 1.4 | Model serialization |
| SHAP | 0.46 | Explainability (optional) |
| LIME | 0.2 | Explainability (optional) |

### OCR & Document Processing

| Technology | Version | Purpose |
|---|---|---|
| Tesseract-OCR | System | Image/scanned PDF text extraction |
| pytesseract | 0.3 | Python Tesseract wrapper |
| pdfplumber | 0.11 | Digital PDF text extraction |
| pdf2image | 1.17 | Scanned PDF to image conversion |
| Pillow | 11.0 | Image preprocessing |

### Payments & Infrastructure

| Technology | Purpose |
|---|---|
| Razorpay SDK | Payment order creation and verification |
| ReportLab | PDF report generation |
| matplotlib | Feature importance charts in reports |
| SQLite (default) | Development database |
| MySQL / PostgreSQL | Recommended production database |

---

## High-Level Architecture

```
+------------------------------------------------------------------+
|                        CLIENT LAYER                              |
|   Browser  -->  Next.js 15 (App Router, React 18, TypeScript)    |
|                 Port 7000 (dev) / 80 or 443 (prod via Nginx)     |
+----------------------------+-------------------------------------+
                             |  HTTPS  (credentials: "include")
                             v
+------------------------------------------------------------------+
|                       API GATEWAY LAYER                          |
|   (Production: Nginx reverse proxy - Phase 6)                    |
|   /api/*  ->  FastAPI backend (port 8000)                        |
|   /*       ->  Next.js frontend (port 7000)                      |
+----------------------------+-------------------------------------+
                             |
                             v
+------------------------------------------------------------------+
|                      MIDDLEWARE STACK                            |
|   1. CORS (outermost - handles OPTIONS preflight)                |
|   2. Rate Limiter (60 req/min per IP, in-memory)                 |
|   3. Request Logger (structured JSON logs)                       |
+----------------------------+-------------------------------------+
                             |
                             v
+------------------------------------------------------------------+
|                        FASTAPI MODULES                           |
|                                                                  |
|  [Auth]  [Prediction]  [OCR]  [Symptom Checker]  [Reports]      |
|  [Payment]  [Subscription]  [Users]  [Admin]  [Analytics]       |
+------------------+------------------+---------------------------+
                   |                  |                  |
                   v                  v                  v
        +------------------+  +-----------+  +------------------+
        |    Database      |  | ML Engine |  | External Services|
        | SQLAlchemy ORM   |  |  joblib   |  |   Razorpay       |
        | SQLite / MySQL   |  | 16 models |  |   SMTP Email     |
        |   11 tables      |  |           |  |                  |
        +------------------+  +-----------+  +------------------+
```

---

## Request Lifecycle

```
User Action (e.g. "Run Prediction")
        |
        v
Next.js Page (prediction/page.tsx)
        |
        v
Service Layer (predictionService.ts)
  |- POST /api/v1/prediction/{slug}
  `- credentials: "include" (sends JWT cookie)
        |
        v
FastAPI Middleware
  |- CORS check
  |- Rate limiter (60 req/min)
  `- Request logger
        |
        v
Route Handler -> get_current_user() [Depends]
  |- Reads access_token from HttpOnly cookie
  |- Decodes and validates JWT (HS256)
  `- Fetches User from DB
        |
        v
Controller -> Service -> Repository
  |- Check prediction token balance
  |- Validate input (Pydantic)
  |- Load disease config (config.json)
  |- Run ML pipeline (predict_proba)
  |- Compute feature importances
  |- Generate doctor-voice explanation
  |- Deduct prediction token
  |- Save Prediction to DB
  `- Return PredictionOut schema
        |
        v
HTTP 200 { success, message, data }
        |
        v
Frontend renders result
```

---

## Folder Structure

```
AI_MDP/
+-- README.md                    <- This file
+-- LICENSE
+-- CONTRIBUTING.md
+-- CHANGELOG.md
+-- .gitignore
|
+-- docs/
|   +-- API.md                   <- Complete API reference
|   +-- ARCHITECTURE.md          <- Architecture and design decisions
|   +-- DEPLOYMENT.md            <- Production deployment guide
|   +-- ML_PIPELINE.md           <- ML training and inference pipeline
|   +-- OCR_PIPELINE.md          <- OCR upload pipeline
|   +-- PROJECT_STRUCTURE.md     <- Detailed folder breakdown
|   +-- ROADMAP.md               <- Future improvement plans
|   `-- SECURITY.md              <- Security architecture
|
+-- frontend/
|   `-- src/
|       +-- app/
|       |   +-- (auth)/          <- Login, Register, Forgot Password
|       |   +-- (dashboard)/     <- All authenticated user pages
|       |   +-- (public)/        <- Landing page
|       |   `-- admin/           <- Admin panel (role-gated)
|       +-- components/          <- Reusable UI components
|       +-- context/             <- AuthContext (global auth state)
|       `-- services/            <- API service layer
|
`-- backend/
    +-- app/
    |   +-- main.py              <- App entrypoint
    |   +-- api/router.py        <- Master API router
    |   +-- core/                <- Config, security, logging, exceptions
    |   +-- middleware/          <- CORS, rate limiter, request logger
    |   +-- modules/             <- Business logic (one folder per domain)
    |   +-- database/            <- SQLAlchemy models, session, seed
    |   +-- schemas/             <- Pydantic request/response schemas
    |   +-- ml/                  <- ML engine
    |   |   +-- diseases/        <- 16 x config.json (one per disease)
    |   |   +-- training/        <- train_all.py CLI
    |   |   +-- inference/       <- Prediction pipeline
    |   |   +-- preprocessing/   <- Cleaning and encoding
    |   |   +-- evaluation/      <- Metrics and metadata
    |   |   +-- explainable_ai/  <- Feature importance, SHAP, LIME
    |   |   `-- registry/        <- Model loader and disease registry
    |   +-- services/            <- Email service
    |   +-- static/              <- Generated PDF reports
    |   +-- templates/           <- Email HTML templates
    |   `-- uploads/             <- Temporary OCR upload storage
    +-- trained_models/          <- Serialized .joblib model files
    +-- requirements.txt
    +-- .env.example
    `-- README.md
```

Full structure details: [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)

---

## Installation Guide

### Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Python | 3.11+ | 3.10 may work; 3.12 untested |
| Node.js | 18+ | 20 LTS recommended |
| npm | 9+ | Bundled with Node |
| Tesseract-OCR | 5.x | System binary; see OCR section |
| Git | Any | For cloning |

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/AI_MDP.git
cd AI_MDP
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv

# Windows:
.venv\Scripts\activate

# Linux/macOS:
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env as needed (defaults work out-of-the-box for development)
```

### 3. Install Tesseract-OCR

**Windows:**

Download from [UB Mannheim Tesseract builds](https://github.com/UB-Mannheim/tesseract/wiki). Default install path (`C:\Program Files\Tesseract-OCR\tesseract.exe`) is auto-detected.

**Ubuntu/Debian:**

```bash
sudo apt-get install tesseract-ocr tesseract-ocr-eng
```

**macOS:**

```bash
brew install tesseract
```

### 4. Train ML Models and Seed Database

```bash
cd backend

# Train all 16 disease models (~30 seconds)
# Downloads 3 real datasets from public GitHub mirrors
python -m app.ml.training.train_all

# Seed the disease reference table + default admin account
python -m app.database.seed
```

### 5. Run the Backend

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

API docs: **http://localhost:8000/api/docs**

### 6. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Application: **http://localhost:7000**

### Default Credentials

| Account | Email | Password |
|---|---|---|
| Admin | `admin@precisionhealth.ai` | `Admin@12345` |

> **Change the admin password immediately in any non-development deployment.**

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env`.

| Variable | Default | Required in Prod | Description |
|---|---|---|---|
| `APP_ENV` | `development` | Yes | `development` / `staging` / `production` |
| `DEBUG` | `True` | Yes | Set `False` in production |
| `DATABASE_URL` | SQLite | Yes | SQLAlchemy DB connection string |
| `JWT_SECRET_KEY` | weak default | **YES** | Change to 64+ char random string |
| `COOKIE_SECURE` | `False` | **YES** | Set `True` behind HTTPS |
| `CORS_ORIGINS` | localhost origins | Yes | List of allowed frontend origins |
| `RAZORPAY_KEY_ID` | test key | **YES** | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | test secret | **YES** | Razorpay Key Secret |
| `RAZORPAY_WEBHOOK_SECRET` | change me | **YES** | Webhook HMAC secret |
| `EMAIL_ENABLED` | `False` | No | If `False`, emails are logged only |
| `TESSERACT_CMD` | `tesseract` | No | Override if Tesseract is in custom path |
| `LLM_ENABLED` | `False` | No | Enable OpenAI LLM clinical narrative |

Full variable reference: [backend/.env.example](./backend/.env.example)

---

## API Overview

Base URL: `http://localhost:8000/api/v1`

Interactive docs: **`/api/docs`** (Swagger UI) | **`/api/redoc`** (ReDoc)

| Group | Prefix | Key Endpoints |
|---|---|---|
| Auth | `/auth` | `POST /register`, `POST /login`, `POST /logout`, `GET /me` |
| Users | `/users` | `PUT /me`, medical profile CRUD, change password |
| Dashboard | `/dashboard` | `GET /overview` |
| Disease Prediction | `/prediction` | `GET /diseases`, `POST /{slug}`, history |
| Symptom Checker | `/symptom-checker` | `POST /analyze` |
| OCR Upload | `/ocr` | `POST /upload` |
| Reports | `/reports` | Generate, list, download PDF |
| History | `/history` | `GET /` |
| Notifications | `/notifications` | List and mark as read |
| Subscriptions | `/subscription` | `GET /me` |
| Payments | `/payment` | Create order, verify, history, webhook |
| Admin | `/admin` | Users, diseases, tokens, logs, analytics |

Full endpoint reference: [docs/API.md](./docs/API.md)

---

## AI Models & Disease Modules

The ML engine uses a config-driven architecture — adding a new disease requires only a new `config.json` and training data, with no new prediction code.

| Disease | Data Source | Algorithm |
|---|---|---|
| Heart Disease | Real — UCI Cleveland Heart Disease | Random Forest |
| Diabetes | Real — Pima Indians Diabetes | Random Forest |
| Breast Cancer | Real — Wisconsin Diagnostic (sklearn) | Random Forest |
| Stroke | Synthetic (medically informed) | Random Forest |
| Hypertension | Synthetic | Random Forest |
| Kidney Disease | Synthetic | Random Forest |
| Liver Disease | Synthetic | Logistic Regression |
| Fatty Liver | Synthetic | Random Forest |
| Lung Cancer | Synthetic | Random Forest |
| Cervical Cancer | Synthetic | Random Forest |
| Prostate Cancer | Synthetic | Random Forest |
| Thyroid Disorders | Synthetic | Logistic Regression |
| Parkinson's Disease | Synthetic | Random Forest |
| Alzheimer's Disease | Synthetic | Random Forest |
| Anemia | Synthetic | Random Forest |
| Obesity | Synthetic | Logistic Regression |

> **Synthetic models are for demonstration purposes only.** Not trained on real patient records. Do not use for clinical decision-making.

Full ML pipeline: [docs/ML_PIPELINE.md](./docs/ML_PIPELINE.md)

---

## OCR Pipeline

```
Upload (PDF / PNG / JPG)
        |
        v
File validation (type + size check)
        |
        v
    Is PDF?  -- Yes --> pdfplumber (digital text extraction)
        |                    |
       No                    | (if empty = scanned PDF)
        |                    v
        v            pytesseract + pdf2image
pytesseract
(with preprocessing:
  grayscale, 2x upsample,
  median denoise, binarize)
        |
        v
   Raw text
        |
        v
Regex matching vs ocr_aliases
(from disease config.json)
        |
        v
Extracted parameters returned
to frontend for user review
        |
        v
User verifies + runs prediction
```

Full OCR pipeline: [docs/OCR_PIPELINE.md](./docs/OCR_PIPELINE.md)

---

## Payment Flow

```
1. User selects plan on /subscription
2. POST /api/v1/payment/create-order  -> Razorpay order ID returned
3. Razorpay checkout popup opens in browser
4. User completes payment
5. POST /api/v1/payment/verify
   -> HMAC-SHA256 signature verification
   -> Payment record saved
   -> Subscription activated
   -> Prediction tokens credited
6. POST /api/v1/payment/webhook (async, Razorpay -> server)
   -> X-Razorpay-Signature verified
   -> Idempotent subscription update
```

---

## Admin Panel

| Module | Description |
|---|---|
| **Dashboard** | Platform-wide stats |
| **Users** | List, suspend, reactivate accounts |
| **Prediction Tokens** | Add/remove/set/reset tokens per user |
| **Diseases** | Enable/disable disease modules |
| **AI Models** | Accuracy reports per disease |
| **Payments** | All payment transactions |
| **Feedback** | Review and moderate user feedback |
| **System Logs** | Admin action audit trail |
| **Analytics** | Platform-wide usage analytics |

---

## Screenshots

> Replace placeholder paths with actual screenshots.

| Page | File |
|---|---|
| Landing Page | `docs/screenshots/landing.png` |
| Login | `docs/screenshots/login.png` |
| User Dashboard | `docs/screenshots/dashboard.png` |
| Disease Prediction | `docs/screenshots/prediction.png` |
| OCR Upload | `docs/screenshots/ocr_upload.png` |
| AI Symptom Checker | `docs/screenshots/symptom_checker.png` |
| Health Analytics | `docs/screenshots/analytics.png` |
| Reports | `docs/screenshots/reports.png` |
| Subscription Plans | `docs/screenshots/subscription.png` |
| Admin Dashboard | `docs/screenshots/admin_dashboard.png` |

---

## Deployment Preparation

> Full Docker and Nginx configuration is covered in separate phases.

### Pre-Deployment Checklist

- [ ] Set `DEBUG=False` in `.env`
- [ ] Set `APP_ENV=production`
- [ ] Generate strong `JWT_SECRET_KEY` (64+ random characters)
- [ ] Set `COOKIE_SECURE=True` (requires HTTPS)
- [ ] Switch to MySQL or PostgreSQL
- [ ] Configure real Razorpay production keys
- [ ] Configure SMTP for email delivery
- [ ] Narrow `CORS_ORIGINS` to your frontend domain
- [ ] Change the default admin password
- [ ] Ensure Tesseract is installed on the server
- [ ] Verify `trained_models/` contains all 16 `.joblib` files

### Branch Protection & CI/CD
This repository is configured with automated GitHub Actions for Continuous Integration. Before deploying to production, ensure branch protection rules are enabled on the `main` branch:
1. **Require pull request reviews** before merging.
2. **Require status checks to pass** before merging (select `Backend CI`, `Frontend CI`, and `Test Docker Builds`).
3. **Do not allow bypassing the above settings.**

Full guide: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `tesseract is not installed` | Install Tesseract; set `TESSERACT_CMD` if in custom path |
| `CORS error` on frontend | Add `http://localhost:7000` to `CORS_ORIGINS` in `.env` |
| `Invalid email or password` | Ensure DB is seeded; check `DATABASE_URL` |
| `402 Prediction limit reached` | Subscribe or have admin add prediction tokens |
| ML models not found | Run `python -m app.ml.training.train_all` |
| Database not seeded | Run `python -m app.database.seed` |
| `npm run dev` fails | Run `npm install` in `frontend/` |

---

## Known Limitations

1. **Synthetic disease models** — 13 of 16 are on synthetic data; not clinically validated
2. **SQLite in production** — No concurrent writes; use MySQL/PostgreSQL for production
3. **In-memory rate limiter** — Does not share state across multiple workers
4. **Tesseract system dependency** — Cannot be pip-installed; requires system package
5. **Razorpay test mode** — Default config uses test keys only

---

## Roadmap

See [docs/ROADMAP.md](./docs/ROADMAP.md) for full details.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

This project does not currently include a LICENSE file. The **MIT License** is recommended. To add it, create a `LICENSE` file at the repository root.

---

<p align="center">Built as a production-grade AI Healthcare Platform.</p>
