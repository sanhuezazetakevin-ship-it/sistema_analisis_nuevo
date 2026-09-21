import type { Persona, RecognitionLog, MLMetrics, CalibrationPoint } from '../types/facial';

export const INITIAL_PERSONAS: Persona[] = [
  {
    id: 1,
    nombre: "Carlos Mendoza",
    email: "carlos.mendoza@empresa.com",
    activo: true,
    foto_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-03-01T10:15:00Z",
    total_embeddings: 3
  },
  {
    id: 2,
    nombre: "Valeria Ríos",
    email: "valeria.rios@empresa.com",
    activo: true,
    foto_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-03-02T11:20:00Z",
    total_embeddings: 4
  },
  {
    id: 3,
    nombre: "Diego Salazar",
    email: "diego.salazar@empresa.com",
    activo: true,
    foto_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-03-05T09:40:00Z",
    total_embeddings: 2
  },
  {
    id: 4,
    nombre: "Mariana Huamán",
    email: "mariana.huaman@empresa.com",
    activo: true,
    foto_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-03-10T14:30:00Z",
    total_embeddings: 3
  },
  {
    id: 5,
    nombre: "Andrés Quispe",
    email: "andres.quispe@empresa.com",
    activo: false,
    foto_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-03-12T16:05:00Z",
    total_embeddings: 1
  }
];

export const INITIAL_LOGS: RecognitionLog[] = [
  {
    id: 101,
    persona_id: 1,
    persona_nombre: "Carlos Mendoza",
    similitud: 0.89,
    distancia: 0.22,
    umbral: 0.75,
    coincide: true,
    probabilidad_calibrada: 0.94,
    calidad_imagen: "Alta",
    iluminacion: "Alta",
    created_at: "2026-03-17T08:10:20Z"
  },
  {
    id: 102,
    persona_id: 2,
    persona_nombre: "Valeria Ríos",
    similitud: 0.92,
    distancia: 0.16,
    umbral: 0.75,
    coincide: true,
    probabilidad_calibrada: 0.97,
    calidad_imagen: "Buena",
    iluminacion: "Media",
    created_at: "2026-03-17T08:14:55Z"
  },
  {
    id: 103,
    persona_id: null,
    persona_nombre: "No identificado (Desconocido)",
    similitud: 0.54,
    distancia: 0.46,
    umbral: 0.75,
    coincide: false,
    probabilidad_calibrada: 0.18,
    calidad_imagen: "Media",
    iluminacion: "Baja",
    created_at: "2026-03-17T08:18:12Z"
  },
  {
    id: 104,
    persona_id: 3,
    persona_nombre: "Diego Salazar",
    similitud: 0.78,
    distancia: 0.31,
    umbral: 0.75,
    coincide: true,
    probabilidad_calibrada: 0.83,
    calidad_imagen: "Buena",
    iluminacion: "Media",
    created_at: "2026-03-17T08:21:04Z"
  },
  {
    id: 105,
    persona_id: 4,
    persona_nombre: "Mariana Huamán",
    similitud: 0.72,
    distancia: 0.37,
    umbral: 0.75,
    coincide: false,
    probabilidad_calibrada: 0.65,
    calidad_imagen: "Baja",
    iluminacion: "Baja",
    created_at: "2026-03-17T08:23:40Z"
  }
];

export const MOCK_ML_METRICS: MLMetrics = {
  precision: 0.952,
  recall: 0.938,
  f1_score: 0.945,
  accuracy: 0.961,
  roc_auc: 0.984,
  falsos_positivos: 12,
  falsos_negativos: 15,
  total_muestras: 680,
  modelo_tipo: "LogisticRegression",
  matriz_confusion: {
    verdaderos_positivos: 310,
    falsos_positivos: 12,
    verdaderos_negativos: 343,
    falsos_negativos: 15
  }
};

// Generación de curva de calibración de similitud vs probabilidad calibrada
export const CALIBRATION_DATA: CalibrationPoint[] = [
  { similitud: 0.40, probabilidad: 0.05, umbral: 0.75, decision: "Rechazado" },
  { similitud: 0.50, probabilidad: 0.12, umbral: 0.75, decision: "Rechazado" },
  { similitud: 0.60, probabilidad: 0.28, umbral: 0.75, decision: "Rechazado" },
  { similitud: 0.68, probabilidad: 0.48, umbral: 0.75, decision: "Zona Gris" },
  { similitud: 0.75, probabilidad: 0.72, umbral: 0.75, decision: "Aceptado (Umbral)" },
  { similitud: 0.80, probabilidad: 0.85, umbral: 0.75, decision: "Aceptado" },
  { similitud: 0.85, probabilidad: 0.92, umbral: 0.75, decision: "Aceptado" },
  { similitud: 0.90, probabilidad: 0.96, umbral: 0.75, decision: "Aceptado" },
  { similitud: 0.95, probabilidad: 0.99, umbral: 0.75, decision: "Aceptado" }
];

export const INITIAL_USUARIOS = [
  { id: 1, nombre: "Kevin Sanhueza", email: "kevin@example.com", rol: "admin", activo: true, created_at: "2026-03-01T08:00:00Z" },
  { id: 2, nombre: "Ana Martínez", email: "ana.martinez@biometricai.lab", rol: "admin", activo: true, created_at: "2026-03-02T09:30:00Z" },
  { id: 3, nombre: "Luis Ramírez", email: "luis.ramirez@biometricai.lab", rol: "usuario", activo: true, created_at: "2026-03-05T11:15:00Z" },
  { id: 4, nombre: "Sofía Castro", email: "sofia.castro@biometricai.lab", rol: "usuario", activo: false, created_at: "2026-03-10T14:20:00Z" }
];

