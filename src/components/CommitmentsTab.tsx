import React, { useState } from 'react';
import { ClubState, Commitment } from '../types';
import { 
  HeartHandshake, 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Edit3,
  Shirt,
  Droplets,
  Trophy,
  ShieldAlert
} from 'lucide-react';

interface CommitmentsTabProps {
  state: ClubState;
  onUpdateCommitmentStatus: (id: string, status: 'Comprometido' | 'En coordinación' | 'Entregado') => void;
  onAddCommitment: (commitment: Omit<Commitment, 'id'>) => void;
}

export const CommitmentsTab: React.FC<CommitmentsTabProps> = ({
  state,
  onUpdateCommitmentStatus,
  onAddCommitment,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newDonor, setNewDonor] = useState('');
  const [newItem, setNewItem] = useState('');
  const [newCat, setNewCat] = useState<any>('Implementos');
  const [newIsSurprise, setNewIsSurprise] = useState(false);
  const [newNotes, setNewNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonor.trim() || !newItem.trim()) return;

    onAddCommitment({
      donorName: newDonor.trim(),
      itemDescription: newItem.trim(),
      category: newCat,
      status: 'Comprometido',
      isSurprise: newIsSurprise,
      surpriseRequestDeadline: newIsSurprise ? '2027-05-25' : undefined,
      notes: newNotes.trim()
    });

    setNewDonor('');
    setNewItem('');
    setNewNotes('');
    setNewIsSurprise(false);
    setIsAddOpen(false);
  };

  const surprises = state.commitments.filter(c => c.isSurprise);
  const regularCommitments = state.commitments.filter(c => !c.isSurprise);

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
              <HeartHandshake className="w-4 h-4" />
              <span>Aportes Familiares & Alianzas de Sangre</span>
              <span className="text-slate-400">·</span>
              <span>100% Solidario</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Compromisos y Donaciones en Especie
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Camisetas, hidratación, balón, botiquín, banderola e inscripción ya comprometidos por familiares de palabra.
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Sumar Donación / Apoyo</span>
          </button>
        </div>

        {/* Quick commitment count */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-500">Compromisos Totales</span>
            <div className="text-xl font-extrabold text-slate-900">{state.commitments.length} acordados</div>
          </div>
          <div>
            <span className="text-slate-500">Aportes en Especie</span>
            <div className="text-xl font-extrabold text-emerald-600">
              {state.commitments.filter(c => !c.isSurprise).length} rubros
            </div>
          </div>
          <div>
            <span className="text-slate-500">Sorpresas Especiales</span>
            <div className="text-xl font-extrabold text-amber-600">2 (Manolo & Vides)</div>
          </div>
          <div>
            <span className="text-slate-500">Regla de Sorpresas</span>
            <div className="text-xl font-extrabold text-blue-600">Pedir 30 días antes</div>
          </div>
        </div>
      </div>

      {/* Prominent Banner for the 30-Day Surprises (Manolo & Vides) */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Protocolo de Sorpresas (Pedir 30 días antes)</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Compromisos Sorpresa: Manolo y Vides
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Según las reglas establecidas: <strong>las sorpresas se piden y coordinan exactamente 30 días antes</strong> del campeonato (última semana de Mayo 2027). No adelantar la revelación para mantener la motivación de todo el plantel familiar.
              </p>
            </div>
          </div>

          <div className="bg-white px-4 py-3 rounded-xl border border-amber-200/80 shadow-xs shrink-0 text-left sm:text-right">
            <span className="text-xs text-slate-400 block font-medium">Fecha de Activación:</span>
            <span className="text-sm font-extrabold text-amber-700">25 al 30 Mayo 2027</span>
            <span className="text-xs text-slate-500 block">30 días antes de Junín</span>
          </div>
        </div>
      </div>

      {/* Surprises List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Gift className="w-4 h-4 text-amber-500" />
          <span>Las 2 Sorpresas Registradas</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {surprises.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-amber-200/90 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    Sorpresa Familiar
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                    {s.status}
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="text-base font-bold text-slate-900">
                    Compromiso: {s.donorName}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    {s.itemDescription}
                  </p>
                </div>

                <p className="text-xs text-slate-500 mt-3 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                  {s.notes}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Coordinar en: Mayo 2027</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateCommitmentStatus(s.id, s.status === 'Entregado' ? 'Comprometido' : 'Entregado')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold transition-colors cursor-pointer"
                  >
                    {s.status === 'Entregado' ? 'Marcar Pendiente' : 'Marcar Confirmado'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regular Commitments List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Compromisos en Especie & Apoyos Asegurados ({regularCommitments.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regularCommitments.map((c) => {
            const isDelivered = c.status === 'Entregado';

            return (
              <div
                key={c.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                  isDelivered ? 'border-emerald-300 bg-emerald-50/10' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {c.category}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isDelivered
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'En coordinación'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-amber-600 font-bold uppercase">
                      Donante: {c.donorName}
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">
                      {c.itemDescription}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-500 mt-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {c.notes}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {c.estimatedValue ? `Valuado en ~S/ ${c.estimatedValue}` : 'Solidario'}
                  </span>
                  
                  <button
                    onClick={() => onUpdateCommitmentStatus(
                      c.id, 
                      c.status === 'Comprometido' 
                        ? 'En coordinación' 
                        : c.status === 'En coordinación' 
                        ? 'Entregado' 
                        : 'Comprometido'
                    )}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                  >
                    Cambiar: {c.status}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Add new donation / commitment */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Sumar Nuevo Compromiso o Donación
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Registra un nuevo aporte voluntario de la familia para el viaje a Junín.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nombre del Donante / Familiar *
                </label>
                <input
                  type="text"
                  required
                  value={newDonor}
                  onChange={(e) => setNewDonor(e.target.value)}
                  placeholder="Ej. Tía María / Primo Beto"
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Descripción del Aporte *
                </label>
                <input
                  type="text"
                  required
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Ej. 2 bolsas de naranjas / Hielo para el cooler"
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Implementos">Implementos</option>
                    <option value="Hidratación">Hidratación</option>
                    <option value="Indumentaria">Indumentaria</option>
                    <option value="Identidad">Identidad</option>
                    <option value="Inscripción">Inscripción</option>
                    <option value="Sorpresa">Sorpresa</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={newIsSurprise}
                      onChange={(e) => setNewIsSurprise(e.target.checked)}
                      className="rounded-sm text-amber-600 focus:ring-amber-500"
                    />
                    <span>¿Es sorpresa a 30 días?</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Notas de coordinación
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ej. Se entregará el día del viaje en Lima"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Guardar Compromiso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
