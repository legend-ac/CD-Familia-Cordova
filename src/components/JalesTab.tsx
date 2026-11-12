import React, { useState } from 'react';
import { ClubState, JalePlayer } from '../types';
import { calculateJalesStats } from '../utils/calculator';
import { 
  Users, 
  Target, 
  MapPin, 
  ShieldCheck, 
  Bus, 
  Home, 
  Edit3, 
  DollarSign, 
  Award,
  AlertCircle
} from 'lucide-react';

interface JalesTabProps {
  state: ClubState;
  onUpdateJale: (jale: JalePlayer) => void;
}

export const JalesTab: React.FC<JalesTabProps> = ({ state, onUpdateJale }) => {
  const [editingJale, setEditingJale] = useState<JalePlayer | null>(null);
  const stats = calculateJalesStats(state.jales);

  const formatMoney = (val: number) => 
    `S/ ${val.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleSaveJale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJale) return;
    onUpdateJale(editingJale);
    setEditingJale(null);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
              <Award className="w-4 h-4" />
              <span>Reglamento del Campeonato · Máximo 3 Refuerzos</span>
              <span className="text-slate-400">·</span>
              <span>Junín 2027</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Los 3 Jales (Fichajes Permitidos)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Presupuesto de S/ 1,000 para cada jale (S/ 3,000 en total). El club cubre su pasaje de ida/vuelta e incentivo. El alojamiento está resuelto en casas familiares de Jisse.
            </p>
          </div>
        </div>

        {/* Jales Quick Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div>
            <span className="text-xs text-slate-500">Presupuesto Asignado</span>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900">
              {formatMoney(stats.targetTotal)}
            </div>
            <span className="text-xs text-slate-400">S/ 1,000 por cada jugador</span>
          </div>

          <div>
            <span className="text-xs text-slate-500">Fichajes Confirmados</span>
            <div className="text-lg sm:text-xl font-extrabold text-emerald-600">
              {stats.confirmedCount} de {stats.totalJales} listos
            </div>
            <span className="text-xs text-slate-400">Cupo máximo permitido: 3</span>
          </div>

          <div>
            <span className="text-xs text-slate-500">Logística de Pasajes</span>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900">
              Cubierto por club
            </div>
            <span className="text-xs text-slate-400">Solo se paga viaje a los jales</span>
          </div>

          <div>
            <span className="text-xs text-slate-500">Alojamiento Jales</span>
            <div className="text-lg sm:text-xl font-extrabold text-blue-600">
              Casas en el pueblo
            </div>
            <span className="text-xs text-slate-400">Hospedaje familiar en Jisse</span>
          </div>
        </div>
      </div>

      {/* Altitude & Conditioning Advisory Box */}
      <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-5 text-xs text-blue-950 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-sm text-blue-900">
            Criterio Clave para Seleccionar los 3 Jales (Altura de Junín ~3,400 msnm)
          </div>
          <p className="text-blue-800 leading-relaxed">
            El campeonato dura 2 días intensos. Los 3 refuerzos deben ser jugadores con resistencia probada en altura o con experiencia en torneos de provincia, para que su rendimiento no decaiga por falta de oxígeno.
          </p>
        </div>
      </div>

      {/* The 3 Jales Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {state.jales.map((jale) => {
          const isConfirmed = jale.status === 'Confirmado en lista';
          const isCommitted = jale.status === 'Comprometido';

          return (
            <div
              key={jale.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between transition-all ${
                isConfirmed
                  ? 'border-emerald-300 bg-emerald-50/10'
                  : isCommitted
                  ? 'border-blue-300 bg-blue-50/10'
                  : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header: Number and Status */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    Jale #{jale.number}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      isConfirmed
                        ? 'bg-emerald-100 text-emerald-800'
                        : isCommitted
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {jale.status}
                  </span>
                </div>

                {/* Name / Position */}
                <h4 className="text-base font-bold text-slate-900 mt-2">
                  {jale.name}
                </h4>
                <div className="text-xs font-semibold text-slate-600">
                  {jale.position}
                </div>

                {/* Budget */}
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Presupuesto Reservado:</span>
                    <span className="font-bold text-slate-900">{formatMoney(jale.budgetAllocated)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Costo Acordado Real:</span>
                    <span className="font-bold text-emerald-600">{formatMoney(jale.actualCost)}</span>
                  </div>
                </div>

                {/* Logistics */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-slate-600">
                    <Bus className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>Pasaje: <strong>{jale.travelStatus}</strong> (ida/vuelta Lima-Junín)</span>
                  </div>

                  <div className="flex items-start gap-2 text-slate-600">
                    <Home className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>Hospedaje: {jale.lodgingNote}</span>
                  </div>
                </div>

                {/* Notes */}
                {jale.notes && (
                  <p className="mt-3 text-xs text-slate-500 italic bg-amber-50/40 p-2 rounded-lg border border-amber-100">
                    "{jale.notes}"
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => setEditingJale(jale)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Gestionar Refuerzo</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal: Edit Jale */}
      {editingJale && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Ficha del Jale #{editingJale.number}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Registra los datos del fichaje, presupuesto pactado y estado de confirmación.
            </p>

            <form onSubmit={handleSaveJale} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nombre del Jugador / Referencia
                </label>
                <input
                  type="text"
                  required
                  value={editingJale.name}
                  onChange={(e) => setEditingJale({ ...editingJale, name: e.target.value })}
                  placeholder="Ej. 'Gato' Mendoza / Carlos Ramos"
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Posición en Cancha
                  </label>
                  <input
                    type="text"
                    value={editingJale.position}
                    onChange={(e) => setEditingJale({ ...editingJale, position: e.target.value })}
                    placeholder="Ej. Volante 10"
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estado Fichaje
                  </label>
                  <select
                    value={editingJale.status}
                    onChange={(e) => setEditingJale({ ...editingJale, status: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="En carpeta">En carpeta</option>
                    <option value="Conversando">Conversando</option>
                    <option value="Comprometido">Comprometido</option>
                    <option value="Confirmado en lista">Confirmado en lista</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Costo Acordado (S/)
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={editingJale.actualCost}
                    onChange={(e) => setEditingJale({ ...editingJale, actualCost: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estado Pasaje
                  </label>
                  <select
                    value={editingJale.travelStatus}
                    onChange={(e) => setEditingJale({ ...editingJale, travelStatus: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Por coordinar">Por coordinar</option>
                    <option value="Pasaje comprado">Pasaje comprado</option>
                    <option value="Confirmado">Confirmado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alojamiento en Junín
                </label>
                <input
                  type="text"
                  value={editingJale.lodgingNote}
                  onChange={(e) => setEditingJale({ ...editingJale, lodgingNote: e.target.value })}
                  placeholder="Ej. Casa de tíos en Jisse"
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Notas Tácticas y Físicas
                </label>
                <textarea
                  rows={2}
                  value={editingJale.notes}
                  onChange={(e) => setEditingJale({ ...editingJale, notes: e.target.value })}
                  placeholder="Ej. Buen pegada, aguanta altura, ya jugó en Junín"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingJale(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Guardar Fichaje
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
