from app.core.exceptions import NotFoundException, ValidationException


class DiseaseNotFoundException(NotFoundException):
    def __init__(self, slug: str):
        super().__init__(f"Unknown disease module '{slug}'.", error_code="DISEASE_NOT_FOUND")


class InvalidFeaturesException(ValidationException):
    def __init__(self, detail: str):
        super().__init__(f"Invalid prediction input: {detail}", error_code="INVALID_FEATURES")
