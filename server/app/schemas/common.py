from pydantic import BaseModel
from typing import Any, Optional, List


class PaginatedResponse(BaseModel):
    data: List[Any]
    total: int
    page: int
    limit: int
    total_pages: int


class MessageResponse(BaseModel):
    message: str
    success: bool = True


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
