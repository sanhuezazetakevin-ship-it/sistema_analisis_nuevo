from datetime import datetime

from pydantic import BaseModel


class MLTrainingRecordCreate(BaseModel):
    similitud: float
    calidad_imagen: float | None = None
    iluminacion: float | None = None
    resultado_real: bool


class MLTrainingRecordResponse(BaseModel):
    id: int
    similitud: float
    calidad_imagen: float | None
    iluminacion: float | None
    resultado_real: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

