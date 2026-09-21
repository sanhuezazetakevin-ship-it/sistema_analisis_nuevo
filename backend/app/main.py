from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database.connection import Base, engine
from app.api.routes.personas import router as personas_router
from app.api.routes.recognition import router as recognition_router
from app.api.routes.ml import router as ml_router
from app.api.routes.models import router as models_router
from app.api.routes.probabilities import router as probabilities_router
from app.api.routes.auth import router as auth_router
from app.api.routes.admin import router as admin_router

from app.models import (
    Persona,
    FaceEmbedding,
    RecognitionLog,
    MLTrainingRecord,
)


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)
app.include_router(personas_router)
app.include_router(recognition_router)
app.include_router(ml_router)
app.include_router(models_router)
app.include_router(probabilities_router)
app.include_router(auth_router)
app.include_router(admin_router)

origins = [
    origin.strip()
    for origin in settings.CORS_ORIGINS.split(",")
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Backend del Sistema Inteligente de Reconocimiento Facial",
        "version": settings.APP_VERSION
    }