from pathlib import Path

from app.services.face_service import face_service


IMAGE_PATH = Path(
    "tests/images/rostro_prueba.jpg"
)


with open(IMAGE_PATH, "rb") as file:
    image_bytes = file.read()


embedding = face_service.process_image(
    image_bytes
)


print("Procesamiento correcto.")
print("Tipo:", type(embedding))
print("Dimensiones:", embedding.shape)
print("Cantidad de valores:", len(embedding))