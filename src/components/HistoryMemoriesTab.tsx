import React, { useState } from 'react';
import { ClubState, FamilyMemory } from '../types';
import { 
  Camera, 
  BookOpen, 
  Heart, 
  Sparkles, 
  Plus, 
  MessageSquare, 
  Send, 
  Shield, 
  Trophy,
  History,
  Image as ImageIcon
} from 'lucide-react';

interface HistoryMemoriesTabProps {
  state: ClubState;
  onAddMemory: (memory: Omit<FamilyMemory, 'id'>) => void;
}

export const HistoryMemoriesTab: React.FC<HistoryMemoriesTabProps> = ({
  state,
  onAddMemory,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCategory, setNewCategory] = useState<any>('Foto Histórica');
  const [newAuthor, setNewAuthor] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTags, setNewTags] = useState('Familia, Fútbol');

  // Family encouragement board messages (stored in component / local state)
  const [familyNotes, setFamilyNotes] = useState([
    { id: '1', author: 'Tío Ramón', text: '¡Este 2027 la copa se viene para la familia Córdova! Con los 3 jales y la garra de siempre nadie nos para.', date: '11/11/2026' },
    { id: '2', author: 'Tía Sonia', text: 'El agua y la bendición de la familia están aseguradas para los muchachos en Junín. ¡Fuerza Córdova!', date: '11/11/2026' },
    { id: '3', author: 'Rocío', text: 'Las camisetas van a quedar hermosas, con la insignia en el pecho para dejar en alto el apellido.', date: '11/11/2026' }
  ]);
  const [newNoteAuthor, setNewNoteAuthor] = useState('');
  const [newNoteText, setNewNoteText] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    onAddMemory({
      title: newTitle.trim(),
      yearOrDate: newDate.trim() || '2026-2027',
      category: newCategory,
      author: newAuthor.trim() || 'Familia Córdova',
      imageUrl: newImageUrl.trim() || undefined,
      description: newDescription.trim(),
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
    });

    setNewTitle('');
    setNewDate('');
    setNewAuthor('');
    setNewImageUrl('');
    setNewDescription('');
    setIsAddOpen(false);
  };

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteAuthor.trim() || !newNoteText.trim()) return;
    setFamilyNotes(prev => [
      ...prev,
      {
        id: String(Date.now()),
        author: newNoteAuthor.trim(),
        text: newNoteText.trim(),
        date: new Date().toLocaleDateString('es-PE')
      }
    ]);
    setNewNoteAuthor('');
    setNewNoteText('');
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <span>Memoria Histórica & Orgullo Familiar</span>
              <span className="text-slate-500">·</span>
              <span>Empezar a Crear Historia</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-1">
              Libro de Oro: CD Familia Córdova
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-2xl">
              Aquí guardamos nuestras fotos, recuerdos de campeonatos pasados, anécdotas en Lima y Junín, y los mensajes de aliento que unen a toda la familia alrededor de la pelota.
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Camera className="w-4 h-4" />
            <span>Agregar Recuerdo / Foto</span>
          </button>
        </div>
      </div>

      {/* Values & Mystique Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Shield className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Nuestra Identidad</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            El CD Familia Córdova nació para juntar a tíos, primos y sobrinos en torno al deporte. En la cancha defendemos los colores con pasión, respeto y juego limpio.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Trophy className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">El Sueño Junín 2027</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Viajar a Jisse / Janjaillo en Junín representa volver a las raíces, disfrutar dos días de fiesta deportiva y demostrar de qué está hecha la familia Córdova.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Heart className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Unión y Transparencia</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Cada sol de cuota dominical y cada pollada se manejan con honestidad absoluta. La confianza familiar es el trofeo más valioso que tenemos.
          </p>
        </div>
      </div>

      {/* Memory Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Galería de Momentos & Recuerdos ({state.memories.length})</span>
          </h3>
          <span className="text-xs text-slate-500">Historias que trascienden</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.memories.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Visual Header / Cover */}
                <div className="h-44 bg-gradient-to-br from-slate-800 to-amber-950 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
                  {m.imageUrl ? (
                    <img
                      src={m.imageUrl}
                      alt={m.title}
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  ) : (
                    <div className="relative z-10 space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                        CD Familia Córdova
                      </span>
                    </div>
                  )}
                  
                  <div className="absolute top-3 left-3 z-20">
                    <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-900/80 backdrop-blur-xs text-white rounded-full">
                      {m.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 z-20">
                    <span className="text-xs text-slate-200 bg-slate-950/60 px-2 py-0.5 rounded-md">
                      {m.yearOrDate}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {m.title}
                  </h4>
                  <span className="text-xs text-amber-700 font-semibold block mt-0.5">
                    Por: {m.author}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {m.tags && m.tags.length > 0 && (
                <div className="px-5 pb-4 pt-1 flex flex-wrap gap-1.5 border-t border-slate-100">
                  {m.tags.map((t, idx) => (
                    <span key={idx} className="text-xs text-slate-500">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Cheer Wall ("Muro de Aliento de la Barra Córdova") */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Muro de Aliento de la Barra Familiar Córdova
              </h3>
              <p className="text-xs text-slate-500">
                Deja tu mensaje de apoyo, motivación y fuerza para los muchachos y los 3 jales.
              </p>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {familyNotes.map((note) => (
            <div
              key={note.id}
              className="bg-amber-50/40 border border-amber-200/70 rounded-xl p-4 flex flex-col justify-between"
            >
              <p className="text-xs sm:text-sm text-slate-800 italic leading-relaxed">
                "{note.text}"
              </p>
              <div className="mt-3 pt-2 border-t border-amber-200/50 flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-amber-900">— {note.author}</span>
                <span>{note.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Note Form */}
        <form onSubmit={handleSendNote} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-end gap-3 text-xs">
          <div className="w-full sm:w-1/3">
            <label className="block font-semibold text-slate-700 mb-1">
              Tu Nombre / Apodo Familiar:
            </label>
            <input
              type="text"
              required
              value={newNoteAuthor}
              onChange={(e) => setNewNoteAuthor(e.target.value)}
              placeholder="Ej. Tía Gladys / Primo Carlos"
              className="w-full border border-slate-300 rounded-lg p-2 bg-white"
            />
          </div>

          <div className="w-full sm:w-2/3">
            <label className="block font-semibold text-slate-700 mb-1">
              Mensaje de Aliento:
            </label>
            <input
              type="text"
              required
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Ej. ¡Vamos muchachos con todo a poner el corazón en la cancha!"
              className="w-full border border-slate-300 rounded-lg p-2 bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publicar</span>
          </button>
        </form>
      </div>

      {/* Modal: Add Memory */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Agregar Recuerdo a la Historia del Club
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Inmortaliza anécdotas, fotos y vivencias del CD Familia Córdova.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Título del Recuerdo *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. La Gran Final de Janjaillo / El Debut en Lima"
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Año / Fecha
                  </label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="Ej. 2024 / Verano 2026"
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    <option value="Foto Histórica">Foto Histórica</option>
                    <option value="Anécdota Familiar">Anécdota Familiar</option>
                    <option value="Mística / Identidad">Mística / Identidad</option>
                    <option value="Trofeo / Campeonato">Trofeo / Campeonato</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Autor / Quién lo relata
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Ej. Tío Walter / Familia Córdova"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  URL de Imagen / Foto (Opcional)
                </label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://ejemplo.com/foto.jpg"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
                <span className="text-xs text-slate-400 mt-0.5 block">
                  Si no tienes enlace, se creará una portada de honor del club.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Historia / Relato *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Cuenta la anécdota, el gol inolvidable o cómo se vivió ese día..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Etiquetas (separadas por coma)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Junín, Camisetas, Gol, Unión"
                  className="w-full border border-slate-300 rounded-lg p-2"
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
                  Guardar Recuerdo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
