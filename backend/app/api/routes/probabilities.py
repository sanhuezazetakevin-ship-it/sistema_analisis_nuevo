from fastapi import APIRouter, Depends, HTTPException

from app.schemas.probability_schema import (
    ProbabilityPredictionRequest,
    ProbabilityPredictionResponse
)

from app.services.probability_service import probability_service

from app.core.security import get_current_user
from app.models.usuario_model import Usuario


router = APIRouter(
    prefix="/api/probabilidades",
    tags=["Probabilidades"]
)


@router.post(
    "/prediccion",
    response_model=ProbabilityPredictionResponse
)
def predecir_probabilidad(
    data: ProbabilityPredictionRequest,
    current_user: Usuario = Depends(get_current_user)
):
    try:
        probabilidad = probability_service.predict(
            similitud=data.similitud,
            calidad_imagen=data.calidad_imagen,
            iluminacion=data.iluminacion
        )

        return {
            "probabilidad_calibrada": probabilidad,
            "modelo_entrenado": probability_service.trained
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )