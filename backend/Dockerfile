# ==========================================
# STAGE 1: Builder
# ==========================================
FROM python:3.11-slim as builder

# Prevent Python from writing .pyc files & buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /build

# Install system dependencies required for building python packages (if any)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
# Add PostgreSQL driver since we are moving to Postgres for Docker
RUN pip install --no-cache-dir -r requirements.txt psycopg2-binary gunicorn

# ==========================================
# STAGE 2: Production Runtime
# ==========================================
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV APP_ENV=production

WORKDIR /app

# Install runtime system dependencies for OCR
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-eng \
    poppler-utils \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy python dependencies from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/

# Create a non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy application source code
COPY . .

# Ensure necessary directories exist and have correct permissions
RUN mkdir -p logs app/uploads/temp app/static/generated_reports tess_extracted \
    && chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Healthcheck to ensure container is ready (using our /health/live endpoint)
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8000/health/live || exit 1

# Start the application using Gunicorn with Uvicorn workers for production
CMD ["gunicorn", "app.main:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
