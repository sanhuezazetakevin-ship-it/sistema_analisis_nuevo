from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base


class FaceEmbedding(Base):
    __tablename__ = "face_embeddings"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    persona_id: Mapped[int] = mapped_column(
        ForeignKey("personas.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    embedding: Mapped[list[float]] = mapped_column(
        ARRAY(Float),
        nullable=False
    )

    modelo: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    persona = relationship(
        "Persona",
        back_populates="embeddings"
    )