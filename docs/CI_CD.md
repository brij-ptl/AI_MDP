# Nidaan+ CI/CD Pipeline Documentation

Nidaan+ uses GitHub Actions to enforce code quality, run tests, perform security scanning, and validate Docker builds. This ensures that the codebase remains stable and production-ready at all times.

---

## 1. Workflows Overview

The CI/CD pipeline is split into two primary workflows located in `.github/workflows/`:

1. **`ci.yml`**: Application-level testing, linting, and security scanning.
2. **`docker.yml`**: Docker build validation for infrastructure testing.

### Workflow Triggers
Both workflows automatically trigger on:
- **Push** to the `main` branch.
- **Pull Request** targeting the `main` branch.

---

## 2. CI Pipeline (`ci.yml`)

The CI pipeline runs jobs in parallel for the Frontend and Backend to minimize execution time.

### Backend CI Job
- **Linting**: Uses `flake8` to enforce PEP 8 coding standards and catch syntax errors.
- **Security Scanning (SAST)**: Uses `bandit` to identify common security vulnerabilities in Python code (e.g., hardcoded passwords, SQL injection risks).
- **Dependency Scanning (SCA)**: Uses `safety` to check `requirements.txt` against known CVEs.
- **Unit Testing**: Runs the `pytest` suite to validate business logic and API endpoints.

### Frontend CI Job
- **Linting**: Uses `eslint` configured for Next.js to catch React/TypeScript issues.
- **Dependency Scanning**: Uses `npm audit` to detect high-severity vulnerabilities in frontend dependencies.
- **Build Verification**: Runs `npm run build` to ensure the Next.js application compiles successfully for production (using `standalone` mode).

---

## 3. Docker Pipeline (`docker.yml`)

The Docker pipeline validates the containerization process. It acts as an integration test for our multi-stage Dockerfiles.

### Docker Build Job
- **Backend Build**: Attempts to build `backend/Dockerfile`. Fails if dependencies cannot be resolved or if the Tesseract system dependencies fail to install.
- **Frontend Build**: Attempts to build `frontend/Dockerfile`. Fails if the Next.js standalone build cannot compile or package assets.
- **Caching**: Utilizes Docker Layer Caching (`--cache-from` and `--cache-to` via GitHub Actions) to drastically speed up sequential pipeline runs.

---

## 4. Branch Protection Rules

To enforce the CI/CD pipeline, the repository must be configured with Branch Protection rules on GitHub.

**Required Settings for `main`:**
1. **Require a pull request before merging.**
2. **Require status checks to pass before merging.**
   - Must select the following checks:
     - `Backend CI`
     - `Frontend CI`
     - `Test Docker Builds`
3. **Require conversation resolution before merging.**
4. **Do not allow bypassing the above settings.**

By enforcing these rules, broken code or vulnerable dependencies cannot be merged into the production branch.
