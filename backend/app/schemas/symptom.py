from pydantic import BaseModel, Field


class SymptomCheckRequest(BaseModel):
    text: str = Field(min_length=5, max_length=2000, description="Free-text symptom description")


class PossibleDisease(BaseModel):
    slug: str
    name: str
    category: str
    confidence: float
    matched_symptoms: list[str]
    overview: str | None = None
    recommended_tests: list[str] = []
    recommended_specialist: str | None = None


class SymptomCheckResponse(BaseModel):
    input_text: str
    detected_symptoms: list[str]
    possible_diseases: list[PossibleDisease]
    next_steps: list[str]
    disclaimer: str
