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
} from 'lucide-react';
import { apiService } from '../services/api';
import type { UsuarioSystem } from '../types/facial';

export const AdminUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioSystem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const data = await apiService.getUsuariosSystem();
      setUsuarios(data);
    } catch (err) {
      console.error(err);
      showNotification('Error al cargar la lista de usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleRole = async (user: UsuarioSystem) => {
    const nextRole = user.rol === 'admin' ? 'usuario' : 'admin';
    setUpdatingId(user.id);
    try {
      await apiService.updateUserRole(user.id, nextRole);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, rol: nextRole } : u))
      );
      showNotification(`Rol de ${user.nombre} cambiado a ${nextRole.toUpperCase()}`, 'success');
    } catch (err: any) {
      showNotification(err.response?.data?.detail || 'Error al cambiar rol', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (user: UsuarioSystem) => {
    const nextStatus = !user.activo;
    setUpdatingId(user.id);
    try {
      await apiService.updateUserStatus(user.id, nextStatus);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, activo: nextStatus } : u))
      );
      showNotification(
        `Usuario ${user.nombre} ${nextStatus ? 'activado' : 'desactivado'} correctamente`,
        'success'
      );
    } catch (err: any) {
      showNotification(err.response?.data?.detail || 'Error al cambiar estado', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsuarios = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAdmins = usuarios.filter((u) => u.rol === 'admin').length;
  const totalActivos = usuarios.filter((u) => u.activo).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Panel de Administración de Usuarios</h2>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
              Admin Permisos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestión de roles (`admin`, `usuario`) y permisos de acceso al sistema biométrico.
          </p>
        </div>

        <button
          onClick={loadUsuarios}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar Lista</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-3 shadow-lg border transition ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/80 border-rose-800 text-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Total Usuarios Registrados</span>
            <span className="text-2xl font-bold font-mono text-white mt-0.5 block">{usuarios.length}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Administradores del Sistema</span>
            <span className="text-2xl font-bold font-mono text-purple-300 mt-0.5 block">{totalAdmins}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Usuarios Activos</span>
            <span className="text-2xl font-bold font-mono text-emerald-300 mt-0.5 block">{totalActivos}</span>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o correo..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-purple-500 focus:outline-none transition"
          />
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">ID</th>
                <th className="px-4 py-3">Usuario / Correo</th>
                <th className="px-4 py-3">Rol actual</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right rounded-r-lg">Acciones de Administración</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsuarios.map((u) => {
                const isBusy = updatingId === u.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5 font-mono text-slate-500">#{u.id}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold uppercase text-xs border border-slate-700">
                          {u.nombre.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{u.nombre}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {u.rol === 'admin' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-700/80 text-purple-300 text-[11px] font-semibold">
                          <Crown className="w-3 h-3" />
                          <span>ADMIN</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium">
                          <User className="w-3 h-3" />
                          <span>USUARIO</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {u.activo ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          <span>Activo</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 text-xs font-medium">
                          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                          <span>Inactivo</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Role */}
                        <button
                          onClick={() => handleToggleRole(u)}
                          disabled={isBusy}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                            u.rol === 'admin'
                              ? 'bg-purple-950/60 text-purple-200 border-purple-800 hover:bg-purple-900/60'
                              : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {u.rol === 'admin' ? 'Cambiar a Usuario' : 'Hacer Admin'}
                        </button>

                        {/* Toggle Status */}
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={isBusy}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer flex items-center gap-1 ${
                            u.activo
                              ? 'bg-rose-950/60 text-rose-300 border-rose-800 hover:bg-rose-900/60'
                              : 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
                          }`}
                        >
                          {u.activo ? (
                            <>
                              <UserX className="w-3.5 h-3.5" />
                              <span>Desactivar</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Activar</span>
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
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    No se encontraron usuarios coincidentes.
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
