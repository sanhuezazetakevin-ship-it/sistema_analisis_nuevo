from insightface.app import FaceAnalysis
import numpy as np
import cv2


class EmbeddingService:

    def __init__(self):

        print("Inicializando modelo facial ligero...")

        self.model = FaceAnalysis(
            name="buffalo_s",
            providers=["CPUExecutionProvider"]
        )

        self.model.prepare(
            ctx_id=-1,
            det_size=(320, 320)
        )

        print("Modelo facial cargado correctamente.")

    def generate_embedding(
        self,
        image: np.ndarray
    ) -> np.ndarray:

        faces = self.model.get(image)

        if not faces:
            raise ValueError(
                "No se detectó ningún rostro."
            )

        if len(faces) > 1:
            raise ValueError(
                "Se detectaron varios rostros. "
                "Debe existir un solo rostro."
            )

        embedding = faces[0].embedding

        return embedding.astype(np.float32)

    def get_embedding(
        self,
        image_bytes: bytes
    ) -> np.ndarray:

        image_array = np.frombuffer(
            image_bytes,
            dtype=np.uint8
        )

        image = cv2.imdecode(
            image_array,
            cv2.IMREAD_COLOR
        )

        if image is None:
            raise ValueError(
                "No se pudo leer la imagen recibida."
            )

        return self.generate_embedding(image)

    def cosine_similarity(
        self,
        embedding1: np.ndarray,
        embedding2: np.ndarray
    ) -> float:

        embedding1 = np.asarray(
            embedding1,
            dtype=np.float32
        )

        embedding2 = np.asarray(
            embedding2,
            dtype=np.float32
        )

        norm1 = np.linalg.norm(embedding1)
        norm2 = np.linalg.norm(embedding2)

        if norm1 == 0 or norm2 == 0:
            return 0.0

        similarity = np.dot(
            embedding1,
            embedding2
        ) / (norm1 * norm2)

        return float(similarity)


embedding_service = EmbeddingService()