import React, { useState, useEffect } from 'react';
import { ClubState, PaymentMethod, WeeklyMember, PolladaItem, JalePlayer, Commitment, FamilyMemory } from './types';
import { buildInitialState } from './data/initialData';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { ChampionshipHubTab } from './components/ChampionshipHubTab';
import { WeeklyCollectionTab } from './components/WeeklyCollectionTab';
import { PolladasTab } from './components/PolladasTab';
import { JalesTab } from './components/JalesTab';
import { CommitmentsTab } from './components/CommitmentsTab';
import { HistoryMemoriesTab } from './components/HistoryMemoriesTab';
import { WhatsAppModal } from './components/WhatsAppModal';
import { PrintReportModal } from './components/PrintReportModal';
import { testFirestoreConnection } from './lib/firebase';
import { 
  seedInitialDataIfEmpty, 
  subscribeToLiveClub,
  updateWeeklyPaymentInFirebase,
  markEntireWeekInFirebase,
  addMemberInFirebase,
  updatePolladaInFirebase,
  updateJaleInFirebase,
  updateCommitmentInFirebase,
  addCommitmentInFirebase,
  addMemoryInFirebase
} from './services/clubFirebaseService';
import { 
  LayoutDashboard, 
  MapPin,
  CalendarCheck, 
  Flame, 
  Users, 
  HeartHandshake, 
  History
} from 'lucide-react';

const STORAGE_KEY = 'cd_familia_cordova_state_2027_v1';

