"""
AI-Enabled Multi-Disease Prediction and Precision Healthcare Platform — backend entry point.

Run locally:
    uvicorn app.main:app --reload --port 8000

First-time setup:
    pip install -r requirements.txt
    python -m app.ml.training.train_all       # trains + saves all 16 disease models
    python -m app.database.seed               # seeds the Disease table + a default admin user
    uvicorn app.main:app --reload
"""
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.core.exceptions import register_exception_handlers
from app.core.startup import run_startup_tasks
from app.middleware.cors import add_cors_middleware
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.request_logger import RequestLoggerMiddleware
from app.middleware.security_headers import SecurityHeadersMiddleware
from app.api.router import api_router

setup_logging(debug=settings.DEBUG)
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME} ({settings.APP_ENV})...")
    run_startup_tasks()
    yield
    logger.info("Shutting down.")


app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered multi-disease risk prediction, symptom analysis, medical report "
                "OCR, and precision healthcare recommendations — with a subscription business model.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# ---- middleware (order matters: last added = outermost = runs first) ----
# CORS must be outermost so it intercepts OPTIONS preflight before the router.
app.add_middleware(RequestLoggerMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware)
add_cors_middleware(app)  # added last → runs first

register_exception_handlers(app)

# ---- static file mounts ----
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# ---- routers ----
app.include_router(api_router)


import os
from sqlalchemy import text
from app.database.session import get_db

@app.get("/", tags=["Health"])
def root():
    return {"success": True, "message": f"{settings.APP_NAME} API is running.", "docs": "/api/docs"}


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": settings.APP_ENV
    }


@app.get("/health/live", tags=["Health"])
def health_live():
    """Liveness probe for Kubernetes/Docker."""
    return {"status": "alive"}


@app.get("/health/ready", tags=["Health"])
def health_ready(db=Depends(get_db)):
    """Readiness probe for Kubernetes/Docker."""
    components = {
        "database": False,
        "filesystem": False,
        "ocr": False,
        "ml_models": False
    }
    
    # 1. Database Check
    try:
        db.execute(text("SELECT 1"))
        components["database"] = True
    except Exception as e:
        logger.error(f"Health DB check failed: {e}")

    # 2. Filesystem Check (can write to uploads)
    try:
        test_file = Path(settings.UPLOAD_DIR) / ".healthcheck"
        test_file.parent.mkdir(exist_ok=True, parents=True)
        test_file.write_text("ok")
        test_file.unlink()
        components["filesystem"] = True
    except Exception as e:
        logger.error(f"Health FS check failed: {e}")
        
    # 3. OCR Check (Tesseract available)
    try:
        import subprocess
        result = subprocess.run([settings.TESSERACT_CMD, "--version"], capture_output=True, text=True, check=False)
        components["ocr"] = result.returncode == 0
    except Exception as e:
        logger.error(f"Health OCR check failed: {e}")

    # 4. ML Check (models exist)
    try:
        heart_model = Path(settings.TRAINED_MODELS_DIR) / "heart" / "model.joblib"
        components["ml_models"] = heart_model.exists()
    except Exception as e:
        logger.error(f"Health ML check failed: {e}")

    ready = all(components.values())
    
    response = {
        "status": "ready" if ready else "not_ready",
        "components": components,
        "version": "1.0.0",
        "environment": settings.APP_ENV
    }
    
    if not ready:
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail=response)
        
    return response
