import React, { useState } from 'react';
import {
  ScanFace,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  Play,
  Fingerprint,
  AlertCircle,
  CheckCircle2,
  User,
} from 'lucide-react';
import { apiService, setMockMode } from '../services/api';
import './Login.css';

interface LoginProps {
  onHome: () => void;
  onDemo: () => void;
  onSuccess: (user: {
    id: number;
    nombre: string;
    email: string;
    rol: 'admin' | 'usuario';
    activo: boolean;
  }) => void;
}

type AuthMode = 'login' | 'registro';

export const Login: React.FC<LoginProps> = ({ onHome, onDemo, onSuccess, }) => {
  const [mode, setMode] = useState<AuthMode>('login');

  // Campos compartidos
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Campos exclusivos de registro
  const [nombre, setNombre] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const limpiarMensajes = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const cambiarModo = (nuevoModo: AuthMode) => {
    setMode(nuevoModo);
    limpiarMensajes();
    setPassword('');
    setConfirmPassword('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    limpiarMensajes();

    try {
      // Intenta autenticar contra la API FastAPI del Backend
      const response = await apiService.loginUser(email, password);
      const usuario = response.usuario;
      setSuccessMsg(
        `¡Bienvenido, ${usuario?.nombre || 'Usuario'}! Redirigiendo...`
      );

      setMockMode(false);

      setTimeout(() => {
        onSuccess({
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol === 'admin' ? 'admin' : 'usuario',
          activo: usuario.activo,
        });
      }, 800);
    } catch (err: any) {
      console.error('Error de login:', err);
      if (err.response?.status === 401) {
        setErrorMsg('Correo o contraseña incorrectos. Verifique sus datos o intente el modo simulación.');
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        setErrorMsg('No se pudo conectar con el servidor backend en http://localhost:8000. Puede acceder usando la demostración interactiva.');
      } else {
        setErrorMsg(err.response?.data?.detail || 'Error de autenticación al conectar con la API.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    limpiarMensajes();

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Los usuarios nuevos siempre se crean con rol "usuario"
      // (el backend decide el rol, nunca el formulario)
      await apiService.registerUser(nombre, email, password);

      setSuccessMsg(
        'Cuenta creada correctamente. Ahora puede iniciar sesión.'
      );

      setTimeout(() => {
        cambiarModo('login');
        setSuccessMsg('Cuenta creada. Inicie sesión con su nuevo correo.');
      }, 900);
    } catch (err: any) {
      console.error('Error de registro:', err);
      if (err.response?.status === 400) {
        setErrorMsg(err.response?.data?.detail || 'No se pudo completar el registro. Verifique los datos.');
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        setErrorMsg('No se pudo conectar con el servidor backend en http://localhost:8000.');
      } else {
        setErrorMsg(err.message || 'Error al registrar el usuario.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const esRegistro = mode === 'registro';

  return (
    <div className="login-container selection:bg-[#739454] selection:text-white">
      <div className="login-split">
        {/* Columna Izquierda (Story / Identidad) */}
        <div className="login-story-col">
          {/* Brand Header */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onHome}>
            <div className="w-10 h-10 rounded-xl bg-[#739454] flex items-center justify-center shadow-lg shadow-[#739454]/30">
              <ScanFace className="w-6 h-6 text-[#172b2a]" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Biometric<span className="text-[#a3c483]">AI</span>
              </span>
              <span className="text-[10px] font-mono text-[#a3c483] block uppercase tracking-wider">
                Laboratorio de Reconocimiento
              </span>
            </div>
          </div>

          {/* Título Estilizado & Copy */}
          <div className="my-auto space-y-6 max-w-md">
            <h1 className="text-3xl sm:text-4xl font-light text-[#f9faf5] leading-tight">
              Una nueva forma de ver. <br />
              <em className="font-serif italic text-[#a3c483]">Y de comprender.</em>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Plataforma de investigación y demostración biométrica en tiempo real. Análisis de distancia de embedding y modelos de probabilidad probabilísticos calibrados.
            </p>

            {/* Gráfico Animado login-art */}
            <div className="login-art" aria-hidden="true">
              <div className="login-art-orbit login-art-orbit-1"></div>
              <div className="login-art-orbit login-art-orbit-2"></div>
              <div className="login-scanner-line"></div>
              <Fingerprint className="w-16 h-16 text-[#a3c483] animate-pulse" />
            </div>
          </div>

          {/* Footer de Laboratorio */}
          <div className="pt-6 border-t border-[#264745] flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>BIOMETRIC / LAB</span>
            <span>Inteligencia artificial con propósito.</span>
          </div>
        </div>

        {/* Columna Derecha (Panel de Autenticación) */}
        <div className="login-form-col">
          {/* Top Bar with Return Link */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onHome}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#172b2a] hover:text-[#739454] transition-colors focus:outline-none cursor-pointer"
              aria-label="Volver al inicio"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al inicio</span>
            </button>

            <span className="text-xs font-mono text-slate-500">v2.4.0 Lab</span>
          </div>

          {/* Header del Formulario */}
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#172b2a] flex items-center justify-center text-[#a3c483] shadow-md">
                <LockKeyhole className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#172b2a]">
                  {esRegistro ? 'Crear Cuenta' : 'Acceso al Sistema'}
                </h2>
                <p className="text-xs text-slate-500">
                  {esRegistro
                    ? 'Complete sus datos para registrarse'
                    : 'Ingrese sus credenciales registradas'}
                </p>
              </div>
            </div>

            {/* Tabs Login / Registro */}
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => cambiarModo('login')}
                className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
                  !esRegistro
                    ? 'bg-white text-[#172b2a] shadow-sm'
                    : 'text-slate-500 hover:text-[#172b2a]'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => cambiarModo('registro')}
                className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
                  esRegistro
                    ? 'bg-white text-[#172b2a] shadow-sm'
                    : 'text-slate-500 hover:text-[#172b2a]'
                }`}
              >
                Registrarse
              </button>
            </div>

            {/* Alerta de Éxito o Error role="status" */}
            <div aria-live="polite">
              {successMsg && (
                <div
                  role="status"
                  className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div
                  role="status"
                  className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">
                      {esRegistro ? 'Error de Registro' : 'Error de Autenticación'}
                    </span>
                    <span>{errorMsg}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Formulario de Login */}
            {!esRegistro && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email-input"
                    className="block text-xs font-bold text-[#172b2a] uppercase tracking-wider mb-1.5"
                  >
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email-input"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kevin@example.com"
                      aria-label="Correo electrónico"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-[#172b2a] text-sm focus:border-[#739454] focus:ring-2 focus:ring-[#739454]/20 transition outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password-input"
                    className="block text-xs font-bold text-[#172b2a] uppercase tracking-wider mb-1.5"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <LockKeyhole className="w-4 h-4" />
                    </div>
                    <input
                      id="password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      aria-label="Contraseña"
                      className="w-full pl-10 pr-11 py-3 rounded-xl bg-white border border-slate-300 text-[#172b2a] text-sm focus:border-[#739454] focus:ring-2 focus:ring-[#739454]/20 transition outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      aria-pressed={showPassword}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#172b2a] transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#172b2a] text-white font-semibold text-sm hover:bg-[#203c3a] transition shadow-md shadow-[#172b2a]/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Conectando con Backend...</span>
                  ) : (
                    <span>Iniciar Sesión</span>
                  )}
                </button>
              </form>
            )}

            {/* Formulario de Registro */}
            {esRegistro && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="nombre-input"
                    className="block text-xs font-bold text-[#172b2a] uppercase tracking-wider mb-1.5"
                  >
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="nombre-input"
                      type="text"
                      required
                      autoComplete="name"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Kevin Pérez"
                      aria-label="Nombre completo"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-[#172b2a] text-sm focus:border-[#739454] focus:ring-2 focus:ring-[#739454]/20 transition outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="registro-email-input"
                    className="block text-xs font-bold text-[#172b2a] uppercase tracking-wider mb-1.5"
                  >
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="registro-email-input"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kevin@example.com"
                      aria-label="Correo electrónico"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-[#172b2a] text-sm focus:border-[#739454] focus:ring-2 focus:ring-[#739454]/20 transition outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="registro-password-input"
                    className="block text-xs font-bold text-[#172b2a] uppercase tracking-wider mb-1.5"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <LockKeyhole className="w-4 h-4" />
                    </div>
                    <input
                      id="registro-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      aria-label="Contraseña"
                      className="w-full pl-10 pr-11 py-3 rounded-xl bg-white border border-slate-300 text-[#172b2a] text-sm focus:border-[#739454] focus:ring-2 focus:ring-[#739454]/20 transition outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      aria-pressed={showPassword}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#172b2a] transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirm-password-input"
                    className="block text-xs font-bold text-[#172b2a] uppercase tracking-wider mb-1.5"
                  >
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <LockKeyhole className="w-4 h-4" />
                    </div>
                    <input
                      id="confirm-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita la contraseña"
                      aria-label="Confirmar contraseña"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-[#172b2a] text-sm focus:border-[#739454] focus:ring-2 focus:ring-[#739454]/20 transition outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#172b2a] text-white font-semibold text-sm hover:bg-[#203c3a] transition shadow-md shadow-[#172b2a]/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Creando cuenta...</span>
                  ) : (
                    <span>Crear Cuenta</span>
                  )}
                </button>
              </form>
            )}

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#f9faf5] px-3 text-slate-400 font-mono">o explore el sistema</span>
              </div>
            </div>

            {/* Acceso Demostración (onDemo) */}
            <button
              onClick={onDemo}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#172b2a] via-[#264745] to-[#739454] text-white font-semibold text-sm hover:brightness-110 transition shadow-lg shadow-[#739454]/20 flex items-center justify-center gap-2 border border-[#739454]/40 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#a3c483]" />
              <span>Explorar Demostración</span>
              <Play className="w-3.5 h-3.5 text-[#a3c483] fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};