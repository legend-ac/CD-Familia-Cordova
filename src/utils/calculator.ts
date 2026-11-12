import { ClubState, SundayWeek, PolladaItem, JalePlayer } from '../types';

/**
 * Returns all Sundays between startDate and closingDate inclusive.
 */
export function generateSundays(startDateStr = '2026-11-11', closingDateStr = '2027-06-30'): { dateStr: string; displayDate: string }[] {
  const result: { dateStr: string; displayDate: string }[] = [];
  const current = new Date(startDateStr + 'T12:00:00Z');
  const end = new Date(closingDateStr + 'T23:59:59Z');

  // Advance to the first Sunday on or after startDate
  while (current.getUTCDay() !== 0) {
    current.setUTCDate(current.getUTCDate() + 1);
  }

  const monthNames = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'
  ];

  while (current <= end) {
    const year = current.getUTCFullYear();
    const month = String(current.getUTCMonth() + 1).padStart(2, '0');
    const day = String(current.getUTCDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const displayDate = `Dom ${day} ${monthNames[current.getUTCMonth()]} ${year}`;
    
    result.push({ dateStr, displayDate });
    current.setUTCDate(current.getUTCDate() + 7);
  }

  return result;
}

/**
 * Calculate weekly collection statistics
 */
export function calculateWeeklyStats(weeks: SundayWeek[], memberCount: number, weeklyQuota = 10) {
  let totalCollected = 0;
  let totalPaidSlots = 0;
  const totalWeeksCount = weeks.length;
  const totalPotentialSlots = totalWeeksCount * memberCount;
  const totalPotentialMoney = totalPotentialSlots * weeklyQuota;

  // Track member specific totals
  const memberTotals: Record<string, { paidWeeks: number; totalPaid: number; pendingWeeks: number; pendingAmount: number }> = {};

  for (const week of weeks) {
    for (const [memberId, p] of Object.entries(week.payments)) {
      if (!memberTotals[memberId]) {
        memberTotals[memberId] = { paidWeeks: 0, totalPaid: 0, pendingWeeks: 0, pendingAmount: 0 };
      }
      if (p.paid) {
        totalPaidSlots += 1;
        totalCollected += p.amount || weeklyQuota;
        memberTotals[memberId].paidWeeks += 1;
        memberTotals[memberId].totalPaid += (p.amount || weeklyQuota);
      }
    }
  }

  // Calculate pending
  for (const memberId of Object.keys(memberTotals)) {
    const paidW = memberTotals[memberId].paidWeeks;
    memberTotals[memberId].pendingWeeks = Math.max(0, totalWeeksCount - paidW);
    memberTotals[memberId].pendingAmount = memberTotals[memberId].pendingWeeks * weeklyQuota;
  }

  return {
    totalCollected,
    totalWeeksCount,
    totalPotentialMoney,
    totalPaidSlots,
    totalPotentialSlots,
    collectionPercentage: totalPotentialMoney > 0 ? Math.round((totalCollected / totalPotentialMoney) * 100) : 0,
    memberTotals
  };
}

/**
 * Calculate Polladas projected and actual net profit
 */
export function calculatePolladasStats(polladas: PolladaItem[]) {
  let projectedGross = 0;
  let projectedCost = 0;
  let projectedNetProfit = 0;

  let actualGross = 0;
  let actualCost = 0;
  let actualNetProfit = 0;

  for (const p of polladas) {
    // Projections
    const pGross = p.targetDishes * p.pricePerDish;
    const pCost = p.targetDishes * p.costPerDish;
    const pNet = pGross - pCost;
    projectedGross += pGross;
    projectedCost += pCost;
    projectedNetProfit += pNet;

    // Actuals
    if (p.status === 'Realizada') {
      const realGross = p.actualGrossIncome !== undefined ? p.actualGrossIncome : (p.soldDishes * p.pricePerDish);
      const realCost = p.actualTotalCost !== undefined ? p.actualTotalCost : (p.soldDishes * p.costPerDish);
      const realNet = realGross - realCost;
      actualGross += realGross;
      actualCost += realCost;
      actualNetProfit += realNet;
    } else {
      // In preparation or planned: actual counts what has been sold so far
      const realGross = p.soldDishes * p.pricePerDish;
      const realCost = p.soldDishes * p.costPerDish;
      actualGross += realGross;
      actualCost += realCost;
      actualNetProfit += (realGross - realCost);
    }
  }

  return {
    projectedGross,
    projectedCost,
    projectedNetProfit,
    actualGross,
    actualCost,
    actualNetProfit
  };
}

/**
 * Calculate Jales funding and costs
 */
