from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.ml_schema import (
    ProbabilityPredictionRequest,
    ProbabilityPredictionResponse
)
from app.services.probability_service import probability_service


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
    db: Session = Depends(get_db)
):
    try:
        probabilidad = probability_service.predict(
            similitud=data.similitud,
            calidad_imagen=data.calidad_imagen or 0.0,
            iluminacion=data.iluminacion or 0.0
        )

        distancia = 1.0 - data.similitud

        return {
            "probabilidad": probabilidad,
            "similitud": data.similitud,
            "distancia": distancia
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )