import React from 'react';
import { ClubState } from '../types';
import { calculateFinancialSummary } from '../utils/calculator';
import { 
  MapPin, 
  Calendar, 
  Bus, 
  Home, 
  Users, 
  ShieldAlert, 
  ThermometerSnowflake, 
  CheckCircle2, 
  Clock, 
  DollarSign,
  Award,
  Sparkles,
  Info
} from 'lucide-react';

interface ChampionshipHubTabProps {
  state: ClubState;
  onNavigateTab: (tabId: string) => void;
  onOpenPrintModal: () => void;
}

export const ChampionshipHubTab: React.FC<ChampionshipHubTabProps> = ({
  state,
  onNavigateTab,
  onOpenPrintModal
}) => {
  const summary = calculateFinancialSummary(state);

  const formatMoney = (val: number) =>
    `S/ ${val.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-8">
      
      {/* Top Banner: Centralized Championship Hub */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-2xl border border-slate-700 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <MapPin className="w-4 h-4" />
              <span>Central Oficial del Campeonato · Junín 2027</span>
              <span className="text-slate-500">·</span>
              <span>2 Días de Competencia</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Información Centralizada: Viaje y Torneo en Jisse / Janjaillo
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Toda la logística clave en un solo lugar: fechas, altitud, hospedaje familiar, políticas de alimentación y el presupuesto garantizado para los 3 jales (S/ 1,000 c/u).
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={onOpenPrintModal}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>Imprimir Ficha Logística</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Logistics Fact-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Destination */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Destino & Altitud</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-slate-900">Jisse / Janjaillo</div>
            <div className="text-xs text-slate-500 mt-0.5">
              Provincia de Jauja, Junín (~3,400 msnm)
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Duración & Cierre</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-slate-900">2 Días de Torneo</div>
            <div className="text-xs text-slate-500 mt-0.5">
              Cierre estricto del plan: 30/06/2027
            </div>
          </div>
        </div>

        {/* Jales Transport */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Transporte Jales</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Bus className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-slate-900">S/ 3,000 en Total</div>
            <div className="text-xs text-slate-500 mt-0.5">
              S/ 1,000 para viaje + honorario de cada jale
            </div>
          </div>
        </div>

        {/* Accommodation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alojamiento</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Home className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-slate-900">Casas Familiares</div>
            <div className="text-xs text-slate-500 mt-0.5">
              Cubierto para toda la delegación y los 3 jales
            </div>
          </div>
        </div>

      </div>

      {/* Deep Dive: Transporte y los 3 Jales */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Bus className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Política de Transporte y Asignación de Fondos para los 3 Jales
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('jales')}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
          >
            Ver Ficha de los 3 Jales →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rules for Family vs Jales */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-slate-900 text-sm">
              ¿Cómo viaja la delegación de Lima a Junín?
            </h4>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-900">• Jugadores Familiares & Barra:</span>
                <span>Cada familia cubre sus pasajes de ida y vuelta de manera independiente (en autos particulares o buses interprovinciales desde terminales de Lima como Yerbateros o Plaza Norte).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-800">• Los 3 Jales (Fichajes):</span>
                <span><strong>El club se hace 100% responsable de su viaje.</strong> De los S/ 1,000 presupuestados para cada jale, se compra su pasaje directo ida/vuelta y se le entrega su viático/honorario acordado.</span>
              </li>
            </ul>
          </div>

          {/* Accommodation guarantee */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-slate-900 text-sm">
              Alojamiento y Hospedaje en Jisse / Janjaillo
            </h4>
            <p className="text-slate-700 leading-relaxed">
              En la sierra, la familia cuenta con casas propias y familiares que abren sus puertas. 
              <strong>Para los 3 jales:</strong> se ha coordinado habitación y abrigo garantizado en las casas de tíos del pueblo, asegurando que descansen cómodos sin incurrir en gastos de hotel.
            </p>
            <div className="bg-emerald-50 text-emerald-900 p-2.5 rounded-lg border border-emerald-200 text-xs font-semibold">
              ✓ Costo total de alojamiento para el club: S/ 0.00 (100% resuelto por la familia).
            </div>
          </div>
        </div>
      </div>

      {/* Itinerary & Recommendations for Altitude */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Itinerary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Cronograma & Dinámica de los 2 Días de Torneo
            </h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="border-l-2 border-amber-500 pl-3 py-1 space-y-1">
              <div className="font-bold text-slate-900">Víspera (Viernes): Salida de Lima</div>
              <p className="text-slate-600 text-xs">
                Concentración y viaje temprano hacia Junín (6-7 horas de ruta) para llegar en la tarde a Jisse, instalar a los 3 jales y descansar para aclimatar.
              </p>
            </div>

            <div className="border-l-2 border-emerald-500 pl-3 py-1 space-y-1">
              <div className="font-bold text-slate-900">Día 1 (Sábado): Fase Clasificatoria</div>
              <p className="text-slate-600 text-xs">
                Inauguración con banderola oficial (Edgar), entrega de camisetas (Rocío) y 2 a 3 partidos decisivos. Hidratación con Sporade (Ramón) y agua (Sonia).
              </p>
            </div>

            <div className="border-l-2 border-purple-500 pl-3 py-1 space-y-1">
              <div className="font-bold text-slate-900">Día 2 (Domingo): Semifinales, Gran Final y Almuerzo de Celebración</div>
              <p className="text-slate-600 text-xs">
                Partidos definitorios, premiación y entrega del trofeo. Despedida y retorno coordinado hacia Lima.
              </p>
            </div>
          </div>
        </div>

        {/* Altitude conditioning & Health */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ThermometerSnowflake className="w-5 h-5 text-cyan-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Recomendaciones Médicas y de Clima (Sierra Central)
            </h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700">
            <div className="p-3 bg-cyan-50/60 rounded-xl border border-cyan-100 space-y-1">
              <span className="font-bold text-cyan-950 block">1. Clima y Abrigarse en las Noches:</span>
              <p className="text-cyan-900 text-xs">
                En Junio, la sierra de Junín tiene días soleados pero noches con heladas (temperaturas que bajan a 3°C - 5°C). Llevar casacas térmicas, chullos y guantes.
              </p>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 space-y-1">
              <span className="font-bold text-amber-950 block">2. Botiquín Listo (Jhon):</span>
              <p className="text-amber-900 text-xs">
                Se cuenta con éter para golpes, spray refrescante, vendas, alcohol y pastillas para el soroche (mal de altura). <strong>Orden estricta cumplida:</strong> no se contrata médico particular para optimizar cada sol en los jales.
              </p>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
              <span className="font-bold text-emerald-950 block">3. Fruta Fresca y Hielo Local:</span>
              <p className="text-emerald-900 text-xs">
                Se cuenta con caja chica asignada (S/ 250) para comprar naranjas frescas, plátanos y hielo en el mercado local durante los 2 días de juego.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
