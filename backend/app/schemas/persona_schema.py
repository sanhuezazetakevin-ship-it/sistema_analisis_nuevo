from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict


class PersonaCreate(BaseModel):
    nombre: str
    email: EmailStr


class PersonaResponse(BaseModel):
    id: int
    nombre: str
    email: str
    activo: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)