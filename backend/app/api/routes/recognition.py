from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Form

from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.services.recognition_service import (
    recognition_service,
    DEFAULT_THRESHOLD
)

from app.schemas.recognition_schema import (
    RecognitionResponse,
    RecognitionHistoryResponse
)

from app.models.recognition_model import RecognitionLog

from app.core.security import get_current_user, require_role

from app.models.usuario_model import Usuario


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
    threshold: float = Form(DEFAULT_THRESHOLD),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:

        if threshold < 0.50 or threshold > 0.95:
            raise HTTPException(
                status_code=400,
                detail="El umbral debe estar entre 0.50 y 0.95."
            )

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
            db=db,
            threshold=threshold
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
    current_user: Usuario = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):

    registros = (
        db.query(RecognitionLog)
        .order_by(RecognitionLog.created_at.desc())
        .all()
    )

    return registros