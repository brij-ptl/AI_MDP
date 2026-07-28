"""Centralized logging configuration."""
import logging
import sys
import json
from logging.handlers import RotatingFileHandler
from pathlib import Path
from datetime import datetime
from typing import Any

LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

# Sensitive fields that must be masked
SENSITIVE_KEYS = {
    "password", "password_confirm", "new_password", "current_password",
    "token", "access_token", "refresh_token", "jwt",
    "razorpay_key_secret", "razorpay_webhook_secret",
    "rzp_test", "rzp_live",
    "api_key", "secret", "cookie", "cookies"
}

def sanitize_value(key: str, value: Any) -> Any:
    key_lower = str(key).lower()
    if any(sensitive in key_lower for sensitive in SENSITIVE_KEYS):
        return "***MASKED***"
    
    # Also mask strings that look like JWTs (eyJ...) or Razorpay secrets (rzp_...)
    if isinstance(value, str):
        if value.startswith("eyJ") and len(value) > 20:
            return "***JWT_MASKED***"
        if value.startswith("rzp_"):
            return "***RZP_MASKED***"
    
    return value

def sanitize_dict(d: dict) -> dict:
    return {k: sanitize_value(k, v) if not isinstance(v, dict) else sanitize_dict(v) for k, v in d.items()}

class ProductionJSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_obj = {
            "timestamp": datetime.fromtimestamp(record.created).isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": sanitize_value("msg", record.getMessage()),
        }
        
        # Add extra fields (e.g. from request_logger)
        if hasattr(record, "request_id"):
            log_obj["request_id"] = record.request_id
        if hasattr(record, "client_ip"):
            log_obj["client_ip"] = record.client_ip
            
        # Optional exception info, but the prompt says: "No stack traces."
        # We will suppress traceback output in JSON to prevent leakage
        if record.exc_info:
            log_obj["exception"] = str(record.exc_info[1]) # Only log the exception message, not trace
            
        return json.dumps(sanitize_dict(log_obj))

class DevelopmentConsoleFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        msg = super().format(record)
        return sanitize_value("msg", msg)

def create_rotating_handler(filename: str, formatter: logging.Formatter, level: int = logging.INFO) -> RotatingFileHandler:
    handler = RotatingFileHandler(LOG_DIR / filename, maxBytes=10_000_000, backupCount=5)
    handler.setFormatter(formatter)
    handler.setLevel(level)
    return handler

def setup_logging(debug: bool = True) -> None:
    level = logging.DEBUG if debug else logging.INFO
    
    json_formatter = ProductionJSONFormatter()
    console_formatter = DevelopmentConsoleFormatter("%(asctime)s | %(levelname)-8s | %(name)s | %(message)s") if debug else json_formatter

    # Root Logger
    root = logging.getLogger()
    root.setLevel(level)
    root.handlers.clear()

    # Console
    console = logging.StreamHandler(sys.stdout)
    console.setFormatter(console_formatter)
    root.addHandler(console)

    # Global Error Log
    error_handler = create_rotating_handler("error.log", json_formatter, logging.WARNING)
    root.addHandler(error_handler)

    # General App Log (Catches everything else)
    app_handler = create_rotating_handler("app.log", json_formatter, level)
    root.addHandler(app_handler)

    def setup_domain_logger(name: str, filename: str):
        logger = logging.getLogger(name)
        logger.addHandler(create_rotating_handler(filename, json_formatter, level))
        # Keep propagation True so it hits console and error.log

    setup_domain_logger("access", "access.log")
    setup_domain_logger("app.modules.auth", "auth.log")
    setup_domain_logger("app.modules.payment", "payment.log")
    setup_domain_logger("app.modules.ocr", "ocr.log")
    setup_domain_logger("app.modules.admin", "admin.log")
    setup_domain_logger("startup", "startup.log")

    # Quiet noisy third-party loggers
    logging.getLogger("passlib").setLevel(logging.ERROR)
    logging.getLogger("python_multipart").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)

def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
