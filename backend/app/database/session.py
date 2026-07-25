"""Per-request DB session dependency for FastAPI."""
from typing import Generator

from app.database.database import SessionLocal


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
