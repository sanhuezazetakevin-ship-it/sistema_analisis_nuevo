from sqlalchemy.orm import Session

from app.models.persona_model import Persona
from app.models.face_embedding_model import FaceEmbedding
from app.models.recognition_model import RecognitionLog

from app.services.embedding_service import embedding_service
from app.services.probability_service import probability_service


# Umbral inicial.
# Posteriormente podremos ajustarlo mediante validación.
DEFAULT_THRESHOLD = 0.75


class RecognitionService:

    def recognize(
        self,
        image_bytes: bytes,
        db: Session
    ):

        # 1. Obtener embedding de la imagen recibida
        captured_embedding = (
            embedding_service.get_embedding(
                image_bytes
            )
        )

        if captured_embedding is None:
            raise ValueError(
                "No se pudo obtener un embedding facial."
            )

        # 2. Obtener embeddings registrados
        registered_embeddings = (
            db.query(
                FaceEmbedding,
                Persona
            )
            .join(
                Persona,
                Persona.id == FaceEmbedding.persona_id
            )
            .filter(
                Persona.activo == True
            )
            .all()
        )

        if not registered_embeddings:
            raise ValueError(
                "No existen rostros registrados."
            )

        # 3. Buscar la mayor similitud
        best_persona = None
        best_similarity = -1.0

        for face_embedding, persona in registered_embeddings:

            similarity = (
                embedding_service.cosine_similarity(
                    captured_embedding,
                    face_embedding.embedding
                )
            )

            if similarity > best_similarity:
                best_similarity = similarity
                best_persona = persona

        # 4. Calcular distancia
        distance = 1.0 - best_similarity

        # 5. Aplicar umbral
        coincide = (
            best_similarity >= DEFAULT_THRESHOLD
        )

        persona_id = (
            best_persona.id
            if coincide
            else None
        )

        nombre = (
            best_persona.nombre
            if coincide
            else None
        )

        # 6. Probabilidad calibrada
        probability = None

        if probability_service.trained:

            probability = (
                probability_service.predict(
                    similitud=best_similarity,
                    calidad_imagen=0.0,
                    iluminacion=0.0
                )
            )

        # 7. Guardar auditoría
        log = RecognitionLog(
            persona_id=persona_id,
            similitud=best_similarity,
            distancia=distance,
            umbral=DEFAULT_THRESHOLD,
            coincide=coincide,
            probabilidad_calibrada=probability
        )

        db.add(log)
        db.commit()
        db.refresh(log)

        # 8. Resultado
        return {
            "persona_id": persona_id,
            "nombre": nombre,
            "similitud": best_similarity,
            "distancia": distance,
            "umbral": DEFAULT_THRESHOLD,
            "coincide": coincide,
            "probabilidad_calibrada": probability
        }


recognition_service = RecognitionService()