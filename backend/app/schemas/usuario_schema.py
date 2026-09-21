from datetime import datetime
from pydantic import BaseModel, EmailStr


class UsuarioCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UsuarioLogin(BaseModel):
    email: EmailStr
    password: str


class UsuarioResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    activo: bool
    created_at: datetime

    class Config:
        from_attributes = True