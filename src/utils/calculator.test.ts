import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateSundays,
  calculateWeeklyStats,
  calculatePolladasStats,
  calculateJalesStats,
  calculateFinancialSummary,
  generateWhatsAppReport
} from './calculator';
import { ClubState, SundayWeek, PolladaItem, JalePlayer } from '../types';

test('generateSundays generates exact Sundays between 2026-11-11 and 2027-06-30', () => {
  const sundays = generateSundays('2026-11-11', '2027-06-30');
  
  // First Sunday after 11/11/2026 is 2026-11-15
  assert.equal(sundays[0].dateStr, '2026-11-15');
  // Last Sunday before 30/06/2027 is 2027-06-27
  assert.equal(sundays[sundays.length - 1].dateStr, '2027-06-27');
  
  // Total Sundays is 33 weeks
  assert.equal(sundays.length, 33);
});

test('calculateWeeklyStats calculates totals and per-member breakdown', () => {
  const dummyWeeks: SundayWeek[] = [
    {
      weekNumber: 1,
      dateStr: '2026-11-15',
      displayDate: 'Dom 15 Nov 2026',
      payments: {
        'm1': { paid: true, amount: 10, method: 'Yape' },
        'm2': { paid: true, amount: 10, method: 'Efectivo' },
        'm3': { paid: false, amount: 10 }
      }
    },
    {
      weekNumber: 2,
      dateStr: '2026-11-22',
      displayDate: 'Dom 22 Nov 2026',
      payments: {
        'm1': { paid: true, amount: 10, method: 'Yape' },
        'm2': { paid: false, amount: 10 },
        'm3': { paid: false, amount: 10 }
      }
    }
  ];

  const stats = calculateWeeklyStats(dummyWeeks, 3, 10);
  assert.equal(stats.totalCollected, 30);
  assert.equal(stats.totalPaidSlots, 3);
  assert.equal(stats.totalPotentialMoney, 60); // 2 weeks * 3 members * 10
  assert.equal(stats.collectionPercentage, 50);

  assert.equal(stats.memberTotals['m1'].paidWeeks, 2);
  assert.equal(stats.memberTotals['m1'].totalPaid, 20);
  assert.equal(stats.memberTotals['m2'].paidWeeks, 1);
  assert.equal(stats.memberTotals['m3'].paidWeeks, 0);
});

test('calculatePolladasStats calculates gross and net profit margins', () => {
  const dummyPolladas: PolladaItem[] = [
    {
      id: 'p1',
      number: 1,
      name: 'Pollada 1 - Apertura de Verano',
      targetDate: '2027-01-31',
      status: 'Realizada',
      pricePerDish: 20,
      targetDishes: 100,
      soldDishes: 100,
      costPerDish: 9,
      actualGrossIncome: 2000,
      actualTotalCost: 900,
      location: 'Local familiar Lima',
      notes: '100 platos vendidos con éxito'
    },
    {
      id: 'p2',
      number: 2,
      name: 'Pollada 2 - Mitad de Campaña',
      targetDate: '2027-04-11',
      status: 'Planificada',
      pricePerDish: 20,
      targetDishes: 100,
      soldDishes: 0,
      costPerDish: 9,
      location: 'Lima',
      notes: 'Meta 100 platos'
    }
  ];

  const stats = calculatePolladasStats(dummyPolladas);
  assert.equal(stats.projectedGross, 4000);
  assert.equal(stats.projectedCost, 1800);
  assert.equal(stats.projectedNetProfit, 2200);
  assert.equal(stats.actualNetProfit, 1100); // 2000 - 900 from p1
});

test('calculateJalesStats calculates jales target and confirmed counts', () => {
  const dummyJales: JalePlayer[] = [
    {
      id: 'j1',
      number: 1,
      name: 'Refuerzo 10 (Creativo)',
      position: 'Volante 10',
      budgetAllocated: 1000,
      actualCost: 1000,
      travelStatus: 'Por coordinar',
      lodgingNote: 'Casa de tíos en Jisse',
      status: 'Comprometido',
      notes: 'Jugador de experiencia en altura'
    },
    {
      id: 'j2',
      number: 2,
      name: 'Refuerzo Delantero 9',
      position: 'Delantero centro',
      budgetAllocated: 1000,
      actualCost: 1000,
      travelStatus: 'Por coordinar',
      lodgingNote: 'Casa comunal',
      status: 'En carpeta',
      notes: ''
    },
    {
      id: 'j3',
      number: 3,
      name: 'Refuerzo Back Central',
      position: 'Defensa central',
      budgetAllocated: 1000,
      actualCost: 1000,
      travelStatus: 'Por coordinar',
      lodgingNote: 'Casa familiar',
      status: 'Confirmado en lista',
      notes: ''
    }
  ];

  const stats = calculateJalesStats(dummyJales);
  assert.equal(stats.targetTotal, 3000);
  assert.equal(stats.confirmedCount, 2); // 1 comprometido + 1 confirmado
});

test('generateWhatsAppReport generates valid formatted text containing club name', () => {
  const mockState: ClubState = {
    clubName: 'CD Familia Córdova 2027',
    startDate: '2026-11-11',
    closingDate: '2027-06-30',
    weeklyQuota: 10,
    members: [
      { id: 'm1', name: 'Andy (Coordinador)', relationship: 'Organizador', active: true },
      { id: 'm2', name: 'Tío Ramón', relationship: 'Tío', active: true }
    ],
    weeks: [
      {
        weekNumber: 1,
        dateStr: '2026-11-15',
        displayDate: 'Dom 15 Nov 2026',
        payments: {
          'm1': { paid: true, amount: 10, method: 'Yape' },
          'm2': { paid: true, amount: 10, method: 'Plin' }
        }
      }
    ],
    polladas: [],
    jales: [
      { id: 'j1', number: 1, name: 'Jale 1', position: 'Delantero', budgetAllocated: 1000, actualCost: 1000, travelStatus: 'Por coordinar', lodgingNote: '', status: 'Conversando', notes: '' },
      { id: 'j2', number: 2, name: 'Jale 2', position: 'Volante', budgetAllocated: 1000, actualCost: 1000, travelStatus: 'Por coordinar', lodgingNote: '', status: 'Conversando', notes: '' },
      { id: 'j3', number: 3, name: 'Jale 3', position: 'Defensa', budgetAllocated: 1000, actualCost: 1000, travelStatus: 'Por coordinar', lodgingNote: '', status: 'Conversando', notes: '' }
    ],
    commitments: [],
    memories: [],
    extraExpenses: [
      { id: 'e1', description: 'Inscripción saldo restante', estimatedCost: 150, actualCost: 0, category: 'Inscripción Saldo', status: 'Presupuestado' }
    ],
    notesAndLogistics: {
      accommodationDetail: 'Casas familiares en Jisse',
      transportGeneralDetail: 'Cada familia va por su cuenta; fondo cubre jales',
      foodPolicyDetail: 'Autogestionada / Omitir en fondo general',
      firstAidDetail: 'Botiquín listo por Jhon'
    }
  };

  const text = generateWhatsAppReport(mockState);
  assert.ok(text.includes('CD FAMILIA CÓRDOVA 2027'));
  assert.ok(text.includes('INFORME DE RECAUDACIÓN'));
  assert.ok(text.includes('S/ 3,000.00'));
  assert.ok(text.includes('Ramón: 4 six packs Sporade'));
});
