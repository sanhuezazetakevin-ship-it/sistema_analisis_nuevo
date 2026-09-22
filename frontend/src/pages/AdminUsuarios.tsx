import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserCheck,
  UserX,
  Search,
  Users,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Crown,
  User,
  LockKeyhole,
} from 'lucide-react';

import { apiService } from '../services/api';
import type { UsuarioSystem } from '../types/facial';

export const AdminUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioSystem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    verificarAcceso();
  }, []);

  const verificarAcceso = async () => {
    setLoading(true);

    try {
      // Obtener usuario actualmente autenticado
      const currentUser = await apiService.getCurrentUser();

      // Verificar rol
      if (currentUser.rol !== 'admin') {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      // Si es admin, cargar usuarios
      setAccessDenied(false);
      await loadUsuarios();

    } catch (err) {
      console.error('Error verificando permisos:', err);
      setAccessDenied(true);
    } finally {
      setLoading(false);
    }
  };

  const loadUsuarios = async () => {
    try {
      const data = await apiService.getUsuariosSystem();
      setUsuarios(data);
    } catch (err) {
      console.error(err);
      showNotification(
        'Error al cargar la lista de usuarios',
        'error'
      );
    }
  };

  const showNotification = (
    message: string,
    type: 'success' | 'error'
  ) => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleToggleRole = async (user: UsuarioSystem) => {
    const nextRole =
      user.rol === 'admin'
        ? 'usuario'
        : 'admin';

    setUpdatingId(user.id);

    try {
      await apiService.updateUserRole(
        user.id,
        nextRole
      );

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, rol: nextRole }
            : u
        )
      );

      showNotification(
        `Rol de ${user.nombre} cambiado a ${nextRole.toUpperCase()}`,
        'success'
      );

    } catch (err: any) {
      showNotification(
        err.response?.data?.detail ||
          'Error al cambiar rol',
        'error'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (
    user: UsuarioSystem
  ) => {
    const nextStatus = !user.activo;

    setUpdatingId(user.id);

    try {
      await apiService.updateUserStatus(
        user.id,
        nextStatus
      );

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, activo: nextStatus }
            : u
        )
      );

      showNotification(
        `Usuario ${user.nombre} ${
          nextStatus
            ? 'activado'
            : 'desactivado'
        } correctamente`,
        'success'
      );

    } catch (err: any) {
      showNotification(
        err.response?.data?.detail ||
          'Error al cambiar estado',
        'error'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsuarios = usuarios.filter(
    (u) =>
      u.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      u.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalAdmins = usuarios.filter(
    (u) => u.rol === 'admin'
  ).length;

  const totalActivos = usuarios.filter(
    (u) => u.activo
  ).length;

  /*
   * ==========================================
   * CARGANDO
   * ==========================================
   */

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-3" />

          <p className="text-sm text-slate-400">
            Verificando permisos...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ==========================================
   * ACCESO DENEGADO
   * ==========================================
   */

  if (accessDenied) {
    return (
      <div className="min-h-[500px] flex items-center justify-center px-4">

        <div className="max-w-md w-full bg-slate-900 border border-rose-900/60 rounded-2xl p-8 text-center shadow-xl">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-950/70 border border-rose-800 flex items-center justify-center mb-5">
            <LockKeyhole className="w-8 h-8 text-rose-400" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2">
            Acceso denegado
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed">
            No tienes permisos suficientes para acceder
            al panel de administración de usuarios.
          </p>

          <div className="mt-5 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-xs text-slate-500">
              Esta sección está disponible únicamente
              para usuarios con rol
            </p>

            <span className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-semibold">
              <Crown className="w-3.5 h-3.5" />
              ADMIN
            </span>
          </div>

        </div>
      </div>
    );
  }

  /*
   * ==========================================
   * PANEL ADMINISTRADOR
   * ==========================================
   */

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <div className="flex items-center gap-2">

            <ShieldCheck className="w-6 h-6 text-purple-400" />

            <h2 className="text-xl font-bold text-white">
              Panel de Administración de Usuarios
            </h2>

            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
              Admin Permisos
            </span>

          </div>

          <p className="text-xs text-slate-400 mt-1">
            Gestión de roles y permisos de acceso al
            sistema biométrico.
          </p>
        </div>

        <button
          onClick={verificarAcceso}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${
              loading ? 'animate-spin' : ''
            }`}
          />

          <span>
            Actualizar Lista
          </span>
        </button>

      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-3 shadow-lg border ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/80 border-rose-800 text-rose-200'
          }`}
        >

          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}

          <span>
            {notification.message}
          </span>

        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-md">

          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
            <Users className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs text-slate-400 block">
              Total Usuarios Registrados
            </span>

            <span className="text-2xl font-bold font-mono text-white mt-0.5 block">
              {usuarios.length}
            </span>
          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-md">

          <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
            <Crown className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs text-slate-400 block">
              Administradores del Sistema
            </span>

            <span className="text-2xl font-bold font-mono text-purple-300 mt-0.5 block">
              {totalAdmins}
            </span>
          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-md">

          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
            <UserCheck className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs text-slate-400 block">
              Usuarios Activos
            </span>

            <span className="text-2xl font-bold font-mono text-emerald-300 mt-0.5 block">
              {totalActivos}
            </span>
          </div>

        </div>

      </div>

      {/* Tabla */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">

        <div className="relative max-w-md">

          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            placeholder="Buscar por nombre o correo..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-purple-500 focus:outline-none transition"
          />

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left text-xs text-slate-300">

            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider">

              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Usuario / Correo</th>
                <th className="px-4 py-3">Rol actual</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">
                  Acciones
                </th>
              </tr>

            </thead>

            <tbody className="divide-y divide-slate-800/60">

              {filteredUsuarios.map((u) => {

                const isBusy =
                  updatingId === u.id;

                return (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-800/40 transition"
                  >

                    <td className="px-4 py-3.5 font-mono text-slate-500">
                      #{u.id}
                    </td>

                    <td className="px-4 py-3.5">

                      <div className="flex items-center gap-3">

                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold uppercase border border-slate-700">
                          {u.nombre.charAt(0)}
                        </div>

                        <div>

                          <span className="font-semibold text-white block">
                            {u.nombre}
                          </span>

                          <span className="text-[11px] text-slate-400 font-mono">
                            {u.email}
                          </span>

                        </div>

                      </div>

                    </td>

                    <td className="px-4 py-3.5">

                      {u.rol === 'admin' ? (

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-700/80 text-purple-300 text-[11px] font-semibold">

                          <Crown className="w-3 h-3" />

                          ADMIN

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium">

                          <User className="w-3 h-3" />

                          USUARIO

                        </span>

                      )}

                    </td>

                    <td className="px-4 py-3.5">

                      {u.activo ? (

                        <span className="inline-flex items-center gap-1 text-emerald-400">

                          <span className="w-2 h-2 rounded-full bg-emerald-400" />

                          Activo

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-1 text-rose-400">

                          <span className="w-2 h-2 rounded-full bg-rose-400" />

                          Inactivo

                        </span>

                      )}

                    </td>

                    <td className="px-4 py-3.5 text-right">

                      <div className="flex items-center justify-end gap-2">

                        <button
                          onClick={() =>
                            handleToggleRole(u)
                          }
                          disabled={isBusy}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                        >
                          {u.rol === 'admin'
                            ? 'Cambiar a Usuario'
                            : 'Hacer Admin'}
                        </button>

                        <button
                          onClick={() =>
                            handleToggleStatus(u)
                          }
                          disabled={isBusy}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1 bg-slate-800"
                        >

                          {u.activo ? (
                            <>
                              <UserX className="w-3.5 h-3.5" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              Activar
                            </>
                          )}

                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })}

              {filteredUsuarios.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-slate-500"
                  >
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};