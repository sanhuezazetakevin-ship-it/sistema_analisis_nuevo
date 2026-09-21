export interface Persona {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
  foto_url?: string;
  created_at: string;
  total_embeddings?: number;
}

export interface FaceEmbedding {
  id: number;
  persona_id: number;
  embedding: number[];
  modelo: string;
  created_at: string;
}

export interface RecognitionResult {
  persona_id: number | null;
  nombre: string;
  similitud: number;
  distancia: number;
  umbral: number;
  coincide: boolean;
  probabilidad_calibrada: number;
  calidad_imagen?: 'Baja' | 'Media' | 'Buena' | 'Alta';
  iluminacion?: 'Baja' | 'Media' | 'Alta';
  tiempo_ms?: number;
  candidatos_alternativos?: Array<{
    persona_id: number;
    nombre: string;
    similitud: number;
  }>;
}

export interface RecognitionLog {
  id: number;
  persona_id: number | null;
  persona_nombre?: string;
  similitud: number;
  distancia: number;
  umbral: number;
  coincide: boolean;
  probabilidad_calibrada: number;
  calidad_imagen?: string;
  iluminacion?: string;
  created_at: string;
}

export interface MLMetrics {
  precision: number;
  recall: number;
  f1_score: number;
  accuracy: number;
  roc_auc: number;
  falsos_positivos: number;
  falsos_negativos: number;
  total_muestras: number;
  modelo_tipo: 'LogisticRegression' | 'RandomForest' | 'GradientBoosting';
  matriz_confusion: {
    verdaderos_positivos: number;
    falsos_positivos: number;
    verdaderos_negativos: number;
    falsos_negativos: number;
  };
}

export interface CalibrationPoint {
  similitud: number;
  probabilidad: number;
  umbral: number;
  decision: string;
}

export interface UsuarioSystem {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'usuario';
  activo: boolean;
  created_at?: string;
}

