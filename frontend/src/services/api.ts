import axios from 'axios';

import type {
  Persona,
  RecognitionResult,
  RecognitionLog,
  MLMetrics,
  UsuarioSystem
} from '../types/facial';

import {
  INITIAL_PERSONAS,
  INITIAL_LOGS,
  MOCK_ML_METRICS,
  INITIAL_USUARIOS
} from './mockData';


// ============================================================
// CONFIGURACIÓN DINÁMICA DEL BACKEND (BLINDADA A HTTPS)
// ============================================================

function getDynamicApiBaseUrl(): string {
  // 1. Si se definió una variable de entorno, limpiar y forzar HTTPS obligatoriamente
  if (import.meta.env.VITE_API_BASE_URL) {
    let url = import.meta.env.VITE_API_BASE_URL.trim();
    if (url.startsWith('http://')) {
      url = url.replace('http://', 'https://');
    }
    return url;
  }

  // 2. Detección automática según el hostname del navegador
  if (typeof window !== 'undefined' && window.location) {
    const host = window.location.hostname;
    
    // Entorno local puro de desarrollo
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8000';
    }

    // Soporte para túneles de desarrollo (DevTunnels)
    if (host.includes('.devtunnels.ms')) {
      const backendHost = host.replace(/-5173\b/, '-8000');
      return `https://${backendHost}`;
    }
  }

  // 3. PRODUCCIÓN (Vercel): Retorna de manera absoluta y segura el backend en Railway por HTTPS
  return 'https://sistemaanalisisnuevo-production-d66f.up.railway.app';
}


// ============================================================
// CLIENTE AXIOS
// ============================================================

const client = axios.create({
  baseURL: getDynamicApiBaseUrl(),
  timeout: 15000,
});


// ============================================================
// INTERCEPTOR JWT
// ============================================================

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// ============================================================
// STORAGE
// ============================================================

const STORAGE_KEYS = {
  PERSONAS: 'facial_personas_db',
  LOGS: 'facial_recognition_logs',
  METRICS: 'facial_ml_metrics',
  USE_MOCK: 'facial_use_mock_api',
  USUARIOS: 'facial_usuarios_db',
};


// ============================================================
// USUARIOS MOCK
// ============================================================

function getStoredUsuarios(): UsuarioSystem[] {
  const data = localStorage.getItem(STORAGE_KEYS.USUARIOS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(INITIAL_USUARIOS));
    return INITIAL_USUARIOS as UsuarioSystem[];
  }
  return JSON.parse(data);
}


// ============================================================
// PERSONAS MOCK
// ============================================================

function getStoredPersonas(): Persona[] {
  const data = localStorage.getItem(STORAGE_KEYS.PERSONAS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.PERSONAS, JSON.stringify(INITIAL_PERSONAS));
    return INITIAL_PERSONAS;
  }
  return JSON.parse(data);
}


// ============================================================
// HISTORIAL MOCK
// ============================================================

function getStoredLogs(): RecognitionLog[] {
  const data = localStorage.getItem(STORAGE_KEYS.LOGS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
    return INITIAL_LOGS;
  }
  return JSON.parse(data);
}


// ============================================================
// MODO MOCK
// ============================================================

export const isMockMode = (): boolean => {
  const setting = localStorage.getItem(STORAGE_KEYS.USE_MOCK);
  return setting === null ? true : setting === 'true';
};


// ============================================================
// CAMBIAR MODO MOCK
// ============================================================

export const setMockMode = (enabled: boolean) => {
  localStorage.setItem(STORAGE_KEYS.USE_MOCK, String(enabled));
};


// ============================================================
// API SERVICE
// ============================================================