export default function App() {
  const [state, setState] = useState<ClubState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load saved state:', e);
    }
    return buildInitialState();
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'championship' | 'weekly' | 'polladas' | 'jales' | 'commitments' | 'history'>('overview');
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isFirebaseLive, setIsFirebaseLive] = useState(false);

  // Initialize and connect live Firebase Firestore
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function initFirebase() {
      try {
        const isConnected = await testFirestoreConnection();
        setIsFirebaseLive(isConnected);
        
        // Seed Firestore if empty with the realistic club data
        await seedInitialDataIfEmpty();

        // Subscribe to live Firestore changes across all devices
        unsubscribe = subscribeToLiveClub((updater) => {
          setState(prev => updater(prev));
        });
      } catch (err) {
        console.warn('Firebase sync notice:', err);
      }
    }

    initFirebase();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Sync state to local storage cache as offline backup
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }, [state]);

  // Handler: Update individual weekly payment (Local + Live Firestore)
  const handleUpdatePayment = (weekNumber: number, memberId: string, paid: boolean, method?: PaymentMethod) => {
    setState(prev => {
      const updatedWeeks = prev.weeks.map(w => {
        if (w.weekNumber === weekNumber) {
          return {
            ...w,
            payments: {
              ...w.payments,
              [memberId]: {
                paid,
                amount: prev.weeklyQuota,
                paidAt: paid ? new Date().toISOString() : undefined,
                method: paid ? (method || 'Efectivo') : undefined
              }
            }
          };
        }
        return w;
      });

      return {
        ...prev,
        weeks: updatedWeeks
      };
    });

    // Write to Firebase Firestore in background
    updateWeeklyPaymentInFirebase(weekNumber, memberId, paid, method || 'Efectivo').catch(err => {
      console.error('Error updating payment in Firebase:', err);
    });
  };

  // Handler: Mark entire Sunday paid for all active members (Local + Live Firestore)
  const handleMarkEntireWeekPaid = (weekNumber: number) => {
    setState(prev => {
      const updatedWeeks = prev.weeks.map(w => {
        if (w.weekNumber === weekNumber) {
          const newPayments = { ...w.payments };
          prev.members.filter(m => m.active).forEach(m => {
            newPayments[m.id] = {
              paid: true,
              amount: prev.weeklyQuota,
              paidAt: new Date().toISOString(),
              method: 'Efectivo'
            };
          });
          return {
            ...w,
            payments: newPayments
          };
        }
        return w;
      });

      return {
        ...prev,
        weeks: updatedWeeks
      };
    });

    // Write to Firebase Firestore in background
    markEntireWeekInFirebase(weekNumber, state.members).catch(err => {
      console.error('Error marking entire week in Firebase:', err);
    });
  };

  // Handler: Add new contributing member (Local + Live Firestore)
  const handleAddMember = (newMemberData: Omit<WeeklyMember, 'id'>) => {
    const newId = `mem_${Date.now()}`;
    const newMember: WeeklyMember = {
      ...newMemberData,
      id: newId
    };

    setState(prev => {
      const updatedMembers = [...prev.members, newMember];
      const updatedWeeks = prev.weeks.map(w => ({
        ...w,
        payments: {
          ...w.payments,
          [newId]: { paid: false, amount: prev.weeklyQuota }
        }
      }));

      return {
        ...prev,
        members: updatedMembers,
        weeks: updatedWeeks
      };
    });

    // Write to Firebase
    addMemberInFirebase(newMember).catch(err => {
      console.error('Error adding member to Firebase:', err);
    });
  };

  // Handler: Update Pollada (Local + Live Firestore)
  const handleUpdatePollada = (updatedPollada: PolladaItem) => {
    setState(prev => ({
      ...prev,
      polladas: prev.polladas.map(p => p.id === updatedPollada.id ? updatedPollada : p)
    }));

    updatePolladaInFirebase(updatedPollada).catch(err => {
      console.error('Error updating pollada in Firebase:', err);
    });
  };

  // Handler: Update Jale (Local + Live Firestore)
  const handleUpdateJale = (updatedJale: JalePlayer) => {
    setState(prev => ({
      ...prev,
      jales: prev.jales.map(j => j.id === updatedJale.id ? updatedJale : j)
    }));

    updateJaleInFirebase(updatedJale).catch(err => {
      console.error('Error updating jale in Firebase:', err);
    });
  };

  // Handler: Update Commitment status (Local + Live Firestore)
  const handleUpdateCommitmentStatus = (id: string, status: 'Comprometido' | 'En coordinación' | 'Entregado') => {
    setState(prev => ({
      ...prev,
      commitments: prev.commitments.map(c => c.id === id ? { ...c, status } : c)
    }));

    updateCommitmentInFirebase(id, status).catch(err => {
      console.error('Error updating commitment in Firebase:', err);
    });
  };

  // Handler: Add new commitment (Local + Live Firestore)
  const handleAddCommitment = (newCommitmentData: Omit<Commitment, 'id'>) => {
    const newCommitment: Commitment = {
      ...newCommitmentData,
      id: `com_${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      commitments: [newCommitment, ...prev.commitments]
    }));

    addCommitmentInFirebase(newCommitment).catch(err => {
      console.error('Error adding commitment to Firebase:', err);
    });
  };

  // Handler: Add new memory to club history (Local + Live Firestore)
  const handleAddMemory = (newMemoryData: Omit<FamilyMemory, 'id'>) => {
    const newMemory: FamilyMemory = {
      ...newMemoryData,
      id: `mem_${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      memories: [newMemory, ...prev.memories]
    }));

    addMemoryInFirebase(newMemory).catch(err => {
      console.error('Error adding memory to Firebase:', err);
    });
  };

  // Handler: Reset to realistic initial data
  const handleResetData = () => {
    if (window.confirm('¿Deseas restaurar los datos iniciales del CD Familia Córdova 2027?')) {
      const fresh = buildInitialState();
      setState(fresh);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      } catch (e) {
        // ignore
      }
    }
  };

  const navItems = [
    { id: 'overview', label: 'Resumen Ejecutivo', icon: LayoutDashboard },
    { id: 'championship', label: 'Campeonato & Junín', icon: MapPin },
    { id: 'weekly', label: 'Cuotas Dominicales (S/10)', icon: CalendarCheck },
    { id: 'polladas', label: '3 Polladas Pro-Fondos', icon: Flame },
    { id: 'jales', label: 'Los 3 Jales (Fichajes)', icon: Users },
    { id: 'commitments', label: 'Compromisos & Especies', icon: HeartHandshake },
    { id: 'history', label: 'Memoria Familiar & Fotos', icon: History }
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* Header */}
      <Header
        clubName={state.clubName}
        closingDateStr={state.closingDate}
        onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Tab Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Body / Active Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewTab
            state={state}
            onNavigateTab={(tabId) => setActiveTab(tabId as any)}
            onOpenPrintModal={() => setIsPrintModalOpen(true)}
          />
        )}

        {activeTab === 'championship' && (
          <ChampionshipHubTab
            state={state}
            onNavigateTab={(tabId) => setActiveTab(tabId as any)}
            onOpenPrintModal={() => setIsPrintModalOpen(true)}
          />
        )}

        {activeTab === 'weekly' && (
          <WeeklyCollectionTab
            state={state}
            onUpdatePayment={handleUpdatePayment}
            onMarkEntireWeekPaid={handleMarkEntireWeekPaid}
            onAddMember={handleAddMember}
            onOpenPrintModal={() => setIsPrintModalOpen(true)}
          />
        )}

        {activeTab === 'polladas' && (
          <PolladasTab
            state={state}
            onUpdatePollada={handleUpdatePollada}
          />
        )}

        {activeTab === 'jales' && (
          <JalesTab
            state={state}
            onUpdateJale={handleUpdateJale}
          />
        )}

        {activeTab === 'commitments' && (
          <CommitmentsTab
            state={state}
            onUpdateCommitmentStatus={handleUpdateCommitmentStatus}
            onAddCommitment={handleAddCommitment}
          />
        )}

        {activeTab === 'history' && (
          <HistoryMemoriesTab
            state={state}
            onAddMemory={handleAddMemory}
          />
        )}
      </main>

      {/* Physical Report Print & PDF Export Modal */}
      <PrintReportModal
        state={state}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />

      {/* WhatsApp Modal */}
      <WhatsAppModal
        state={state}
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />

      {/* Clean Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs text-center mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-300">
            CD Familia Córdova 2027 · Rumbo a la gloria en Junín (Jisse / Janjaillo)
          </p>
          <p className="text-slate-500">
            Plan estratégico y financiero de recaudación semanal, polladas y gestión deportiva familiar · Sincronizado en Firebase Firestore.
          </p>
        </div>
      </footer>
    </div>
  );
}
