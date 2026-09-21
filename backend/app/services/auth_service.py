from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.models.usuario_model import Usuario


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


class AuthService:

    def hash_password(self, password: str) -> str:
        return pwd_context.hash(password)

    def verify_password(
        self,
        password: str,
        password_hash: str
    ) -> bool:
        return pwd_context.verify(
            password,
            password_hash
        )

    def register_user(
        self,
        nombre: str,
        email: str,
        password: str,
        db: Session
    ):
        # Verificar si ya existe
        usuario_existente = (
            db.query(Usuario)
            .filter(Usuario.email == email)
            .first()
        )

        if usuario_existente:
            raise ValueError(
                "Ya existe un usuario con ese correo."
            )

        # Crear usuario
        nuevo_usuario = Usuario(
            nombre=nombre,
            email=email,
            password_hash=self.hash_password(password),
            rol="usuario",
            activo=True
        )

        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)

        return nuevo_usuario

    def login(
        self,
        email: str,
        password: str,
        db: Session
    ):
        usuario = (
            db.query(Usuario)
            .filter(Usuario.email == email)
            .first()
        )

        if usuario is None:
            raise ValueError(
                "Correo o contraseña incorrectos."
            )

        if not usuario.activo:
            raise ValueError(
                "El usuario está desactivado."
            )

        if not self.verify_password(
            password,
            usuario.password_hash
        ):
            raise ValueError(
                "Correo o contraseña incorrectos."
            )

        return usuario


auth_service = AuthService()