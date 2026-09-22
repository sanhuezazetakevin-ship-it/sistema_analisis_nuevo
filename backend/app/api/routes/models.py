from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.services.probability_service import probability_service

from app.core.security import require_role

from app.models.usuario_model import Usuario


router = APIRouter(
    prefix="/api/modelos",
    tags=["Modelos ML"]
)


@router.post("/entrenar")
def entrenar_modelo(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_role("admin"))
):
    try:
        resultado = probability_service.train(db)

        return {
            "success": True,
            "mensaje": "Modelo entrenado correctamente",
            **resultado
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.get("/metricas")
def obtener_metricas(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_role("admin"))
):
    try:
        return probability_service.get_metrics(db)

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )