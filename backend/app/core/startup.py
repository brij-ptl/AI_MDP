"""Runs once when the FastAPI app starts: creates tables, seeds reference data."""
from app.core.logging import get_logger
from app.database.init_db import init_db
from app.database.seed import seed_all

logger = get_logger(__name__)


def run_startup_tasks() -> None:
    init_db()
    seed_all()
    logger.info("Startup tasks complete.")
