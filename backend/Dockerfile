FROM python:3.10-slim

WORKDIR /app

# Instalar las dependencias de sistema necesarias para OpenCV y el reconocimiento facial
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    libxcb1 \
    && rm -rf /var/lib/apt/lists/*

# Copiar e instalar las librerías limpias
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiar el código del backend
COPY . .

# Comando de arranque para Railway usando el puerto dinámico
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}