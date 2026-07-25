from pydantic import BaseModel, Field


class MedicalProfileIn(BaseModel):
    age: int | None = Field(default=None, ge=1, le=120)
    gender: str | None = None
    height_cm: float | None = Field(default=None, ge=50, le=250)
    weight_kg: float | None = Field(default=None, ge=2, le=350)
    blood_group: str | None = None
    smoking: str | None = None
    alcohol: str | None = None
    physical_activity: str | None = None
    family_history: str | None = None
    existing_conditions: str | None = None


class MedicalProfileOut(MedicalProfileIn):
    id: str
    user_id: str
    bmi: float | None = None

    class Config:
        from_attributes = True
