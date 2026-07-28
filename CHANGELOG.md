# Changelog

All notable changes to this project are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project uses semantic versioning.

---

## [1.0.1] — 2026-07-28

### Fixed
- `GET /admin/users` returned HTTP 500 when any user in the database had an email with a reserved TLD (e.g. `.local`). Root cause: `UserProfileOut` used Pydantic `EmailStr` which re-validates on serialization. Fixed by changing `email` field type to `str` in `UserProfileOut` schema. Input validation at registration is unaffected.
- Header avatar dropdown logout button did not navigate to `/login` after clearing session. Fixed by centralizing logout redirect in `AuthContext.logout()` using `window.location.href`.
- Settings page displayed hardcoded placeholder strings instead of the authenticated user's actual name and email. Fixed by binding `useAuth()` data to the settings form.

### Changed
- `backend/app/ml/training/train_all.py`: replaced `print()` calls with `logger.info()` for consistent structured logging.
- `frontend/src/app/(dashboard)/profile/page.tsx`: replaced silent `console.error` with `setMessage()` state for user-visible error feedback.

### Removed
- Deleted temporary installation artifacts from `backend/`: `tesseract_installer.exe`, `tesserocr.zip`, `7z_extra.7z`, `7zr.exe`, `get_7z.py`, `7z_bin/`, `7z_extra/`. The runtime Tesseract binary (`tess_extracted/`) was retained.

---

## [1.0.0] — 2026-07-28

### Initial Release

#### Authentication
- User registration with email and password
- JWT authentication via HttpOnly cookies
- Refresh token with 7-day lifetime
- Access token with 30-minute lifetime
- Bearer token fallback for non-browser clients
- Email verification token generation
- Password reset via email link
- Bcrypt password hashing
- Session tracking cookie for funnel analytics

#### User Features
- User dashboard with prediction token balance and subscription overview
- Medical profile (age, gender, blood group, height, weight, lifestyle data)
- Profile editor
- Account settings (name, phone, password change)
- Notification list and mark-as-read

#### Disease Prediction
- 16 disease modules (Heart, Diabetes, Breast Cancer, Stroke, Hypertension, Kidney, Liver, Fatty Liver, Lung Cancer, Cervical Cancer, Prostate Cancer, Thyroid, Parkinson's, Alzheimer's, Anemia, Obesity)
- Config-driven prediction engine (no bespoke code per disease)
- Random Forest and Logistic Regression algorithms
- Per-prediction feature importance (Explainable AI)
- Doctor-voice clinical explanation (deterministic, offline)
- Risk level classification (Low / Moderate / High)
- Prediction history with pagination and filtering

#### AI Symptom Checker
- Free-text symptom input
- Rule-based analysis engine
- Possible conditions and recommendations

#### OCR Medical Report Upload
- PDF (digital and scanned), PNG, JPG, JPEG support
- pdfplumber for digital PDF text extraction
- Tesseract-OCR with image preprocessing for scanned documents
- Regex-based parameter extraction via `ocr_aliases` in disease config
- Auto-fill prediction form with extracted values
- User review step before prediction

#### Reports
- PDF clinical report generation (ReportLab)
- Feature importance bar chart embedded in PDF (matplotlib)
- Report download endpoint
- Report history list

#### Subscription System
- 4 subscription plans: Starter, Care+, Family, Annual
- 2 free predictions and 2 free symptom checks before paywall
- HTTP 402 enforcement for exhausted quotas
- Prediction token system (admin-adjustable)

#### Payments (Razorpay)
- Razorpay order creation
- Frontend Razorpay checkout integration
- HMAC-SHA256 payment signature verification
- Payment record storage
- Subscription activation on verified payment
- Razorpay webhook endpoint with signature verification
- Payment history endpoint

#### Admin Panel
- Admin login (separate role-gated area)
- User management: list, suspend, reactivate
- Prediction token management: add, remove, set, reset per user; history
- Disease module management: enable/disable
- AI model accuracy reports per disease
- Payment transaction log
- User feedback moderation
- Admin action audit log
- Platform-wide analytics

#### Infrastructure
- FastAPI with layered module architecture (router/controller/service/repository)
- SQLAlchemy ORM with SQLite (development) and MySQL/PostgreSQL support
- Pydantic v2 schema validation
- CORS middleware
- In-memory rate limiting (60 req/min per IP)
- Request logging middleware
- Idempotent database seeding
- Structured Python logging
- Dark/Light mode UI
- Responsive design (mobile + desktop)
- Next.js 15 App Router with TypeScript
