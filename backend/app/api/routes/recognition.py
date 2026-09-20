from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.services.recognition_service import recognition_service
from app.schemas.recognition_schema import (
    RecognitionResponse,
    RecognitionHistoryResponse
)
from app.models.recognition_model import RecognitionLog


router = APIRouter(
    prefix="/api/reconocimiento",
    tags=["Reconocimiento"]
)


@router.post(
    "",
    response_model=RecognitionResponse
)
async def reconocer_rostro(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:

        # Leer los bytes de la imagen
        image_bytes = await file.read()

        if not image_bytes:
            raise HTTPException(
                status_code=400,
                detail="No se recibió ninguna imagen."
            )

        # Ejecutar reconocimiento facial
        resultado = recognition_service.recognize(
            image_bytes=image_bytes,
            db=db
        )

        return resultado

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Error durante el reconocimiento facial: {str(e)}"
        )


@router.get(
    "/historial",
    response_model=list[RecognitionHistoryResponse]
)
def historial_reconocimiento(
    db: Session = Depends(get_db)
):

    registros = (
        db.query(RecognitionLog)
        .order_by(RecognitionLog.created_at.desc())
        .all()
    )

    return registros