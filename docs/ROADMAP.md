# Nidaan+ — Roadmap

> Planned improvements and future development directions.
> This document reflects realistic, engineering-grounded plans — not aspirational marketing.

---

## Current Status — v1.0.0

The following features are fully implemented and production-verified:

- Authentication (JWT, RBAC, bcrypt, HttpOnly cookies)
- 16 disease prediction modules (3 real datasets, 13 synthetic)
- AI symptom checker (rule-based)
- OCR medical report upload (pdfplumber + Tesseract)
- PDF report generation (ReportLab + matplotlib)
- Razorpay payment integration (4 subscription plans)
- Admin dashboard (users, diseases, tokens, logs, analytics)
- Responsive UI with dark/light mode

---

## Short Term — v1.1.0

Infrastructure and stability improvements that do not require new features.

### DevOps
- [ ] **Docker + docker-compose** — containerize both backend and frontend for reproducible deployments
- [ ] **Nginx reverse proxy** — API routing, GZIP compression, security headers, HTTPS-ready config
- [ ] **Structured JSON logging** — ship logs to ELK/Loki/Datadog
- [ ] **CI/CD pipeline** (GitHub Actions) — lint, build, test on every push

### Backend
- [ ] **Redis-backed rate limiting** — shared state across multiple uvicorn workers
- [ ] **`/readiness` and `/liveness` endpoints** — for Kubernetes/Docker health probes
- [ ] **Automated test suite** — pytest + HTTPX covering all 40+ endpoints
- [ ] **PostgreSQL as default** — replace SQLite default with PostgreSQL for production

### Security
- [ ] **File upload MIME type verification** — verify actual file headers, not just extension
- [ ] **Refresh token rotation** — invalidate old refresh token on each refresh
- [ ] **Email verification enforcement** — block login until email is verified

---

## Medium Term — v1.2.0

Feature improvements and data quality upgrades.

### ML / Data
- [ ] **Replace synthetic disease models** — source real clinical datasets for the 13 synthetic modules
- [ ] **Model retraining pipeline** — automated periodic retraining when new data is available
- [ ] **Model versioning** — track model versions and allow rollback
- [ ] **Confidence intervals** — display prediction uncertainty alongside probability

### OCR
- [ ] **Multi-language OCR** — support lab reports in Hindi, regional languages
- [ ] **Improved regex matching** — expand `ocr_aliases` based on real lab report formats from Indian labs
- [ ] **MIME type validation** — add python-magic for server-side file type verification

### User Experience
- [ ] **Email verification enforcement** — require verified email before first prediction
- [ ] **Password strength meter** on registration
- [ ] **Notification delivery** — push notifications or email for report readiness
- [ ] **Multi-language UI** — i18n support (English and Hindi at minimum)

---

## Long Term — v2.0.0

Larger architectural and product changes.

### Platform
- [ ] **Mobile application** — React Native app sharing the same backend
- [ ] **Doctor consultation booking** — integration with telemedicine API
- [ ] **Wearable data ingestion** — ingest health metrics from Apple Health, Fitbit, Google Health
- [ ] **Family health tracking** — allow one account to manage multiple family member profiles

### Compliance
- [ ] **HIPAA compliance review** — end-to-end encryption at rest, audit logging, BAA framework
- [ ] **GDPR compliance** — data export, right to erasure endpoints
- [ ] **ISO 27001 alignment** — information security management

### AI / ML
- [ ] **LLM-generated clinical narratives** — full OpenAI integration for doctor-style explanations (configurable per deployment)
- [ ] **Drug interaction checker** — alert when user's existing medications interact with likely conditions
- [ ] **Risk trend analysis** — track risk scores over time and alert on worsening trends

---

## Will NOT Be Implemented

The following are intentionally out of scope:

- Actual medical diagnosis (this is a screening tool only)
- Real-time patient monitoring (requires medical device certification)
- EHR/EMR integration (requires HIPAA BAA and significant compliance work)
- Prescription or treatment recommendations (requires medical licensing)
