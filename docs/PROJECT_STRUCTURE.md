# Nidaan+ — Detailed Project Structure

> Annotated breakdown of every significant file and directory in the repository.

---

## Root Level

```
AI_MDP/
 README.md              <- Primary project documentation
 LICENSE                <- (Recommended: MIT)
 CONTRIBUTING.md        <- Contribution guidelines
 CHANGELOG.md           <- Release history
 .gitignore             <- Git ignore rules
 package-lock.json      <- Root-level npm lockfile (frontend workspace)
 docs/                  <- All supplementary documentation
 frontend/              <- Next.js application
 backend/               <- FastAPI application
```

---

## docs/

```
docs/
 API.md                 <- Complete API endpoint reference
 ARCHITECTURE.md        <- System architecture and design decisions
 DEPLOYMENT.md          <- Production deployment guide
 ML_PIPELINE.md         <- ML training and inference pipeline
 OCR_PIPELINE.md        <- OCR upload pipeline
 PROJECT_STRUCTURE.md   <- This file
 ROADMAP.md             <- Future improvements
 SECURITY.md            <- Security architecture
 engineering_audit.md   <- Phase 1 engineering audit report
```

---

## frontend/

```
frontend/
 package.json           <- Dependencies: Next.js, React, Tailwind, Recharts, etc.
 next.config.js         <- Next.js configuration
 tsconfig.json          <- TypeScript configuration
 tailwind.config.js     <- Tailwind CSS configuration
 postcss.config.js      <- PostCSS configuration
 .eslintrc.json         <- ESLint rules
 public/                <- Static assets (favicon, images)
 src/
  app/                  <- Next.js App Router pages
  components/           <- Reusable React components
  context/              <- React contexts
  services/             <- API service layer
  lib/                  <- Shared utilities
```

### src/app/

```
src/app/
 layout.tsx             <- Root layout (fonts, global CSS, AuthProvider)
 globals.css            <- Global CSS variables and base styles
 page.tsx               <- Landing page (public)
 loading.tsx            <- Global loading skeleton
 error.tsx              <- Global error boundary
 not-found.tsx          <- 404 page

 (auth)/                <- Route group: authentication pages (no sidebar)
  login/page.tsx
  register/page.tsx
  forgot-password/page.tsx
  reset-password/page.tsx

 (public)/              <- Route group: public marketing page
  page.tsx              <- (currently redirects to landing)

 (dashboard)/           <- Route group: all authenticated user pages
  layout.tsx            <- Auth guard + sidebar + mobile nav wrapper
  dashboard/page.tsx    <- Main dashboard with overview stats
  prediction/page.tsx   <- Disease picker and prediction form
  upload-report/page.tsx<- OCR upload + auto-fill flow
  symptom-checker/page.tsx <- AI symptom analysis
  reports/page.tsx      <- List and download PDF reports
  history/page.tsx      <- Full prediction history
  analytics/page.tsx    <- Personal health trend charts
  subscription/page.tsx <- Subscription plan cards
  payment/page.tsx      <- Razorpay checkout wrapper
  notifications/page.tsx<- User notification list
  profile/page.tsx      <- Clinical profile editor
  settings/page.tsx     <- Account settings (name, email, password, logout)

 admin/                 <- Admin panel (role-gated)
  layout.tsx            <- Auth guard + admin role check + admin sidebar
  dashboard/page.tsx    <- Platform stats overview
  users/page.tsx        <- User list + suspend/reactivate
  prediction-tokens/page.tsx <- Token management per user
  diseases/page.tsx     <- Enable/disable disease modules
  models/page.tsx       <- AI model accuracy reports
  payments/page.tsx     <- All payment transactions
  feedback/page.tsx     <- User feedback moderation
  logs/page.tsx         <- Admin action audit log
  analytics/page.tsx    <- Platform-wide usage analytics
```

### src/components/

```
src/components/
 layout/
  DashboardSidebar.tsx  <- Desktop navigation sidebar
  DashboardTopbar.tsx   <- Top bar with user avatar menu and theme toggle
  MobileNav.tsx         <- Bottom navigation bar for mobile
 ui/
  Button.tsx
  Card.tsx
  ... (shared UI primitives)
```

### src/context/

```
src/context/
 AuthContext.tsx         <- Global auth state: user, loading, logout()
                            Fetches /auth/me on mount to restore session
                            logout() clears cookies + hard-navigates to /login
```

### src/services/

```
src/services/
 auth.service.ts         <- register, login, logout, me, forgotPassword, resetPassword
 prediction.service.ts   <- getDiseases, predict, getHistory
 ocr.service.ts          <- uploadReport
 payment.service.ts      <- createOrder, verifyPayment, getHistory
 subscription.service.ts <- getMySubscription
 report.service.ts       <- generateReport, listReports, downloadReport
 user.service.ts         <- updateMe, getMedicalProfile, saveMedicalProfile
 dashboard.service.ts    <- overview
 symptom.service.ts      <- analyzeSymptoms
 notification.service.ts <- getNotifications, markAsRead
 analytics.service.ts    <- getAnalytics (admin)
```

---

## backend/

