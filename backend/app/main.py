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

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.core.exceptions import register_exception_handlers
from app.core.startup import run_startup_tasks
from app.middleware.cors import add_cors_middleware
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.request_logger import RequestLoggerMiddleware
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
app.add_middleware(RateLimitMiddleware)
add_cors_middleware(app)  # added last → runs first

register_exception_handlers(app)

# ---- static file mounts ----
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# ---- routers ----
app.include_router(api_router)


@app.get("/", tags=["Health"])
def root():
    return {"success": True, "message": f"{settings.APP_NAME} API is running.", "docs": "/api/docs"}


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
