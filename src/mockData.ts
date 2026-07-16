import { User, Course, Workout, Sale, GymAlert, Subscription } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Giovanni',
    surname: 'Rossi',
    email: 'giovanni.rossi@email.it',
    phone: '+39 345 678 9012',
    fiscalCode: 'RSSGNN95S20F205H',
    address: 'Via Roma 45, Milano (MI)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    membershipStatus: 'Attivo',
    membershipExpiry: '2026-09-30',
    membershipType: 'Annuale Open',
    registrationExpiry: '2026-12-31',
    medicalCertificateExpiry: '2026-09-10', // Expiring in less than 60 days
    totalCheckIns: 124,
    totalSpent: 480,
    checkInDates: ['2026-07-15', '2026-07-13', '2026-07-10', '2026-07-08'],
    checkInHistory: [
      { date: '2026-07-15', time: '13:00', courseName: 'Crossfit WOD', forced: false },
      { date: '2026-07-13', time: '12:30', courseName: 'Crossfit WOD', forced: false },
      { date: '2026-07-10', time: '18:15', courseName: 'Vinyasa Flow Yoga', forced: false },
      { date: '2026-07-08', time: '19:30', courseName: 'Calisthenics Skills', forced: false }
    ],
    level: 12,
    xp: 450,
    nextLevelXp: 1000,
    weeklyWorkouts: 4,
    birthday: '1995-11-20',
    lastActive: '2026-07-15',
    registeredOnWeb: false,
    skills: [
      { name: 'Forza', level: 8, exp: 70, maxExp: 100 },
      { name: 'Resistenza', level: 9, exp: 40, maxExp: 100 },
      { name: 'Flessibilità', level: 5, exp: 80, maxExp: 100 },
      { name: 'Coordinazione', level: 7, exp: 10, maxExp: 100 }
    ],
    badges: [
      { id: 'bdg-1', name: 'Guerriero d\'Acciaio', description: 'Supera i 100 allenamenti', icon: 'Shield', unlockedAt: '2026-06-10' },
      { id: 'bdg-2', name: 'Fedelissimo', description: 'Membro attivo da più di 6 mesi', icon: 'Award', unlockedAt: '2026-05-01' }
    ]
  },
  {
    id: 'usr-2',
    name: 'Laura',
    surname: 'Bianchi',
    email: 'laura.bianchi@email.it',
    phone: '+39 333 456 7890',
    fiscalCode: 'BNCLRA98L56H501F',
    address: 'Corso Buenos Aires 12, Milano (MI)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    membershipStatus: 'Attivo',
    membershipExpiry: '2026-08-15',
    membershipType: 'Mensile Standard',
    registrationExpiry: '2026-11-20',
    medicalCertificateExpiry: '2026-08-20', // Very close
    totalCheckIns: 48,
    totalSpent: 180,
    checkInDates: ['2026-07-14', '2026-07-11', '2026-07-09'],
    checkInHistory: [
      { date: '2026-07-14', time: '18:10', courseName: 'Vinyasa Flow Yoga', forced: false },
      { date: '2026-07-11', time: '09:15', courseName: 'Pilates Core', forced: false },
      { date: '2026-07-09', time: '18:30', courseName: 'Vinyasa Flow Yoga', forced: false }
    ],
    level: 5,
    xp: 850,
    nextLevelXp: 1000,
    weeklyWorkouts: 3,
    birthday: '1998-07-16', // COMPLEANNO OGGI (16 Luglio)
    lastActive: '2026-07-14',
    registeredOnWeb: false,
    skills: [
      { name: 'Forza', level: 4, exp: 20, maxExp: 100 },
      { name: 'Resistenza', level: 5, exp: 90, maxExp: 100 },
      { name: 'Flessibilità', level: 7, exp: 30, maxExp: 100 },
      { name: 'Coordinazione', level: 4, exp: 60, maxExp: 100 }
    ],
    badges: [
      { id: 'bdg-3', name: 'Zensational', description: 'Partecipa a 10 lezioni di Yoga', icon: 'Flame', unlockedAt: '2026-06-20' }
    ]
  },
  {
    id: 'usr-3',
    name: 'Marco',
    surname: 'Verdi',
    email: 'marco.verdi@email.it',
    phone: '+39 329 123 4567',
    fiscalCode: 'VRDMRC91D12F205T',
    address: 'Viale Monza 198, Milano (MI)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    membershipStatus: 'In Scadenza',
    membershipExpiry: '2026-07-22', // SCADENZA IMMINENTE
    membershipType: 'A Ingressi (10 ingressi)',
    registrationExpiry: '2026-07-22',
    medicalCertificateExpiry: '2026-07-25', // Expiring in 9 days
    totalCheckIns: 12,
    totalSpent: 90,
    checkInDates: ['2026-07-02'],
    checkInHistory: [
      { date: '2026-07-02', time: '13:00', courseName: 'Crossfit WOD', forced: true }
    ],
    level: 2,
    xp: 150,
    nextLevelXp: 500,
    weeklyWorkouts: 0, // CALO DI FREQUENZA
    birthday: '1991-04-12',
    lastActive: '2026-07-02',
    registeredOnWeb: false,
    remainingEntries: 2, // Less than 3 entries!
    skills: [
      { name: 'Forza', level: 2, exp: 40, maxExp: 100 },
      { name: 'Resistenza', level: 1, exp: 90, maxExp: 100 },
      { name: 'Flessibilità', level: 2, exp: 10, maxExp: 100 },
      { name: 'Coordinazione', level: 2, exp: 30, maxExp: 100 }
    ],
    badges: []
  },
  {
    id: 'usr-4',
    name: 'Sofia',
    surname: 'Neri',
    email: 'sofia.neri@email.it',
    phone: '+39 347 987 6543',
    fiscalCode: 'NRESFO93P45H501K',
    address: 'Via Torino 8, Milano (MI)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    membershipStatus: 'Attivo',
    membershipExpiry: '2026-12-31',
    membershipType: 'Semestrale Open',
    registrationExpiry: '2026-12-31',
    medicalCertificateExpiry: '2026-12-01',
    totalCheckIns: 49, // RAGGIUNGERÀ 50 ALLA PROSSIMA LEZIONE! (Pietra Miliare)
    totalSpent: 290,
    checkInDates: ['2026-07-15', '2026-07-13', '2026-07-11'],
    checkInHistory: [
      { date: '2026-07-15', time: '12:30', courseName: 'Crossfit WOD', forced: false },
      { date: '2026-07-13', time: '13:00', courseName: 'Crossfit WOD', forced: false },
      { date: '2026-07-11', time: '09:00', courseName: 'Pilates Core', forced: false }
    ],
    level: 7,
    xp: 990, // Vicina al livello 8
    nextLevelXp: 1000,
    weeklyWorkouts: 3,
    birthday: '1993-09-05',
    lastActive: '2026-07-15',
    registeredOnWeb: false,
    skills: [
      { name: 'Forza', level: 6, exp: 60, maxExp: 100 },
      { name: 'Resistenza', level: 8, exp: 80, maxExp: 100 },
      { name: 'Flessibilità', level: 6, exp: 40, maxExp: 100 },
      { name: 'Coordinazione', level: 7, exp: 50, maxExp: 100 }
    ],
    badges: [
      { id: 'bdg-2', name: 'Fedelissimo', description: 'Membro attivo da più di 6 mesi', icon: 'Award', unlockedAt: '2026-04-15' }
    ]
  },
  {
    id: 'usr-web',
    name: 'Massimiliano',
    surname: 'Scomazzon',
    email: 'massimoscomazzon@gmail.com',
    phone: '+39 340 000 1234',
    fiscalCode: 'SCMMSM96M25F205Z',
    address: 'Piazza del Duomo 1, Milano (MI)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    membershipStatus: 'Attivo',
    membershipExpiry: '2026-08-16',
    membershipType: 'Mensile Promo Web',
    registrationExpiry: '2026-08-16',
    medicalCertificateExpiry: '2027-01-20',
    totalCheckIns: 1,
    totalSpent: 45,
    checkInDates: ['2026-07-16'],
    checkInHistory: [
      { date: '2026-07-16', time: '18:00', courseName: 'Vinyasa Flow Yoga', forced: false }
    ],
    level: 1,
    xp: 50,
    nextLevelXp: 300,
    weeklyWorkouts: 1,
    birthday: '1996-08-25',
    lastActive: '2026-07-16',
    registeredOnWeb: true, // Iscritto dal sito web, importato automaticamente!
    skills: [
      { name: 'Forza', level: 1, exp: 10, maxExp: 100 },
      { name: 'Resistenza', level: 1, exp: 20, maxExp: 100 },
      { name: 'Flessibilità', level: 1, exp: 30, maxExp: 100 },
      { name: 'Coordinazione', level: 1, exp: 15, maxExp: 100 }
    ],
    badges: [
      { id: 'bdg-web', name: 'Pioniere Digitale', description: 'Iscritto dal sito web', icon: 'Smartphone', unlockedAt: '2026-07-16' }
    ]
  }
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    name: 'Abbonamento Mensile Standard',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    description: 'Abbonamento mensile standard per accesso a discipline Yoga, Pilates e Spinning.',
    disciplines: ['Vinyasa Flow Yoga', 'Pilates Core', 'Spinning Endurance'],
    type: 'tempo',
    cadence: '3',
    commissionFeePercentage: 2.5,
    price: 45
  },
  {
    id: 'sub-2',
    name: 'Abbonamento Annuale Open',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=300&q=80',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    description: 'Accesso illimitato a tutti i corsi della palestra per un anno intero con commissioni azzerate.',
    disciplines: ['Crossfit WOD', 'Vinyasa Flow Yoga', 'Calisthenics Skills', 'Pilates Core', 'Crossfit Power', 'Spinning Endurance'],
    type: 'tempo',
    cadence: 'open',
    commissionFeePercentage: 0,
    price: 480
  },
  {
    id: 'sub-3',
    name: 'Carnet 10 Ingressi Crossfit & Pilates',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=300&q=80',
    startDate: '2026-03-01',
    endDate: '2026-10-31',
    description: 'Pacchetto da 10 ingressi spendibili nei corsi di Crossfit e Pilates.',
    disciplines: ['Crossfit WOD', 'Pilates Core', 'Crossfit Power'],
    type: 'ingressi',
    cadence: '2',
    commissionFeePercentage: 3.0,
    price: 90
  }
];

