export interface SkillLevel {
  name: string;
  level: number;
  exp: number;
  maxExp: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface CheckInRecord {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  courseName: string;
  forced: boolean; // check in forzato
}

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  avatar: string;
  phone: string;
  fiscalCode: string;
  address: string;
  membershipStatus: 'Attivo' | 'In Scadenza' | 'Scaduto' | 'Sospeso';
  membershipExpiry: string;
  membershipType: string;
  registrationDate?: string; // Data di iscrizione
  registrationExpiry: string; // Scadenza iscrizione (e.g. YYYY-MM-DD)
  medicalCertificate?: boolean; // Se presente
  medicalCertificateExpiry: string; // Scadenza certificato medico (e.g. YYYY-MM-DD)
  skills: SkillLevel[];
  badges: Badge[];
  totalCheckIns: number;
  totalSpent: number;
  checkInDates: string[]; // YYYY-MM-DD for legacy support
  checkInHistory: CheckInRecord[]; // Rich list of check ins with day and time
  level: number;
  xp: number;
  nextLevelXp: number;
  weeklyWorkouts: number;
  birthday: string;
  lastActive: string;
  registeredOnWeb: boolean;
  remainingEntries?: number; // for ingressi-based subscriptions (if applicable)
}

export interface Course {
  id: string;
  name: string; // Course name / discipline
  trainer: string;
  time: string; // "18:00 - 19:00"
  date: string; // YYYY-MM-DD
  category: string; // 'Crossfit' | 'Yoga' | 'Pilates' | 'Calisthenics' | 'Spinning' | etc
  capacityMin: number;
  capacityMax: number;
  bookings: string[]; // User IDs
  bookingWindowHours: number;
  cancellationWindowHours: number;
  isSuspended?: boolean; // class suspension
  suspended?: boolean; // alias for suspension
  validFrom?: string; // YYYY-MM-DD start of validity over time
  validTo?: string; // YYYY-MM-DD end of validity over time
  validityStart?: string; // alias validity start
  validityEnd?: string; // alias validity end
}

export interface Subscription {
  id: string;
  name: string;
  image: string; // URL / uploaded base64 data
  imageUrl?: string; // alias URL
  startDate: string; // YYYY-MM-DD (purchasable period start)
  endDate: string; // YYYY-MM-DD (purchasable period end)
  validityStart?: string; // alias start date
  validityEnd?: string; // alias end date
  description: string;
  disciplines: string[]; // disciplines/courses paired with this subscription
  allowedDisciplines?: string[]; // alias allowed disciplines
  type: 'tempo' | 'ingressi';
  cadence: '1' | '2' | '3' | '4' | '5' | 'open' | 'weekly' | 'monthly'; // weekly/monthly limit or open
  commissionFeePercentage: number; // percentage passed to app payment
  appFeePercentage?: number; // alias fee percentage
  price: number;
}

export interface Workout {
  id: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
  publishTime: string; // "07:00"
  published: boolean;
}

export interface Sale {
  id: string;
  userId: string;
  userName: string;
  item: string; // e.g., "Abbonamento Mensile Open"
  amount: number;
  date: string; // YYYY-MM-DD
  status: 'Completato' | 'In Attesa' | 'Rimborsato';
  type: 'Ricorrente' | 'Una Tantum';
}

export interface GymAlert {
  id: string;
  type: 'cancellation' | 'milestone' | 'birthday' | 'frequency_drop' | 'expiry' | 'class_change';
  message: string;
  timestamp: string; // ISO string
  read: boolean;
  user?: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  type: 'reminder' | 'level_up' | 'gym_broadcast';
}
