# Nidaan+ Development Guide

This guide covers everything you need to know to set up a local development environment for Nidaan+.

## Table of Contents
1. [Local Development (Bare Metal)](#local-development-bare-metal)
2. [Docker Development Guide](#docker-development-guide)
3. [Environment Variables](#environment-variables)
4. [Testing & Linting](#testing--linting)

---

## Local Development (Bare Metal)

If you prefer to run the application natively without Docker, follow these steps.

### Prerequisites
- Python 3.11+
- Node.js 18+ (20 LTS recommended)
- Tesseract-OCR 5.x installed on your system

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

### 2. Seeding the Database and ML Models
Before running the backend, you must generate the ML models and seed the local SQLite database.
```bash
python -m app.ml.training.train_all
python -m app.database.seed
```

### 3. Running the Backend
```bash
uvicorn app.main:app --reload --port 8000
```
- API is available at: `http://localhost:8000/api/v1`
- Swagger Docs: `http://localhost:8000/api/docs`

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Web Application is available at: `http://localhost:7000`

---

## Docker Development Guide

For a containerized development experience, we use `docker-compose.yml`. This automatically sets up PostgreSQL, the FastAPI backend, and the Next.js frontend.

### Prerequisites
- Docker Engine
- Docker Compose v2

### 1. Environment Configuration
Ensure `.env.docker` is present in the root directory. This file maps the environment variables directly into the containers. Note that `DATABASE_URL` is pre-configured to point to the `nidaan_db` PostgreSQL container.

### 2. Starting the Stack
Run the entire stack in detached mode:
```bash
docker compose up -d --build
```
This command builds the multi-stage images and orchestrates the containers. The frontend will be mapped to port `7000` and backend to `8000`.

### 3. Seeding the Docker Database
The first time you start the Docker stack, the `nidaan_pgdata` volume is empty. You must train the models and seed the DB *inside* the container:
```bash
docker exec -it nidaan_backend python -m app.ml.training.train_all
docker exec -it nidaan_backend python -m app.database.seed
```

### 4. Viewing Logs
To tail the logs of the entire stack:
```bash
docker compose logs -f
```

To tail the logs of a specific service:
```bash
docker compose logs -f backend
```

---

## Environment Variables

Nidaan+ uses different `.env` files depending on the execution context.

- `backend/.env`: Used when running the backend natively via `uvicorn`. (Default SQLite)
- `.env.docker`: Used by `docker-compose.yml` to inject into containers. (Default PostgreSQL)

### Key Variables for Developers
- `DEBUG=True`: Ensures tracebacks are visible during local development.
- `APP_ENV=development`: Sets the environment context.
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: If you are working on the billing integration, you must inject Razorpay Test Keys here. Otherwise, the checkout flow will result in an "Authentication Failed" error.

---

## Testing & Linting

### Backend
The backend uses `pytest` for unit testing and `flake8` for linting.
```bash
cd backend
pytest tests/
flake8 app/
```

### Frontend
The frontend uses `eslint` and `next lint`.
```bash
cd frontend
npm run lint
```
