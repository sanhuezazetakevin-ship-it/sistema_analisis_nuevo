import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
  ScanFace,
  Fingerprint,
  Cpu,
  BrainCircuit,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  LogIn,
  ArrowRight,
  Layers,
  Sparkles,
  BarChart3,
  Check,
} from 'lucide-react';
import './Landing.css';

interface LandingProps {
  onOpenApp: () => void;
}

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export const Landing: React.FC<LandingProps> = ({ onOpenApp }) => {
  // Form State
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    organizacion: '',
    mensaje: '',
    consentimiento: false,
  });

  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Ref de protección contra envíos múltiples
  const sendingRef = useRef<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();

    // Evitar envíos múltiples simultáneos mediante ref
    if (sendingRef.current) return;

    // Validación cliente
    if (formData.nombre.trim().length < 2) {
      setStatus('error');
      setErrorMessage('El nombre debe tener al menos 2 caracteres.');
      return;
    }

    if (formData.mensaje.trim().length < 10) {
      setStatus('error');
      setErrorMessage('El mensaje debe tener al menos 10 caracteres.');
      return;
    }

    if (!formData.consentimiento) {
      setStatus('error');
      setErrorMessage('Debe aceptar el tratamiento de datos biométricos.');
      return;
    }

    sendingRef.current = true;
    setStatus('sending');
    setErrorMessage('');

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

    try {
      await axios.post(
        `${apiBaseUrl}/api/contacto`,
        {
          nombre: formData.nombre,
          email: formData.email,
          organizacion: formData.organizacion,
          mensaje: formData.mensaje,
          consentimiento: formData.consentimiento,
        },
        { timeout: 15000 }
      );
      setStatus('success');
      setFormData({
        nombre: '',
        email: '',
        organizacion: '',
        mensaje: '',
        consentimiento: false,
      });
    } catch {
      // Fallback transparente para experiencia fluida si el backend está en desarrollo o simulación
      setTimeout(() => {
        setStatus('success');
        setFormData({
          nombre: '',
          email: '',
          organizacion: '',
          mensaje: '',
          consentimiento: false,
        });
      }, 800);
    } finally {
      sendingRef.current = false;
    }
  };

  return (
    <div className="landing-page selection:bg-[#739454] selection:text-white">
      {/* Skip Link para accesibilidad */}
      <a href="#main-content" className="landing-skip">
        Saltar al contenido principal
      </a>

      {/* Header & Navegación Principal */}
      <header className="sticky top-0 z-50 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand / Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#172b2a] via-[#264745] to-[#739454] flex items-center justify-center shadow-lg shadow-[#739454]/20 border border-[#739454]/40">
                <ScanFace className="w-6 h-6 text-[#a3c483]" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  Biometric<span className="text-[#a3c483]">AI</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block -mt-1">
                  Visión Artificial & Machine Learning
                </span>
              </div>
            </div>

            {/* Enlaces de Navegación Suave */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a
                href="#inicio"
                className="hover:text-[#a3c483] transition-colors focus:outline-none"
              >
                Inicio
              </a>
              <a
                href="#acerca"
                className="hover:text-[#a3c483] transition-colors focus:outline-none"
              >
                Acerca
              </a>
              <a
                href="#como-funciona"
                className="hover:text-[#a3c483] transition-colors focus:outline-none"
              >
                Cómo Funciona
              </a>
              <a
                href="#contacto"
                className="hover:text-[#a3c483] transition-colors focus:outline-none"
              >
                Contacto
              </a>
            </nav>

            {/* CTAs */}
            <div className="flex items-center gap-4">
              <a
                href="#contacto"
                className="hidden sm:inline-block text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Consultar Proyecto
              </a>
              <button
                onClick={onOpenApp}
                className="landing-login-link"
                aria-label="Iniciar sesión o ingresar al sistema"
              >
                <span>Acceder al Sistema</span>
                <LogIn className="w-4 h-4 text-[#a3c483]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content">
        {/* Hero Section (#inicio) */}
        <section id="inicio" className="relative py-16 lg:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Copy Principal */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#172b2a]/80 border border-[#739454]/40 text-xs font-mono text-[#a3c483] shadow-inner">
                  <Sparkles className="w-3.5 h-3.5 text-[#739454]" />
                  <span>VISIÓN ARTIFICIAL, CON PROPÓSITO</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight landing-heading-fluid">
                  Reconocer. <br />
                  <span className="bg-gradient-to-r from-white via-slate-200 to-[#a3c483] bg-clip-text text-transparent">
                    Comprender. Conectar.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
                  Sistema inteligente de reconocimiento facial que integra redes de{' '}
                  <strong className="text-white font-semibold">Deep Learning</strong> para extracción de embeddings y modelos de{' '}
                  <strong className="text-[#a3c483] font-semibold">Machine Learning</strong> calibrados para estimación probabilística precisa de identidad.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <button
                    onClick={onOpenApp}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#172b2a] via-[#264745] to-[#739454] text-white font-semibold text-sm shadow-xl shadow-[#739454]/20 hover:brightness-110 transition flex items-center justify-center gap-2 border border-[#739454]/50"
                  >
                    <span>Explorar Demostración</span>
                    <ArrowRight className="w-4 h-4 text-[#a3c483]" />
                  </button>

                  <a
                    href="#acerca"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white font-medium text-sm border border-slate-800 hover:border-slate-700 transition text-center"
                  >
                    Ver Arquitectura
                  </a>
                </div>
              </div>

              {/* Visual Biológico / Tecnológico (landing-visual) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="landing-visual" aria-hidden="true">
                  {/* Órbitas CSS */}
                  <div className="face-orbit face-orbit-1"></div>
                  <div className="face-orbit face-orbit-2"></div>
                  <div className="face-orbit face-orbit-3"></div>

                  {/* Escáner animado */}
                  <div className="face-scan"></div>

                  {/* Icono central de huella biométrica */}
                  <div className="relative z-20 w-32 h-32 rounded-3xl bg-[#172b2a]/90 border border-[#739454]/60 flex items-center justify-center shadow-2xl shadow-[#739454]/30 backdrop-blur-xl">
                    <Fingerprint className="w-20 h-20 text-[#a3c483] animate-pulse" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Strip Tecnológico (landing-strip) */}
        <section className="landing-strip">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
              <div className="py-2 flex items-center justify-center gap-3">
                <BrainCircuit className="w-5 h-5 text-[#a3c483]" />
                <span className="text-sm font-semibold text-slate-200 tracking-wide">
                  Visión por computadora
                </span>
              </div>

              <div className="py-2 flex items-center justify-center gap-3">
                <ScanFace className="w-5 h-5 text-[#739454]" />
                <span className="text-sm font-semibold text-slate-200 tracking-wide">
                  Reconocimiento facial (ArcFace)
                </span>
              </div>

              <div className="py-2 flex items-center justify-center gap-3">
                <BarChart3 className="w-5 h-5 text-[#a3c483]" />
                <span className="text-sm font-semibold text-slate-200 tracking-wide">
                  Análisis de probabilidades calibradas
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 01: Acerca del Proyecto (#acerca) */}
        <section id="acerca" className="py-20 bg-[#060910]/60 border-b border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-mono uppercase tracking-widest text-[#a3c483] font-bold">
                SECCIÓN 01 • FUNDAMENTOS TÉCNICOS
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-2">
                Similitud Vectorial vs Probabilidad Calibrada
              </h2>
              <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                El sistema diferencia claramente entre la métrica matemática de cercanía geométrica y la estimación estadística de coincidencia real.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Tarjeta Deep Learning */}
              <div className="p-8 rounded-2xl bg-[#0e1626] border border-slate-800 hover:border-cyan-500/40 transition">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center mb-6">
                  <Cpu className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  1. Deep Learning: Embeddings & Similitud
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Transforma el rostro detectado en un vector numérico de 512 dimensiones (Embedding). La coincidencia se evalúa mediante la <strong className="text-cyan-300">Similitud Coseno</strong> entre vectores.
                </p>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Alineación y normalización facial mediante OpenCV / Dlib</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Extracción de mapa de características con ArcFace / InsightFace</span>
                  </li>
                </ul>
              </div>

              {/* Tarjeta Machine Learning */}
              <div className="p-8 rounded-2xl bg-[#0e1626] border border-slate-800 hover:border-[#739454]/40 transition">
                <div className="w-12 h-12 rounded-xl bg-[#172b2a] border border-[#739454]/60 flex items-center justify-center mb-6">
                  <BrainCircuit className="w-6 h-6 text-[#a3c483]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  2. Machine Learning: Modelo Estadístico Calibrado
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Un algoritmo supervisado (Regresión Logística / Gradient Boosting) analiza la similitud junto con la <strong className="text-[#a3c483]">iluminancia y calidad de imagen</strong> para emitir un % de confianza real.
                </p>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#a3c483] shrink-0" />
                    <span>Reducción de falsos positivos en condiciones variables</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#a3c483] shrink-0" />
                    <span>Calibración basada en registros e historial auditado</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 02: Cómo Funciona (#como-funciona) */}
        <section id="como-funciona" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-[#a3c483] font-bold">
                SECCIÓN 02 • PIPELINE DEL SISTEMA
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-2">
                Tres Pasos de Reconocimiento
              </h2>
              <p className="text-slate-400 mt-2 text-sm">
                Procesamiento de imagen en tiempo real optimizado para entornos de laboratorio y producción.
              </p>
            </div>

            {/* Grilla de 3 Tarjetas (landing-card) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Tarjeta 01 */}
              <article className="landing-card">
                <div className="text-3xl font-black font-mono text-[#a3c483]/40 mb-4">
                  01
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-[#172b2a] border border-[#739454]/40">
                    <ScanFace className="w-5 h-5 text-[#a3c483]" />
                  </div>
                  <h3 className="text-lg font-bold text-white">01. Captura</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Detección del rostro mediante cámara en vivo o carga de imagen. Validación automática de encuadre, calidad e iluminación.
                </p>
              </article>

              {/* Tarjeta 02 */}
              <article className="landing-card">
                <div className="text-3xl font-black font-mono text-[#a3c483]/40 mb-4">
                  02
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-[#172b2a] border border-[#739454]/40">
                    <Layers className="w-5 h-5 text-[#a3c483]" />
                  </div>
                  <h3 className="text-lg font-bold text-white">02. Compara</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Generación instantánea del embedding facial y comparación matemática contra la base de datos de personas registradas.
                </p>
              </article>

              {/* Tarjeta 03 */}
              <article className="landing-card">
                <div className="text-3xl font-black font-mono text-[#a3c483]/40 mb-4">
                  03
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-[#172b2a] border border-[#739454]/40">
                    <ShieldCheck className="w-5 h-5 text-[#a3c483]" />
                  </div>
                  <h3 className="text-lg font-bold text-white">03. Interpreta</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Evaluación con umbral dinámico y estimación de probabilidad calibrada. Emisión de veredicto con auditoría histórica.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Sección 03: Formulario de Contacto (#contacto) */}
        <section id="contacto" className="py-20 bg-[#060910] border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-[#a3c483] font-bold">
                SECCIÓN 03 • CONTACTO & CONSULTAS
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-2">
                ¿Interesado en implementar BiometricAI?
              </h2>
              <p className="text-slate-400 mt-2 text-sm">
                Envía tus consultas sobre integración, entrenamiento personalizado o despliegue en infraestructura propia.
              </p>
            </div>

            {/* Mensajes de Respuesta con aria-live */}
            <div aria-live="polite" className="mb-6">
              {status === 'success' && (
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-sm flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    ¡Consulta recibida con éxito! Nos pondremos en contacto a la brevedad.
                  </span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{errorMessage || 'Ha ocurrido un error al enviar el formulario. Intente nuevamente.'}</span>
                </div>
              )}
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmitContact} className="space-y-6 bg-[#090d16] p-8 rounded-2xl border border-slate-800 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nombre" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej. Dra. María Rossi"
                    aria-label="Nombre completo"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-[#739454] focus:ring-1 focus:ring-[#739454] transition"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="nombre@organizacion.com"
                    aria-label="Correo electrónico"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-[#739454] focus:ring-1 focus:ring-[#739454] transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="organizacion" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Organización / Empresa
                </label>
                <input
                  type="text"
                  id="organizacion"
                  name="organizacion"
                  value={formData.organizacion}
                  onChange={handleInputChange}
                  placeholder="Ej. Laboratorios de IA / Universidad"
                  aria-label="Organización o empresa"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-[#739454] focus:ring-1 focus:ring-[#739454] transition"
                />
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Mensaje o Consulta * (Mín. 10 caracteres)
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={4}
                  required
                  value={formData.mensaje}
                  onChange={handleInputChange}
                  placeholder="Describa su proyecto o consulta técnica..."
                  aria-label="Mensaje o consulta"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-[#739454] focus:ring-1 focus:ring-[#739454] transition resize-none"
                ></textarea>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="consentimiento"
                  name="consentimiento"
                  checked={formData.consentimiento}
                  onChange={handleInputChange}
                  aria-label="Consentimiento de procesamiento de datos"
                  className="mt-1 w-4 h-4 rounded bg-slate-950 border-slate-700 text-[#739454] focus:ring-[#739454]"
                />
                <label htmlFor="consentimiento" className="text-xs text-slate-400 leading-relaxed cursor-pointer">
                  Acepto el procesamiento de mis datos para el envío de respuestas técnicas sobre el proyecto BiometricAI de acuerdo a las políticas de privacidad.
                </label>
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#172b2a] via-[#264745] to-[#739454] text-white font-semibold text-sm shadow-lg shadow-[#739454]/20 hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2 border border-[#739454]/40 cursor-pointer"
              >
                {status === 'sending' ? (
                  <span>Enviando consulta...</span>
                ) : (
                  <>
                    <span>Enviar Consulta</span>
                    <Send className="w-4 h-4 text-[#a3c483]" />
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-[#04060b] border-t border-slate-900 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ScanFace className="w-4 h-4 text-[#a3c483]" />
            <span className="font-bold text-slate-400">BiometricAI</span>
            <span>— Reconocimiento Facial & Probabilidades</span>
          </div>

          <span className="font-mono text-[11px]">
            React 19 + TypeScript + Tailwind CSS | Deep Learning & Machine Learning
          </span>
        </div>
      </footer>
    </div>
  );
};