export const INITIAL_COURSES: Course[] = [
  // Oggi 16 Luglio
  {
    id: 'crs-1',
    name: 'Crossfit WOD',
    trainer: 'Stefano Berti',
    time: '12:30 - 13:30',
    date: '2026-07-16',
    category: 'Crossfit',
    capacityMin: 3,
    capacityMax: 12,
    bookings: ['usr-1', 'usr-4'],
    bookingWindowHours: 24,
    cancellationWindowHours: 2
  },
  {
    id: 'crs-2',
    name: 'Vinyasa Flow Yoga',
    trainer: 'Elena Molinari',
    time: '18:00 - 19:15',
    date: '2026-07-16',
    category: 'Yoga',
    capacityMin: 4,
    capacityMax: 15,
    bookings: ['usr-2', 'usr-web'],
    bookingWindowHours: 24,
    cancellationWindowHours: 3
  },
  {
    id: 'crs-3',
    name: 'Calisthenics Skills',
    trainer: 'Alex Riva',
    time: '19:30 - 20:30',
    date: '2026-07-16',
    category: 'Calisthenics',
    capacityMin: 3,
    capacityMax: 10,
    bookings: ['usr-1'],
    bookingWindowHours: 24,
    cancellationWindowHours: 4
  },
  // Domani 17 Luglio
  {
    id: 'crs-4',
    name: 'Pilates Core',
    trainer: 'Elena Molinari',
    time: '09:00 - 10:00',
    date: '2026-07-17',
    category: 'Pilates',
    capacityMin: 3,
    capacityMax: 12,
    bookings: ['usr-2', 'usr-4'],
    bookingWindowHours: 24,
    cancellationWindowHours: 2
  },
  {
    id: 'crs-5',
    name: 'Crossfit Power',
    trainer: 'Stefano Berti',
    time: '13:00 - 14:00',
    date: '2026-07-17',
    category: 'Crossfit',
    capacityMin: 4,
    capacityMax: 15,
    bookings: ['usr-1', 'usr-web'],
    bookingWindowHours: 24,
    cancellationWindowHours: 2
  },
  {
    id: 'crs-6',
    name: 'Spinning Endurance',
    trainer: 'Manuel Costa',
    time: '19:00 - 20:00',
    date: '2026-07-17',
    category: 'Spinning',
    capacityMin: 5,
    capacityMax: 20,
    bookings: [],
    bookingWindowHours: 24,
    cancellationWindowHours: 1
  }
];

