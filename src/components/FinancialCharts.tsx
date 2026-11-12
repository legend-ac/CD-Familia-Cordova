import React from 'react';
import { ClubState } from '../types';
import { calculateFinancialSummary } from '../utils/calculator';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieIcon, ShieldAlert } from 'lucide-react';

interface FinancialChartsProps {
  state: ClubState;
}

export const FinancialCharts: React.FC<FinancialChartsProps> = ({ state }) => {
  const summary = calculateFinancialSummary(state);
  const activeMembers = state.members.filter(m => m.active);
  const weeklyQuota = state.weeklyQuota || 10;
  const weeklyPace = activeMembers.length * weeklyQuota; // S/ 60 per week

  const formatMoney = (val: number) =>
    `S/ ${val.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  // 1. Data for Weekly Cumulative Savings Projection (with Polladas milestones)
  const timelineData = [
    { name: '15 Nov', semana: 'Sem 1', cuotas: 60, totalProyectado: 60, real: summary.currentCashInBox > 0 ? 60 : 0 },
    { name: '30 Nov', semana: 'Sem 3', cuotas: 180, totalProyectado: 180, real: summary.currentCashInBox >= 180 ? 180 : null },
    { name: '15 Dic', semana: 'Sem 5', cuotas: 300, totalProyectado: 300, real: summary.currentCashInBox >= 300 ? 300 : null },
    { name: '31 Dic', semana: 'Sem 7', cuotas: 420, totalProyectado: 420, real: null },
    { name: '15 Ene', semana: 'Sem 9', cuotas: 540, totalProyectado: 540, real: null },
    { name: '31 Ene (Pol 1)', semana: 'Sem 11', cuotas: 660, totalProyectado: 660 + 1150, real: null }, // Pollada 1 jump
    { name: '15 Feb', semana: 'Sem 13', cuotas: 780, totalProyectado: 780 + 1150, real: null },
    { name: '28 Feb', semana: 'Sem 15', cuotas: 900, totalProyectado: 900 + 1150, real: null },
    { name: '15 Mar', semana: 'Sem 17', cuotas: 1020, totalProyectado: 1020 + 1150, real: null },
    { name: '31 Mar', semana: 'Sem 19', cuotas: 1140, totalProyectado: 1140 + 1150, real: null },
    { name: '18 Abr (Pol 2)', semana: 'Sem 22', cuotas: 1320, totalProyectado: 1320 + 2300, real: null }, // Pollada 2 jump
    { name: '30 Abr', semana: 'Sem 24', cuotas: 1440, totalProyectado: 1440 + 2300, real: null },
    { name: '15 May', semana: 'Sem 26', cuotas: 1560, totalProyectado: 1560 + 2300, real: null },
    { name: '30 May (Pol 3)', semana: 'Sem 29', cuotas: 1740, totalProyectado: 1740 + 3565, real: null }, // Pollada 3 jump
    { name: '15 Jun', semana: 'Sem 31', cuotas: 1860, totalProyectado: 1860 + 3565, real: null },
    { name: '27 Jun (Meta)', semana: 'Sem 33', cuotas: 1980, totalProyectado: 1980 + 3565, real: null }
  ];

  // 2. Data for Comparison: Funds vs Budgeted Expenses
  const fundsVsExpensesData = [
    {
      category: '3 Jales (Fichajes)',
      presupuestado: 3000,
      cubierto: Math.min(3000, summary.currentCashInBox),
      deficit: Math.max(0, 3000 - summary.currentCashInBox)
    },
    {
      category: 'Saldo Inscripción',
      presupuestado: 180,
      cubierto: summary.currentCashInBox >= 3000 ? Math.min(180, summary.currentCashInBox - 3000) : 0,
      deficit: summary.currentCashInBox >= 3000 ? Math.max(0, 180 - (summary.currentCashInBox - 3000)) : 180
    },
    {
      category: 'Hielo / Fruta Fresca',
      presupuestado: 250,
      cubierto: summary.currentCashInBox >= 3180 ? Math.min(250, summary.currentCashInBox - 3180) : 0,
      deficit: summary.currentCashInBox >= 3180 ? Math.max(0, 250 - (summary.currentCashInBox - 3180)) : 250
    },
    {
      category: 'Fondo Imprevistos',
      presupuestado: 500,
      cubierto: summary.currentCashInBox >= 3430 ? Math.min(500, summary.currentCashInBox - 3430) : 0,
      deficit: summary.currentCashInBox >= 3430 ? Math.max(0, 500 - (summary.currentCashInBox - 3430)) : 500
    }
  ];

  // 3. Data for Income Sources Pie / Donut
  const incomeSourcesData = [
    { name: 'Cuotas Semanales (33 Sem)', value: summary.weekly.totalPotentialMoney, color: '#f59e0b' },
    { name: 'Pollada #1 (Enero)', value: 1150, color: '#10b981' },
    { name: 'Pollada #2 (Abril)', value: 1150, color: '#06b6d4' },
    { name: 'Pollada #3 (Mayo)', value: 1265, color: '#6366f1' }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1">
          <div className="font-bold text-amber-400 border-b border-slate-800 pb-1">{label}</div>
          {payload.map((p: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-3">
              <span className="text-slate-300">{p.name}:</span>
              <span className="font-bold text-white">{formatMoney(p.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Header of Analytics Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
            <TrendingUp className="w-4 h-4" />
            <span>Visualización Financiera & Dinámica de Fondos</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
            Dashboard de Proyecciones, Ahorro y Cobertura de Metas
          </h3>
        </div>
        <div className="text-xs text-slate-500">
          Objetivo Total Requerido: <strong className="text-slate-900">{formatMoney(summary.totalBudgetRequired)}</strong>
        </div>
      </div>

      {/* Chart 1: Timeline Area Chart (Full Width) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span>Curva de Ahorro Semanal Acumulado (Nov 2026 – Jun 2027)</span>
            </h4>
            <p className="text-xs text-slate-500">
              Observa el impacto acumulativo de los S/ 60 dominicales y los saltos de capital de las 3 polladas pro-fondos.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 font-medium">Fondo Total con Polladas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-slate-600 font-medium">Solo Cuotas</span>
            </div>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCuotas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `S/${val}`} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Reference line for the Target 3 Jales (S/ 3,000) */}
              <ReferenceLine y={3000} stroke="#2563eb" strokeDasharray="4 4" label={{ value: 'Meta 3 Jales: S/ 3,000', fill: '#2563eb', fontSize: 10, position: 'top' }} />
              
              {/* Reference line for Total Budget Required (S/ 3,930) */}
              <ReferenceLine y={3930} stroke="#dc2626" strokeDasharray="4 4" label={{ value: 'Presupuesto Total: S/ 3,930', fill: '#dc2626', fontSize: 10, position: 'top' }} />

              <Area type="monotone" dataKey="totalProyectado" name="Fondo Total con Polladas" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTotal)" />
              <Area type="monotone" dataKey="cuotas" name="Solo Cuotas Dominicales" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorCuotas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dual Grid: Bar Chart (Funds vs Expenses) & Pie Chart (Income Sources) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 2: Comparativa Fondos vs Gastos Previstos */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>Comparativa: Presupuesto vs Cobertura Actual</span>
              </h4>
              <p className="text-xs text-slate-500">
                Seguimiento de cada rubro de gasto obligatorio para Junín 2027.
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fundsVsExpensesData} layout="vertical" margin={{ top: 5, right: 20, left: 25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `S/${val}`} />
                <YAxis dataKey="category" type="category" stroke="#64748b" fontSize={11} tickLine={false} width={110} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Bar dataKey="presupuestado" name="Presupuesto Requerido" fill="#cbd5e1" radius={[0, 4, 4, 0]} barSize={14} />
                <Bar dataKey="cubierto" name="Fondos Asignados" fill="#10b981" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
            <span>Prioridad 1: Los 3 Jales (S/ 3,000)</span>
            <span className="font-bold text-slate-800">
              {summary.currentCoverageOfJales}% de jales cubierto
            </span>
          </div>
        </div>

        {/* Chart 3: Desglose de Fuentes de Recaudación (Donut) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-purple-600" />
                <span>Desglose de Ingresos Proyectados (Total S/ 5,545)</span>
              </h4>
              <p className="text-xs text-slate-500">
                Aportes sostenidos de cuotas dominicales vs actividades extraordinarias.
              </p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeSourcesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {incomeSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
            <div>
              <span className="text-slate-400 block">Cuotas Dominicales:</span>
              <span className="font-bold text-amber-600">35.7% del total</span>
            </div>
            <div>
              <span className="text-slate-400 block">3 Polladas Pro-Fondos:</span>
              <span className="font-bold text-emerald-600">64.3% del total</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
