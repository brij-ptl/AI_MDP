"""Creates all tables. Called once at application startup."""
from app.core.logging import get_logger
from app.database.database import engine
from app.database.base import Base
from app.database import models  # noqa: F401  (registers all models on Base.metadata)

logger = get_logger(__name__)


def init_db() -> None:
    logger.info("Creating database tables (if not present)...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database ready.")
