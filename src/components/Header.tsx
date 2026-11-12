import React from 'react';
import { Trophy, Calendar, Share2, Shield, RefreshCw, Printer } from 'lucide-react';

interface HeaderProps {
  clubName: string;
  closingDateStr: string;
  onOpenWhatsApp: () => void;
  onOpenPrintModal: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  clubName,
  closingDateStr,
  onOpenWhatsApp,
  onOpenPrintModal,
  onResetData,
}) => {
  // Calculate remaining days
  const now = new Date('2026-11-11T00:00:00'); // current time anchor
  const closingDate = new Date(closingDateStr + 'T23:59:59');
  const diffTime = closingDate.getTime() - now.getTime();
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const diffWeeks = Math.floor(diffDays / 7);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Club Crest & Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-amber-400">
                <span>Club Deportivo Familiar</span>
                <span className="text-slate-500">·</span>
                <span>Lima → Junín 2027</span>
                <span className="text-slate-500">·</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 lowercase font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>firebase en vivo</span>
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight mt-0.5">
                {clubName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Plan Maestro de Recaudación, Gestión de 3 Jales y Logística (Jisse / Janjaillo)
              </p>
            </div>
          </div>

          {/* Countdown & Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Days Counter */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-left">
                <div className="text-xs text-slate-400 font-medium">Cierre del Plan</div>
                <div className="text-sm sm:text-base font-bold text-white">
                  30 Junio 2027 <span className="text-xs text-amber-400 font-normal">({diffDays} días · ~{diffWeeks} sem)</span>
                </div>
              </div>
            </div>

            {/* Physical Print / PDF Report Button */}
            <button
              onClick={onOpenPrintModal}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Abrir e imprimir reporte físico oficial para reuniones familiares"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>Imprimir Reporte (PDF)</span>
            </button>

            {/* WhatsApp Share Button */}
            <button
              onClick={onOpenWhatsApp}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Generar resumen formateado para el grupo de WhatsApp familiar"
            >
              <Share2 className="w-4 h-4" />
              <span>Reporte WhatsApp</span>
            </button>

            {/* Reset / Demo reload */}
            <button
              onClick={onResetData}
              className="inline-flex items-center justify-center p-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-300 hover:text-white rounded-xl border border-slate-700/60 transition-colors cursor-pointer"
              title="Restaurar datos iniciales"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
