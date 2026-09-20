from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, Integer

from app.database.connection import Base


class MLTrainingRecord(Base):
    __tablename__ = "ml_training_records"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    similitud = Column(
        Float,
        nullable=False
    )

    calidad_imagen = Column(
        Float,
        nullable=True
    )

    iluminacion = Column(
        Float,
        nullable=True
    )

    resultado_real = Column(
        Boolean,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )