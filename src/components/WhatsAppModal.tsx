import React, { useState } from 'react';
import { ClubState } from '../types';
import { generateWhatsAppReport } from '../utils/calculator';
import { Share2, Check, Copy, ExternalLink, X } from 'lucide-react';

interface WhatsAppModalProps {
  state: ClubState;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ state, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const reportText = generateWhatsAppReport(state);

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const encodedMessage = encodeURIComponent(reportText);
  const waUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Reporte de Caja para WhatsApp Familiar
              </h3>
              <p className="text-xs text-slate-500">
                Transparencia total para enviar al grupo del CD Familia Córdova
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Content Preview */}
        <div className="my-4 flex-1 overflow-hidden flex flex-col">
          <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
            Mensaje generado automáticamente con cuentas al día:
          </label>
          <textarea
            readOnly
            value={reportText}
            className="w-full flex-1 min-h-[280px] p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 leading-relaxed resize-none focus:outline-hidden"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            {copied ? '¡Copiado al portapapeles!' : 'Listo para compartir'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Texto Copiado!' : 'Copiar Texto'}</span>
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir en WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