export const apiService = {

  async getPersonas(): Promise<Persona[]> {
    if (isMockMode()) {
      return getStoredPersonas();
    }
    try {
      const res = await client.get<Persona[]>('/api/personas');
      return res.data;
    } catch {
      return getStoredPersonas();
    }
  },

  async createPersona(
    data: {
      nombre: string;
      email: string;
      foto_base64?: string;
    }
  ): Promise<Persona> {
    if (isMockMode()) {
      const current = getStoredPersonas();
      const newPersona: Persona = {
        id: current.length > 0 ? Math.max(...current.map(p => p.id)) + 1 : 1,
        nombre: data.nombre,
        email: data.email,
        activo: true,
        foto_url: data.foto_base64 || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="%23739454" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        created_at: new Date().toISOString(),
        total_embeddings: 1,
      };
      const updated = [newPersona, ...current];
      localStorage.setItem(STORAGE_KEYS.PERSONAS, JSON.stringify(updated));
      return newPersona;
    }

    const res = await client.post<Persona>('/api/personas', data);
    return res.data;
  },

  async recognizeFace(
    imageBase64: string,
    umbral: number = 0.75
  ): Promise<RecognitionResult> {

    if (isMockMode()) {
      await new Promise(r => setTimeout(r, 600));
      const personas = getStoredPersonas().filter(p => p.activo);
      const shouldMatch = personas.length > 0 && Math.random() > 0.25;
      const matchedPersona = shouldMatch ? personas[Math.floor(Math.random() * personas.length)] : null;
      const similitud = matchedPersona ? +(0.76 + Math.random() * 0.22).toFixed(2) : +(0.42 + Math.random() * 0.25).toFixed(2);
      const distancia = +(1.0 - similitud).toFixed(2);
      const coincide = similitud >= umbral;
      const rawProb = 1 / (1 + Math.exp(-12 * (similitud - 0.70)));
      const probabilidad_calibrada = +Math.min(0.99, Math.max(0.01, rawProb)).toFixed(2);

      const result: RecognitionResult = {
        persona_id: coincide && matchedPersona ? matchedPersona.id : null,
        nombre: coincide && matchedPersona ? matchedPersona.nombre : 'No identificado',
        similitud,
        distancia,
        umbral,
        coincide,
        probabilidad_calibrada,
        calidad_imagen: similitud > 0.85 ? 'Alta' : similitud > 0.65 ? 'Buena' : 'Media',
        iluminacion: Math.random() > 0.3 ? 'Alta' : 'Media',
        tiempo_ms: Math.floor(80 + Math.random() * 50),
        candidatos_alternativos: personas.slice(0, 3).map(p => ({
          persona_id: p.id,
          nombre: p.nombre,
          similitud: +(similitud * (0.6 + Math.random() * 0.3)).toFixed(2),
        })),
      };

      const logs = getStoredLogs();
      const newLog: RecognitionLog = {
        id: Date.now(),
        persona_id: result.persona_id,
        persona_nombre: result.nombre,
        similitud: result.similitud,
        distancia: result.distancia,
        umbral: result.umbral,
        coincide: result.coincide,
        probabilidad_calibrada: result.probabilidad_calibrada,
        calidad_imagen: result.calidad_imagen,
        iluminacion: result.iluminacion,
        created_at: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([newLog, ...logs]));
      return result;
    }

    const formData = new FormData();
    const response = await fetch(imageBase64);
    const blob = await response.blob();
    const file = new File([blob], 'rostro.jpg', { type: blob.type || 'image/jpeg' });

    formData.append('file', file);
    formData.append('threshold', String(umbral));

    const res = await client.post<RecognitionResult>('/api/reconocimiento', formData);
    return res.data;
  },

  async getHistorial(): Promise<RecognitionLog[]> {
    if (isMockMode()) {
      return getStoredLogs();
    }
    try {
      const res = await client.get<RecognitionLog[]>('/api/reconocimiento/historial');
      return res.data;
    } catch {
      return getStoredLogs();
    }
  },

  async getMetrics(): Promise<MLMetrics> {
    if (isMockMode()) {
      return MOCK_ML_METRICS;
    }
    try {
      const res = await client.get<MLMetrics>('/api/modelos/metricas');
      return res.data;
    } catch {
      return MOCK_ML_METRICS;
    }
  },

  async trainModel(modeloTipo: string): Promise<{ success: boolean; metrics: MLMetrics }> {
    if (isMockMode()) {
      await new Promise(r => setTimeout(r, 1200));
      return {
        success: true,
        metrics: {
          ...MOCK_ML_METRICS,
          modelo_tipo: modeloTipo as MLMetrics['modelo_tipo'],
          accuracy: +(0.95 + Math.random() * 0.03).toFixed(3),
          f1_score: +(0.94 + Math.random() * 0.04).toFixed(3),
        }
      };
    }

    const res = await client.post<{ success: boolean; metrics: MLMetrics }>('/api/modelos/entrenar');
    return res.data;
  },

  calculateCalibratedProbability(similitud: number, calidad: string, iluminacion: string): number {
    let factor = 0;
    if (calidad === 'Alta') factor += 0.04;
    else if (calidad === 'Baja') factor -= 0.06;

    if (iluminacion === 'Alta') factor += 0.03;
    else if (iluminacion === 'Baja') factor -= 0.05;

    const z = 14 * (similitud - 0.72) + factor;
    const prob = 1 / (1 + Math.exp(-z));
    return +Math.min(0.99, Math.max(0.01, prob)).toFixed(2);
  },

  async loginUser(email: string, password: string): Promise<{ access_token: string; usuario: any }> {
    if (isMockMode()) {
      return {
        access_token: 'mock-jwt-token-12345',
        usuario: {
          id: 1,
          nombre: email.split('@')[0],
          email,
          rol: 'usuario',
          activo: true,
        }
      };
    }

    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const res = await client.post('/api/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (res.data && res.data.access_token) {
      localStorage.setItem('auth_token', res.data.access_token);
    }
    return res.data;
  },

  async registerUser(nombre: string, email: string, password: string): Promise<{ id: number; nombre: string; email: string; rol: string; activo: boolean }> {
    if (isMockMode()) {
      await new Promise(r => setTimeout(r, 500));
      const current = getStoredUsuarios();
      const yaExiste = current.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (yaExiste) {
        throw new Error('Ya existe un usuario registrado con ese correo.');
      }
      const nuevoUsuario: UsuarioSystem = {
        id: current.length > 0 ? Math.max(...current.map(u => u.id)) + 1 : 1,
        nombre,
        email,
        rol: 'usuario',
        activo: true,
      } as UsuarioSystem;

      localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify([nuevoUsuario, ...current]));
      return nuevoUsuario;
    }

    const res = await client.post('/api/auth/registro', { nombre, email, password });
    return res.data;
  },

  async getUsuariosSystem(): Promise<UsuarioSystem[]>{
    if (isMockMode()) {
      return getStoredUsuarios();
    }
    try {
      const res = await client.get<{ success: boolean; usuarios: UsuarioSystem[] }>('/api/admin/usuarios');
      return res.data.usuarios;
    } catch {
      return getStoredUsuarios();
    }
  },

  async updateUserRole(usuarioId: number, nuevoRol: string): Promise<any> {
    if (isMockMode()) {
      const current = getStoredUsuarios();
      const updated = current.map(u => u.id === usuarioId ? { ...u, rol: nuevoRol as 'admin' | 'usuario' } : u);
      localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(updated));
      return { success: true, mensaje: 'Rol actualizado' };
    }

    const res = await client.put(`/api/admin/usuarios/${usuarioId}/rol?nuevo_rol=${encodeURIComponent(nuevoRol)}`);
    return res.data;
  },

  async updateUserStatus(usuarioId: number, activo: boolean): Promise<any> {
    if (isMockMode()) {
      const current = getStoredUsuarios();
      const updated = current.map(u => u.id === usuarioId ? { ...u, activo } : u);
      localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(updated));
      return { success: true, mensaje: 'Estado actualizado' };
    }

    const res = await client.put(`/api/admin/usuarios/${usuarioId}/estado?activo=${activo}`);
    return res.data;
  },

  async registrarRostro(personaId: number, imageBase64: string): Promise<{ message: string; persona_id: number; embedding_id: number; modelo: string; dimension: number }> {
    const blob = await (await fetch(imageBase64)).blob();
    const formData = new FormData();

    formData.append('file', blob, 'rostro.jpg');

    const res = await client.post(`/api/personas/${personaId}/rostro`, formData);
    return res.data;
  },

  async getCurrentUser() {
    const res = await client.get<{ id: number; nombre: string; email: string; rol: string; activo: boolean }>('/api/auth/me');
    return res.data;
  },
};
