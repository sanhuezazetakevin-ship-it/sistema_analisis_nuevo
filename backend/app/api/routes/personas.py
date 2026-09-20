from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status
)

from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.persona_model import Persona
from app.models.face_embedding_model import FaceEmbedding
from app.schemas.persona_schema import (
    PersonaCreate,
    PersonaResponse
)
from app.services.face_service import face_service


router = APIRouter(
    prefix="/api/personas",
    tags=["Personas"]
)


@router.post(
    "/",
    response_model=PersonaResponse,
    status_code=status.HTTP_201_CREATED
)
def crear_persona(
    persona: PersonaCreate,
    db: Session = Depends(get_db)
):

    nueva_persona = Persona(
        nombre=persona.nombre,
        email=persona.email
    )

    db.add(nueva_persona)
    db.commit()
    db.refresh(nueva_persona)

    return nueva_persona


@router.post("/{persona_id}/rostro")
async def registrar_rostro(
    persona_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # Buscar persona
    persona = (
        db.query(Persona)
        .filter(Persona.id == persona_id)
        .first()
    )

    if persona is None:
        raise HTTPException(
            status_code=404,
            detail="Persona no encontrada"
        )

    # Leer imagen
    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="La imagen está vacía"
        )

    try:

        # Generar embedding
        embedding = face_service.process_image(
            image_bytes
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    # Convertir NumPy a lista de Python
    embedding_list = embedding.tolist()

    # Crear registro
    nuevo_embedding = FaceEmbedding(
        persona_id=persona_id,
        embedding=embedding_list,
        modelo="buffalo_l"
    )

    db.add(nuevo_embedding)
    db.commit()
    db.refresh(nuevo_embedding)

    return {
        "message": "Rostro registrado correctamente",
        "persona_id": persona_id,
        "embedding_id": nuevo_embedding.id,
        "modelo": nuevo_embedding.modelo,
        "dimension": len(embedding_list)
    }


@router.get(
    "/",
    response_model=list[PersonaResponse]
)
def listar_personas(
    db: Session = Depends(get_db)
):

    return db.query(Persona).all()