```
backend/
 app/                   <- Application package
 trained_models/        <- Serialized ML models (one folder per disease)
 datasets/              <- Downloaded public datasets (auto-created)
 requirements.txt       <- Python package dependencies
 .env.example           <- Environment variable template
 .env                   <- Local secrets (git-ignored)
 README.md              <- Backend-specific documentation
```

### backend/app/

```
app/
 __init__.py
 main.py                <- App factory: FastAPI instance, middleware, routers, lifespan
 api/
  router.py             <- Assembles all 14 domain routers under /api/v1
 core/
  config.py             <- Settings (pydantic-settings), loaded from .env
  security.py           <- JWT encode/decode, bcrypt, tracking ID generation
  logging.py            <- Structured logging setup (JSON-compatible)
  exceptions.py         <- Custom exception classes + FastAPI exception handlers
  dependencies.py       <- get_current_user, get_current_admin, get_optional_user
  startup.py            <- Startup tasks (DB init, model warmup)
 middleware/
  cors.py               <- CORSMiddleware configuration
  rate_limit.py         <- In-memory 60 req/min per IP rate limiter
  request_logger.py     <- Logs every request with method, path, status, duration
 modules/               <- One subdirectory per business domain
 database/
  base.py               <- SQLAlchemy declarative base + UUID + timestamp mixins
  database.py           <- Engine + SessionLocal
  session.py            <- get_db FastAPI dependency
  init_db.py            <- create_all tables
  seed.py               <- Idempotent seed: diseases + default admin
  models/               <- SQLAlchemy ORM models (11 files)
 schemas/               <- Pydantic v2 request/response schemas
 ml/                    <- ML engine
 services/
  email_service.py      <- SMTP email sending (or log-only if EMAIL_ENABLED=False)
 static/
  generated_reports/    <- PDF report files served statically
 templates/
  email/                <- HTML email templates (password reset, verification)
 uploads/               <- Temporary OCR file storage
 utils/
  response.py           <- success_response() helper
  pagination.py         <- Pagination utilities
```

### backend/app/modules/

Each module follows the same internal structure:

```
modules/{domain}/
 __init__.py
 router.py              <- FastAPI route definitions + Depends() wiring
 controller.py          <- Input validation, orchestration, error translation
 service.py             <- Business logic (no HTTP knowledge)
 repository.py          <- Database queries (SQLAlchemy only, no business logic)
 validators.py          <- Domain-specific validation helpers (where applicable)
 webhook.py             <- Webhook handler (payment module only)
```

Modules present:
```
auth/ dashboard/ users/ prediction/ symptom_checker/ ocr/
recommendation/ reports/ history/ notifications/ subscription/
payment/ analytics/ admin/
```

### backend/app/ml/

```
ml/
 diseases/              <- One subdirectory per disease
  heart/config.json
  diabetes/config.json
  breast_cancer/config.json
  ... (16 total)
 training/
  train_all.py          <- CLI: trains all or one disease model
 inference/
  predictor.py          <- Runs the sklearn pipeline, returns prediction result
 preprocessing/
  cleaning.py           <- Null handling, outlier clamping
  encoding.py           <- ColumnTransformer builder (StandardScaler + OHE)
 evaluation/
  evaluator.py          <- accuracy, F1, ROC-AUC, confusion matrix
 explainable_ai/
  feature_importance.py <- Per-prediction feature importance extraction
  shap_explainer.py     <- SHAP explanations (optional, admin panel)
  lime_explainer.py     <- LIME explanations (optional, admin panel)
 registry/
  model_loader.py       <- joblib.load with in-memory cache
  model_registry.py     <- Lists all trained disease slugs
 common/
  constants.py          <- RANDOM_STATE, TEST_SIZE, MODEL_FILE_NAME
  metrics.py            <- full_report() metric computation
```

### trained_models/

```
trained_models/
 heart/
  model.joblib          <- Serialized sklearn Pipeline (preprocessor + classifier)
  metadata.json         <- Accuracy, training date, data source
 diabetes/
  model.joblib
  metadata.json
 ... (16 disease folders total)
```

---

## Configuration Files

| File | Purpose |
|---|---|
| `backend/.env.example` | Template for all environment variables with documented defaults |
| `backend/.env` | Actual secrets (git-ignored, must be created manually) |
| `frontend/next.config.js` | Next.js build and API proxy configuration |
| `frontend/tsconfig.json` | TypeScript compiler settings (`@/` path alias configured) |
| `frontend/tailwind.config.js` | Tailwind CSS theme and content paths |

---

## Git-Ignored Paths

The following are excluded from version control:

```
.venv/                  <- Python virtual environment
backend/.env            <- Secrets
backend/app/database/healthcare.db  <- SQLite database file
backend/app/uploads/    <- Temporary OCR uploads
backend/app/static/generated_reports/  <- Generated PDFs
backend/trained_models/ <- Large binary model files (if excluded)
frontend/node_modules/  <- npm packages
frontend/.next/         <- Next.js build cache
```

> **Note:** `trained_models/` may or may not be committed depending on file size. For production deployments, models should be rebuilt from source using `train_all.py` or stored in an artifact registry.
