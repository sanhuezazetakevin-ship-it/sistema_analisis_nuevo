from fastapi import APIRouter, Depends, status

from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.schemas.ml_schema import (
    MLTrainingRecordCreate,
    MLTrainingRecordResponse
)

from app.services.ml_training_service import (
    ml_training_service
)

from app.core.security import require_role
from app.models.usuario_model import Usuario


router = APIRouter(
    prefix="/api/ml",
    tags=["Machine Learning"]
)


@router.post(
    "/registros",
    response_model=MLTrainingRecordResponse,
    status_code=status.HTTP_201_CREATED
)
def crear_registro_ml(
    data: MLTrainingRecordCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_role("admin"))
):

    return ml_training_service.create_record(
        data=data,
        db=db
    )