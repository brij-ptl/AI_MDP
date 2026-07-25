"""
Central application configuration.
All values are overridable via environment variables / .env file.
"""
from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # ---- App ----
    APP_NAME: str = "AI Precision Healthcare Platform"
    APP_ENV: str = "development"          # development | staging | production
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # ---- Server ----
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # ---- Database ----
    # Defaults to local SQLite so the project runs out-of-the-box.
    # Point DATABASE_URL at MySQL in production, e.g.
    # mysql+pymysql://user:pass@host:3306/healthcare_db
    DATABASE_URL: str = "sqlite:///./app/database/healthcare.db"

    # ---- Security / JWT ----
    JWT_SECRET_KEY: str = "CHANGE_THIS_SECRET_IN_PRODUCTION_ENV_FILE"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    COOKIE_NAME: str = "access_token"
    REFRESH_COOKIE_NAME: str = "refresh_token"
    TRACKING_COOKIE_NAME: str = "phc_tracking_id"
    COOKIE_SECURE: bool = False        # set True behind HTTPS in production
    COOKIE_SAMESITE: str = "lax"

    # ---- CORS ----
    CORS_ORIGINS: List[str] = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:7000",
    "http://127.0.0.1:7000",
]

    # ---- Business rules ----
    FREE_PREDICTIONS_LIMIT: int = 2
    FREE_SYMPTOM_CHECKS_LIMIT: int = 2

    # ---- Payment (Razorpay) ----
    RAZORPAY_KEY_ID: str = "rzp_test_xxxxxxxxxxxx"
    RAZORPAY_KEY_SECRET: str = "CHANGE_ME"
    RAZORPAY_WEBHOOK_SECRET: str = "CHANGE_ME"
    PREMIUM_MONTHLY_PRICE_INR: int = 49900     # in paise -> ₹499
    PREMIUM_YEARLY_PRICE_INR: int = 399900     # ₹3999

    # ---- Email (SMTP) ----
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = "no-reply@precisionhealth.ai"
    EMAIL_ENABLED: bool = False        # if False, emails are logged instead of sent

    # ---- File storage ----
    UPLOAD_DIR: str = "app/uploads"
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_UPLOAD_EXTENSIONS: List[str] = [".pdf", ".png", ".jpg", ".jpeg"]
    GENERATED_REPORTS_DIR: str = "app/static/generated_reports"

    # ---- ML ----
    TRAINED_MODELS_DIR: str = "trained_models"
    DATASETS_DIR: str = "datasets"
    ML_CONFIG_DIR: str = "app/ml/diseases"

    # ---- Rate limiting ----
    RATE_LIMIT_PER_MINUTE: int = 60

    # ---- OCR ----
    TESSERACT_CMD: str = "tesseract"   # override if tesseract binary is elsewhere


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
