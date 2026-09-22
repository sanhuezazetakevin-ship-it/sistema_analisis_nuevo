from sqlalchemy.orm import Session

from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)

import os
import joblib

from app.models.ml_training_model import MLTrainingRecord


MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "ml_models",
    "probability_model.joblib"
)


class ProbabilityService:

    def __init__(self):
        self.model = None
        self.trained = False
        self.load_model()

    def get_training_data(self, db: Session):
        records = (
            db.query(MLTrainingRecord)
            .order_by(MLTrainingRecord.id.asc())
            .all()
        )

        if not records:
            raise ValueError(
                "No existen registros suficientes para entrenar."
            )

        X = []
        y = []

        for record in records:
            X.append([
                float(record.similitud),
                float(record.calidad_imagen or 0.0),
                float(record.iluminacion or 0.0)
            ])

            y.append(
                1 if record.resultado_real else 0
            )

        return X, y

    def train(self, db: Session):
        X, y = self.get_training_data(db)

        if len(set(y)) < 2:
            raise ValueError(
                "Se necesitan registros positivos y negativos "
                "para entrenar el modelo."
            )

        positivos = y.count(1)
        negativos = y.count(0)

        if positivos < 3 or negativos < 3:
            raise ValueError(
                "Se necesitan al menos 3 registros positivos "
                "y 3 registros negativos para entrenar el modelo."
            )

        base_model = make_pipeline(
            StandardScaler(),
            LogisticRegression(
                max_iter=1000
            )
        )

        self.model = CalibratedClassifierCV(
            base_model,
            method="sigmoid",
            cv=3
        )

        self.model.fit(X, y)

        self.save_model()
        self.trained = True

        return {
            "registros": len(X),
            "clases": {
                "negativos": y.count(0),
                "positivos": y.count(1)
            }
        }

    def predict(
        self,
        similitud: float,
        calidad_imagen: float,
        iluminacion: float
    ):
        if not self.trained or self.model is None:
            raise ValueError(
                "El modelo todavía no ha sido entrenado."
            )

        X = [[
            similitud,
            calidad_imagen,
            iluminacion
        ]]

        probability = self.model.predict_proba(X)[0][1]

        return float(probability)

    def get_metrics(self, db: Session):
        X, y = self.get_training_data(db)

        if len(set(y)) < 2:
            raise ValueError(
                "Se necesitan registros positivos y negativos."
            )

        if not self.trained or self.model is None:
            self.train(db)

        predictions = self.model.predict(X)

        tn, fp, fn, tp = confusion_matrix(
            y,
            predictions,
            labels=[0, 1]
        ).ravel()

        return {
            "registros": len(y),
            "total_muestras": len(y),

            "accuracy": float(
                accuracy_score(y, predictions)
            ),

            "precision": float(
                precision_score(
                    y,
                    predictions,
                    zero_division=0
                )
            ),

            "recall": float(
                recall_score(
                    y,
                    predictions,
                    zero_division=0
                )
            ),

            "f1": float(
                f1_score(
                    y,
                    predictions,
                    zero_division=0
                )
            ),

            "f1_score": float(
                f1_score(
                    y,
                    predictions,
                    zero_division=0
                )
            ),

            "falsos_positivos": int(fp),
            "falsos_negativos": int(fn),

            "matriz_confusion": {
                "verdaderos_negativos": int(tn),
                "falsos_positivos": int(fp),
                "falsos_negativos": int(fn),
                "verdaderos_positivos": int(tp)
            }
        }

    def save_model(self):
        if self.model is None:
            raise ValueError(
                "No existe un modelo entrenado."
            )

        os.makedirs(
            os.path.dirname(MODEL_PATH),
            exist_ok=True
        )

        joblib.dump(
            self.model,
            MODEL_PATH
        )

    def load_model(self):
        if not os.path.exists(MODEL_PATH):
            return False

        self.model = joblib.load(
            MODEL_PATH
        )

        self.trained = True

        return True


probability_service = ProbabilityService()