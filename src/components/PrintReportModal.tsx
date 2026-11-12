import React, { useRef } from 'react';
import { ClubState } from '../types';
import { calculateFinancialSummary } from '../utils/calculator';
import { Printer, Download, X, Shield, CheckCircle, FileText } from 'lucide-react';

interface PrintReportModalProps {
  state: ClubState;
  isOpen: boolean;
  onClose: () => void;
  reportType?: 'all' | 'overview' | 'weekly';
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  state,
  isOpen,
  onClose,
  reportType = 'all'
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const summary = calculateFinancialSummary(state);
  const activeMembers = state.members.filter(m => m.active);

  const formatMoney = (val: number) =>
    `S/ ${val.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const todayStr = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto print:p-0 print:bg-white print:fixed-none">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-4 sm:p-8 shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:p-0 print:rounded-none">
        
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Reporte Físico Oficial para Reunión Familiar
              </h3>
              <p className="text-xs text-slate-500">
                Documento ejecutivo listo para imprimir o guardar en PDF (Cuentas Claras)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              title="Cerrar vista previa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div 
          ref={printAreaRef}
          className="print-report-content flex-1 overflow-y-auto my-4 pr-1 sm:pr-2 print:overflow-visible print:my-0 text-slate-900 font-sans"
        >
          <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-xl print:border-none print:p-0 space-y-6">
            
            {/* Document Header / Letterhead */}
            <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-2xl print:border print:border-slate-900">
                  <Shield className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <div className="text-[11px] font-bold tracking-widest uppercase text-slate-600">
                    Club Deportivo Familiar Fundado en Lima
                  </div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-950">
                    CD FAMILIA CÓRDOVA 2027
                  </h1>
                  <p className="text-xs text-slate-600 font-medium">
                    Plan Maestro de Fondos, Cuotas Dominicales, 3 Polladas y Gestión de 3 Jales
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                <div className="text-xs font-bold text-slate-900 uppercase">
                  Informe de Estado de Caja
                </div>
                <div className="text-xs text-slate-600 capitalize">
                  {todayStr}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Destino: Campeonato Junín (Jisse / Janjaillo)
                </div>
              </div>
            </div>

            {/* Financial Summary KPI Cards for paper */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">
                1. Balance General y Estado de Caja
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block">Total en Caja Actual:</span>
                  <span className="text-lg font-black text-slate-900">{formatMoney(summary.currentCashInBox)}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Líquido disponible</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block">Meta 3 Jales (S/1,000 c/u):</span>
                  <span className="text-lg font-black text-slate-900">{formatMoney(summary.jales.targetTotal)}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                    {summary.currentCoverageOfJales}% financiado
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block">Recaudado Cuotas:</span>
                  <span className="text-lg font-black text-slate-900">{formatMoney(summary.weekly.totalCollected)}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{summary.weekly.totalPaidSlots} aportes</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block">Recaudación Proyectada:</span>
                  <span className="text-lg font-black text-slate-900">{formatMoney(summary.totalProjectedRevenue)}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Superávit estimado</span>
                </div>
              </div>
            </div>

            {/* Sunday Quotas Table (Cuotas Dominicales) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  2. Registro y Cumplimiento de Cuotas Dominicales (S/ 10 semanal)
                </h2>
                <span className="text-xs text-slate-500">
                  {activeMembers.length} Aportantes Activos · 33 Semanas
                </span>
              </div>
              
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-300 text-slate-800">
                    <tr>
                      <th className="p-2.5 font-bold">Aportante Familiar</th>
                      <th className="p-2.5 font-bold">Rol / Parentesco</th>
                      <th className="p-2.5 font-bold text-center">Domingos al Día</th>
                      <th className="p-2.5 font-bold text-right">Total Aportado</th>
                      <th className="p-2.5 font-bold text-right">Saldo Pendiente</th>
                      <th className="p-2.5 font-bold text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activeMembers.map(m => {
                      const memberStat = summary.weekly.memberTotals[m.id] || { paidWeeks: 0, totalPaid: 0, pendingWeeks: 33, pendingAmount: 330 };
                      const isUpToDate = memberStat.paidWeeks > 0;

                      return (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">{m.name}</td>
                          <td className="p-2.5 text-slate-600">{m.relationship}</td>
                          <td className="p-2.5 text-center font-semibold text-slate-800">
                            {memberStat.paidWeeks} de {state.weeks.length}
                          </td>
                          <td className="p-2.5 text-right font-bold text-emerald-700">
                            {formatMoney(memberStat.totalPaid)}
                          </td>
                          <td className="p-2.5 text-right text-slate-600">
                            {formatMoney(memberStat.pendingAmount)}
                          </td>
                          <td className="p-2.5 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                              memberStat.pendingWeeks === 0
                                ? 'bg-emerald-100 text-emerald-900'
                                : memberStat.paidWeeks > 0
                                ? 'bg-blue-100 text-blue-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}>
                              {memberStat.pendingWeeks === 0 ? 'COMPLETO' : memberStat.paidWeeks > 0 ? 'AL DÍA' : 'POR INICIAR'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-900">
                    <tr>
                      <td colSpan={3} className="p-2.5 text-right uppercase">Total Recaudado en Cuotas:</td>
                      <td className="p-2.5 text-right text-emerald-800">{formatMoney(summary.weekly.totalCollected)}</td>
                      <td className="p-2.5 text-right text-slate-600">
                        {formatMoney(summary.weekly.totalPotentialMoney - summary.weekly.totalCollected)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Jales (Refuerzos) & Logistics Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  3. Estado de los 3 Jales (Fichajes Externos Permitidos)
                </h2>
                <span className="text-xs text-slate-500">
                  Presupuesto: S/ 1,000 c/u (Pasaje + Honorario) · Alojamiento en pueblo
                </span>
              </div>

              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-300 text-slate-800">
                    <tr>
                      <th className="p-2.5 font-bold">Cupo</th>
                      <th className="p-2.5 font-bold">Jugador / Posición</th>
                      <th className="p-2.5 font-bold">Presupuesto</th>
                      <th className="p-2.5 font-bold">Logística Pasaje</th>
                      <th className="p-2.5 font-bold">Hospedaje en Junín</th>
                      <th className="p-2.5 font-bold text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {state.jales.map(j => (
                      <tr key={j.id}>
                        <td className="p-2.5 font-bold text-slate-800">Jale #{j.number}</td>
                        <td className="p-2.5">
                          <span className="font-bold text-slate-900 block">{j.name}</span>
                          <span className="text-[11px] text-slate-500">{j.position}</span>
                        </td>
                        <td className="p-2.5 font-semibold text-slate-800">{formatMoney(j.budgetAllocated)}</td>
                        <td className="p-2.5 text-slate-700">{j.travelStatus} (cubierto por club)</td>
                        <td className="p-2.5 text-slate-700">{j.lodgingNote}</td>
                        <td className="p-2.5 text-center">
                          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 rounded-sm font-semibold text-[10px]">
                            {j.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3 Polladas & Commitments Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Polladas */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                <h3 className="font-bold text-xs uppercase text-slate-800 mb-2">
                  4. Plan de las 3 Polladas Pro-Fondos
                </h3>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {state.polladas.map(p => (
                    <div key={p.id} className="flex justify-between border-b border-slate-200 pb-1">
                      <span>• Pollada #{p.number} ({p.targetDate}):</span>
                      <span className="font-semibold">{p.targetDishes} platos · Meta neta {formatMoney(p.targetDishes * (p.pricePerDish - p.costPerDish))}</span>
                    </div>
                  ))}
                  <div className="pt-1 text-[11px] text-slate-500">
                    * Tarjetas asignadas: 17 tarjetas por cada uno de los 6 miembros.
                  </div>
                </div>
              </div>

              {/* Commitments & Especies */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                <h3 className="font-bold text-xs uppercase text-slate-800 mb-2">
                  5. Compromisos en Especie & Apoyos Clave
                </h3>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700">
                  <div>• <strong>Ramón:</strong> 4 six pack Sporade</div>
                  <div>• <strong>Sonia:</strong> 3 paquetes agua</div>
                  <div>• <strong>Mastha:</strong> Pelota oficial</div>
                  <div>• <strong>Jhon:</strong> Éter y botiquín</div>
                  <div>• <strong>Rocío:</strong> Camisetas oficiales</div>
                  <div>• <strong>Manolo:</strong> S/ 500 inscripción</div>
                  <div>• <strong>Edgar:</strong> 1 Banderola club</div>
                  <div>• <strong>Barcos:</strong> Guantes arquero</div>
                  <div>• <strong>Vides:</strong> Sorpresa (Mayo 2027)</div>
                  <div>• <strong>Manolo:</strong> Sorpresa (Mayo 2027)</div>
                </div>
              </div>

            </div>

            {/* Official Signatures & Transparency Seal for the family meeting */}
            <div className="pt-6 mt-6 border-t-2 border-slate-300">
              <div className="text-center text-xs font-semibold text-slate-600 mb-8 italic">
                "Cuentas claras y transparentes para la unión de la familia Córdova. ¡Rumbo a la gloria en Junín 2027!"
              </div>

              <div className="grid grid-cols-3 gap-6 text-center text-xs">
                <div className="border-t border-slate-400 pt-2">
                  <div className="font-bold text-slate-900">Coordinador General & Tesorería</div>
                  <div className="text-[11px] text-slate-500">CD Familia Córdova</div>
                </div>

                <div className="border-t border-slate-400 pt-2">
                  <div className="font-bold text-slate-900">Representante Familiar #1</div>
                  <div className="text-[11px] text-slate-500">Visto Bueno Reunión</div>
                </div>

                <div className="border-t border-slate-400 pt-2">
                  <div className="font-bold text-slate-900">Representante Familiar #2</div>
                  <div className="text-[11px] text-slate-500">Visto Bueno Reunión</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer (Hidden in print) */}
        <div className="pt-3 border-t border-slate-200 print:hidden flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Consejo: Al seleccionar "Imprimir / Guardar PDF", puedes elegir guardar como archivo PDF o imprimir en papel A4.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
