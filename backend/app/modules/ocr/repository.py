from sqlalchemy.orm import Session
from app.database.models.prediction import OcrDocument


def create_document(db: Session, **kwargs) -> OcrDocument:
    doc = OcrDocument(**kwargs)
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


def get_by_id(db: Session, doc_id: str, user_id: str) -> OcrDocument | None:
    return db.query(OcrDocument).filter(OcrDocument.id == doc_id, OcrDocument.user_id == user_id).first()
