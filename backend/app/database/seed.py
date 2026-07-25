"""Idempotent seed data: disease reference rows (from config.json files) + a default admin user."""
from app.core.config import settings
from app.core.logging import get_logger
from app.core.security import hash_password
from app.database.database import SessionLocal
from app.database.models.disease import Disease
from app.database.models.user import User
from app.ml.registry.model_registry import list_disease_slugs
from app.ml.registry.model_loader import load_disease_config
from app.ml.evaluation.evaluator import get_model_metadata

logger = get_logger(__name__)

DEFAULT_ADMIN_EMAIL = "admin@precisionhealth.ai"
DEFAULT_ADMIN_PASSWORD = "Admin@12345"   # CHANGE after first login in any real deployment


def seed_diseases(db) -> None:
    for slug in list_disease_slugs():
        cfg = load_disease_config(slug)
        meta = get_model_metadata(slug)
        existing = db.query(Disease).filter(Disease.slug == slug).first()
        values = dict(
            slug=slug, name=cfg["name"], category=cfg["category"], icon=cfg.get("icon"),
            short_description=cfg.get("short_description"), overview=cfg.get("overview"),
            risk_factors=cfg.get("risk_factors", []), common_symptoms=cfg.get("common_symptoms", []),
            recommended_tests=cfg.get("recommended_tests", []),
            recommended_specialist=cfg.get("recommended_specialist"),
            feature_schema=cfg.get("feature_schema", []),
            model_algorithm=cfg.get("algorithm"),
            model_accuracy=meta["metrics"]["accuracy"] if meta else None,
            model_version=meta.get("model_version") if meta else None,
            data_source=cfg.get("data_source"),
        )
        if existing:
            for k, v in values.items():
                setattr(existing, k, v)
        else:
            db.add(Disease(**values))
    db.commit()


def seed_admin(db) -> None:
    existing = db.query(User).filter(User.email == DEFAULT_ADMIN_EMAIL).first()
    if existing:
        return
    admin = User(
        full_name="Platform Administrator", email=DEFAULT_ADMIN_EMAIL,
        password_hash=hash_password(DEFAULT_ADMIN_PASSWORD), role="admin",
        is_active=True, is_email_verified=True,
    )
    db.add(admin)
    db.commit()
    logger.info(f"Seeded default admin account: {DEFAULT_ADMIN_EMAIL} / {DEFAULT_ADMIN_PASSWORD} (change this password!)")


def seed_all() -> None:
    db = SessionLocal()
    try:
        seed_diseases(db)
        seed_admin(db)
    finally:
        db.close()


if __name__ == "__main__":
    from app.database.init_db import init_db
    init_db()
    seed_all()
