from pydantic import BaseModel, Field


class ProbabilityPredictionRequest(BaseModel):

    similitud: float = Field(
        ...,
        ge=0.0,
        le=1.0
    )

    calidad_imagen: float = Field(
        0.0,
        ge=0.0,
        le=1.0
    )

    iluminacion: float = Field(
        0.0,
        ge=0.0,
        le=1.0
    )


class ProbabilityPredictionResponse(BaseModel):

    probabilidad_calibrada: float
    modelo_entrenado: bool