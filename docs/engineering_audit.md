# 🏥 NIDAAAN — Complete Engineering Audit Report

**Platform**: AI-Powered Multi-Disease Prediction & Precision Healthcare (NIDAAAN)
**Audit Date**: 2026-07-28
**Auditor**: Senior Engineering Review (Full-Stack + ML + DevOps)
**Backend**: FastAPI + SQLite → SQLAlchemy
**Frontend**: Next.js 15 + React 18 + TailwindCSS
**ML**: scikit-learn (16 disease modules)

---

> [!CAUTION]
> The previous developer's claim that "most work is completed" is **MISLEADING**.
> Several critical modules are either non-functional, hardcoded placeholders, or entirely missing.

---

## MODULE 1 — Project Architecture

**Status**: 🟡 Partial (75%)

### Evidence
- `backend/app/` follows clean layered architecture: `modules/` → `router → controller → service → repository → models`
- 15 backend modules registered in `api/router.py`
- `frontend/src/` organized as: `app/` (pages) → `components/` → `services/` → `context/`
- Route groups: `(auth)`, `(dashboard)`, `(public)`, `admin`
- No Alembic or any migration tool initialized (migrations folder has only `.gitkeep` + `__init__.py`)
- No Docker, no Docker Compose, no `Procfile`, no `Makefile`
- No CI/CD pipeline configured anywhere in the repo
- `README.md` is only 59 bytes — essentially empty at the root

### Can it run? YES
### Can it be tested? PARTIALLY