export function calculateJalesStats(jales: JalePlayer[]) {
  const targetTotal = jales.reduce((acc, j) => acc + (j.budgetAllocated || 1000), 0);
  const committedTotal = jales.reduce((acc, j) => acc + (j.actualCost || j.budgetAllocated || 1000), 0);
  const confirmedCount = jales.filter(j => j.status === 'Confirmado en lista' || j.status === 'Comprometido').length;

  return {
    targetTotal, // Usually 3000 (3 x 1000)
    committedTotal,
    confirmedCount,
    totalJales: jales.length
  };
}

/**
 * Overall financial summary of the club
 */
export function calculateFinancialSummary(state: ClubState) {
  const activeMembers = state.members.filter(m => m.active);
  const weekly = calculateWeeklyStats(state.weeks, activeMembers.length, state.weeklyQuota);
  const polladas = calculatePolladasStats(state.polladas);
  const jales = calculateJalesStats(state.jales);

  // Total cash in box right now
  const currentCashInBox = weekly.totalCollected + polladas.actualNetProfit;

  // Total projected revenue (weeks total potential + polladas projected net profit)
  const totalProjectedRevenue = weekly.totalPotentialMoney + polladas.projectedNetProfit;

  // Extra expenses (Inscripcion restante, agua, fruta, imprevistos)
  const budgetedExtras = state.extraExpenses.reduce((acc, e) => acc + e.estimatedCost, 0);
  const totalBudgetRequired = jales.targetTotal + budgetedExtras;

  const currentCoverageOfJales = jales.targetTotal > 0 
    ? Math.min(100, Math.round((currentCashInBox / jales.targetTotal) * 100))
    : 100;

  const totalCoverage = totalBudgetRequired > 0 
    ? Math.min(100, Math.round((currentCashInBox / totalBudgetRequired) * 100))
    : 100;

  const projectedSurplus = totalProjectedRevenue - totalBudgetRequired;

  return {
    currentCashInBox,
    totalProjectedRevenue,
    totalBudgetRequired,
    currentCoverageOfJales,
    totalCoverage,
    projectedSurplus,
    weekly,
    polladas,
    jales,
    budgetedExtras
  };
}

/**
 * Generate a clean, transparent WhatsApp message for the family group
 */
export function generateWhatsAppReport(state: ClubState): string {
  const summary = calculateFinancialSummary(state);
  const activeMembers = state.members.filter(m => m.active);
  
  // Format numbers
  const money = (val: number) => `S/ ${val.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const lines = [
    `⚽ *${state.clubName.toUpperCase()}* ⚽`,
    `📋 *INFORME DE RECAUDACIÓN Y CAJA FAMILIAR*`,
    `📅 Meta: Campeonato Provincia Junín (Cierre: 30/06/2027)`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `💰 *ESTADO DE CAJA ACTUAL:*`,
    `• Total en Caja: *${money(summary.currentCashInBox)}*`,
    `• Cuotas Dominicales: ${money(summary.weekly.totalCollected)} (${summary.weekly.totalPaidSlots} aportes)`,
    `• Ganancia Polladas: ${money(summary.polladas.actualNetProfit)}`,
    ``,
    `🎯 *META PRIORITARIA: 3 JALES (S/ 3,000.00)*`,
    `• Progreso Jales: *${summary.currentCoverageOfJales}%* cubierto`,
    `• Falta para jales: ${money(Math.max(0, summary.jales.targetTotal - summary.currentCashInBox))}`,
    ``,
    `🍗 *ACTIVIDADES (3 POLLADAS):*`,
    ...state.polladas.map((p, idx) => `• Pollada #${idx + 1} (${p.targetDate}): ${p.status} - Meta: ${p.targetDishes} platos`),
    ``,
    `🤝 *COMPROMISOS DE LA FAMILIA:*`,
    `• Ramón: 4 six packs Sporade`,
    `• Sonia: 3 paquetes agua`,
    `• Mastha: Pelota de fútbol`,
    `• Jhon: Éter para lesiones`,
    `• Rocío: Camisetas oficiales`,
    `• Manolo: S/ 500 inscripción + sorpresa`,
    `• Edgar: Banderola del club`,
    `• Barcos: Guantes para arquero`,
    `• Vides: Sorpresa (se coordina a 30 días)`,
    ``,
    `👤 *APORTES DOMINICALES (S/ 10 c/u - ${activeMembers.length} aportantes):*`,
    ...activeMembers.map(m => {
      const stats = summary.weekly.memberTotals[m.id];
      const paid = stats ? stats.paidWeeks : 0;
      return `• ${m.name}: ${paid} domingos pagados (${money((stats?.totalPaid || 0))})`;
    }),
    `━━━━━━━━━━━━━━━━━━━━━`,
    `¡Cuentas claras y transparentes para la familia! Con fe rumbo a Junín 2027. 💪🏆`
  ];

  return lines.join('\n');
}
