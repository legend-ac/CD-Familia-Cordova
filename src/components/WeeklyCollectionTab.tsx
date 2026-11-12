import React, { useState } from 'react';
import { ClubState, PaymentMethod, WeeklyMember } from '../types';
import { calculateWeeklyStats } from '../utils/calculator';
import { 
  CheckCircle2, 
  Circle, 
  UserPlus, 
  Calendar, 
  DollarSign, 
  Wallet,
  Phone,
  Search,
  Filter,
  CheckCheck,
  Printer
} from 'lucide-react';

interface WeeklyCollectionTabProps {
  state: ClubState;
  onUpdatePayment: (weekNumber: number, memberId: string, paid: boolean, method?: PaymentMethod) => void;
  onMarkEntireWeekPaid: (weekNumber: number) => void;
  onAddMember: (member: Omit<WeeklyMember, 'id'>) => void;
  onOpenPrintModal: () => void;
}

export const WeeklyCollectionTab: React.FC<WeeklyCollectionTabProps> = ({
  state,
  onUpdatePayment,
  onMarkEntireWeekPaid,
  onAddMember,
  onOpenPrintModal,
}) => {
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number>(1);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRel, setNewMemberRel] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');
  const [memberFilter, setMemberFilter] = useState('');

  const activeMembers = state.members.filter(m => m.active);
  const stats = calculateWeeklyStats(state.weeks, activeMembers.length, state.weeklyQuota);
  const selectedWeek = state.weeks.find(w => w.weekNumber === selectedWeekNumber) || state.weeks[0];

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    onAddMember({
      name: newMemberName.trim(),
      relationship: newMemberRel.trim() || 'Familiar',
      phone: newMemberPhone.trim() || undefined,
      active: true,
    });
    setNewMemberName('');
    setNewMemberRel('');
    setNewMemberPhone('');
    setIsAddMemberOpen(false);
  };

  const formatMoney = (val: number) => 
    `S/ ${val.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const filteredMembers = activeMembers.filter(m => 
    m.name.toLowerCase().includes(memberFilter.toLowerCase()) ||
    m.relationship.toLowerCase().includes(memberFilter.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Stats */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
              <Calendar className="w-4 h-4" />
              <span>Control Dominical de Cuotas</span>
              <span className="text-slate-400">·</span>
              <span>S/ 10 por persona</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Registro Semanal de Aportes Familiares
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              33 domingos desde el 15/11/2026 hasta el 27/06/2027. Cada sol suma para los 3 jales y gastos en Junín.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenPrintModal}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer border border-slate-200"
              title="Imprimir tabla contable de cuotas dominicales para la reunión"
            >
              <Printer className="w-4 h-4 text-slate-700" />
              <span>Imprimir Reporte (PDF)</span>
            </button>
            <button
              onClick={() => setIsAddMemberOpen(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Nuevo Aportante</span>
            </button>
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div>
            <span className="text-xs text-slate-500">Recaudado en Cuotas</span>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900">
              {formatMoney(stats.totalCollected)}
            </div>
            <span className="text-xs text-slate-400">de {formatMoney(stats.totalPotentialMoney)}</span>
          </div>

          <div>
            <span className="text-xs text-slate-500">Aportes Realizados</span>
            <div className="text-lg sm:text-xl font-extrabold text-emerald-600">
              {stats.totalPaidSlots} / {stats.totalPotentialSlots}
            </div>
            <span className="text-xs text-slate-400">({stats.collectionPercentage}% completado)</span>
          </div>

          <div>
            <span className="text-xs text-slate-500">Aportantes Activos</span>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900">
              {activeMembers.length} personas
            </div>
            <span className="text-xs text-slate-400">S/ {activeMembers.length * 10} por domingo</span>
          </div>

          <div>
            <span className="text-xs text-slate-500">Domingos Totales</span>
            <div className="text-lg sm:text-xl font-extrabold text-blue-600">
              33 semanas
            </div>
            <span className="text-xs text-slate-400">Cierre 30/06/2027</span>
          </div>
        </div>
      </div>

      {/* Week Selector Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Seleccionar Domingo:
            </span>
            <select
              value={selectedWeekNumber}
              onChange={(e) => setSelectedWeekNumber(Number(e.target.value))}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-sm font-semibold rounded-lg px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            >
              {state.weeks.map(w => {
                const paidCount = Object.values(w.payments).filter(p => p.paid).length;
                return (
                  <option key={w.weekNumber} value={w.weekNumber}>
                    Semana #{w.weekNumber} · {w.displayDate} ({paidCount}/{activeMembers.length} pagaron)
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onMarkEntireWeekPaid(selectedWeekNumber)}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Marcar a todos los miembros como que ya pagaron este domingo"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Marcar Domingo Completo (S/ {activeMembers.length * 10})</span>
            </button>
            
            <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tarjetas
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'matrix' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tabla Matriz
              </button>
            </div>
          </div>
        </div>

        {/* Selected Sunday Details Panel */}
        {selectedWeek && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center font-bold text-base">
                #{selectedWeek.weekNumber}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">
                  {selectedWeek.displayDate}
                </div>
                <div className="text-slate-500 text-xs">
                  Aportes registrados este domingo: {Object.values(selectedWeek.payments).filter(p => p.paid).length} de {activeMembers.length}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Recaudado este día:</span>
                <span className="font-bold text-slate-900">
                  {formatMoney(
                    Object.values(selectedWeek.payments)
                      .filter(p => p.paid)
                      .reduce((acc, curr) => acc + (curr.amount || 10), 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Member Cards or Matrix */}
      {viewMode === 'cards' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Aportantes Familiares ({activeMembers.length})
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={memberFilter}
                onChange={(e) => setMemberFilter(e.target.value)}
                placeholder="Buscar aportante..."
                className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500 w-44 sm:w-56"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => {
              const currentPayment = selectedWeek?.payments[member.id] || { paid: false, amount: 10 };
              const memberStat = stats.memberTotals[member.id] || { paidWeeks: 0, totalPaid: 0, pendingWeeks: 33, pendingAmount: 330 };
              const isPaidThisWeek = currentPayment.paid;

              return (
                <div
                  key={member.id}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-xs flex flex-col justify-between ${
                    isPaidThisWeek ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'
                  }`}
                >
                  <div>
                    {/* Header: Name & Relationship */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          {member.name}
                        </h4>
                        <span className="text-xs text-slate-500 block">
                          {member.relationship}
                        </span>
                      </div>
                      
                      {member.phone && (
                        <a
                          href={`tel:${member.phone.replace(/\s+/g, '')}`}
                          className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
                          title={`Llamar a ${member.name}: ${member.phone}`}
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {/* Overall Progress for this member */}
                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block">Domingos al día:</span>
                        <span className="font-bold text-slate-800">
                          {memberStat.paidWeeks} / {state.weeks.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Total Aportado:</span>
                        <span className="font-bold text-emerald-600">
                          {formatMoney(memberStat.totalPaid)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment toggle for the SELECTED week */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="text-xs">
                      <span className="text-slate-400 block">Semana #{selectedWeekNumber}:</span>
                      <span className={`font-semibold ${isPaidThisWeek ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {isPaidThisWeek ? `Pagado (${currentPayment.method || 'Efectivo'})` : 'Pendiente (S/ 10)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isPaidThisWeek ? (
                        <button
                          onClick={() => onUpdatePayment(selectedWeekNumber, member.id, false)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Desmarcar
                        </button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onUpdatePayment(selectedWeekNumber, member.id, true, 'Yape')}
                            className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                            title="Pagar por Yape"
                          >
                            Yape S/10
                          </button>
                          <button
                            onClick={() => onUpdatePayment(selectedWeekNumber, member.id, true, 'Efectivo')}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                            title="Pagar en Efectivo"
                          >
                            Efectivo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Matrix View: All weeks table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              Matriz Completa de los 33 Domingos (Nov 2026 - Jun 2027)
            </h3>
            <span className="text-xs text-slate-400">
              Haz clic en cualquier celda para alternar Pagado / Pendiente
            </span>
          </div>
          
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="p-3 font-bold sticky left-0 bg-slate-50 z-10">Semana</th>
                  <th className="p-3 font-bold">Fecha</th>
                  {activeMembers.map(m => (
                    <th key={m.id} className="p-3 font-bold text-center whitespace-nowrap">
                      {m.name.split(' ')[0]}
                    </th>
                  ))}
                  <th className="p-3 font-bold text-right">Total Semanal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.weeks.map(w => {
                  const weekPaidSum = Object.values(w.payments)
                    .filter(p => p.paid)
                    .reduce((acc, curr) => acc + (curr.amount || 10), 0);
                  const isCurrent = w.weekNumber === selectedWeekNumber;

                  return (
                    <tr
                      key={w.weekNumber}
                      className={`hover:bg-slate-50/80 transition-colors ${isCurrent ? 'bg-amber-50/50' : ''}`}
                    >
                      <td className="p-3 font-bold text-slate-800 sticky left-0 bg-white z-5 whitespace-nowrap">
                        Semana #{w.weekNumber}
                      </td>
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        {w.displayDate}
                      </td>
                      {activeMembers.map(m => {
                        const p = w.payments[m.id];
                        const isPaid = p?.paid;
                        return (
                          <td key={m.id} className="p-2 text-center">
                            <button
                              onClick={() => onUpdatePayment(w.weekNumber, m.id, !isPaid, 'Efectivo')}
                              className={`w-7 h-7 rounded-lg inline-flex items-center justify-center font-bold text-xs cursor-pointer transition-all ${
                                isPaid
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-slate-100 text-slate-400 hover:bg-amber-100 hover:text-amber-800'
                              }`}
                              title={`${m.name}: ${isPaid ? 'Pagado S/10' : 'Pendiente'}`}
                            >
                              {isPaid ? '✓' : '—'}
                            </button>
                          </td>
                        );
                      })}
                      <td className="p-3 text-right font-bold text-slate-900">
                        {formatMoney(weekPaidSum)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Member */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Agregar Nuevo Aportante Familiar
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Cada nuevo aportante sumará S/ 10 semanales para fortalecer la meta de los 3 jales y Junín 2027.
            </p>

            <form onSubmit={handleAddMemberSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Ej. Tío Walter Córdova"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Parentesco / Rol en el Club
                </label>
                <input
                  type="text"
                  value={newMemberRel}
                  onChange={(e) => setNewMemberRel(e.target.value)}
                  placeholder="Ej. Primo / Barra Familiar / Tío"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teléfono / WhatsApp (Opcional)
                </label>
                <input
                  type="text"
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                  placeholder="Ej. 987 123 456"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Guardar Aportante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