### Known Problems
- No database migration system — manual `init_db()` creates all tables on startup (risky for production)
- No monorepo orchestration (no root `docker-compose.yml`, no root task runner)
- `package-lock.json` at root is 91 bytes (empty/corrupt stub — not the frontend's lock file)
- Frontend `next.config.ts` has no API proxy configuration (frontend manually points to `localhost:8000`)

### Missing Work
- Alembic migration setup
- Docker + Docker Compose
- CI/CD pipeline
- Proper README documentation

---

## MODULE 2 — Frontend

**Overall Frontend Status**: 🟡 Partial (58%)

### 2.1 Landing Page

**Status**: ✅ Complete (95%)

- `frontend/src/app/page.tsx` — 29,345 bytes (large, comprehensive)
- `(public)/page.tsx` redirects to root
- Animated, feature-rich landing page
- Plans listed statically
- No major issues found

### 2.2 Authentication Pages

**Status**: 🟡 Partial (65%)

| Page | File | Status |
|---|---|---|
| Login | `(auth)/login/page.tsx` | ✅ Functional — delegates to `AuthCard.tsx` |
| Register | `(auth)/register/page.tsx` | ✅ Functional — delegates to `AuthCard.tsx` |
| Forgot Password | `(auth)/forgot-password/page.tsx` | ❌ **Static placeholder** — form has `onSubmit={e => e.preventDefault()}`, no API call |
| Reset Password | `(auth)/reset-password/page.tsx` | ❌ **Static placeholder** — form has `onSubmit={e => e.preventDefault()}`, no API call |
| Verify Email | `(auth)/verify-email/page.tsx` | ❌ **Static informational page only** — does not read token from URL, does not call backend |

**Critical Problem**: Forgot Password and Reset Password pages render UI but make **no backend calls**. The backend has working endpoints for both. The frontend is disconnected.

### 2.3 Dashboard

**Status**: 🟡 Partial (70%)

- `(dashboard)/dashboard/page.tsx` — ✅ Calls `dashboardService.overview()`, displays real stats, recent predictions
- Layout: `(dashboard)/layout.tsx` — thin wrapper, no route protection at Next.js level (relies on backend 401)
- Dashboard itself is functional once logged in

### 2.4 Prediction Pages

**Status**: 🟡 Partial (65%)

- `(dashboard)/prediction/page.tsx` — ✅ Lists 16 diseases from hardcoded `DISEASES` constant (not from API)
- `(dashboard)/prediction/[disease]/page.tsx` — exists, contains `DiseaseForm.tsx` component
- `DiseaseForm.tsx` — needs verification of end-to-end API connectivity

### 2.5 Symptom Checker

**Status**: ❌ Placeholder (15%)

- `(dashboard)/symptom-checker/page.tsx` — **HARDCODED FAKE RESULTS**
  - `analyze()` function sets: `setResult(["Possible Migraine (62%)", "Tension Headache (48%)", "Dehydration (31%)"]) `
  - Does NOT call the symptom checker API at all
  - Backend has a real symptom checker module with working endpoints

### 2.6 OCR / Upload Report

**Status**: 🟡 Partial (55%)

- `(dashboard)/upload-report/page.tsx` — exists (3.4KB), has file upload UI
- `ocr.service.ts` exists with upload call
- Depends on Tesseract being installed on the server (Windows dev — not likely installed)

### 2.7 History

**Status**: ✅ Mostly Complete (80%)

- `(dashboard)/history/page.tsx` — calls `historyService.getHistory()`, paginated table with filters (disease, risk level, date range)
- Well implemented

### 2.8 Reports

**Status**: 🟡 Partial (70%)

- `(dashboard)/reports/page.tsx` — calls `reportService.getReports()`, shows table, download button
- Download link calls `reportService.download(id)` which constructs a direct URL — functional

### 2.9 Profile

**Status**: ❌ Broken / Placeholder (30%)

- `(dashboard)/profile/page.tsx` — **HARDCODED STATIC DATA** throughout:
  - `fullName: "Aditya Varma"`, `email: "aditya.varma@nidaanplus.in"`, etc.
  - `handleSave` calls `alert("Clinical Profile Successfully Synchronized.")` — does NOT call any API
  - Profile data never loads from backend, never saves to backend
  - Form is a UI mockup only

### 2.10 Subscription

**Status**: ✅ Mostly Complete (75%)

- `(dashboard)/subscription/page.tsx` — fetches subscription status via API, displays 4 plans from `PLANS` constant
- Links to `/payment?plan=...`

### 2.11 Analytics (User-side)

**Status**: 🟡 Partial (65%)

- `(dashboard)/analytics/page.tsx` — calls `dashboardService.riskTrend()`, renders Recharts line chart
- Works if data exists

### 2.12 Settings

**Status**: 🟡 Partial (40%)

- `(dashboard)/settings/page.tsx` — UI is detailed (3 tabs: Account, Security, Clinical)
- **2FA toggle** — UI only, no backend integration
- **Biometric toggle** — UI only, no backend
- **Language/Timezone selects** — UI only, no persistence
- **FHIR Export** — button exists, no backend endpoint
- **Delete Account** — button exists, no backend call
- Real functionality: logout (works), subscription status display (works)

### 2.13 Notifications

**Status**: 🟡 Partial (50%)

- `(dashboard)/notifications/page.tsx` — exists
- `notification.service.ts` — exists (184 bytes, very thin)

### 2.14 Admin UI

**Status**: 🟡 Partial (35%)

| Admin Page | Status |
|---|---|
| `admin/dashboard/page.tsx` | ✅ Calls `adminService.platformAnalytics()`, displays KPIs |
| `admin/users/page.tsx` | ❌ **LITERAL PLACEHOLDER** — `"No data yet — connect the users admin service..."` |
| `admin/analytics/page.tsx` | Exists, needs verification |
| `admin/diseases/page.tsx` | Exists |
| `admin/models/page.tsx` | Exists |
| `admin/payments/page.tsx` | Exists |
| `admin/subscriptions/page.tsx` | Exists |
| `admin/logs/page.tsx` | Exists |
| `admin/feedback/page.tsx` | Exists |
| `admin/datasets/page.tsx` | Exists |
| `admin/prediction-tokens/page.tsx` | Exists |

**Critical**: Admin layout (`admin/layout.tsx`) is 2938 bytes — likely has sidebar. Admin dashboard API call exists but most sub-pages unverified.

---

## MODULE 3 — Backend

**Status**: ✅ Mostly Complete (82%)

### Evidence
- Clean module structure: `router → controller → service → repository`
- 15 modules all registered in `api/router.py`
- `app.add_middleware()` stack (CORS bug fixed in prior session)
- Exception hierarchy with proper HTTP codes
- Request logging, rate limiting, auth guard middleware all present
- Pydantic v2 schemas across all modules

### Known Problems
- `email_service.py` — email links hardcoded to `localhost:3000` (not port 7000, not configurable)
  - `send_verification_email` → `http://localhost:3000/verify-email?token=...`
  - `send_password_reset_email` → `http://localhost:3000/reset-password?token=...`
- No async DB sessions — synchronous SQLAlchemy with `Depends(get_db)` (acceptable for SQLite)
- `LLM_ENABLED=False` by default — clinical reports use offline structured fallback, **not real LLM output**
- `OPENAI_MODEL=gpt-5-mini` — this model name does not exist (should be `gpt-4o-mini` or similar)
- No input sanitization beyond Pydantic validation

### Missing Work
- Rate limiting doesn't differentiate between auth and non-auth endpoints
- No refresh token rotation
- No token blacklisting/revocation on logout

---

## MODULE 4 — Authentication

**Status**: 🟡 Partial (70%)

### Backend Auth: ✅ Strong (85%)

| Endpoint | Status |
|---|---|
| `POST /api/v1/auth/register` | ✅ Works — creates user, sends verification email (logged in dev mode) |
| `POST /api/v1/auth/login` | ✅ Works — validates credentials, sets HttpOnly cookies |
| `POST /api/v1/auth/logout` | ✅ Works — clears cookies |
| `POST /api/v1/auth/refresh` | ✅ Works — refresh token to new access token |
| `POST /api/v1/auth/verify-email` | ✅ Backend works — frontend page does nothing |
| `POST /api/v1/auth/forgot-password` | ✅ Backend works — frontend page does nothing |
| `POST /api/v1/auth/reset-password` | ✅ Backend works — frontend page does nothing |
| `GET /api/v1/auth/me` | ✅ Works |
| Google Login | ❌ Not implemented (backend OR frontend) |
| GitHub Login | ❌ Not implemented (backend OR frontend) |

### Frontend Auth: 🟡 Partial (55%)

- `AuthContext.tsx` — proper `refreshUser` / `logout` with `useCallback`
- `AuthCard.tsx` — handles login + register (14,648 bytes, likely complete)
- Forgot password / Reset password pages: **static placeholders only**
- Verify email page: **static placeholder only**
- No route guards at Next.js middleware level (no `middleware.ts` file)

### Known Problems
- CORS was broken (fixed in prior session — OPTIONS returned 400)
- JWT secret in `.env` is still development default
- `COOKIE_SECURE=False` — correct for dev, must change for production
- Email verification link hardcoded to `localhost:3000` instead of `localhost:7000`
- No social login (OAuth2 with Google/GitHub — described in project proposal but absent)

---

## MODULE 5 — Database

**Status**: ✅ Mostly Complete (80%)

### Models Present

| Model | File | Relationships | Status |
|---|---|---|---|
| `User` | `user.py` | 7 relationships | ✅ Complete |
| `MedicalProfile` | `medical_profile.py` | User FK | ✅ Complete |
| `Prediction` | `prediction.py` | User, Report, OcrDocument | ✅ Complete |
| `OcrDocument` | `prediction.py` | User FK | ✅ Complete |
| `Disease` | `disease.py` | Standalone | ✅ Complete |
| `Report` | `report.py` | Prediction FK, User FK | ✅ Complete |
| `Payment` | `payment.py` | User FK | ✅ Complete |
| `Subscription` | `subscription.py` | User FK | ✅ Complete |
| `Notification` | `notification.py` | User FK | ✅ Complete |
| `Feedback` | `feedback.py` | User FK | ✅ Complete |
| `AdminLog` | `admin.py` | Admin user FK | ✅ Complete |

**All 11 models registered** in `models/__init__.py`

### Known Problems
- **NO migration system** — `database/migrations/` folder exists but only has `.gitkeep`. Schema changes require manual table drops or new `.db` file.
- Database is SQLite by default — acceptable for dev, must be replaced before production (MySQL/Postgres)
- No database indexes beyond `email` (unique) and `user_id` FKs — missing compound indexes for query optimization
- `seed.py` seeds diseases from config.json — **will fail if `trained_models/` doesn't exist** because `get_model_metadata()` tries to read from it (gracefully returns `None`, but model_accuracy will be `null`)

### Missing Work
- Alembic migration initialization
- Production database connection (MySQL/PostgreSQL)
- DB backup/restore strategy

---

## MODULE 6 — Machine Learning

**Status**: ❌ CRITICAL BLOCKER (25%)

> [!CAUTION]
> The `trained_models/` directory **does NOT exist**.
> ALL 16 disease prediction models are missing.
> The prediction API will return 500 errors for every disease.

### ML Architecture: ✅ Complete (90%)
- `ml/diseases/` — 16 disease config directories each with `config.json` ✅
- `ml/registry/model_registry.py` — registry with `list_disease_slugs()` ✅
- `ml/registry/model_loader.py` — `load_model_bundle()` using `joblib.load()` ✅
- `ml/training/train_all.py` — comprehensive training script (215 lines) ✅
- `ml/inference/predictor.py` — inference pipeline ✅
- `ml/preprocessing/` — cleaning + encoding ✅
- `ml/evaluation/` — metrics ✅
- `ml/explainable_ai/` — SHAP/LIME support (optional) ✅

### Disease Models: ❌ ALL MISSING
No `.joblib` files exist. Training has never been run. Evidence:
```
trained_models directory does NOT exist
```

| Disease | Config | Trained Model | Status |
|---|---|---|---|
| Heart | ✅ | ❌ | Not trained |
| Diabetes | ✅ | ❌ | Not trained |
| Kidney | ✅ | ❌ | Not trained |
| Liver | ✅ | ❌ | Not trained |
| Breast Cancer | ✅ | ❌ | Not trained |
| Cervical Cancer | ✅ | ❌ | Not trained |
| Lung Cancer | ✅ | ❌ | Not trained |
| Prostate Cancer | ✅ | ❌ | Not trained |
| Stroke | ✅ | ❌ | Not trained |
| Alzheimer's | ✅ | ❌ | Not trained |
| Parkinson's | ✅ | ❌ | Not trained |
| Thyroid | ✅ | ❌ | Not trained |
| Hypertension | ✅ | ❌ | Not trained |
| Obesity | ✅ | ❌ | Not trained |
| Anemia | ✅ | ❌ | Not trained |
| Fatty Liver | ✅ | ❌ | Not trained |

### Data Sources
- Some diseases use **public datasets** (UCI Heart, Pima Diabetes, Wisconsin Breast Cancer) downloaded at train time
- Others use **synthetic data** (generated from `config.json` feature ranges + weights)
- 11 of 16 are synthetic — **NOT clinically validated models**

### LLM Clinical Reports
- `LLM_ENABLED=False` in `.env`
- `OPENAI_MODEL=gpt-5-mini` — **this model does not exist** (likely meant `gpt-4o-mini`)
- When disabled, uses `_offline_structured_report()` — a templated fallback, not real AI

### Can predictions run? NO (models missing)
### Missing Work
- Run `python -m app.ml.training.train_all` once
- Verify datasets download correctly
- Correct the `OPENAI_MODEL` config value

---

## MODULE 7 — OCR

**Status**: 🟡 Partial (55%)

### Evidence
- `modules/ocr/service.py` — complete OCR logic with pdfplumber + pytesseract fallback ✅
- `modules/ocr/router.py` — `POST /api/v1/ocr/upload` endpoint ✅
- `modules/ocr/controller.py` — wires file upload to service ✅
- `ocr.service.ts` (frontend) — exists, makes API call ✅
- `(dashboard)/upload-report/page.tsx` — upload UI exists

### Known Problems
- **Tesseract is a system binary** — must be installed separately. Very likely NOT installed on Windows dev machine.
- `pdf2image` requires **Poppler** system binary — also likely not installed on Windows
- OCR only extracts numeric fields; categorical fields (e.g. sex, smoking status) cannot be parsed
- No OCR result stored in `OcrDocument` table during the upload flow (controller calls service but may not persist)
- Frontend upload page not verified end-to-end

### Can it run? CONDITIONAL (Tesseract + Poppler must be installed)

---

## MODULE 8 — Dashboard

**Status**: ✅ Mostly Complete (78%)

### Backend Dashboard
- `modules/dashboard/service.py` — aggregates stats for `overview` and `risk_trend` ✅
- `modules/dashboard/router.py` — `GET /dashboard/overview`, `GET /dashboard/risk-trend` ✅
- History module (`modules/history/`) — paginated with filters ✅
- Notifications module — CRUD exists ✅

### Frontend Dashboard
- Main dashboard page: ✅ Fetches and displays real data
- Analytics (risk trend chart): ✅ Recharts line chart connected to API
- History: ✅ Paginated table with filters

### Known Problems
- Dashboard `health_score` calculation not verified (may be a naive average)
- No real-time updates (no websockets)

---

## MODULE 9 — Reports

**Status**: 🟡 Partial (65%)

### Backend Reports
- `modules/reports/pdf_generator.py` — full PDF generation with ReportLab + Matplotlib chart ✅
- `modules/reports/service.py` — generates PDF, saves to `app/static/generated_reports/` ✅
- `modules/reports/router.py` — list, get, download, delete endpoints ✅

### Frontend Reports
- Reports page: ✅ Lists reports, shows download button
- Download constructs static file URL correctly

### Known Problems
- PDF generation depends on ML models being trained (needs `prediction.feature_importance`, `doctor_explanation`)
- `doctor_explanation` will be the offline template fallback (not LLM) unless `LLM_ENABLED=True`
- No email notification on report ready (backend service exists but email is disabled by default)
- No page-level detail view for individual report (only download link)

---

## MODULE 10 — Subscription & Payments

**Status**: 🟡 Partial (65%)

### Backend
- `modules/subscription/service.py` — quota enforcement, premium activation, free trial logic ✅
- `modules/payment/service.py` — Razorpay order creation + signature verification ✅
- `modules/payment/webhook.py` — webhook handler (durability backstop) ✅
- Plans: `starter`, `care_plus`, `family`, `annual` with correct INR amounts ✅

### Frontend
- Subscription page: ✅ Shows plans, links to payment
- Payment page: ✅ Full Razorpay checkout flow implemented (loads SDK, opens modal, verifies payment)

### Known Problems
- **Razorpay keys are test placeholders** — `rzp_test_xxxxxxxxxxxx` (not real test keys)
- Razorpay webhook secret is `"CHANGE_ME"` — webhook signature verification will fail in production
- `.env` `CORS_ORIGINS` still lists `localhost:3000` NOT `localhost:7000` — frontend on port 7000 was added in `config.py` but `.env` file still has the old port
- Webhook endpoint security: no HMAC verification visible in `webhook.py`
- No subscription cancellation flow from frontend

---

## MODULE 11 — Admin

**Status**: 🟡 Partial (45%)

### Backend Admin API
- `modules/admin/router.py` — 120 lines, 12+ endpoints ✅
  - Users list, suspend, reactivate ✅
  - Diseases list, enable, disable ✅
  - Model accuracy reports ✅
  - Payments list ✅
  - Feedback moderation ✅
  - System logs ✅
  - Prediction token management ✅

### Frontend Admin UI
| Page | Status |
|---|---|
| `admin/dashboard/page.tsx` | 🟡 Calls analytics API, shows KPIs |
| `admin/users/page.tsx` | ❌ **PLACEHOLDER** — literal "connect the service" text |
| `admin/analytics/page.tsx` | Unverified |
| `admin/diseases/page.tsx` | Unverified |
| `admin/models/page.tsx` | Unverified |
| `admin/payments/page.tsx` | Unverified |
| `admin/subscriptions/page.tsx` | Unverified |
| `admin/logs/page.tsx` | Unverified |
| `admin/feedback/page.tsx` | Unverified |
| `admin/prediction-tokens/page.tsx` | Unverified |

### Known Problems
- Admin layout auth guard: unverified whether it checks `user.role === "admin"` client-side
- Most admin sub-pages are unverified — backend APIs exist but frontend connectivity unknown
- Users page is explicitly a placeholder

---

## MODULE 12 — Cloud / DevOps

**Status**: ❌ Missing (10%)

### Environment Variables
- `backend/.env` exists ✅
- `backend/.env.example` exists ✅
- `.env` `CORS_ORIGINS` is wrong (still `localhost:3000`, not `localhost:7000`)
- `JWT_SECRET_KEY` is a weak development default
- `RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx` (placeholder)

### Docker
- ❌ **No Dockerfile** anywhere in the project
- ❌ **No docker-compose.yml** anywhere in the project
- ❌ No container strategy at all

### CI/CD
- ❌ No GitHub Actions workflows
- ❌ No test automation pipeline
- ❌ No deployment scripts

### Logging
- `app/logs/` directory exists
- `RequestLoggerMiddleware` + `LoggingMiddleware` write to logger ✅
- No log rotation configured
- No structured JSON logging (plain text)

### Security
- `COOKIE_SECURE=False` (must be `True` in production)
- `DEBUG=True` (exposes stack traces)
- No HTTPS enforcement
- No rate limit differentiation between authenticated vs anonymous
- No secrets management (no Vault, no AWS Secrets Manager)

### Production Readiness
- ❌ SQLite in production is unacceptable (no concurrent writes)
- ❌ No static file CDN
- ❌ No health check endpoint for load balancer (`/health` exists ✅ but no monitoring integration)
- ❌ No database backups

---

# 📊 MASTER COMPLETION REPORT

| Module | Completion % | Status |
|---|---|---|
| **Architecture** | 75% | 🟡 Partial |
| **Frontend** | 58% | 🟡 Partial |
| **Backend** | 82% | 🟡 Mostly Complete |
| **Authentication** | 70% | 🟡 Partial |
| **Database** | 80% | 🟡 Mostly Complete |
| **Machine Learning** | 25% | ❌ Critical (models missing) |
| **OCR** | 55% | 🟡 Partial |
| **Dashboard** | 78% | 🟡 Mostly Complete |
| **Reports** | 65% | 🟡 Partial |
| **Subscription / Payments** | 65% | 🟡 Partial |
| **Admin** | 45% | 🟡 Partial |
| **Cloud / DevOps** | 10% | ❌ Missing |
| **Testing** | 20% | ❌ Minimal |

## 🎯 OVERALL PROJECT COMPLETION: **56%**

### Overall Health Score: 5.2 / 10

**Reason for 5.2**: The backend architecture is solid and most APIs exist. However, the ML models (the entire core value proposition) have never been trained. Several frontend pages are hardcoded placeholders. No production infrastructure exists. The project is a well-structured skeleton that works locally for basic auth/navigation but cannot deliver its primary functionality (disease prediction) in its current state.

---

# 📋 FINAL TODO LIST

---

## 🔴 HIGH PRIORITY

### H1 — Train all 16 ML models
**Why required**: Without trained models, every `POST /api/v1/prediction/{slug}` returns 500. The entire platform's core value proposition is broken.
**Files**: Run `python -m app.ml.training.train_all` from `backend/`; creates `backend/trained_models/`
**Difficulty**: Easy (automated script exists)
**Time**: 10–30 minutes (network + CPU bound per dataset)

---

### H2 — Fix CORS_ORIGINS in .env
**Why required**: `.env` still lists `localhost:3000`. Frontend runs on `localhost:7000`. Any deployment will have wrong CORS config.
**Files**: `backend/.env` — change `CORS_ORIGINS` to include `localhost:7000`
**Difficulty**: Trivial
**Time**: 5 minutes

---

### H3 — Fix email verification link URL
**Why required**: `email_service.py` sends verification links to `localhost:3000/verify-email` — but frontend runs on port 7000, and the verify-email page is a static placeholder anyway.
**Files**: `backend/app/services/email_service.py` — parameterize `FRONTEND_URL` from config
**Difficulty**: Easy
**Time**: 30 minutes

---

### H4 — Implement Forgot Password frontend
**Why required**: Users who forget passwords are completely stuck. Backend endpoint exists and works. Frontend form does nothing.
**Files**: `frontend/src/app/(auth)/forgot-password/page.tsx`
**Difficulty**: Easy
**Time**: 1–2 hours

---

### H5 — Implement Reset Password frontend
**Why required**: Password reset link from email leads to a page that does nothing.
**Files**: `frontend/src/app/(auth)/reset-password/page.tsx` — must read `?token=` from URL, call API
**Difficulty**: Easy
**Time**: 1–2 hours

---

### H6 — Implement Email Verification frontend
**Why required**: Clicking the email verification link shows a static page. Backend token is never consumed.
**Files**: `frontend/src/app/(auth)/verify-email/page.tsx` — must read `?token=` from URL, call `POST /api/v1/auth/verify-email`
**Difficulty**: Easy
**Time**: 1 hour

---

### H7 — Connect Profile page to backend
**Why required**: Profile page displays hardcoded data ("Aditya Varma") and `handleSave` calls `alert()`. User profile data never persists.
**Files**: `frontend/src/app/(dashboard)/profile/page.tsx` — wire to `users` service (GET profile on mount, PUT on save)
**Difficulty**: Medium
**Time**: 3–4 hours

---

### H8 — Fix Symptom Checker (remove hardcoded fake results)
**Why required**: The symptom checker always shows the same three hardcoded results regardless of input. Backend has a real endpoint.
**Files**: `frontend/src/app/(dashboard)/symptom-checker/page.tsx` — replace hardcoded `setResult([...])` with `symptom.service.ts` API call
**Difficulty**: Easy-Medium
**Time**: 2–3 hours

---

### H9 — Fix OPENAI_MODEL config value
**Why required**: `gpt-5-mini` is not a valid OpenAI model. When LLM is enabled in production, the API call will fail on every prediction.
**Files**: `backend/.env` + `backend/app/core/config.py` — change to `gpt-4o-mini` or the correct model name
**Difficulty**: Trivial
**Time**: 5 minutes

---

### H10 — Initialize Alembic database migrations
**Why required**: No migration system means schema changes require dropping/recreating the database in production. Catastrophic for any live deployment.
**Files**: Create `backend/alembic.ini`, `backend/alembic/env.py`, and initial migration
**Difficulty**: Medium
**Time**: 2–3 hours

---

## 🟡 MEDIUM PRIORITY

### M1 — Complete Admin User Management page
**Why required**: `admin/users/page.tsx` is a literal placeholder with "connect the service" text.
**Files**: `frontend/src/app/admin/users/page.tsx` — wire to `admin.service.ts` user list + suspend/reactivate endpoints
**Difficulty**: Medium
**Time**: 3–4 hours

---

### M2 — Audit and fix remaining Admin sub-pages
**Why required**: ~9 admin pages are unverified and likely unconnected to their backend APIs.
**Files**: All `frontend/src/app/admin/*/page.tsx`
**Difficulty**: Medium
**Time**: 8–12 hours

---

### M3 — Install and configure Tesseract + Poppler for OCR
**Why required**: OCR upload endpoint depends on system binaries that are not installed.
**Files**: Server setup + `backend/app/core/config.py` (`TESSERACT_CMD`)
**Difficulty**: Medium (system-level)
**Time**: 1–2 hours for setup

---

### M4 — Add Next.js middleware for route protection
**Why required**: There is no `middleware.ts` in the frontend. Protected routes have no client-side guard — unauthenticated users see a flash of content before the 401 redirects them.
**Files**: Create `frontend/src/middleware.ts`
**Difficulty**: Easy-Medium
**Time**: 1–2 hours

---

### M5 — Parameterize frontend URL in email service
**Why required**: Email links are hardcoded to `localhost:3000`. Must be config-driven for any deployment.
**Files**: `backend/app/core/config.py` (add `FRONTEND_URL`), `backend/app/services/email_service.py`
**Difficulty**: Easy
**Time**: 30 minutes

---

### M6 — Implement refresh token rotation on logout
**Why required**: Refresh tokens are never invalidated on logout. A stolen token can be used after logout.
**Files**: `backend/app/modules/auth/service.py`, `backend/app/database/models/user.py` (add refresh token hash column)
**Difficulty**: Medium
**Time**: 3–4 hours

---

### M7 — Fix Settings page — connect to backend
**Why required**: Most settings (2FA, language, data export, account deletion) are UI-only and do nothing.
**Files**: `frontend/src/app/(dashboard)/settings/page.tsx` — connect to users service endpoints
**Difficulty**: Medium-Hard
**Time**: 4–8 hours

---

### M8 — Add Razorpay webhook HMAC verification
**Why required**: `payment/webhook.py` accepts webhooks but doesn't verify the Razorpay signature. This is a security vulnerability.
**Files**: `backend/app/modules/payment/webhook.py`
**Difficulty**: Easy-Medium
**Time**: 1–2 hours

---

### M9 — Add proper Razorpay test credentials
**Why required**: Payment flow cannot be tested with placeholder `rzp_test_xxxxxxxxxxxx` keys.
**Files**: `backend/.env` — replace with real Razorpay test credentials
**Difficulty**: Trivial (requires Razorpay account)
**Time**: 30 minutes

---

### M10 — Add subscription cancellation flow
**Why required**: Users can upgrade but cannot cancel their subscription from the frontend.
**Files**: Backend: add cancel endpoint to `modules/subscription/service.py`; Frontend: add cancel button to subscription page
**Difficulty**: Medium
**Time**: 2–3 hours

---

## 🟢 LOW PRIORITY

### L1 — Create Dockerfile and docker-compose.yml
**Why required**: No containerization strategy exists. Deployment is entirely manual.
**Files**: Create `backend/Dockerfile`, `frontend/Dockerfile`, `docker-compose.yml` at root
**Difficulty**: Medium
**Time**: 3–5 hours

---

### L2 — Set up CI/CD pipeline
**Why required**: No automated testing or deployment pipeline exists.
**Files**: Create `.github/workflows/test.yml` and `deploy.yml`
**Difficulty**: Medium
**Time**: 4–6 hours

---

### L3 — Write comprehensive test suite
**Why required**: Only 4 test files exist (auth, ml_registry, and stubs). Critical paths like prediction, payment, OCR have no tests.
**Files**: `backend/tests/` — add prediction, payment, OCR, subscription tests
**Difficulty**: Medium-Hard
**Time**: 8–16 hours

---

### L4 — Replace SQLite with PostgreSQL/MySQL for production
**Why required**: SQLite has no concurrent write support. Production multi-worker deployment will corrupt data.
**Files**: `backend/.env` (`DATABASE_URL`), add `psycopg2` or `pymysql` to `requirements.txt`
**Difficulty**: Easy (once Alembic is set up)
**Time**: 1–2 hours

---

### L5 — Implement Google/GitHub OAuth2 login
**Why required**: Social login is described in the project proposal but entirely absent from both backend and frontend.
**Files**: Backend: new auth endpoints; Frontend: `AuthCard.tsx` + OAuth2 redirect handling
**Difficulty**: Hard
**Time**: 8–12 hours

---

### L6 — Write proper README and API documentation
**Why required**: Root `README.md` is 59 bytes. Developer onboarding is impossible.
**Files**: `README.md` (root), `backend/README.md` (exists, 6KB — update), `frontend/README.md`
**Difficulty**: Easy
**Time**: 2–3 hours

---

### L7 — Add compound database indexes
**Why required**: Queries like `WHERE user_id = ? AND disease_slug = ?` on the predictions table will do full scans at scale.
**Files**: `backend/app/database/models/prediction.py`, `payment.py`, `subscription.py`
**Difficulty**: Easy
**Time**: 1 hour

---

### L8 — Configure structured JSON logging for production
**Why required**: Current logging is plain text. Production monitoring tools (Datadog, Grafana Loki) expect JSON.
**Files**: `backend/app/core/logging.py`
**Difficulty**: Easy
**Time**: 1–2 hours

---

### L9 — Implement FHIR data export endpoint
**Why required**: Settings page has "Export FHIR JSON" button — no backend endpoint exists.
**Files**: Backend: add export endpoint to users module; Frontend: wire the button
**Difficulty**: Medium-Hard (FHIR schema compliance)
**Time**: 4–8 hours

---

### L10 — Implement account deletion flow
**Why required**: Settings page has a "Permanently Delete Account" button that does nothing. GDPR compliance may require this.
**Files**: Backend: add delete endpoint; Frontend: wire with confirmation dialog
**Difficulty**: Medium
**Time**: 2–3 hours

---

*Audit complete. Awaiting approval before any code modifications.*
