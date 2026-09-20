from datetime import datetime

from pydantic import BaseModel


class RecognitionResponse(BaseModel):
    persona_id: int | None = None
    nombre: str | None = None

    similitud: float
    distancia: float
    umbral: float
    coincide: bool

    probabilidad_calibrada: float | None = None


class RecognitionHistoryResponse(BaseModel):
    id: int
    persona_id: int | None = None
    similitud: float
    distancia: float
    umbral: float
    coincide: bool
    probabilidad_calibrada: float | None = None
    created_at: datetime

    class Config:
        from_attributes = True