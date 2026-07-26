"""Creates all tables. Called once at application startup."""
from app.core.logging import get_logger
from sqlalchemy import inspect, text
from app.database.database import engine
from app.database.base import Base
from app.database import models  # noqa: F401  (registers all models on Base.metadata)

logger = get_logger(__name__)


def init_db() -> None:
    logger.info("Creating database tables (if not present)...")
    Base.metadata.create_all(bind=engine)
    # Lightweight, idempotent compatibility migration for deployments created
    # before prediction tokens were introduced.
    columns = {column["name"] for column in inspect(engine).get_columns("users")}
    if "prediction_tokens" not in columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE users ADD COLUMN prediction_tokens INTEGER NOT NULL DEFAULT 0"))
    logger.info("Database ready.")
