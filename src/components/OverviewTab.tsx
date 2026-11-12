import React from 'react';
import { ClubState } from '../types';
import { calculateFinancialSummary } from '../utils/calculator';
import { FinancialCharts } from './FinancialCharts';
import { 
  DollarSign, 
  Users, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Sparkles,
  Home,
  Bus,
  UtensilsCrossed,
  ShieldAlert,
  ArrowRight,
  Printer
} from 'lucide-react';

interface OverviewTabProps {
  state: ClubState;
  onNavigateTab: (tabId: string) => void;
  onOpenPrintModal: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ state, onNavigateTab, onOpenPrintModal }) => {
  const summary = calculateFinancialSummary(state);
  const activeMembers = state.members.filter(m => m.active);

  const formatMoney = (amount: number) => 
    `S/ ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-8">
      
      {/* Top Notice: Realistic Executive Summary */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/80 rounded-2xl p-6 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>Diagnóstico & Viabilidad 100% Realista</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Meta: 3 Jales (S/ 3,000) + Logística Provincia Junio 2027
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl">
              Coordinación centralizada: con <strong>{activeMembers.length} personas aportando S/ 10 cada domingo</strong> durante 33 semanas y <strong>3 polladas bien organizadas</strong>, se proyecta recaudar más de S/ 5,000, cubriendo holgadamente los 3 jales, el saldo de inscripción y dejando reserva para imprevistos.
            </p>
          </div>
          <div className="shrink-0 flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenPrintModal}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-600 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2"
              title="Exportar reporte físico para reuniones familiares"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Reporte Físico / PDF</span>
            </button>
            <button
              onClick={() => onNavigateTab('weekly')}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>Registrar Cuota</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Real Cash in Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Caja Actual Disponible</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">
              {formatMoney(summary.currentCashInBox)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span>{formatMoney(summary.weekly.totalCollected)} cuotas</span>
              <span>·</span>
              <span>{formatMoney(summary.polladas.actualNetProfit)} polladas</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Jales Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Meta 3 Jales (S/ 3,000)</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">
              {summary.currentCoverageOfJales}%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {formatMoney(summary.currentCashInBox)} de {formatMoney(summary.jales.targetTotal)} necesarios
            </div>
          </div>
        </div>

        {/* KPI 3: Total Projected Revenue */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recaudación Proyectada</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">
              {formatMoney(summary.totalProjectedRevenue)}
            </div>
            <div className="text-xs text-emerald-600 font-medium mt-1">
              Superávit estimado de {formatMoney(Math.max(0, summary.projectedSurplus))}
            </div>
          </div>
        </div>

        {/* KPI 4: Sundays Count */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Semanas de Colecta</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">
              {summary.weekly.totalWeeksCount} Domingos
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Desde 15/11/2026 hasta 27/06/2027
            </div>
          </div>
        </div>

      </div>

      {/* Jales Funding Milestone Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Termómetro de Financiamiento: Los 3 Jales</span>
              <span className="text-xs text-slate-500 font-normal">(S/ 1,000 por cada jugador)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Cada S/ 1,000 acumulados en caja asegura un refuerzo confirmado para el campeonato en Junín.
            </p>
          </div>
          <div className="text-sm font-bold text-slate-700">
            {formatMoney(summary.currentCashInBox)} / {formatMoney(summary.jales.targetTotal)}
          </div>
        </div>

        {/* Bar */}
        <div className="relative w-full bg-slate-100 rounded-full h-4 overflow-hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(100, (summary.currentCashInBox / 3000) * 100)}%` }}
          />
        </div>

        {/* Milestones */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="border-t-2 border-slate-200 pt-2">
            <span className="block text-xs font-semibold text-slate-700">Jale 1 (S/ 1,000)</span>
            <span className="block text-xs text-slate-500">
              {summary.currentCashInBox >= 1000 ? '✅ Financiado' : 'Pendiente'}
            </span>
          </div>
          <div className="border-t-2 border-slate-200 pt-2">
            <span className="block text-xs font-semibold text-slate-700">Jale 2 (S/ 2,000)</span>
            <span className="block text-xs text-slate-500">
              {summary.currentCashInBox >= 2000 ? '✅ Financiado' : 'Pendiente'}
            </span>
          </div>
          <div className="border-t-2 border-slate-200 pt-2">
            <span className="block text-xs font-semibold text-slate-700">Jale 3 (S/ 3,000)</span>
            <span className="block text-xs text-slate-500">
              {summary.currentCashInBox >= 3000 ? '✅ Financiado' : 'Pendiente'}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Data Analytics Dashboard (Recharts) */}
      <FinancialCharts state={state} />

      {/* Dual Column: Realism Financial Breakdown & Operational Truths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Financial Reality Map */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <span>Estructura de Fondos Realista (2026-2027)</span>
            </h3>
            <span className="text-xs text-slate-400">Sin ilusiones</span>
          </div>

          <div className="space-y-4">
            {/* Income 1 */}
            <div className="flex items-start justify-between text-sm">
              <div>
                <div className="font-semibold text-slate-800">Cuotas Dominicales (S/ 10 semanal)</div>
                <div className="text-xs text-slate-500">
                  {activeMembers.length} personas fijas × 33 semanas = S/ {activeMembers.length * 33 * 10} potencial
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900">{formatMoney(summary.weekly.totalCollected)}</div>
                <div className="text-xs text-slate-400">Meta: {formatMoney(summary.weekly.totalPotentialMoney)}</div>
              </div>
            </div>

            {/* Income 2 */}
            <div className="flex items-start justify-between text-sm">
              <div>
                <div className="font-semibold text-slate-800">3 Polladas Familiares Pro-Fondos</div>
                <div className="text-xs text-slate-500">
                  3 eventos × ~100 platos a S/ 20 c/u (costo S/ 8.50, ganancia S/ 11.50)
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900">{formatMoney(summary.polladas.actualNetProfit)}</div>
                <div className="text-xs text-slate-400">Meta Neta: {formatMoney(summary.polladas.projectedNetProfit)}</div>
              </div>
            </div>

            {/* Income 3 */}
            <div className="flex items-start justify-between text-sm">
              <div>
                <div className="font-semibold text-slate-800">Aporte Inscripción Manolo</div>
                <div className="text-xs text-slate-500">Compromiso seguro para asegurar la inscripción al 70%+</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-600">S/ 500.00</div>
                <div className="text-xs text-slate-400">Donación directa</div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                <span>Total Presupuestado Requerido:</span>
                <span>{formatMoney(summary.totalBudgetRequired)}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Incluye: 3 Jales (S/ 3,000) + Saldo Inscripción (S/ 180) + Hielo/Fruta/Agua extra (S/ 250) + Imprevistos (S/ 500).
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Logistics & Operations Status (What's Resolved vs What's Handled) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Diagnóstico de Logística & Compromisos</span>
            </h3>
            <span className="text-xs text-slate-400">Jisse / Janjaillo</span>
          </div>

          <div className="space-y-3.5 text-sm">
            
            {/* Alojamiento */}
            <div className="flex items-start gap-3">
              <Home className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-800">Alojamiento: Resuelto (S/ 0 de costo)</div>
                <p className="text-xs text-slate-500">
                  Cada familia tiene donde llegar y para los 3 jales hay casas familiares coordinadas en el pueblo.
                </p>
              </div>
            </div>

            {/* Transporte */}
            <div className="flex items-start gap-3">
              <Bus className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-800">Transporte: Resuelto para familiares</div>
                <p className="text-xs text-slate-500">
                  Familiares y jugadores van por su propia cuenta. Los pasajes de los 3 jales salen del presupuesto de los S/ 1,000 asignados.
                </p>
              </div>
            </div>

            {/* Indumentaria & Balones */}
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-800">Camisetas, Banderola & Balones: Donados</div>
                <p className="text-xs text-slate-500">
                  Camisetas por Rocío, banderola por Edgar Espinoza, guantes por Barcos y balón oficial por Mastha.
                </p>
              </div>
            </div>

            {/* Botiquín & Salud */}
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-800">Botiquín Listo & Orden Médica Cumplida</div>
                <p className="text-xs text-slate-500">
                  Jhon aporta éter para lesiones. Orden estricta acatada: médico omitido para no encarecer el viaje.
                </p>
              </div>
            </div>

            {/* Comida */}
            <div className="flex items-start gap-3">
              <UtensilsCrossed className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-800">Alimentación: Autogestionada / Omitida del fondo común</div>
                <p className="text-xs text-slate-500">
                  Cada familia/grupo cubre sus alimentos en Junín. No se recarga a la caja del club.
                </p>
              </div>
            </div>

            {/* Sorpresas */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-800">Sorpresas de Manolo y Vides: Alerta Mayo 2027</div>
                <p className="text-xs text-slate-500">
                  Regla establecida: se coordinan y solicitan exactamente 30 días antes del campeonato.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Guide for Solo Leadership: Cómo llevar la batuta solo sin quemarse */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <span>Reglas de Oro: Liderando la Batuta Solo con Éxito</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-amber-950">
          <div className="bg-white/80 rounded-xl p-3 border border-amber-200/60">
            <div className="font-bold mb-1">1. Transparencia Total Dominical</div>
            <p>
              Cada domingo por la noche, usa el botón <strong>Reporte WhatsApp</strong> para enviar el estado de caja al grupo familiar. Nadie duda cuando las cuentas son públicas y automáticas.
            </p>
          </div>
          <div className="bg-white/80 rounded-xl p-3 border border-amber-200/60">
            <div className="font-bold mb-1">2. Tarjetas de Pollada Asignadas</div>
            <p>
              No vendas solo las 100 tarjetas. Reparte 16-17 tarjetas a cada uno de los 6 miembros del núcleo. Que cada quien sea responsable de su paquete.
            </p>
          </div>
          <div className="bg-white/80 rounded-xl p-3 border border-amber-200/60">
            <div className="font-bold mb-1">3. Jales Cerrados con Anticipación</div>
            <p>
              Negocia con los 3 jales entre marzo y abril de 2027. Asegura que sepan que juegan en altura (+3,400 msnm) y que su pasaje e incentivo están garantizados.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
