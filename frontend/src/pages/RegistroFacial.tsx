import React, { useState, useEffect } from 'react';
import { CameraCapture } from '../components/CameraCapture';
import { apiService } from '../services/api';
import type { Persona } from '../types/facial';
import { UserPlus, CheckCircle2, ShieldCheck, User } from 'lucide-react';

export const RegistroFacial: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    try {
      const data = await apiService.getPersonas();
      setPersonas(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!nombre.trim() || !email.trim()) {
    setErrorMessage(
      'Por favor completa todos los campos de texto requeridos.'
    );
    return;
  }

  if (!capturedImage) {
    setErrorMessage(
      'Es indispensable capturar una fotografía facial para generar el embedding.'
    );
    return;
  }

  setIsSubmitting(true);
  setErrorMessage(null);
  setSuccessMessage(null);

  try {
    // 1. Crear la persona
    const newPersona = await apiService.createPersona({
      nombre: nombre.trim(),
      email: email.trim(),
    });

    // 2. Registrar el rostro y generar el embedding
    const rostro = await apiService.registrarRostro(
      newPersona.id,
      capturedImage
    );

    setSuccessMessage(
      `¡Persona "${newPersona.nombre}" registrada correctamente! ` +
      `Embedding generado (${rostro.dimension} dimensiones).`
    );

    // Limpiar formulario
    setNombre('');
    setEmail('');
    setCapturedImage(null);

    // Actualizar lista
    await loadPersonas();

  } catch (error: any) {

    console.error(
      'Error durante el registro facial:',
      error
    );

    // Si la persona se creó pero falló el rostro,
    // mostramos el error real del backend.
    const detail =
      error?.response?.data?.detail ||
      'Error al registrar la persona o generar el embedding.';

    setErrorMessage(detail);

  } finally {
    setIsSubmitting(false);
  }
}
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-cyan-400" />
          Módulo de Registro Facial y Extracción de Embeddings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Ingresa los datos personales y captura el rostro para calcular el vector numérico (embedding de 512 dimensiones).
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulario & Cámara */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3">
              1. Datos de Identidad
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Ana Lucía Morales"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  placeholder="ana.morales@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-semibold text-slate-200 mb-3">
                2. Captura Biométrica Facial
              </h3>
              <CameraCapture
                onCapture={(img) => setCapturedImage(img)}
                isLoading={isSubmitting}
                buttonLabel="Capturar Foto para Embedding"
              />
            </div>

            {/* Checklist de Validación Biométrica */}
            <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl space-y-2 text-xs">
              <span className="font-mono text-[11px] text-cyan-400 uppercase tracking-wider font-semibold block">
                Requisitos del Modelo Deep Learning (ArcFace / InsightFace):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-400 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Rostro centrado y frontal
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Buena iluminación ambiental
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Sin gafas oscuras ni máscara
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !capturedImage || !nombre || !email}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {isSubmitting ? 'Generando Embedding...' : 'Guardar y Registrar Persona'}
            </button>
          </form>
        </div>

        {/* Lista de Personas Registradas */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                Personas Registradas ({personas.length})
              </h3>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Base Vectorial
              </span>
            </div>

            <div className="mt-4 space-y-3 max-h-[540px] overflow-y-auto pr-1">
              {personas.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 p-3 rounded-xl flex items-center gap-3 transition"
                >
                  <img
                    src={p.foto_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt={p.nombre}
                    className="w-11 h-11 rounded-lg object-cover border border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-slate-200 truncate">{p.nombre}</h4>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          p.activo ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-600'
                        }`}
                        title={p.activo ? 'Activo' : 'Inactivo'}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{p.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-cyan-400/90 bg-cyan-950/60 px-1.5 py-0.5 rounded">
                        Vector: {p.total_embeddings || 1}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(p.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
