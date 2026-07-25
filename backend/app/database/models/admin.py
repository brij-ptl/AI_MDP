from sqlalchemy import Column, String, JSON, ForeignKey

from app.database.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class AdminLog(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Audit trail for administrative actions."""
    __tablename__ = "admin_logs"

    admin_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    action = Column(String(100), nullable=False)        # e.g. "USER_SUSPENDED", "MODEL_RETRAINED"
    target_type = Column(String(50), nullable=True)      # "user" | "disease" | "payment" ...
    target_id = Column(String(36), nullable=True)
    metadata_json = Column(JSON, nullable=True)
    ip_address = Column(String(50), nullable=True)
