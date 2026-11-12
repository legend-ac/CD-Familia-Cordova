import { ClubState } from '../types';
import { generateSundays } from '../utils/calculator';

export const INITIAL_MEMBERS = [
  { id: 'm1', name: 'Coordinador General (Tú)', relationship: 'Organizador y Tesorero', phone: '987 654 321', active: true },
  { id: 'm2', name: 'Tío Ramón', relationship: 'Familia Córdova - Donante Sporade', phone: '991 234 567', active: true },
  { id: 'm3', name: 'Tía Sonia', relationship: 'Familia Córdova - Donante Agua', phone: '992 345 678', active: true },
  { id: 'm4', name: 'Jhon', relationship: 'Primo - Apoyo Botiquín y Éter', phone: '993 456 789', active: true },
  { id: 'm5', name: 'Rocío', relationship: 'Prima - Donante Camisetas', phone: '994 567 890', active: true },
  { id: 'm6', name: 'Manolo', relationship: 'Familiar - Aporte S/500 Inscripción', phone: '995 678 901', active: true }
];

export function buildInitialState(): ClubState {
  const generatedSundays = generateSundays('2026-11-11', '2027-06-30');
  
  // Build initial weeks data
  const weeks = generatedSundays.map((s, index) => {
    const weekNumber = index + 1;
    // For week 1 (first Sunday 15 Nov 2026), let's pre-initialize initial payments
    const payments: Record<string, { paid: boolean; amount: number; method?: any }> = {};
    INITIAL_MEMBERS.forEach(m => {
      // Starting clean or with first demo payments if desired
      payments[m.id] = {
        paid: false,
        amount: 10
      };
    });

    return {
      weekNumber,
      dateStr: s.dateStr,
      displayDate: s.displayDate,
      payments
    };
  });

  return {
    clubName: 'CD Familia Córdova 2027',
    startDate: '2026-11-11',
    closingDate: '2027-06-30',
    weeklyQuota: 10,
    members: INITIAL_MEMBERS,
    weeks,
    polladas: [
      {
        id: 'pol-1',
        number: 1,
        name: 'Pollada Pro-Fondos #1: Gran Apertura de Campaña',
        targetDate: '2027-01-31',
        status: 'Planificada',
        pricePerDish: 20,
        targetDishes: 100,
        soldDishes: 0,
        costPerDish: 8.50,
        location: 'Local familiar / Domicilio Lima',
        notes: 'Meta: 100 platos. Cada uno de los 6 miembros se compromete a colocar 15-18 tarjetas.'
      },
      {
        id: 'pol-2',
        number: 2,
        name: 'Pollada Pro-Fondos #2: Afianzamiento Mitad de Año',
        targetDate: '2027-04-18',
        status: 'Planificada',
        pricePerDish: 20,
        targetDishes: 100,
        soldDishes: 0,
        costPerDish: 8.50,
        location: 'Lima',
        notes: 'Segunda actividad clave para asegurar el pago del 2do y 3er jale.'
      },
      {
        id: 'pol-3',
        number: 3,
        name: 'Pollada Pro-Fondos #3: La Despedida y Recta Final',
        targetDate: '2027-05-30',
        status: 'Planificada',
        pricePerDish: 20,
        targetDishes: 110,
        soldDishes: 0,
        costPerDish: 8.50,
        location: 'Lima',
        notes: 'Última gran actividad antes del viaje de Junio a Junín. Cierre de caja y entrega de indumentaria.'
      }
    ],
    jales: [
      {
        id: 'jal-1',
        number: 1,
        name: 'Jale #1 (Volante Ofensivo / 10)',
        alias: 'Por definir / En visor',
        position: 'Volante de Creación (10)',
        budgetAllocated: 1000,
        actualCost: 1000,
        travelStatus: 'Por coordinar',
        lodgingNote: 'Alojamiento en casa familiar en Jisse / Janjaillo',
        status: 'Conversando',
        notes: 'Perfil: Buen manejo de balón, resistente a la altura de Junín (+3,400 msnm).'
      },
      {
        id: 'jal-2',
        number: 2,
        name: 'Jale #2 (Centrodelantero Goleador / 9)',
        alias: 'Por definir / En visor',
        position: 'Delantero Centro (9)',
        budgetAllocated: 1000,
        actualCost: 1000,
        travelStatus: 'Por coordinar',
        lodgingNote: 'Alojamiento en casa comunal / tíos',
        status: 'En carpeta',
        notes: 'Fuerza física y definición para partidos duros de 2 días.'
      },
      {
        id: 'jal-3',
        number: 3,
        name: 'Jale #3 (Defensa Central Muralla / 2 o 3)',
        alias: 'Por definir / En visor',
        position: 'Back Central',
        budgetAllocated: 1000,
        actualCost: 1000,
        travelStatus: 'Por coordinar',
        lodgingNote: 'Alojamiento garantizado en el pueblo',
        status: 'En carpeta',
        notes: 'Liderazgo atrás, juego aéreo y voz de mando.'
      }
    ],
    commitments: [
      {
        id: 'com-1',
        donorName: 'Ramón',
        itemDescription: '4 six packs de Sporade',
        category: 'Hidratación',
        status: 'Comprometido',
        isSurprise: false,
        estimatedValue: 75,
        notes: 'Para hidratación de los 2 días de competencia'
      },
      {
        id: 'com-2',
        donorName: 'Sonia',
        itemDescription: '3 paquetes de agua de mesa',
        category: 'Hidratación',
        status: 'Comprometido',
        isSurprise: false,
        estimatedValue: 45,
        notes: 'Paquetes de botellas para el banquillo y descanso'
      },
      {
        id: 'com-3',
        donorName: 'Mastha',
        itemDescription: 'Pelota de fútbol oficial',
        category: 'Implementos',
        status: 'Comprometido',
        isSurprise: false,
        estimatedValue: 120,
        notes: 'Balón para entrenamiento previo y calentamiento'
      },
      {
        id: 'com-4',
        donorName: 'Jhon',
        itemDescription: 'Éter para lesiones deportivas y botiquín',
        category: 'Implementos',
        status: 'Comprometido',
        isSurprise: false,
        estimatedValue: 60,
        notes: 'Para golpes, contusiones y enfriamiento muscular en campo'
      },
      {
        id: 'com-5',
        donorName: 'Rocío',
        itemDescription: 'Camisetas del equipo (Juego completo donado)',
        category: 'Indumentaria',
        status: 'Comprometido',
        isSurprise: false,
        estimatedValue: 350,
        notes: 'Juego de camisetas oficiales con números y escudo'
      },
      {
        id: 'com-6',
        donorName: 'Manolo',
        itemDescription: 'S/ 500 para la inscripción del campeonato',
        category: 'Inscripción',
        status: 'Comprometido',
        isSurprise: false,
        estimatedValue: 500,
        notes: 'Cubre más del 70% de la inscripción total'
      },
      {
        id: 'com-7',
        donorName: 'Manolo',
        itemDescription: 'Sorpresa de Manolo para el club',
        category: 'Sorpresa',
        status: 'Comprometido',
        isSurprise: true,
        surpriseRequestDeadline: '2027-05-25',
        estimatedValue: 150,
        notes: 'Pedir y coordinar 30 días antes del campeonato (Mayo 2027)'
      },
      {
        id: 'com-8',
        donorName: 'Edgar Espinoza',
        itemDescription: '1 Banderola oficial del club CD Familia Córdova',
        category: 'Identidad',
        status: 'Comprometido',
        isSurprise: false,
        estimatedValue: 100,
        notes: 'Para alentar a la barra familiar en la tribuna en Junín'
      },
      {
        id: 'com-9',
        donorName: 'Barcos',
        itemDescription: 'Par de guantes profesionales para arquero',
        category: 'Implementos',
        status: 'Comprometido',
        isSurprise: false,
        estimatedValue: 90,
        notes: 'Para dar seguridad al arco del equipo'
      },
      {
        id: 'com-10',
        donorName: 'Vides',
        itemDescription: 'Sorpresa de Vides para el club',
        category: 'Sorpresa',
        status: 'Comprometido',
        isSurprise: true,
        surpriseRequestDeadline: '2027-05-25',
        estimatedValue: 150,
        notes: 'Pedir y coordinar 30 días antes del campeonato (Mayo 2027)'
      }
    ],
    memories: [
      {
        id: 'mem-1',
        title: 'El Nacimiento de CD Familia Córdova',
        yearOrDate: 'Lima',
        category: 'Mística / Identidad',
        author: 'Familia Córdova',
        imageUrl: '',
        description: 'La tradición de reunirnos cada año en la cancha, vistiendo los mismos colores con garra, unión y orgullo de nuestras raíces.',
        tags: ['Fundación', 'Familia', 'Unión']
      },
      {
        id: 'mem-2',
        title: 'La Mística de Jisse y Janjaillo',
        yearOrDate: 'Junín',
        category: 'Mística / Identidad',
        author: 'Consejo Familiar',
        imageUrl: '',
        description: 'La tierra donde la pelota rueda con orgullo y el frío de la sierra se calienta con la pasión de la familia en la tribuna y en el campo.',
        tags: ['Junín', 'Janjaillo', 'Jisse', 'Campeonato']
      },
      {
        id: 'mem-3',
        title: 'Las Polleras y Tardes Deportivas',
        yearOrDate: 'Recuerdo Familiar',
        category: 'Anécdota Familiar',
        author: 'Tíos y Primos',
        imageUrl: '',
        description: 'Hacer pollada no solo es juntar soles; es poner la música, sazonar el pollo entre primos y pasar un domingo riendo mientras sumamos para el equipo.',
        tags: ['Polladas', 'Hermandad', 'Sazón']
      }
    ],
    extraExpenses: [
      {
        id: 'exp-1',
        description: 'Saldo restante de Inscripción (estimado 30% restante)',
        estimatedCost: 180,
        actualCost: 0,
        category: 'Inscripción Saldo',
        status: 'Presupuestado'
      },
      {
        id: 'exp-2',
        description: 'Caja chica para Fruta fresca, hielo y agua extra en provincia',
        estimatedCost: 250,
        actualCost: 0,
        category: 'Agua/Hielo/Fruta',
        status: 'Presupuestado'
      },
      {
        id: 'exp-3',
        description: 'Fondo de Imprevistos & Contingencias en viaje a Junín',
        estimatedCost: 500,
        actualCost: 0,
        category: 'Imprevistos/Reserva',
        status: 'Presupuestado'
      }
    ],
    notesAndLogistics: {
      accommodationDetail: 'Alojamiento para todos cubierto: cada familia tiene casa o familiares donde pernoctar. Para los 3 jales se hospedarán en casas de la familia en el pueblo.',
      transportGeneralDetail: 'Transporte de la familia y jugadores locales es por cuenta propia. Los fondos del club cubren pasajes y honorarios exclusivos de los 3 jales.',
      foodPolicyDetail: 'Comida durante el viaje es autogestionada/familiar. No sobrecargar el presupuesto general obligatorio para mantener la meta viable.',
      firstAidDetail: 'Botiquín de campo asegurado por Jhon (incluye éter, vendas, alcohol, spray refrescante). Médico particular descartado por orden del club.'
    }
  };
}
