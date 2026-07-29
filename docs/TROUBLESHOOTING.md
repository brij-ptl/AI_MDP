# Nidaan+ Troubleshooting Guide

This guide addresses common issues developers and operators might face when configuring, building, or deploying Nidaan+.

---

## 1. Environment and Configuration Issues

### `Authentication Failed` during Razorpay Checkout
- **Symptoms**: The UI displays "Authentication Failed" when clicking "Continue to Razorpay" on the Subscription page.
- **Root Cause**: The `RAZORPAY_KEY_ID` or `RAZORPAY_KEY_SECRET` environment variables are empty or invalid.
- **Fix**: Check `backend/.env` (for local dev) or `.env.docker` (for Docker). Ensure real test keys are injected. Restart the server/container after modifying `.env` files.

### `CORS Policy Error` on Frontend
- **Symptoms**: The frontend loads, but all API requests fail. Browser console shows CORS preflight errors.
- **Root Cause**: The frontend is being served from an origin not explicitly allowed by the backend's `CORS_ORIGINS`.
- **Fix**: Add the exact origin (including `http/https` and port) to the `CORS_ORIGINS` JSON array in your `.env` file (e.g., `["http://localhost:7000"]`).

---

## 2. Docker & Database Issues

### Backend Container Restarting Constantly (`OperationalError`)
- **Symptoms**: `docker-compose ps` shows `nidaan_backend` repeatedly restarting. Logs show `psycopg2.OperationalError: could not translate host name "db" to address`.
- **Root Cause**: The backend cannot resolve the database container.
- **Fix**: 
  - Ensure `DATABASE_URL` in `.env.docker` uses the container name `nidaan_db` (e.g., `postgresql+psycopg2://nidaan_user:nidaan_password@nidaan_db:5432/nidaan_db`).
  - Ensure the `nidaan_db` container is running and healthy.

### Database Not Seeded
- **Symptoms**: Cannot log in as admin, or diseases do not appear in the dropdown.
- **Root Cause**: The database tables exist but are empty.
- **Fix**:
  - Local: `python -m app.database.seed`
  - Docker: `docker exec -it nidaan_backend python -m app.database.seed`

---

## 3. Machine Learning & OCR Issues

### 500 Internal Server Error on Prediction
- **Symptoms**: Submitting a prediction form immediately fails with a 500 error. The backend logs show `FileNotFoundError: No such file or directory: 'trained_models/model.joblib'`.
- **Root Cause**: The ML models have not been trained yet.
- **Fix**:
  - Local: `python -m app.ml.training.train_all`
  - Docker: `docker exec -it nidaan_backend python -m app.ml.training.train_all`

### PDF OCR Fails: "Tesseract Not Found"
- **Symptoms**: Uploading a PDF or Image fails with a 500 error indicating `tesseract` is missing from the PATH.
- **Root Cause**: Tesseract-OCR is missing from the host machine (if running locally), or the `TESSERACT_CMD` variable points to the wrong path.
- **Fix**:
  - Install Tesseract-OCR on your host machine.
  - Windows: Explicitly define the path in `.env` (e.g., `TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe`).
  - Note: The Docker container already includes Tesseract natively.

---

## 4. Frontend Compilation Issues

### `npm run dev` Fails or Shows Dependency Errors
- **Symptoms**: Next.js fails to start or shows module resolution errors.
- **Root Cause**: `node_modules` is out of sync with `package.json`.
- **Fix**: 
  ```bash
  cd frontend
  rm -rf node_modules package-lock.json
  npm install
  npm run dev
  ```
