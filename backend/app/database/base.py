"""Declarative base + shared mixins for all ORM models."""
import uuid
from datetime import datetime

from sqlalchemy.orm import declarative_base, declared_attr
from sqlalchemy import Column, String, DateTime

Base = declarative_base()


def generate_uuid() -> str:
    return str(uuid.uuid4())


class TimestampMixin:
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class UUIDPrimaryKeyMixin:
    @declared_attr
    def id(cls):
        return Column(String(36), primary_key=True, default=generate_uuid)
