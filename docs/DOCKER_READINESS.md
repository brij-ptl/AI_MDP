# Docker Readiness Audit

This document summarizes the current state of the Nidaan+ repository regarding Docker containerization.

## ✅ Completed Pre-Requisites

1. **Environment Configuration:** All hardcoded values have been replaced with Pydantic BaseSettings. Production vs Development environments are strictly separated via `APP_ENV`.
2. **Stateless Authentication:** JWT authentication stores state purely in HttpOnly cookies, making the backend horizontally scalable across multiple containers.
3. **Structured Logging:** Production logs are formatted as JSON and written to rotating files (or standard streams), which is essential for Docker log aggregators (e.g., fluentd, ELK).
4. **Health Endpoints:** Kubernetes-compatible liveness and readiness probes (`/health/live` and `/health/ready`) have been implemented to check DB, OCR, and ML dependencies.
5. **Database Agnosticism:** SQLAlchemy is used via a connection string URL. Moving from SQLite to PostgreSQL/MySQL in a Docker-Compose network requires zero code changes (only updating `.env`).

## ⚠️ Requirements for Dockerization (Next Steps)

### Backend Container
- **Base Image:** Requires `python:3.11-slim` or `python:3.11-bullseye`.
- **System Dependencies:** The image MUST `apt-get install` the following for OCR to function:
  - `tesseract-ocr`
  - `tesseract-ocr-eng`
  - `poppler-utils` (for `pdf2image`)
- **Port Mapping:** Expose port `8000`.
- **Startup Command:** `uvicorn app.main:app --host 0.0.0.0 --port 8000`

### Frontend Container
- **Base Image:** `node:20-alpine`.
- **Build Step:** Requires `npm run build` during image creation.
- **Port Mapping:** Expose port `7000`.
- **Environment:** `NEXT_PUBLIC_API_URL` must point to the backend container or Nginx proxy.

### Database Container
- Replace local SQLite with an official `mysql:8.0` or `postgres:15` container.
- Create a persistent Docker volume for database storage.

### Persistent Volumes Required
If deploying the backend via Docker, the following directories must be mapped to persistent volumes to prevent data loss on container restart:
1. `backend/app/uploads/` — User OCR uploads.
2. `backend/app/static/generated_reports/` — Downloadable PDF reports.
3. `backend/logs/` — Rotating production logs (if not shipping to a centralized aggregator).

### Reverse Proxy (Nginx)
- A Docker network should sit behind an Nginx container to route `/api/` to the backend and `/` to the frontend, handling SSL termination.
