from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base


class Persona(Base):
    __tablename__ = "personas"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    nombre: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
        index=True
    )

    activo: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    embeddings = relationship(
        "FaceEmbedding",
        back_populates="persona",
        cascade="all, delete-orphan"
    )

    recognition_logs = relationship(
        "RecognitionLog",
        back_populates="persona"
    )