export const INITIAL_WORKOUTS: Workout[] = [
  {
    id: 'wod-1',
    title: 'WOD - Helen Custom Strength',
    content: `Riscaldamento (10 minuti):\n- 3 giri di: 200m corsa, 10 squat a corpo libero, 5 trazioni.\n\nParte A (Forza):\n- Back Squat: 5 serie x 5 rep al 75-80% 1RM (Recupero 2 min)\n\nParte B (Metcon):\n3 Round a tempo di:\n- 400m Corsa\n- 21 Kettlebell Swings (24kg / 16kg)\n- 12 Pull-ups\n\nTarget Time: < 12 minuti.\nAnnota i tuoi carichi e il tempo totale nel pannello dei Personal Records!`,
    date: '2026-07-16',
    publishTime: '06:00',
    published: true
  },
  {
    id: 'wod-2',
    title: 'WOD - Calisthenics Progression',
    content: `Riscaldamento:\n- Circonduzioni spalle, polsi e mobilità dell'anca.\n\nCore Builder:\n- Hollow body hold: 4 serie x 45 secondi\n- Plank con sovraccarico: 3 serie x 1 minuto\n\nForza e Abilità:\n- Propedeutica L-Sit / Handstand: 5 tentativi x max tenuta\n- Dips alle parallele: 4 serie x 8-10 reps (pesanti)\n- Pull-ups con fermo 2" in alto: 4 serie x 6 reps`,
    date: '2026-07-17',
    publishTime: '07:30',
    published: false // Da pubblicare domani!
  }
];

