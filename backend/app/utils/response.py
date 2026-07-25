"""Standard envelope for all successful API responses (errors go through core.exceptions handlers)."""
from typing import Any
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse


def success_response(data: Any = None, message: str = "Success", status_code: int = 200) -> JSONResponse:
    content = {"success": True, "message": message, "data": jsonable_encoder(data)}
    return JSONResponse(status_code=status_code, content=content)
