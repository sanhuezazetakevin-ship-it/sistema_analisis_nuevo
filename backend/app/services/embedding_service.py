from insightface.app import FaceAnalysis
import numpy as np
import cv2


class EmbeddingService:

    def __init__(self):

        print("========================================")
        print("Inicializando modelo facial...")
        print("Modelo: buffalo_s")
        print("Proveedor: CPU")
        print("========================================")

        self.model = FaceAnalysis(
            name="buffalo_s",
            providers=["CPUExecutionProvider"]
        )

        # Menor resolución = menor consumo de memoria
        self.model.prepare(
            ctx_id=-1,
            det_size=(320, 320)
        )

        print("========================================")
        print("Modelo facial cargado correctamente.")
        print("========================================")

    def generate_embedding(
        self,
        image: np.ndarray
    ) -> np.ndarray:

        if image is None:
            raise ValueError(
                "La imagen recibida es inválida."
            )

        # Reducir imágenes demasiado grandes
        max_size = 640

        height, width = image.shape[:2]

        if max(height, width) > max_size:

            scale = max_size / max(height, width)

            new_width = int(width * scale)
            new_height = int(height * scale)

            image = cv2.resize(
                image,
                (new_width, new_height),
                interpolation=cv2.INTER_AREA
            )

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

        if not image_bytes:
            raise ValueError(
                "No se recibió ninguna imagen."
            )

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


# Instancia única del servicio
embedding_service = EmbeddingService()