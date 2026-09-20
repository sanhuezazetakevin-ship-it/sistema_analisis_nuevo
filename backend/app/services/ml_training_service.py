from sqlalchemy.orm import Session

from app.models.ml_training_model import MLTrainingRecord
from app.schemas.ml_schema import MLTrainingRecordCreate


class MLTrainingService:

    def create_record(
        self,
        data: MLTrainingRecordCreate,
        db: Session
    ):
        record = MLTrainingRecord(
            similitud=data.similitud,
            calidad_imagen=data.calidad_imagen,
            iluminacion=data.iluminacion,
            resultado_real=data.resultado_real
        )

        db.add(record)
        db.commit()

        return record


ml_training_service = MLTrainingService()