export const INITIAL_SALES: Sale[] = [
  // Vendite storiche 2024
  { id: 'sal-100', userId: 'usr-1', userName: 'Giovanni Rossi', item: 'Annuale Open', amount: 480, date: '2024-09-15', status: 'Completato', type: 'Una Tantum' },
  { id: 'sal-101', userId: 'usr-2', userName: 'Laura Bianchi', item: 'Mensile Standard', amount: 45, date: '2024-10-10', status: 'Completato', type: 'Ricorrente' },
  { id: 'sal-102', userId: 'usr-3', userName: 'Marco Verdi', item: 'Mensile Open', amount: 60, date: '2024-11-05', status: 'Completato', type: 'Ricorrente' },
  // Vendite 2025
  { id: 'sal-200', userId: 'usr-1', userName: 'Giovanni Rossi', item: 'Abbonamento Semestrale', amount: 260, date: '2025-03-10', status: 'Completato', type: 'Una Tantum' },
  { id: 'sal-201', userId: 'usr-4', userName: 'Sofia Neri', item: 'Mensile Standard', amount: 45, date: '2025-05-12', status: 'Completato', type: 'Ricorrente' },
  { id: 'sal-202', userId: 'usr-2', userName: 'Laura Bianchi', item: 'Mensile Standard', amount: 45, date: '2025-09-01', status: 'Completato', type: 'Ricorrente' },
  { id: 'sal-203', userId: 'usr-3', userName: 'Marco Verdi', item: 'Mensile Open', amount: 60, date: '2025-11-01', status: 'Completato', type: 'Ricorrente' },
  // Vendite 2026 (Anno corrente)
  { id: 'sal-301', userId: 'usr-1', userName: 'Giovanni Rossi', item: 'Abbonamento Annuale Open', amount: 480, date: '2026-01-10', status: 'Completato', type: 'Una Tantum' },
  { id: 'sal-302', userId: 'usr-4', userName: 'Sofia Neri', item: 'Semestrale Open', amount: 290, date: '2026-02-15', status: 'Completato', type: 'Una Tantum' },
  { id: 'sal-303', userId: 'usr-3', userName: 'Marco Verdi', item: 'Mensile Open', amount: 90, date: '2026-06-22', status: 'Completato', type: 'Ricorrente' },
  { id: 'sal-304', userId: 'usr-2', userName: 'Laura Bianchi', item: 'Mensile Standard', amount: 45, date: '2026-06-15', status: 'Completato', type: 'Ricorrente' },
  { id: 'sal-305', userId: 'usr-web', userName: 'Massimiliano Scomazzon', item: 'Mensile Promo Web', amount: 45, date: '2026-07-16', status: 'Completato', type: 'Una Tantum' }
];

export const INITIAL_ALERTS: GymAlert[] = [
  {
    id: 'alt-1',
    type: 'birthday',
    message: 'Oggi è il compleanno di Laura Bianchi! Compiè 28 anni. Inviale gli auguri dalla palestra!',
    timestamp: '2026-07-16T08:00:00Z',
    read: false,
    user: { id: 'usr-2', name: 'Laura Bianchi', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' }
  },
  {
    id: 'alt-2',
    type: 'expiry',
    message: 'L\'abbonamento di Marco Verdi scadrà tra 6 giorni (il 22 Luglio). Notifica automatica inviata.',
    timestamp: '2026-07-16T08:15:00Z',
    read: false,
    user: { id: 'usr-3', name: 'Marco Verdi', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' }
  },
  {
    id: 'alt-3',
    type: 'frequency_drop',
    message: 'Calo di frequenza rilevato: Marco Verdi non partecipa ad allenamenti da 14 giorni. Rischio abbandono alto!',
    timestamp: '2026-07-15T18:00:00Z',
    read: true,
    user: { id: 'usr-3', name: 'Marco Verdi', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' }
  },
  {
    id: 'alt-4',
    type: 'milestone',
    message: 'Sofia Neri è ad un passo dalla pietra miliare: 50 allenamenti! Mancano solo 1 check-in.',
    timestamp: '2026-07-15T19:30:00Z',
    read: false,
    user: { id: 'usr-4', name: 'Sofia Neri', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' }
  }
];
