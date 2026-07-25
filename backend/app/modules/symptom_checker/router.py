from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.database.models.user import User
from app.schemas.symptom import SymptomCheckRequest
from app.modules.symptom_checker import controller
from app.modules.symptom_checker.validators import assert_meaningful_text
from app.utils.response import success_response

router = APIRouter(prefix="/symptom-checker", tags=["AI Symptom Analyzer"])


@router.post("/analyze")
def analyze_symptoms(payload: SymptomCheckRequest, db: Session = Depends(get_db),
                      user: User = Depends(get_current_user)):
    assert_meaningful_text(payload.text)
    result = controller.handle_check(db, user, payload.text)
    return success_response(result, "Symptom analysis complete.")
