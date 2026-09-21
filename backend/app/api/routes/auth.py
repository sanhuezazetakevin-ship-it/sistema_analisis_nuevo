from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.auth_schema import (
    LoginResponse,
    RegisterRequest,
    UserResponse
)
from app.services.auth_service import auth_service
from app.core.security import create_access_token, get_current_user
from app.models.usuario_model import Usuario


router = APIRouter(
    prefix="/api/auth",
    tags=["Autenticación"]
)


@router.post(
    "/login",
    response_model=LoginResponse
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    try:

        usuario = auth_service.login(
            email=form_data.username,
            password=form_data.password,
            db=db
        )

        access_token = create_access_token(
            data={
                "sub": str(usuario.id),
                "rol": usuario.rol
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "success": True,
            "mensaje": "Inicio de sesión exitoso",
            "usuario": {
                "id": usuario.id,
                "nombre": usuario.nombre,
                "email": usuario.email,
                "rol": usuario.rol,
                "activo": usuario.activo,
                "created_at": usuario.created_at
            }
        }

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(error)
        )


@router.post(
    "/registro",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def registrar_usuario(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):

    try:

        usuario = auth_service.register_user(
            nombre=data.nombre,
            email=data.email,
            password=data.password,
            db=db
        )

        return usuario

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )


@router.get("/me")
def obtener_usuario_actual(
    current_user: Usuario = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "nombre": current_user.nombre,
        "email": current_user.email,
        "rol": current_user.rol,
        "activo": current_user.activo
    }