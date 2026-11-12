export interface WeeklyMember {
  id: string;
  name: string;
  relationship: string;
  phone?: string;
  active: boolean;
}

export type PaymentMethod = 'Yape' | 'Plin' | 'Efectivo' | 'Transferencia';

export interface WeeklyPayment {
  paid: boolean;
  amount: number;
  paidAt?: string;
  method?: PaymentMethod;
  notes?: string;
}

export interface SundayWeek {
  weekNumber: number; // 1 to 33
  dateStr: string; // YYYY-MM-DD
  displayDate: string; // "Dom 15 Nov 2026"
  payments: Record<string, WeeklyPayment>; // memberId -> payment
}

export interface PolladaItem {
  id: string;
  number: 1 | 2 | 3;
  name: string;
  targetDate: string; // YYYY-MM-DD
  status: 'Planificada' | 'En preparación' | 'Realizada';
  pricePerDish: number; // default S/ 20
  targetDishes: number; // e.g. 100
  soldDishes: number;
  costPerDish: number; // e.g. S/ 8.50 (pollo, papa, ensalada, ají, táper)
  actualTotalCost?: number;
  actualGrossIncome?: number;
  location: string;
  notes: string;
}

export interface JalePlayer {
  id: string;
  number: 1 | 2 | 3;
  name: string;
  alias?: string;
  position: string;
  budgetAllocated: number; // S/ 1000
  actualCost: number; // real agreement
  travelStatus: 'Por coordinar' | 'Pasaje comprado' | 'Confirmado';
  lodgingNote: string;
  status: 'En carpeta' | 'Conversando' | 'Comprometido' | 'Confirmado en lista';
  notes: string;
}

export interface Commitment {
  id: string;
  donorName: string;
  itemDescription: string;
  category: 'Implementos' | 'Hidratación' | 'Inscripción' | 'Indumentaria' | 'Identidad' | 'Sorpresa';
  status: 'Comprometido' | 'En coordinación' | 'Entregado';
  isSurprise: boolean;
  surpriseRequestDeadline?: string; // ~30 días antes del campeonato (Mayo 2027)
  estimatedValue?: number;
  notes: string;
}

export interface FamilyMemory {
  id: string;
  title: string;
  yearOrDate: string;
  category: 'Foto Histórica' | 'Anécdota Familiar' | 'Trofeo / Campeonato' | 'Camiseta / Mística' | 'Mística / Identidad';
  author: string;
  imageUrl?: string;
  description: string;
  tags?: string[];
}

export interface ClubState {
  clubName: string;
  startDate: string; // 2026-11-11
  closingDate: string; // 2027-06-30
  weeklyQuota: number; // 10
  members: WeeklyMember[];
  weeks: SundayWeek[];
  polladas: PolladaItem[];
  jales: JalePlayer[];
  commitments: Commitment[];
  memories: FamilyMemory[];
  extraExpenses: {
    id: string;
    description: string;
    estimatedCost: number;
    actualCost: number;
    category: 'Inscripción Saldo' | 'Agua/Hielo/Fruta' | 'Imprevistos/Reserva' | 'Transporte Jales' | 'Otro';
    status: 'Presupuestado' | 'Ejecutado';
  }[];
  notesAndLogistics: {
    accommodationDetail: string;
    transportGeneralDetail: string;
    foodPolicyDetail: string;
    firstAidDetail: string;
  };
}
