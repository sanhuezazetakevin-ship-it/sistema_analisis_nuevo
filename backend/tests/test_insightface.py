import cv2
import numpy as np
from insightface.app import FaceAnalysis


IMAGE_PATH = "tests/images/rostro_prueba.jpg"


print("Cargando modelo facial...")

app = FaceAnalysis(
    name="buffalo_l",
    providers=["CPUExecutionProvider"]
)

app.prepare(
    ctx_id=0,
    det_size=(640, 640)
)

print("Modelo cargado correctamente.")

# Leer imagen
image = cv2.imread(IMAGE_PATH)

if image is None:
    raise FileNotFoundError(
        f"No se pudo leer la imagen: {IMAGE_PATH}"
    )

print("Imagen cargada correctamente.")

# Detectar rostros
faces = app.get(image)

print(f"Rostros detectados: {len(faces)}")

if len(faces) == 0:
    raise RuntimeError(
        "No se detectó ningún rostro en la imagen."
    )

# Tomamos el primer rostro
face = faces[0]

# Obtener embedding
embedding = face.embedding

print("Embedding generado correctamente.")
print(f"Tipo: {type(embedding)}")
print(f"Dimensiones: {embedding.shape}")
print(f"Cantidad de valores: {len(embedding)}")

# Norma del embedding
norma = np.linalg.norm(embedding)

print(f"Norma del embedding: {norma:.6f}")