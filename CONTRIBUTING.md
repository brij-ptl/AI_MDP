# Contributing to Nidaan+

Thank you for your interest in contributing. This document explains how to get started, what to work on, and how to submit changes.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Code Style](#code-style)
- [How to Add a New Disease Module](#how-to-add-a-new-disease-module)
- [Running the Verification Suite](#running-the-verification-suite)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [What NOT to Do](#what-not-to-do)

---

## Code of Conduct

This project is a professional engineering repository. Contributions must be:

- Technically accurate
- Backward compatible
- Documented
- Tested

---

## Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/YOUR_USERNAME/AI_MDP.git
cd AI_MDP
```

### 2. Set Up the Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python -m app.ml.training.train_all
python -m app.database.seed
uvicorn app.main:app --reload --port 8000
```

### 3. Set Up the Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Development Workflow

1. Create a branch from `main`
2. Make your changes
3. Run the verification suite
4. Commit with a clear message
5. Push and open a pull request

---

## Branch Naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feat/short-description` | `feat/redis-rate-limiting` |
| Bug fix | `fix/short-description` | `fix/admin-users-500-error` |
| Documentation | `docs/short-description` | `docs/ocr-pipeline` |
| Refactor | `refactor/short-description` | `refactor/payment-service` |
| Chore | `chore/short-description` | `chore/update-dependencies` |

---

## Commit Messages

Use the conventional commits format:

```
type(scope): short description

Optional longer description if needed.
```

Examples:
```
fix(admin): use str instead of EmailStr for UserProfileOut email field
feat(ocr): add MIME type verification using python-magic
docs(readme): add architecture diagram to root README
```

---

## Code Style

### Backend (Python)

- Follow PEP 8
- Use type hints on all function signatures
- Add docstrings to non-trivial functions
- Keep functions focused (single responsibility)
- Do not use `print()` — use `get_logger(__name__)` from `app.core.logging`

### Frontend (TypeScript)

- Use TypeScript strict mode
- No `any` types without a comment explaining why
- Use `async/await` over `.then()` chains
- No inline styles — use Tailwind utility classes
- Do not use `console.log()` in production code

---

## How to Add a New Disease Module

Adding a disease requires no new Python code — only a config file and training data.

### Step 1: Create the config directory

```bash
mkdir backend/app/ml/diseases/your_disease
```

### Step 2: Create config.json

```json
{
  "slug": "your_disease",
  "name": "Your Disease Name",
  "category": "Cardiovascular",
  "icon": "heart",
  "short_description": "A brief description.",
  "overview": "A longer clinical overview.",
  "data_source": "public_dataset",
  "dataset_url": "https://raw.githubusercontent.com/path/to/dataset.csv",
  "target": "target",
  "positive_value": 1,
  "algorithm": "random_forest",
  "feature_schema": [
    {
      "name": "feature_name",
      "label": "Display Label",
      "type": "numeric",
      "min": 0,
      "max": 100,
      "default": 50,
      "unit": "mg/dL",
      "ocr_aliases": ["feature name", "fn"]
    }
  ],
  "risk_factors": ["Risk factor 1"],
  "common_symptoms": ["Symptom 1"],
  "recommended_specialist": "Cardiologist",
  "recommended_tests": ["ECG", "Echocardiogram"]
}
```

### Step 3: Train the model

```bash
cd backend
python -m app.ml.training.train_all --disease your_disease
```

### Step 4: Seed the database

```bash
python -m app.database.seed
```

The new disease will appear automatically in the disease catalogue.

---

## Running the Verification Suite

Run the API verification script before submitting any PR:

```bash
# Ensure the backend is running
cd backend
uvicorn app.main:app --reload --port 8000

# In another terminal
python verify_apis.py
```

All tests must pass. Do not submit a PR with failing API checks.

---

## Submitting a Pull Request

1. Ensure all changes are on a feature branch (not `main`)
2. Run the verification suite and confirm all tests pass
3. Update any relevant documentation in `docs/`
4. Open a PR against `main` with:
   - A clear title
   - Description of what changed and why
   - Any breaking changes clearly marked
   - Reference to any related issue

---

## What NOT to Do

- Do not commit `backend/.env` (contains secrets)
- Do not commit `backend/app/database/healthcare.db`
- Do not break existing API response formats
- Do not rename endpoints that the frontend already uses
- Do not remove the data source disclosure from `backend/README.md`
- Do not document features that do not exist
- Do not add `print()` statements to application code
