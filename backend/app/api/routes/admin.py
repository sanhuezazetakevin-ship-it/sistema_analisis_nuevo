from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import require_role
from app.database.connection import get_db
from app.models.usuario_model import Usuario


router = APIRouter(
    prefix="/api/admin",
    tags=["Administración"]
)


@router.get("/prueba")
def prueba_admin(
    current_user: Usuario = Depends(
        require_role("admin")
    )
):
    return {
        "success": True,
        "mensaje": "Acceso autorizado",
        "usuario": current_user.nombre,
        "rol": current_user.rol
    }


@router.put("/usuarios/{usuario_id}/rol")
def cambiar_rol(
    usuario_id: int,
    nuevo_rol: str,
    current_user: Usuario = Depends(
        require_role("admin")
    ),
    db: Session = Depends(get_db)
):
    roles_permitidos = ["usuario", "admin"]

    if nuevo_rol not in roles_permitidos:
        raise HTTPException(
            status_code=400,
            detail="Rol no válido. Use 'usuario' o 'admin'."
        )

    usuario = (
        db.query(Usuario)
        .filter(Usuario.id == usuario_id)
        .first()
    )

    if usuario is None:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    usuario.rol = nuevo_rol

    db.commit()
    db.refresh(usuario)

    return {
        "success": True,
        "mensaje": "Rol actualizado correctamente",
        "usuario": {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email,
            "rol": usuario.rol,
            "activo": usuario.activo
        }
    }


@router.put("/usuarios/{usuario_id}/estado")
def cambiar_estado_usuario(
    usuario_id: int,
    activo: bool,
    current_user: Usuario = Depends(
        require_role("admin")
    ),
    db: Session = Depends(get_db)
):
    usuario = (
        db.query(Usuario)
        .filter(Usuario.id == usuario_id)
        .first()
    )

    if usuario is None:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    usuario.activo = activo

    db.commit()
    db.refresh(usuario)

    return {
        "success": True,
        "mensaje": (
            "Usuario activado correctamente"
            if activo
            else "Usuario desactivado correctamente"
        ),
        "usuario": {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email,
            "rol": usuario.rol,
            "activo": usuario.activo
        }
    }
@router.get("/usuarios")
def listar_usuarios(
    current_user: Usuario = Depends(
        require_role("admin")
    ),
    db: Session = Depends(get_db)
):
    usuarios = (
        db.query(Usuario)
        .order_by(Usuario.id.asc())
        .all()
    )

    return {
        "success": True,
        "total": len(usuarios),
        "usuarios": [
            {
                "id": usuario.id,
                "nombre": usuario.nombre,
                "email": usuario.email,
                "rol": usuario.rol,
                "activo": usuario.activo,
                "created_at": usuario.created_at
            }
            for usuario in usuarios
        ]
    }
@router.get("/usuarios/{usuario_id}")
def obtener_usuario(
    usuario_id: int,
    current_user: Usuario = Depends(
        require_role("admin")
    ),
    db: Session = Depends(get_db)
):
    usuario = (
        db.query(Usuario)
        .filter(Usuario.id == usuario_id)
        .first()
    )

    if usuario is None:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    return {
        "success": True,
        "usuario": {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email,
            "rol": usuario.rol,
            "activo": usuario.activo,
            "created_at": usuario.created_at
        }
    }