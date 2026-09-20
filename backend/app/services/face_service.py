import cv2
import numpy as np

from app.services.embedding_service import embedding_service


class FaceService:

    def __init__(self):
        self.embedding_service = embedding_service

    def process_image(
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
                "No se pudo procesar la imagen."
            )

        embedding = (
            self.embedding_service
            .generate_embedding(image)
        )

        return embedding


face_service = FaceService()