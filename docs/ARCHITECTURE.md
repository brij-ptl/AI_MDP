# Nidaan+ — Architecture Reference

> Technical architecture, design decisions, and system internals.

---

## Table of Contents

- [Overview](#overview)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Database Schema](#database-schema)
- [Authentication Architecture](#authentication-architecture)
- [Middleware Stack](#middleware-stack)
- [ML Inference Pipeline](#ml-inference-pipeline)
- [Key Design Decisions](#key-design-decisions)

---

## Overview

Nidaan+ is a decoupled full-stack application:

- **Backend:** FastAPI (Python 3.11) serving a REST API at port 8000
- **Frontend:** Next.js 15 (TypeScript, App Router) served at port 7000
- **Database:** SQLAlchemy ORM over SQLite (development) or MySQL/PostgreSQL (production)
- **ML Engine:** scikit-learn pipelines serialized with joblib; one model per disease
- **Auth:** HttpOnly JWT cookies; no token management required on the frontend

The two services communicate exclusively over HTTP. There is no server-side rendering of protected pages — all authenticated pages are client-side React components that call the API.

---

## Backend Architecture

The backend follows a **layered module architecture**:

```
app/
 modules/
  auth/
   router.py      <- HTTP handlers (FastAPI routes)
   controller.py  <- Input validation and orchestration
   service.py     <- Business logic
   repository.py  <- Database queries (SQLAlchemy)
```

Every business domain (auth, prediction, OCR, payments, etc.) follows this exact four-layer pattern. This enforces strict separation of concerns:

| Layer | Responsibility |
|---|---|
| **Router** | HTTP method, path, request/response schemas, auth dependency injection |
| **Controller** | Input validation, pre/post-processing, error translation |
| **Service** | Pure business logic; no HTTP knowledge |
| **Repository** | All database I/O; no business logic |

### API Router

All 14 domain routers are assembled in `app/api/router.py` and mounted under the `/api/v1` prefix. The master router is included in `app/main.py`.

### Dependency Injection

FastAPI's `Depends()` system is used for:
- `get_current_user` — validates JWT, fetches user from DB, raises 401 if invalid
- `get_current_admin` — extends `get_current_user`, raises 403 if not admin
- `get_db` — provides a SQLAlchemy `Session` per request, closing it after

### Configuration

All application settings live in `app/core/config.py` (`Settings` class, Pydantic BaseSettings). Values are loaded from environment variables / `.env` file. The `settings` object is a cached singleton via `@lru_cache`.

---

## Frontend Architecture

The frontend uses Next.js 15 **App Router** with a route-group structure:

```
src/app/
 (auth)/       <- Login, Register, Forgot/Reset Password (public)
 (public)/     <- Landing page (public)
 (dashboard)/  <- All authenticated user pages
  layout.tsx   <- Auth guard: redirects to /login if no session
 admin/        <- Admin panel
  layout.tsx   <- Auth guard + admin role check
```

### State Management

- **Authentication state:** `AuthContext` (React Context) — single source of truth for `user`, `loading`, `logout()`
- **Server state:** Direct API calls via service modules in `src/services/`
- **No external state library** (no Redux, no Zustand) — context + local state is sufficient

### Service Layer

Every API domain has a corresponding service file in `src/services/`:

```
src/services/
 auth.service.ts
 prediction.service.ts
 ocr.service.ts
 payment.service.ts
 subscription.service.ts
 ...
```

Each service function wraps a `fetch()` call with `credentials: "include"` to ensure JWT cookies are sent automatically.

### Auth Guard

The dashboard layout (`(dashboard)/layout.tsx`) uses a `useEffect` to check `user` state from `AuthContext`. If the user is not authenticated after the loading state resolves, it calls `router.replace("/login")`. This provides client-side route protection without a middleware file.

---

## Database Schema

11 SQLAlchemy ORM models, all using UUID primary keys and `created_at` / `updated_at` timestamps.

```
users
 id, full_name, email, password_hash, phone, role,
 is_active, is_email_verified, tracking_id,
 prediction_tokens, login_count, last_login_at

medical_profiles
 id, user_id (FK), age, gender, blood_group,
 height_cm, weight_kg, smoking, alcohol,
 physical_activity, family_history, existing_conditions

diseases
 id, slug (unique), name, category, icon,
 short_description, overview, risk_factors (JSON),
 common_symptoms (JSON), feature_schema (JSON),
 model_accuracy, model_version, data_source, is_active

predictions
 id, user_id (FK), disease_id (FK), disease_slug,
 input_features (JSON), probability, risk_level,
 explanation, top_risk_factors (JSON),
 recommendations (JSON), warnings (JSON)

reports
 id, user_id (FK), prediction_id (FK),
 file_path, file_name

subscriptions
 id, user_id (FK), plan, status,
 tokens_granted, started_at, expires_at,
 razorpay_subscription_id

payments
 id, user_id (FK), razorpay_order_id,
 razorpay_payment_id, amount_paise, currency,
 plan, status, verified_at

notifications
 id, user_id (FK), title, message, type, is_read

feedbacks
 id, user_id (FK), prediction_id (FK),
 rating, comment, category, status

admin_logs
 id, admin_id (FK), action, target_type,
 target_id, metadata_json

token_logs
 id, admin_id (FK), target_id (FK),
 action, metadata_json
```

---

## Authentication Architecture

### Token Strategy

- **Access token:** HS256 JWT, 30-minute lifetime, stored in `access_token` HttpOnly cookie
- **Refresh token:** HS256 JWT, 7-day lifetime, stored in `refresh_token` HttpOnly cookie
- **Tracking cookie:** Non-HttpOnly `phc_tracking_id` cookie, set on first visit, linked to user record at registration for funnel analytics

### Login Flow

```
1. POST /auth/login  { email, password }
2. Service verifies bcrypt hash
3. access_token JWT generated (30 min)
4. refresh_token JWT generated (7 days)
5. Both set as HttpOnly cookies in the response
6. TokenResponse returned with user data
```

### Token Refresh

```
1. Frontend detects 401 response
2. POST /auth/refresh (sends refresh_token cookie automatically)
3. New access_token issued and set as cookie
4. Original request is retried
```

### Request Authentication

```
get_current_user(request, db):
  1. Read access_token from cookie
  2. Fallback: read Bearer token from Authorization header
  3. Decode JWT (HS256, check "type" == "access")
  4. Query User by JWT "sub" claim
  5. Verify user.is_active == True
  6. Return User ORM object
```

---

## Middleware Stack

Middleware is added in reverse order (last added = outermost = runs first):

```python
app.add_middleware(RequestLoggerMiddleware)  # innermost
app.add_middleware(RateLimitMiddleware)       # middle
add_cors_middleware(app)                     # outermost - runs first
```

### CORS Middleware

- Uses FastAPI's built-in `CORSMiddleware`
- `allow_credentials=True` required for cookie-based auth
- Origins configured via `CORS_ORIGINS` env var

### Rate Limiter

- In-memory per-IP counter (60 requests/minute default)
- Resets every 60 seconds
- Returns HTTP 429 on breach
- Configured via `RATE_LIMIT_PER_MINUTE` env var
- **Note:** In-memory; does not share state across multiple workers

### Request Logger

- Logs every request: method, path, status code, duration
- Uses the structured logging system (`app/core/logging.py`)

---

## ML Inference Pipeline

See [ML_PIPELINE.md](./ML_PIPELINE.md) for the full training pipeline.

### Inference Flow (per prediction request)

```
1. Load disease config (config.json) from registry cache
2. Validate input features against feature_schema
3. Load Pipeline from trained_models/{slug}/model.joblib
   (cached in memory after first load)
4. pipeline.predict_proba(X)[0][1] -> probability float
5. risk_level = "Low" / "Moderate" / "High" based on probability
6. feature_importances from pipeline.named_steps["classifier"]
7. Sort top features by importance -> top_risk_factors
8. Build doctor-voice explanation (template + feature data)
9. Generate recommendations from disease config
10. Add warnings if data_source == "synthetic_demo"
11. Return PredictionOut
```

### Model Caching

Joblib model files are loaded on first request and cached in a module-level dict. Models are not reloaded on each request. The cache is invalidated only on server restart.

---

## Key Design Decisions

### 1. Config-Driven Disease Engine

Every disease module is driven by a `config.json` file. The prediction engine (`app/ml/inference/`) is completely generic — it reads the feature schema, loads the correct model, and applies it. Adding disease #17 requires:
- A new directory `app/ml/diseases/new_disease/config.json`
- Training data
- Running `train_all.py --disease new_disease`

No new Python code is required.

### 2. HttpOnly Cookie Auth

Tokens are never exposed to JavaScript. This eliminates XSS-based token theft. The `credentials: "include"` header on frontend requests ensures cookies are automatically included.

### 3. Deterministic Clinical Explanations

Prediction explanations are generated deterministically from the model's feature importances — no external LLM call. This means explanations are:
- Fully reproducible
- Instantly generated
- Available in offline/air-gapped environments

LLM-generated narrative is supported but disabled by default (`LLM_ENABLED=False`).

### 4. Pydantic v2 Schemas

All request/response schemas use Pydantic v2 with `model_validate()` for ORM-to-schema conversion. `from_attributes = True` is set on all output schemas.

### 5. Idempotent Seeding

`seed.py` is safe to run multiple times. It checks for existing records before inserting.

### 6. Free Tier Enforcement

HTTP 402 is returned when a user exhausts their free prediction/symptom-check quota. The check is enforced in `subscription/service.py`, not in a middleware — keeping it close to the business logic.
