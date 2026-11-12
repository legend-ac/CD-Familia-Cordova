import React, { useState } from 'react';
import { ClubState, PolladaItem } from '../types';
import { calculatePolladasStats } from '../utils/calculator';
import { 
  Flame, 
  Utensils, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Calendar, 
  Edit3, 
  Layers,
  ShoppingBag,
  TrendingUp,
  Receipt
} from 'lucide-react';

interface PolladasTabProps {
  state: ClubState;
  onUpdatePollada: (pollada: PolladaItem) => void;
}

export const PolladasTab: React.FC<PolladasTabProps> = ({ state, onUpdatePollada }) => {
  const [editingPollada, setEditingPollada] = useState<PolladaItem | null>(null);
  const activeMembers = state.members.filter(m => m.active);
  const stats = calculatePolladasStats(state.polladas);

  const formatMoney = (val: number) => 
    `S/ ${val.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleSavePollada = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPollada) return;
    onUpdatePollada(editingPollada);
    setEditingPollada(null);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
              <Flame className="w-4 h-4" />
              <span>Estrategia de Actividades Familiares</span>
              <span className="text-slate-400">·</span>
              <span>Lima 2027</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Plan Maestro: 3 Polladas Pro-Fondos
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Cálculo real de insumos, costo por plato, metas de tarjetas distribuidas entre los {activeMembers.length} del equipo y ganancia neta directa a caja.
            </p>
          </div>
        </div>

        {/* Financial metrics for the 3 polladas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div>
            <span className="text-xs text-slate-500">Ganancia Neta Real</span>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900">
              {formatMoney(stats.actualNetProfit)}
            </div>
            <span className="text-xs text-slate-400">Ingreso ya en caja</span>
          </div>

          <div>
            <span className="text-xs text-slate-500">Ganancia Neta Meta</span>
            <div className="text-lg sm:text-xl font-extrabold text-emerald-600">
              {formatMoney(stats.projectedNetProfit)}
            </div>
            <span className="text-xs text-slate-400">Suficiente para los 3 jales</span>
          </div>

          <div>
            <span className="text-xs text-slate-500">Platos por Pollada</span>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900">
              100 a 110 platos
            </div>
            <span className="text-xs text-slate-400">~17 tarjetas por persona</span>
          </div>

          <div>
            <span className="text-xs text-slate-500">Margen por Plato</span>
            <div className="text-lg sm:text-xl font-extrabold text-amber-600">
              S/ 11.50 neto
            </div>
            <span className="text-xs text-slate-400">Venta S/ 20 · Costo S/ 8.50</span>
          </div>
        </div>
      </div>

      {/* Realistic Insumos Cost Breakdown Box */}
      <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-5 text-xs text-amber-950">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-900 mb-2">
          <Utensils className="w-4 h-4 text-amber-700" />
          <span>Ficha Técnica de Costos por Plato (Realidad Lima)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200/60">
            <span className="block text-slate-500">1/4 de Pollo:</span>
            <span className="font-bold text-slate-900">S/ 4.80</span>
          </div>
          <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200/60">
            <span className="block text-slate-500">Papa Huayro (250g):</span>
            <span className="font-bold text-slate-900">S/ 1.10</span>
          </div>
          <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200/60">
            <span className="block text-slate-500">Ensalada col/zanahoria:</span>
            <span className="font-bold text-slate-900">S/ 0.70</span>
          </div>
          <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200/60">
            <span className="block text-slate-500">Ají casero + cremas:</span>
            <span className="font-bold text-slate-900">S/ 0.80</span>
          </div>
          <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200/60">
            <span className="block text-slate-500">Táper + cubierto + bolsa:</span>
            <span className="font-bold text-slate-900">S/ 0.60</span>
          </div>
          <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200/60">
            <span className="block text-slate-500">Carbón / aderezo:</span>
            <span className="font-bold text-slate-900">S/ 0.50</span>
          </div>
        </div>
        <div className="mt-3 text-slate-600 font-medium flex flex-wrap items-center justify-between gap-2 border-t border-amber-200/50 pt-2">
          <span>Costo total estimado por plato: <strong>S/ 8.50</strong> · Precio de venta sugerido: <strong>S/ 20.00</strong></span>
          <span className="text-emerald-700 font-bold">Ganancia neta líquida: S/ 11.50 por plato (57.5% de margen)</span>
        </div>
      </div>

      {/* The 3 Polladas Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Cronograma de las 3 Actividades Programadas
          </h3>
          <span className="text-xs text-slate-500">
            Distribuir 17 tarjetas a cada uno de los {activeMembers.length} miembros del equipo
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {state.polladas.map((pollada, index) => {
            const projectedGross = pollada.targetDishes * pollada.pricePerDish;
            const projectedNet = pollada.targetDishes * (pollada.pricePerDish - pollada.costPerDish);
            const cardsPerMember = Math.ceil(pollada.targetDishes / Math.max(1, activeMembers.length));

            const isDone = pollada.status === 'Realizada';
            const realNet = isDone
              ? (pollada.actualGrossIncome || 0) - (pollada.actualTotalCost || 0)
              : pollada.soldDishes * (pollada.pricePerDish - pollada.costPerDish);

            return (
              <div
                key={pollada.id}
                className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between transition-all ${
                  isDone ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Badge & Number */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                      Actividad #{pollada.number}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        pollada.status === 'Realizada'
                          ? 'bg-emerald-100 text-emerald-800'
                          : pollada.status === 'En preparación'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {pollada.status}
                    </span>
                  </div>

                  {/* Title & Date */}
                  <h4 className="text-base font-bold text-slate-900 mt-2">
                    {pollada.name}
                  </h4>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Fecha tentativa: <strong>{pollada.targetDate}</strong></span>
                  </div>

                  {/* Location & notes */}
                  <p className="text-xs text-slate-600 mt-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {pollada.notes}
                  </p>

                  {/* Metrics */}
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Meta de Platos:</span>
                      <span className="font-bold text-slate-800">{pollada.targetDishes} tarjetas</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Cuota por miembro ({activeMembers.length}):</span>
                      <span className="font-bold text-amber-600">{cardsPerMember} tarjetas c/u</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Precio tarjeta:</span>
                      <span className="font-bold text-slate-800">{formatMoney(pollada.pricePerDish)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Ganancia neta meta:</span>
                      <span className="font-bold text-emerald-600">{formatMoney(projectedNet)}</span>
                    </div>

                    {isDone && (
                      <div className="mt-3 pt-3 border-t border-slate-200 bg-emerald-50/50 p-2.5 rounded-xl">
                        <div className="flex justify-between text-xs font-bold text-emerald-900">
                          <span>Ganancia Real Obtenida:</span>
                          <span>{formatMoney(realNet)}</span>
                        </div>
                        <div className="text-xs text-emerald-700 mt-0.5">
                          Platos vendidos: {pollada.soldDishes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit Button */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => setEditingPollada(pollada)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar / Registrar Cuentas</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Edit Pollada details */}
      {editingPollada && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Editar {editingPollada.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Ajusta las metas, registra los platos vendidos y calcula los costos reales de la actividad.
            </p>

            <form onSubmit={handleSavePollada} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estado de la Actividad
                  </label>
                  <select
                    value={editingPollada.status}
                    onChange={(e) => setEditingPollada({ ...editingPollada, status: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Planificada">Planificada</option>
                    <option value="En preparación">En preparación</option>
                    <option value="Realizada">Realizada (Cerrada)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Fecha Tentativa
                  </label>
                  <input
                    type="date"
                    value={editingPollada.targetDate}
                    onChange={(e) => setEditingPollada({ ...editingPollada, targetDate: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Meta de Platos
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={editingPollada.targetDishes}
                    onChange={(e) => setEditingPollada({ ...editingPollada, targetDishes: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Precio por Tarjeta (S/)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={editingPollada.pricePerDish}
                    onChange={(e) => setEditingPollada({ ...editingPollada, pricePerDish: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Costo Insumos (S/)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={editingPollada.costPerDish}
                    onChange={(e) => setEditingPollada({ ...editingPollada, costPerDish: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Actuals when in progress or done */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block text-xs uppercase">
                  Datos Reales de Ejecución
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Platos Vendidos
                    </label>
                    <input
                      type="number"
                      value={editingPollada.soldDishes}
                      onChange={(e) => setEditingPollada({ ...editingPollada, soldDishes: Number(e.target.value) })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Gasto Total Real (S/)
                    </label>
                    <input
                      type="number"
                      value={editingPollada.actualTotalCost !== undefined ? editingPollada.actualTotalCost : ''}
                      placeholder={`Ej. ${(editingPollada.soldDishes * editingPollada.costPerDish) || 850}`}
                      onChange={(e) => setEditingPollada({ ...editingPollada, actualTotalCost: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Ingreso Bruto Real (S/)
                    </label>
                    <input
                      type="number"
                      value={editingPollada.actualGrossIncome !== undefined ? editingPollada.actualGrossIncome : ''}
                      placeholder={`Ej. ${(editingPollada.soldDishes * editingPollada.pricePerDish) || 2000}`}
                      onChange={(e) => setEditingPollada({ ...editingPollada, actualGrossIncome: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Notas / Lugar de la Pollada
                </label>
                <textarea
                  rows={2}
                  value={editingPollada.notes}
                  onChange={(e) => setEditingPollada({ ...editingPollada, notes: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPollada(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
