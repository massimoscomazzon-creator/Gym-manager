import React, { useState } from 'react';
import { 
  Users, DollarSign, TrendingUp, Calendar, Edit3, CheckCircle, 
  AlertTriangle, Cake, Award, Plus, FileText, Send, Trash2, Shield, Flame, Search,
  UserCheck, BookOpen, Tag, Printer, Download, ToggleLeft, ToggleRight, X, Image as ImageIcon, Info, UserX
} from 'lucide-react';
import { User, Course, Workout, Sale, GymAlert, Subscription, CheckInRecord } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { exportToExcel, printUserPDF, exportSalesToExcel, exportUsersToExcel } from '../utils/export';

interface AdminDashboardProps {
  users: User[];
  courses: Course[];
  workouts: Workout[];
  sales: Sale[];
  alerts: GymAlert[];
  subscriptions: Subscription[];
  onAddWorkout: (workout: Omit<Workout, 'id'>) => void;
  onUpdateSale: (sale: Sale) => void;
  onAddSale: (sale: Omit<Sale, 'id'>) => void;
  onSendBroadcast: (title: string, body: string) => void;
  onForceRefreshAlerts: () => void;
  onAddSubscription: (sub: Omit<Subscription, 'id'>) => void;
  onUpdateSubscription: (sub: Subscription) => void;
  onDeleteSubscription: (id: string) => void;
  onAddCourse: (course: Omit<Course, 'id' | 'bookings'>) => void;
  onUpdateCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  onAddUserToClass: (courseId: string, userId: string, forced: boolean) => void;
  onRemoveUserFromClass: (courseId: string, userId: string) => void;
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

export default function AdminDashboard({
  users,
  courses,
  workouts,
  sales,
  alerts,
  subscriptions = [],
  onAddWorkout,
  onUpdateSale,
  onAddSale,
  onSendBroadcast,
  onForceRefreshAlerts,
  onAddSubscription,
  onUpdateSubscription,
  onDeleteSubscription,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onAddUserToClass,
  onRemoveUserFromClass,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}: AdminDashboardProps) {
  // Tabs within Desktop Dashboard
  const [activeTab, setActiveTab] = useState<'panoramica' | 'finanze' | 'wod' | 'fidelizzazione' | 'comunicazioni' | 'checkin' | 'utenti' | 'palinsesto' | 'abbonamenti'>('panoramica');

  // Workout state
  const [wodTitle, setWodTitle] = useState('');
  const [wodContent, setWodContent] = useState('');
  const [wodDate, setWodDate] = useState('2026-07-16');
  const [wodTime, setWodTime] = useState('07:00');
  const [wodPublishNow, setWodPublishNow] = useState(true);

  // Sales edit modal state
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [newSaleUser, setNewSaleUser] = useState(users[0]?.id || '');
  const [newSaleItem, setNewSaleItem] = useState('Abbonamento Mensile Standard');
  const [newSaleAmount, setNewSaleAmount] = useState('45');
  const [newSaleType, setNewSaleType] = useState<'Ricorrente' | 'Una Tantum'>('Ricorrente');
  
  // Custom manual sale input
  const [showAddSaleForm, setShowAddSaleForm] = useState(false);

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastStatus, setBroadcastStatus] = useState<string | null>(null);

  // Search filter
  const [salesSearch, setSalesSearch] = useState('');

  // --- NEW STATES FOR GESTIONE PALESTRA ---

  // 1. Contabilità & Vendite filters
  const [salesFilterUser, setSalesFilterUser] = useState('');
  const [salesFilterStartDate, setSalesFilterStartDate] = useState('');
  const [salesFilterEndDate, setSalesFilterEndDate] = useState('');

  // 2. Anagrafica Utenti
  const [userSearch, setUserSearch] = useState('');
  const [userFilterStatus, setUserFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<User | null>(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // User form fields state
  const [userFormName, setUserFormName] = useState('');
  const [userFormSurname, setUserFormSurname] = useState('');
  const [userFormEmail, setUserFormEmail] = useState('');
  const [userFormPhone, setUserFormPhone] = useState('');
  const [userFormAddress, setUserFormAddress] = useState('');
  const [userFormFiscalCode, setUserFormFiscalCode] = useState('');
  const [userFormBirthday, setUserFormBirthday] = useState('1995-01-01');
  const [userFormRegistrationDate, setUserFormRegistrationDate] = useState('2026-07-16');
  const [userFormMedicalCert, setUserFormMedicalCert] = useState(true);
  const [userFormMedicalCertExpiry, setUserFormMedicalCertExpiry] = useState('2027-01-16');
  const [userFormMembershipType, setUserFormMembershipType] = useState('Mensile Open');
  const [userFormMembershipStatus, setUserFormMembershipStatus] = useState<'Attivo' | 'Scaduto' | 'Sospeso'>('Attivo');
  const [userFormMembershipExpiry, setUserFormMembershipExpiry] = useState('2026-08-16');
  const [userFormRemainingEntries, setUserFormRemainingEntries] = useState<string>('0');

  // Helper to open Add User form
  const openAddUser = () => {
    setEditingUser(null);
    setUserFormName('');
    setUserFormSurname('');
    setUserFormEmail('');
    setUserFormPhone('');
    setUserFormAddress('');
    setUserFormFiscalCode('');
    setUserFormBirthday('1995-01-01');
    setUserFormRegistrationDate('2026-07-16');
    setUserFormMedicalCert(true);
    setUserFormMedicalCertExpiry('2027-01-16');
    setUserFormMembershipType('Mensile Open');
    setUserFormMembershipStatus('Attivo');
    setUserFormMembershipExpiry('2026-08-16');
    setUserFormRemainingEntries('0');
    setShowAddUserForm(true);
  };

  // Helper to open Edit User form
  const openEditUser = (u: User) => {
    setEditingUser(u);
    setUserFormName(u.name);
    setUserFormSurname(u.surname || '');
    setUserFormEmail(u.email);
    setUserFormPhone(u.phone);
    setUserFormAddress(u.address || '');
    setUserFormFiscalCode(u.fiscalCode || '');
    setUserFormBirthday(u.birthday || '1995-01-01');
    setUserFormRegistrationDate(u.registrationDate || '2026-07-16');
    setUserFormMedicalCert(u.medicalCertificate);
    setUserFormMedicalCertExpiry(u.medicalCertificateExpiry || '2027-01-16');
    setUserFormMembershipType(u.membershipType);
    setUserFormMembershipStatus(u.membershipStatus as any);
    setUserFormMembershipExpiry(u.membershipExpiry || '2026-08-16');
    setUserFormRemainingEntries(String(u.remainingEntries || 0));
    setShowAddUserForm(true);
  };

  // 3. Palinsesto & Lezioni
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  // Course form fields state
  const [courseFormName, setCourseFormName] = useState('');
  const [courseFormTrainer, setCourseFormTrainer] = useState('');
  const [courseFormCategory, setCourseFormCategory] = useState('CrossFit');
  const [courseFormTime, setCourseFormTime] = useState('18:00 - 19:00');
  const [courseFormDate, setCourseFormDate] = useState('2026-07-16');
  const [courseFormMin, setCourseFormMin] = useState('5');
  const [courseFormMax, setCourseFormMax] = useState('15');
  const [courseFormSuspended, setCourseFormSuspended] = useState(false);
  const [courseFormValidityStart, setCourseFormValidityStart] = useState('2026-07-16');
  const [courseFormValidityEnd, setCourseFormValidityEnd] = useState('2026-12-31');

  // Helper to open Add Course form
  const openAddCourse = () => {
    setEditingCourse(null);
    setCourseFormName('');
    setCourseFormTrainer('');
    setCourseFormCategory('CrossFit');
    setCourseFormTime('18:00 - 19:00');
    setCourseFormDate('2026-07-16');
    setCourseFormMin('5');
    setCourseFormMax('15');
    setCourseFormSuspended(false);
    setCourseFormValidityStart('2026-07-16');
    setCourseFormValidityEnd('2026-12-31');
    setShowAddCourseForm(true);
  };

  // Helper to open Edit Course form
  const openEditCourse = (c: Course) => {
    setEditingCourse(c);
    setCourseFormName(c.name);
    setCourseFormTrainer(c.trainer);
    setCourseFormCategory(c.category);
    setCourseFormTime(c.time);
    setCourseFormDate(c.date);
    setCourseFormMin(String(c.capacityMin));
    setCourseFormMax(String(c.capacityMax));
    setCourseFormSuspended(c.suspended || false);
    setCourseFormValidityStart(c.validityStart || '2026-07-16');
    setCourseFormValidityEnd(c.validityEnd || '2026-12-31');
    setShowAddCourseForm(true);
  };

  // 4. Listino Abbonamenti
  const [showAddSubForm, setShowAddSubForm] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  // Subscription form fields state
  const [subFormName, setSubFormName] = useState('');
  const [subFormDescription, setSubFormDescription] = useState('');
  const [subFormPrice, setSubFormPrice] = useState('50');
  const [subFormType, setSubFormType] = useState<'time' | 'entries'>('time');
  const [subFormValidityStart, setSubFormValidityStart] = useState('2026-07-16');
  const [subFormValidityEnd, setSubFormValidityEnd] = useState('2026-12-31');
  const [subFormAllowedCategories, setSubFormAllowedCategories] = useState<string[]>(['CrossFit', 'Calisthenics', 'Yoga']);
  const [subFormCadence, setSubFormCadence] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [subFormAppFee, setSubFormAppFee] = useState('0');
  const [subFormImage, setSubFormImage] = useState('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop');

  // Check-In states
  const [checkInDate, setCheckInDate] = useState('2026-07-16');
  const [selectedUserByCourse, setSelectedUserByCourse] = useState<Record<string, string>>({});

  // Helper to open Add Subscription
  const openAddSub = () => {
    setEditingSub(null);
    setSubFormName('');
    setSubFormDescription('');
    setSubFormPrice('50');
    setSubFormType('time');
    setSubFormValidityStart('2026-07-16');
    setSubFormValidityEnd('2026-12-31');
    setSubFormAllowedCategories(['CrossFit', 'Calisthenics', 'Yoga']);
    setSubFormCadence('monthly');
    setSubFormAppFee('0');
    setSubFormImage('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop');
    setShowAddSubForm(true);
  };

  // Helper to open Edit Subscription
  const openEditSub = (s: Subscription) => {
    setEditingSub(s);
    setSubFormName(s.name);
    setSubFormDescription(s.description);
    setSubFormPrice(String(s.price));
    setSubFormType(s.type);
    setSubFormValidityStart(s.validityStart);
    setSubFormValidityEnd(s.validityEnd);
    setSubFormAllowedCategories(s.allowedDisciplines);
    setSubFormCadence(s.cadence || 'monthly');
    setSubFormAppFee(String(s.appFeePercentage || 0));
    setSubFormImage(s.imageUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop');
    setShowAddSubForm(true);
  };

  // Check-in helper states
  const [selectedCourseForCheckIn, setSelectedCourseForCheckIn] = useState<string>('');
  const [selectedUserForCheckIn, setSelectedUserForCheckIn] = useState<string>('');

  // Calculations for KPIs
  const totalSubscribers = users.length;
  const lifetimeSales = sales.reduce((acc, curr) => curr.status === 'Completato' ? acc + curr.amount : acc, 0);
  
  // Current Year (2026) & Month (07)
  const currentYearSales = sales.reduce((acc, curr) => {
    if (curr.status === 'Completato' && curr.date.startsWith('2026')) {
      return acc + curr.amount;
    }
    return acc;
  }, 0);

  const currentMonthSales = sales.reduce((acc, curr) => {
    if (curr.status === 'Completato' && curr.date.startsWith('2026-07')) {
      return acc + curr.amount;
    }
    return acc;
  }, 0);

  // Annual chart comparison data: group sales by month for 2024, 2025, and 2026
  const monthsItalian = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
  
  const getComparisonData = () => {
    return monthsItalian.map((monthName, idx) => {
      const monthNumStr = String(idx + 1).padStart(2, '0');
      
      const sales2024 = sales.filter(s => s.status === 'Completato' && s.date.startsWith(`2024-${monthNumStr}`)).reduce((a, c) => a + c.amount, 0);
      const sales2025 = sales.filter(s => s.status === 'Completato' && s.date.startsWith(`2025-${monthNumStr}`)).reduce((a, c) => a + c.amount, 0);
      const sales2026 = sales.filter(s => s.status === 'Completato' && s.date.startsWith(`2026-${monthNumStr}`)).reduce((a, c) => a + c.amount, 0);
      
      return {
        name: monthName,
        '2024 (Storico)': sales2024,
        '2025 (Storico)': sales2025,
        '2026 (Corrente)': sales2026
      };
    });
  };

  const chartData = getComparisonData();

  // Handle sales modifications
  const handleSaveSaleChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSale) {
      onUpdateSale(editingSale);
      setEditingSale(null);
    }
  };

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUser = users.find(u => u.id === newSaleUser);
    if (!targetUser) return;

    onAddSale({
      userId: targetUser.id,
      userName: targetUser.name,
      item: newSaleItem,
      amount: parseFloat(newSaleAmount) || 0,
      date: new Date().toISOString().split('T')[0],
      status: 'Completato',
      type: newSaleType
    });

    setShowAddSaleForm(false);
    setNewSaleAmount('45');
  };

  // Handle WOD creation
  const handlePublishWod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wodTitle || !wodContent) return;

    onAddWorkout({
      title: wodTitle,
      content: wodContent,
      date: wodDate,
      publishTime: wodTime,
      published: wodPublishNow
    });

    setWodTitle('');
    setWodContent('');
    alert(`Workout "${wodTitle}" creato con successo!`);
  };

  // Handle broadcast push
  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastBody) return;

    onSendBroadcast(broadcastTitle, broadcastBody);
    setBroadcastTitle('');
    setBroadcastBody('');
    setBroadcastStatus("Notifica inviata con successo in tempo reale a tutti gli atleti!");
    setTimeout(() => setBroadcastStatus(null), 5000);
  };

  // Group classes today (2026-07-16)
  const todayClasses = courses.filter(c => c.date === '2026-07-16');

  // Loyalty Ranking (classifica in base agli ingressi)
  const loyaltyRanking = [...users].sort((a, b) => b.totalCheckIns - a.totalCheckIns);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-slate-200 font-sans pb-12" id="owner-desktop-dashboard">
      {/* Upper Navigation & Tabs */}
      <header className="bg-[#0d0d0d] border-b border-slate-800 sticky top-12 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-black border border-slate-800 rounded-xl text-white">
              <Shield className="w-6 h-6 text-lime-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white font-display">Desk Amministratore</h1>
              <p className="text-xs text-slate-400">Gestione proprietaria, contabilità e palinsesto corsi</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-1.5 bg-[#0a0a0a] border border-slate-800 p-1.5 rounded-xl text-sm" id="desktop-tabs-nav">
            <button
              onClick={() => setActiveTab('panoramica')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${activeTab === 'panoramica' ? 'bg-lime-400 text-black shadow-md' : 'text-slate-400 hover:text-white'}`}
              id="tab-btn-panoramica"
            >
              Panoramica
            </button>
            <button
              onClick={() => setActiveTab('finanze')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${activeTab === 'finanze' ? 'bg-lime-400 text-black shadow-md' : 'text-slate-400 hover:text-white'}`}
              id="tab-btn-finanze"
            >
              Contabilità
            </button>
            <button
              onClick={() => setActiveTab('checkin')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${activeTab === 'checkin' ? 'bg-lime-400 text-black shadow-md' : 'text-slate-400 hover:text-white'}`}
              id="tab-btn-checkin"
            >
              Check-in
            </button>
            <button
              onClick={() => setActiveTab('utenti')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${activeTab === 'utenti' ? 'bg-lime-400 text-black shadow-md' : 'text-slate-400 hover:text-white'}`}
              id="tab-btn-utenti"
            >
              Utenti
            </button>
            <button
              onClick={() => setActiveTab('palinsesto')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${activeTab === 'palinsesto' ? 'bg-lime-400 text-black shadow-md' : 'text-slate-400 hover:text-white'}`}
              id="tab-btn-palinsesto"
            >
              Palinsesto
            </button>
            <button
              onClick={() => setActiveTab('abbonamenti')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${activeTab === 'abbonamenti' ? 'bg-lime-400 text-black shadow-md' : 'text-slate-400 hover:text-white'}`}
              id="tab-btn-abbonamenti"
            >
              Abbonamenti
            </button>
            <button
              onClick={() => setActiveTab('wod')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${activeTab === 'wod' ? 'bg-lime-400 text-black shadow-md' : 'text-slate-400 hover:text-white'}`}
              id="tab-btn-wod"
            >
              WOD
            </button>
            <button
              onClick={() => setActiveTab('fidelizzazione')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${activeTab === 'fidelizzazione' ? 'bg-lime-400 text-black shadow-md' : 'text-slate-400 hover:text-white'}`}
              id="tab-btn-fidelizzazione"
            >
              Fidelizzazione
            </button>
            <button
              onClick={() => setActiveTab('comunicazioni')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${activeTab === 'comunicazioni' ? 'bg-lime-400 text-black shadow-md' : 'text-slate-400 hover:text-white'}`}
              id="tab-btn-comunicazioni"
            >
              Broadcast
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* KPI Row (Always visible) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" id="kpi-cards-grid">
          <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">Iscritti Attivi</span>
              <span className="text-3xl font-extrabold text-white font-display">{totalSubscribers}</span>
              <span className="text-xs text-lime-400 font-medium block mt-1">Sincronizzazione in tempo reale</span>
            </div>
            <div className="p-3 bg-lime-950/30 text-lime-400 border border-lime-900/20 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">Entrate Totali</span>
              <span className="text-3xl font-extrabold text-white font-display">€{lifetimeSales.toLocaleString('it-IT')}</span>
              <span className="text-xs text-slate-500 block mt-1">Storico transazioni registrate</span>
            </div>
            <div className="p-3 bg-blue-950/30 text-blue-400 border border-blue-900/20 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">Vendite Annuali (2026)</span>
              <span className="text-3xl font-extrabold text-white font-display">€{currentYearSales.toLocaleString('it-IT')}</span>
              <span className="text-xs text-lime-400 font-medium block mt-1">+14% rispetto al 2025</span>
            </div>
            <div className="p-3 bg-indigo-950/30 text-indigo-400 border border-indigo-900/20 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">Vendita Mensile (Luglio)</span>
              <span className="text-3xl font-extrabold text-white font-display">€{currentMonthSales.toLocaleString('it-IT')}</span>
              <span className="text-xs text-amber-400 font-medium block mt-1">Obbiettivo mensile: 85%</span>
            </div>
            <div className="p-3 bg-amber-950/30 text-amber-400 border border-amber-900/20 rounded-2xl">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* Dynamic Panel Content */}
        {activeTab === 'panoramica' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="overview-content-layout">
            
            {/* Live Today Schedule Grid */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#0d0d0d] rounded-2xl border border-slate-800 shadow-sm p-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-white font-display">Palinsesto Giornaliero & Iscritti</h2>
                    <p className="text-xs text-slate-400">Lezioni in corso o pianificate per oggi (16 Luglio 2026)</p>
                  </div>
                  <span className="bg-amber-950/30 text-amber-300 border border-amber-900/30 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Oggi
                  </span>
                </div>

                <div className="space-y-4">
                  {todayClasses.map((course) => {
                    const enrolledUsers = users.filter(u => course.bookings.includes(u.id));
                    const ratio = course.bookings.length;
                    const percent = Math.min(100, (ratio / course.capacityMax) * 100);
                    
                    return (
                      <div key={course.id} className="p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all bg-[#0a0a0a]" id={`today-class-${course.id}`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-lime-400 bg-lime-950/30 border border-lime-900/30 px-2.5 py-0.5 rounded-md uppercase font-mono">
                                {course.category}
                              </span>
                              <span className="text-xs text-slate-400 font-medium">Min: {course.capacityMin} · Max: {course.capacityMax} posti</span>
                            </div>
                            <h3 className="text-base font-bold text-white font-display mt-1.5">{course.name}</h3>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                              <span>Trainer: <strong className="text-slate-200">{course.trainer}</strong></span>
                              <span>•</span>
                              <span>Orario: <strong className="text-slate-200">{course.time}</strong></span>
                            </div>
                          </div>

                          <div className="min-w-[140px]">
                            <div className="flex justify-between items-center text-xs mb-1">
                              <span className="font-semibold text-slate-300">Iscritti: {ratio}/{course.capacityMax}</span>
                              <span className="text-slate-400 font-mono">{Math.round(percent)}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${ratio >= course.capacityMax ? 'bg-red-500' : ratio >= course.capacityMin ? 'bg-lime-400' : 'bg-amber-500'}`}
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Annual comparisons chart */}
              <div className="bg-[#0d0d0d] rounded-2xl border border-slate-800 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white font-display">Andamento Vendite Annuale</h2>
                    <p className="text-xs text-slate-400">Confronto fatturato mensile corrente vs. storici anni precedenti</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-lime-400 rounded-sm"></span> 2026</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-sm"></span> 2025</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-slate-700 rounded-sm"></span> 2024</span>
                  </div>
                </div>

                <div className="h-72 w-full mt-6" id="annual-sales-recharts-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `€${v}`} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0d0d0d', borderColor: '#334155', borderRadius: '12px' }} 
                        itemStyle={{ color: '#f1f5f9' }}
                        labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                        formatter={(value) => `€${value}`} 
                      />
                      <Bar dataKey="2024 (Storico)" fill="#334155" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="2025 (Storico)" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="2026 (Corrente)" fill="#a3e635" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Sidebar Alerts panel & Active Events */}
            <div className="space-y-6">
              <div className="bg-[#0d0d0d] rounded-2xl border border-slate-800 shadow-sm p-6">
                <h2 className="text-lg font-bold text-white font-display mb-1">Alerts & Pietre Miliari</h2>
                <p className="text-xs text-slate-400 mb-4">Eventi automatici ed anomalie di allenamento</p>
                
                <div className="space-y-3">
                  {alerts.map(alert => (
                    <div 
                      key={alert.id} 
                      className={`p-3 rounded-xl border flex gap-3 relative text-xs ${
                        alert.type === 'birthday' ? 'bg-amber-950/20 border-amber-900/40 text-amber-300' :
                        alert.type === 'milestone' ? 'bg-lime-950/20 border-lime-900/40 text-lime-300' :
                        alert.type === 'frequency_drop' ? 'bg-rose-950/20 border-rose-900/40 text-rose-300' :
                        alert.type === 'cancellation' ? 'bg-red-950/20 border-red-900/40 text-red-300' :
                        'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                      id={`sidebar-alert-${alert.id}`}
                    >
                      {alert.user && (
                        <img src={alert.user.avatar} alt={alert.user.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          {alert.type === 'birthday' && <span className="bg-amber-950/50 text-amber-300 border border-amber-900/30 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5"><Cake className="w-2.5 h-2.5"/> Compleanno</span>}
                          {alert.type === 'milestone' && <span className="bg-lime-950/50 text-lime-300 border border-lime-900/30 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5"><Award className="w-2.5 h-2.5"/> Milestone</span>}
                          {alert.type === 'frequency_drop' && <span className="bg-rose-950/50 text-rose-300 border border-rose-900/30 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5"><AlertTriangle className="w-2.5 h-2.5"/> Calo Frequenza</span>}
                          {alert.type === 'cancellation' && <span className="bg-red-950/50 text-red-300 border border-red-900/30 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5"><AlertTriangle className="w-2.5 h-2.5"/> Disdetta</span>}
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(alert.timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-300 font-medium leading-relaxed">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automatic import notification indicator from Web site */}
              <div className="bg-gradient-to-br from-indigo-950 via-[#0a0a0a] to-black text-white p-6 rounded-2xl shadow-sm border border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-300">
                    <Send className="w-5 h-5 text-lime-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-display">Sincronizzazione Sito Web</h3>
                    <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                      L'iscrizione degli utenti sul tuo sito web riporta i dati su quest'app istantaneamente.
                    </p>
                    <div className="mt-4 bg-black/40 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono flex items-center justify-between">
                      <span className="text-lime-400">● 1 Nuovo Utente Web Importato</span>
                      <span className="text-slate-300">Massimiliano S.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTABILITÀ TAB */}
        {activeTab === 'finanze' && (() => {
          const filteredSales = sales.filter(s => {
            const matchesUser = salesFilterUser ? s.userName.toLowerCase().includes(salesFilterUser.toLowerCase()) : true;
            const matchesSearch = salesSearch ? (
              s.userName.toLowerCase().includes(salesSearch.toLowerCase()) || 
              s.item.toLowerCase().includes(salesSearch.toLowerCase()) ||
              s.id.toLowerCase().includes(salesSearch.toLowerCase())
            ) : true;
            let matchesDate = true;
            if (salesFilterStartDate) {
              matchesDate = matchesDate && s.date >= salesFilterStartDate;
            }
            if (salesFilterEndDate) {
              matchesDate = matchesDate && s.date <= salesFilterEndDate;
            }
            return matchesUser && matchesSearch && matchesDate;
          });

          return (
            <>
              <div className="bg-[#0d0d0d] rounded-2xl border border-slate-800 shadow-sm p-6" id="finanze-tab-content">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white font-display">Registro Vendite e Contabilità</h2>
                  <p className="text-xs text-slate-400">Filtra le transazioni per atleta o intervallo temporale, ed esporta il report completo per Excel.</p>
                </div>
                
                {/* Advanced Filter controls row */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Cerca per testo..."
                      value={salesSearch}
                      onChange={(e) => setSalesSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs bg-[#0a0a0a] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-lime-400 w-44 font-mono"
                      id="sales-search-input"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Nome Utente..."
                    value={salesFilterUser}
                    onChange={(e) => setSalesFilterUser(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-[#0a0a0a] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-lime-400 w-36 font-mono"
                    id="sales-user-filter"
                  />

                  <div className="flex items-center gap-1.5">
                    <input
                      type="date"
                      value={salesFilterStartDate}
                      onChange={(e) => setSalesFilterStartDate(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-[#0a0a0a] border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-lime-400 w-32 font-mono"
                      title="Data Inizio"
                      id="sales-start-date-filter"
                    />
                    <span className="text-xs text-slate-600">a</span>
                    <input
                      type="date"
                      value={salesFilterEndDate}
                      onChange={(e) => setSalesFilterEndDate(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-[#0a0a0a] border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-lime-400 w-32 font-mono"
                      title="Data Fine"
                      id="sales-end-date-filter"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setSalesFilterUser('');
                      setSalesFilterStartDate('');
                      setSalesFilterEndDate('');
                      setSalesSearch('');
                    }}
                    className="bg-[#0a0a0a] border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
                    title="Azzera Filtri"
                  >
                    Azzera
                  </button>

                  <button
                    onClick={() => exportSalesToExcel(filteredSales)}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    id="export-sales-excel-btn"
                  >
                    <Download className="w-4 h-4 text-lime-400" /> Esporta Excel
                  </button>

                  <button
                    onClick={() => setShowAddSaleForm(!showAddSaleForm)}
                    className="bg-lime-400 hover:bg-lime-500 text-black text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer font-display"
                    id="toggle-add-sale-btn"
                  >
                    <Plus className="w-4 h-4 text-black stroke-[3]" /> Registra Vendita
                  </button>
                </div>
              </div>

              {/* Manual New Sale Form Overlay */}
              {showAddSaleForm && (
                <form onSubmit={handleCreateSale} className="bg-[#0a0a0a] p-4 rounded-xl border border-slate-800 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end" id="add-sale-manual-form">
                  <div>
                    <label className="text-xs text-slate-400 font-bold block mb-1">Seleziona Cliente</label>
                    <select
                      value={newSaleUser}
                      onChange={(e) => setNewSaleUser(e.target.value)}
                      className="w-full bg-[#0d0d0d] border border-slate-800 p-2 rounded-lg text-xs text-slate-200 focus:border-lime-400 focus:outline-none"
                      id="select-sale-user"
                    >
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name} {u.surname}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-bold block mb-1">Tipo Abbonamento / Articolo</label>
                    <input
                      type="text"
                      value={newSaleItem}
                      onChange={(e) => setNewSaleItem(e.target.value)}
                      className="w-full bg-[#0d0d0d] border border-slate-800 p-2 rounded-lg text-xs text-white focus:border-lime-400 focus:outline-none"
                      id="input-sale-item"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 font-bold block mb-1">Importo (€)</label>
                      <input
                        type="number"
                        value={newSaleAmount}
                        onChange={(e) => setNewSaleAmount(e.target.value)}
                        className="w-full bg-[#0d0d0d] border border-slate-800 p-2 rounded-lg text-xs text-white focus:border-lime-400 focus:outline-none font-mono"
                        id="input-sale-amount"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 font-bold block mb-1">Pagamento</label>
                      <select
                        value={newSaleType}
                        onChange={(e) => setNewSaleType(e.target.value as any)}
                        className="w-full bg-[#0d0d0d] border border-slate-800 p-2 rounded-lg text-xs text-slate-200 focus:border-lime-400 focus:outline-none"
                        id="select-sale-type"
                      >
                        <option value="Ricorrente">Ricorrente</option>
                        <option value="Una Tantum">Una Tantum</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-lime-400 text-black p-2 rounded-lg text-xs font-bold hover:bg-lime-500 transition-all cursor-pointer" id="submit-sale-btn">
                      Conferma
                    </button>
                    <button type="button" onClick={() => setShowAddSaleForm(false)} className="bg-slate-800 text-slate-300 px-3 p-2 rounded-lg text-xs font-bold hover:bg-slate-700 transition-all cursor-pointer">
                      Annulla
                    </button>
                  </div>
                </form>
              )}

              {/* Sales Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" id="sales-history-table">
                  <thead>
                    <tr className="border-b border-slate-800 bg-[#0a0a0a]/50">
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">ID Transazione</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Cliente</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Articolo/Abbonamento</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Data</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Tipo</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Importo</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Stato</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide text-right">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-[#0a0a0a]/50 transition-colors">
                        <td className="py-3 px-4 text-xs font-mono text-slate-500">#{sale.id}</td>
                        <td className="py-3 px-4 text-xs font-bold text-white">{sale.userName}</td>
                        <td className="py-3 px-4 text-xs text-slate-300">{sale.item}</td>
                        <td className="py-3 px-4 text-xs text-slate-400 font-mono">{sale.date}</td>
                        <td className="py-3 px-4 text-xs">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${sale.type === 'Ricorrente' ? 'bg-indigo-950/40 text-indigo-300 border border-indigo-900/30' : 'bg-slate-800/40 text-slate-300 border border-slate-700/30'}`}>
                            {sale.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs font-bold text-lime-400 font-mono">€ {sale.amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-xs">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            sale.status === 'Completato' ? 'bg-lime-950/30 text-lime-300 border-lime-900/30' :
                            sale.status === 'In Attesa' ? 'bg-amber-950/30 text-amber-300 border-amber-900/30' : 'bg-rose-950/30 text-rose-300 border-rose-900/30'
                          }`}>
                            {sale.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-right">
                          <button
                            onClick={() => setEditingSale(sale)}
                            className="text-lime-400 hover:text-lime-300 font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                            id={`edit-sale-btn-${sale.id}`}
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Modifica
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredSales.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-xs text-slate-500 font-mono">Nessuna transazione trovata con i filtri applicati.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sales Correction Modal/Form Overlay */}
            {editingSale && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
                <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-slate-800 shadow-2xl max-w-md w-full" id="sales-correction-modal">
                  <h3 className="text-base font-bold text-white font-display mb-1">Modifica / Correggi Vendita</h3>
                  <p className="text-xs text-slate-400 mb-4">Correggi l'importo o lo stato del pagamento per #{editingSale.id}</p>
                  
                  <form onSubmit={handleSaveSaleChange} className="space-y-4">
                     <div>
                      <label className="text-xs text-slate-400 font-bold block mb-1">Cliente</label>
                      <input type="text" className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-slate-500" value={editingSale.userName} disabled />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 font-bold block mb-1">Articolo</label>
                      <input 
                        type="text" 
                        className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:border-lime-400 focus:outline-none" 
                        value={editingSale.item} 
                        onChange={(e) => setEditingSale({ ...editingSale, item: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Importo Corretto (€)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:border-lime-400 focus:outline-none font-mono" 
                          value={editingSale.amount} 
                          onChange={(e) => setEditingSale({ ...editingSale, amount: parseFloat(e.target.value) || 0 })}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Stato Pagamento</label>
                        <select 
                          className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-slate-200 focus:border-lime-400 focus:outline-none"
                          value={editingSale.status}
                          onChange={(e) => setEditingSale({ ...editingSale, status: e.target.value as any })}
                        >
                          <option value="Completato">Completato</option>
                          <option value="In Attesa">In Attesa</option>
                          <option value="Rimborsato">Rimborsato</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-slate-800">
                      <button type="submit" className="flex-1 bg-lime-400 hover:bg-lime-500 text-black text-xs font-bold p-2.5 rounded-xl transition-all cursor-pointer" id="save-sale-correction">
                        Salva Correzione
                      </button>
                      <button type="button" onClick={() => setEditingSale(null)} className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold p-2.5 rounded-xl transition-all cursor-pointer">
                        Annulla
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            </>
          );
        })()}

        {/* WORKOUT BACHECA PUBLISHER */}
        {activeTab === 'wod' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="wod-tab-content">
            {/* Publisher form */}
            <div className="bg-[#0d0d0d] rounded-2xl border border-slate-800 shadow-sm p-6 lg:col-span-1">
              <h2 className="text-lg font-bold text-white font-display mb-1">Scrivi Workout Giornaliero</h2>
              <p className="text-xs text-slate-400 mb-5">Pubblica gli allenamenti sulla bacheca dell'applicazione.</p>
 
              <form onSubmit={handlePublishWod} className="space-y-4" id="wod-publish-form">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Titolo Workout (WOD)</label>
                  <input
                    type="text"
                    placeholder="Es. WOD - Helen Custom Strength"
                    value={wodTitle}
                    onChange={(e) => setWodTitle(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:border-lime-400 focus:outline-none"
                    id="input-wod-title"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Contenuto Allenamento (Riscaldamento, Forza, Metcon...)</label>
                  <textarea
                    rows={8}
                    placeholder="Descrivi l'allenamento completo..."
                    value={wodContent}
                    onChange={(e) => setWodContent(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white font-mono focus:border-lime-400 focus:outline-none"
                    id="textarea-wod-content"
                    required
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 font-bold block mb-1">Data Pubblicazione</label>
                    <input
                      type="date"
                      value={wodDate}
                      onChange={(e) => setWodDate(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-slate-800 p-2 rounded-lg text-xs text-white focus:border-lime-400 focus:outline-none font-mono"
                      id="input-wod-date"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-bold block mb-1">Orario Rilascio</label>
                    <input
                      type="time"
                      value={wodTime}
                      onChange={(e) => setWodTime(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-slate-800 p-2 rounded-lg text-xs text-white focus:border-lime-400 focus:outline-none font-mono"
                      id="input-wod-time"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="wod-publish-now-check"
                    checked={wodPublishNow}
                    onChange={(e) => setWodPublishNow(e.target.checked)}
                    className="rounded border-slate-800 text-lime-400 focus:ring-lime-400 bg-[#0a0a0a]"
                  />
                  <label htmlFor="wod-publish-now-check" className="text-xs text-slate-400 cursor-pointer select-none">Pubblica immediatamente</label>
                </div>
                <button type="submit" className="w-full bg-lime-400 hover:bg-lime-500 text-black text-xs font-bold p-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer" id="publish-wod-btn">
                  <FileText className="w-4 h-4 text-black stroke-[2.5]" /> Pubblica in Bacheca
                </button>
              </form>
            </div>
 
            {/* List of current WODs */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-[#0d0d0d] rounded-2xl border border-slate-800 shadow-sm p-6">
                <h2 className="text-lg font-bold text-white font-display mb-1">Bacheca WOD Attuale</h2>
                <p className="text-xs text-slate-400 mb-5">Workout pubblicati visibili agli atleti sull'app mobile</p>
 
                <div className="space-y-4">
                  {workouts.map(w => (
                    <div key={w.id} className="p-5 rounded-xl border border-slate-800 bg-[#0a0a0a] hover:bg-[#0a0a0a]/80 transition-all" id={`wod-item-${w.id}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${w.published ? 'bg-lime-950/30 text-lime-300 border-lime-900/30' : 'bg-amber-950/30 text-amber-300 border-amber-900/30'}`}>
                              {w.published ? 'Pubblicato' : 'Pianificato'}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">Rilascio: {w.date} alle {w.publishTime}</span>
                          </div>
                          <h3 className="text-base font-bold text-white font-display">{w.title}</h3>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 font-mono mt-3 whitespace-pre-line leading-relaxed bg-[#0d0d0d] p-3.5 rounded-lg border border-slate-800">
                        {w.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
 
        {/* LOYALTY RANKING & MILESTONES */}
        {activeTab === 'fidelizzazione' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="fidelity-tab-content">
            {/* Leaderboard */}
            <div className="bg-[#0d0d0d] rounded-2xl border border-slate-800 shadow-sm p-6 lg:col-span-2">
              <div className="border-b border-slate-800 pb-4 mb-5">
                <h2 className="text-lg font-bold text-white font-display">Classifica di Fidelizzazione Membri</h2>
                <p className="text-xs text-slate-400">Iscritti ordinati per numero di presenze storiche in palestra</p>
              </div>
 
              <div className="space-y-3">
                {loyaltyRanking.map((member, index) => (
                  <div key={member.id} className="flex items-center justify-between p-3.5 bg-[#0a0a0a] border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
                    <div className="flex items-center gap-4">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                        index === 0 ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                        index === 1 ? 'bg-slate-700/50 text-slate-200 border-slate-600/30' :
                        index === 2 ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' : 'text-slate-400 border-slate-800'
                      }`}>
                        {index + 1}
                      </span>
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-white font-display">{member.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                          <span>Livello: <strong className="text-slate-200">{member.level}</strong></span>
                          <span>•</span>
                          <span>Abbonamento: <strong className="text-slate-200">{member.membershipType}</strong></span>
                        </div>
                      </div>
                    </div>
 
                    <div className="text-right">
                      <span className="text-lg font-black text-lime-400 block font-mono">{member.totalCheckIns}</span>
                      <span className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Ingressi</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
 
            {/* Inactivity & Frequency alerts panel */}
            <div className="space-y-6 lg:col-span-1">
              <div className="bg-[#0d0d0d] rounded-2xl border border-slate-800 shadow-sm p-6">
                <h3 className="text-base font-bold text-white font-display mb-1">Rapporto Frequenza Settimanale</h3>
                <p className="text-xs text-slate-400 mb-4">Membri che non si presentano o hanno ridotto gli allenamenti</p>
 
                <div className="space-y-4">
                  {users.map(u => {
                    const isInactive = u.weeklyWorkouts === 0;
                    return (
                      <div key={u.id} className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2.5">
                          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <span className="text-xs font-bold text-white block">{u.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">Ultimo attivo: {u.lastActive}</span>
                          </div>
                        </div>
 
                        <div className="text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${isInactive ? 'bg-rose-950/30 text-rose-300 border-rose-900/30 animate-pulse' : 'bg-lime-950/30 text-lime-300 border-lime-900/30'}`}>
                            {isInactive ? 'Calo Frequenza' : `${u.weeklyWorkouts} / week`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
 
              {/* Milestones explanation card */}
              <div className="bg-[#0a0a0a] text-slate-300 p-5 rounded-2xl border border-slate-800 shadow-sm">
                <div className="flex gap-3">
                  <Award className="w-6 h-6 text-lime-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-white font-display">Traguardi di Allenamento</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      L'app invia automaticamente notifiche al gestore quando un utente raggiunge una pietra miliare (es. 50, 100 ingressi) o compie gli anni, per permetterti di congratularti o regalare gadget.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CHECK-IN TAB (Giorno per Giorno, Gestione Classi) */}
        {activeTab === 'checkin' && (() => {
          const filteredCourses = courses.filter(c => c.date === checkInDate);

          const handleCheckInSubmit = (e: React.FormEvent, courseId: string) => {
            e.preventDefault();
            const userId = selectedUserByCourse[courseId];
            if (!userId) return;

            const athlete = users.find(u => u.id === userId);
            if (!athlete) return;

            const forced = athlete.membershipStatus !== 'Attivo';
            onAddUserToClass(courseId, userId, forced);
            
            // Reset selection for this course
            setSelectedUserByCourse({ ...selectedUserByCourse, [courseId]: '' });
          };

          return (
            <div className="space-y-6" id="checkin-tab-content">
              <div className="bg-[#0d0d0d] rounded-2xl border border-slate-800 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white font-display">Check-in & Palinsesto Giornaliero</h2>
                    <p className="text-xs text-slate-400">Seleziona una data per visualizzare le classi programmate, gestire le iscrizioni o forzare un check-in.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-bold">Data di gestione:</span>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="bg-[#0a0a0a] border border-slate-800 text-white rounded-xl px-4 py-2 text-xs font-mono focus:outline-none focus:border-lime-400"
                    />
                  </div>
                </div>

                {filteredCourses.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl bg-[#0a0a0a]/30">
                    Nessuna classe o lezione programmata per il giorno {checkInDate}.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredCourses.map((c) => {
                      const enrolled = users.filter(u => c.bookings.includes(u.id));
                      const capacityRatio = enrolled.length;
                      const percent = (capacityRatio / c.capacityMax) * 100;

                      return (
                        <div key={c.id} className="bg-[#0a0a0a] rounded-xl border border-slate-800 p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full font-bold">
                                    {c.category}
                                  </span>
                                  {c.suspended && (
                                    <span className="text-[10px] bg-rose-950/40 border border-rose-900/30 text-rose-400 px-2 py-0.5 rounded-full font-bold animate-pulse">
                                      SOSPESA
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-base font-bold text-white font-display">{c.name}</h3>
                                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                                  Coach: <strong className="text-slate-300 font-sans">{c.trainer}</strong> | Ore: <strong className="text-lime-400">{c.time}</strong>
                                </p>
                              </div>

                              <div className="text-right">
                                <span className="text-xs text-slate-400 font-semibold">Posti: {capacityRatio} / {c.capacityMax}</span>
                                <div className="w-24 h-1.5 bg-slate-900 rounded-full mt-1.5 overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${capacityRatio >= c.capacityMax ? 'bg-red-500' : capacityRatio >= c.capacityMin ? 'bg-lime-400' : 'bg-amber-500'}`}
                                    style={{ width: `${percent}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 border-t border-slate-800/60 pt-4">
                              <h4 className="text-xs font-bold text-slate-400 mb-2.5 uppercase tracking-wide">Membri Iscritti ({enrolled.length}):</h4>
                              
                              {enrolled.length === 0 ? (
                                <p className="text-xs text-slate-500 italic font-mono mb-4">Nessun utente iscritto a questa classe.</p>
                              ) : (
                                <div className="space-y-2 mb-4">
                                  {enrolled.map(member => {
                                    const isInactive = member.membershipStatus !== 'Attivo';
                                    return (
                                      <div key={member.id} className="flex items-center justify-between bg-[#0d0d0d] border border-slate-850 px-3 py-2 rounded-lg">
                                        <div className="flex items-center gap-2.5">
                                          <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full object-cover" />
                                          <div>
                                            <span className="text-xs font-bold text-slate-200">{member.name} {member.surname}</span>
                                            {isInactive && (
                                              <span className="text-[9px] bg-amber-950/40 border border-amber-900/30 text-amber-400 px-1.5 py-0.2 rounded ml-2 font-bold uppercase tracking-wide">
                                                Check-in Forzato
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => onRemoveUserFromClass(c.id, member.id)}
                                          className="text-[10px] text-rose-400 hover:text-rose-300 font-bold hover:underline cursor-pointer"
                                        >
                                          Rimuovi
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Add Member Dropdown Form */}
                          <form onSubmit={(e) => handleCheckInSubmit(e, c.id)} className="mt-4 pt-3 border-t border-slate-800/40 flex items-center gap-2">
                            <select
                              value={selectedUserByCourse[c.id] || ''}
                              onChange={(e) => setSelectedUserByCourse({ ...selectedUserByCourse, [c.id]: e.target.value })}
                              className="flex-1 bg-[#0d0d0d] border border-slate-800 text-xs text-slate-300 rounded-lg p-2 focus:outline-none focus:border-lime-400"
                              required
                            >
                              <option value="">-- Seleziona Atleta --</option>
                              {users
                                .filter(u => !c.bookings.includes(u.id))
                                .map(u => (
                                  <option key={u.id} value={u.id}>
                                    {u.name} {u.surname} {u.membershipStatus !== 'Attivo' ? '(Inattivo - Forzato)' : ''}
                                  </option>
                                ))}
                            </select>
                            <button
                              type="submit"
                              className="bg-lime-400 hover:bg-lime-500 text-black text-xs font-bold px-3 py-2 rounded-lg cursor-pointer shrink-0 transition-all"
                            >
                              Inserisci
                            </button>
                          </form>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* UTENTI TAB (Anagrafica completa, filtri, schede personali) */}
        {activeTab === 'utenti' && (
          <div className="space-y-6" id="utenti-tab-content">
            <div className="bg-[#0d0d0d] rounded-2xl border border-slate-800 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white font-display">Anagrafica Atleti Palestra</h2>
                  <p className="text-xs text-slate-400">Clicca su un utente per aprire la sua scheda anagrafica dettagliata, esportare i suoi dati e record personali.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Cerca per nome..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs bg-[#0a0a0a] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-lime-400 w-44 font-mono"
                    />
                  </div>

                  <select
                    value={userFilterStatus}
                    onChange={(e) => setUserFilterStatus(e.target.value as any)}
                    className="px-3 py-1.5 text-xs bg-[#0a0a0a] border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:ring-1 focus:ring-lime-400"
                  >
                    <option value="all">Tutti gli iscritti</option>
                    <option value="active">Solo Attivi</option>
                    <option value="inactive">Solo Scaduti/Sospesi</option>
                  </select>

                  <button
                    onClick={() => exportUsersToExcel(users)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer font-sans"
                    id="export-users-excel-btn"
                  >
                    <Download className="w-4 h-4 text-lime-400" /> Esporta Completa Excel
                  </button>

                  <button
                    onClick={openAddUser}
                    className="bg-lime-400 hover:bg-lime-500 text-black text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer font-display font-bold"
                    id="add-new-user-btn"
                  >
                    <Plus className="w-4 h-4 text-black stroke-[3]" /> Nuovo Atleta
                  </button>
                </div>
              </div>

              {/* Users Grid Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" id="users-full-directory">
                  <thead>
                    <tr className="border-b border-slate-800 bg-[#0a0a0a]/50">
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Atleta</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Email</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Telefono</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Abbonamento</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Scadenza</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Ingressi Totali</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Stato</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide text-right">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {users
                      .filter(u => {
                        const fullName = `${u.name} ${u.surname || ''}`.toLowerCase();
                        const matchesSearch = fullName.includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
                        const matchesStatus = userFilterStatus === 'all' ? true :
                                              userFilterStatus === 'active' ? u.membershipStatus === 'Attivo' : u.membershipStatus !== 'Attivo';
                        return matchesSearch && matchesStatus;
                      })
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-[#0a0a0a]/50 transition-colors">
                          <td className="py-3 px-4 text-xs font-bold text-white flex items-center gap-2.5">
                            <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover border border-slate-800" />
                            <span>{u.name} {u.surname}</span>
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-400 font-mono">{u.email}</td>
                          <td className="py-3 px-4 text-xs text-slate-400 font-mono">{u.phone}</td>
                          <td className="py-3 px-4 text-xs text-slate-300 font-medium">{u.membershipType}</td>
                          <td className="py-3 px-4 text-xs text-slate-400 font-mono">{u.membershipExpiry}</td>
                          <td className="py-3 px-4 text-xs font-bold text-lime-400 font-mono">{u.totalCheckIns}</td>
                          <td className="py-3 px-4 text-xs">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              u.membershipStatus === 'Attivo' ? 'bg-lime-950/30 text-lime-300 border-lime-900/30' :
                              u.membershipStatus === 'Sospeso' ? 'bg-amber-950/30 text-amber-300 border-amber-900/30' : 'bg-rose-950/30 text-rose-300 border-rose-900/30'
                            }`}>
                              {u.membershipStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs text-right space-x-2">
                            <button
                              onClick={() => setSelectedUserForDetail(u)}
                              className="text-lime-400 hover:text-lime-300 font-bold cursor-pointer transition-all"
                            >
                              Scheda
                            </button>
                            <button
                              onClick={() => openEditUser(u)}
                              className="text-slate-400 hover:text-white font-bold cursor-pointer transition-all"
                            >
                              Modifica
                            </button>
                            <button
                              onClick={() => {
                                if(confirm(`Sei sicuro di voler rimuovere definitivamente l'atleta ${u.name}?`)) {
                                  onDeleteUser(u.id);
                                }
                              }}
                              className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer transition-all"
                            >
                              Rimuovi
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Scheda Dettagliata Cliente Overlay */}
            {selectedUserForDetail && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-[#0d0d0d] rounded-2xl border border-slate-800 shadow-2xl p-6 max-w-2xl w-full max-h-[95vh] overflow-y-auto">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-4 mb-5">
                    <div className="flex items-center gap-3">
                      <img src={selectedUserForDetail.avatar} alt={selectedUserForDetail.name} className="w-12 h-12 rounded-full object-cover border-2 border-lime-400" />
                      <div>
                        <h3 className="text-lg font-bold text-white font-display">{selectedUserForDetail.name} {selectedUserForDetail.surname}</h3>
                        <p className="text-xs text-slate-400">Atleta Registrato | Grado Gamification: Livello {selectedUserForDetail.level}</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedUserForDetail(null)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Anagrafica & Abbonamento info */}
                    <div className="space-y-4">
                      <div className="bg-[#0a0a0a] p-4 rounded-xl border border-slate-850">
                        <h4 className="text-xs font-bold text-lime-400 uppercase tracking-wide mb-3">Informazioni Anagrafiche</h4>
                        <div className="space-y-2 text-xs">
                          <p className="text-slate-400">Codice Fiscale: <strong className="text-white font-mono">{selectedUserForDetail.fiscalCode || 'N/D'}</strong></p>
                          <p className="text-slate-400">Email: <strong className="text-white font-mono">{selectedUserForDetail.email}</strong></p>
                          <p className="text-slate-400">Telefono: <strong className="text-white font-mono">{selectedUserForDetail.phone}</strong></p>
                          <p className="text-slate-400">Indirizzo: <strong className="text-white">{selectedUserForDetail.address || 'N/D'}</strong></p>
                          <p className="text-slate-400">Compleanno: <strong className="text-white font-mono">{selectedUserForDetail.birthday || 'N/D'}</strong></p>
                          <p className="text-slate-400">Data Iscrizione: <strong className="text-white font-mono">{selectedUserForDetail.registrationDate || 'N/D'}</strong></p>
                        </div>
                      </div>

                      <div className="bg-[#0a0a0a] p-4 rounded-xl border border-slate-850">
                        <h4 className="text-xs font-bold text-lime-400 uppercase tracking-wide mb-3">Abbonamento & Certificato</h4>
                        <div className="space-y-2 text-xs">
                          <p className="text-slate-400">Tipo: <strong className="text-white">{selectedUserForDetail.membershipType}</strong></p>
                          <p className="text-slate-400">Stato: <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${selectedUserForDetail.membershipStatus === 'Attivo' ? 'bg-lime-950/40 text-lime-400' : 'bg-rose-950/40 text-rose-400'}`}>{selectedUserForDetail.membershipStatus}</span></p>
                          <p className="text-slate-400">Scadenza Abbonamento: <strong className="text-white font-mono">{selectedUserForDetail.membershipExpiry}</strong></p>
                          <p className="text-slate-400">Ingressi Rimanenti: <strong className="text-lime-400 font-mono">{selectedUserForDetail.remainingEntries !== undefined ? selectedUserForDetail.remainingEntries : 'Illimitati'}</strong></p>
                          <p className="text-slate-400">Certificato Medico: <strong className={selectedUserForDetail.medicalCertificate ? 'text-lime-400' : 'text-rose-500'}>{selectedUserForDetail.medicalCertificate ? 'Presente' : 'Assente/In attesa'}</strong></p>
                          <p className="text-slate-400">Scadenza Certificato: <strong className="text-white font-mono">{selectedUserForDetail.medicalCertificateExpiry || 'N/D'}</strong></p>
                        </div>
                      </div>
                    </div>

                    {/* Performance & Export Actions */}
                    <div className="space-y-4">
                      <div className="bg-[#0a0a0a] p-4 rounded-xl border border-slate-850">
                        <h4 className="text-xs font-bold text-lime-400 uppercase tracking-wide mb-3">Statistiche Atletiche & Spese</h4>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="bg-[#0d0d0d] p-3 rounded-lg border border-slate-800">
                            <span className="text-lg font-black text-lime-400 block font-mono">{selectedUserForDetail.totalCheckIns}</span>
                            <span className="text-[10px] text-slate-400 uppercase">Ingressi Storici</span>
                          </div>
                          <div className="bg-[#0d0d0d] p-3 rounded-lg border border-slate-800">
                            <span className="text-lg font-black text-lime-400 block font-mono">€{selectedUserForDetail.totalSpent}</span>
                            <span className="text-[10px] text-slate-400 uppercase">Spesa Totale</span>
                          </div>
                          <div className="bg-[#0d0d0d] p-3 rounded-lg border border-slate-800">
                            <span className="text-lg font-black text-lime-400 block font-mono">€{(selectedUserForDetail.totalSpent / (selectedUserForDetail.totalCheckIns || 1)).toFixed(2)}</span>
                            <span className="text-[10px] text-slate-400 uppercase">Media Ingressi</span>
                          </div>
                          <div className="bg-[#0d0d0d] p-3 rounded-lg border border-slate-800">
                            <span className="text-lg font-black text-lime-400 block font-mono">Lvl {selectedUserForDetail.level}</span>
                            <span className="text-[10px] text-slate-400 uppercase">Esperienza</span>
                          </div>
                        </div>

                        {/* Gamification progress bar */}
                        <div className="mt-4">
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-400 font-medium">Progresso Livello:</span>
                            <span className="text-slate-300 font-mono">{selectedUserForDetail.xp} / {selectedUserForDetail.nextLevelXp} XP</span>
                          </div>
                          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-lime-400" style={{ width: `${(selectedUserForDetail.xp / selectedUserForDetail.nextLevelXp) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>

                      {/* Export Actions Box */}
                      <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wide">Esportazione Statistiche & Report</h4>
                        <p className="text-xs text-slate-400">Scarica i file di performance dell'atleta richiesti dal commercialista o dall'amministratore.</p>
                        
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <button
                            onClick={() => printUserPDF(selectedUserForDetail, sales)}
                            className="bg-lime-400 hover:bg-lime-500 text-black text-xs font-bold py-2 px-3 rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Printer className="w-3.5 h-3.5 text-black" /> Esporta PDF
                          </button>
                          <button
                            onClick={() => exportToExcel(selectedUserForDetail, sales)}
                            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 px-3 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700"
                          >
                            <Download className="w-3.5 h-3.5 text-lime-400" /> Esporta Excel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modulo Aggiunta o Modifica Atleta Form Overlay */}
            {showAddUserForm && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-[#0d0d0d] rounded-2xl border border-slate-800 shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                    <h3 className="text-base font-bold text-white font-display">
                      {editingUser ? 'Modifica Scheda Atleta' : 'Aggiungi Nuovo Atleta'}
                    </h3>
                    <button onClick={() => setShowAddUserForm(false)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const newUser: User = {
                      id: editingUser ? editingUser.id : `usr-${Date.now()}`,
                      name: userFormName,
                      surname: userFormSurname,
                      email: userFormEmail,
                      phone: userFormPhone,
                      address: userFormAddress,
                      fiscalCode: userFormFiscalCode,
                      birthday: userFormBirthday,
                      registrationDate: userFormRegistrationDate,
                      registrationExpiry: editingUser ? editingUser.registrationExpiry : '',
                      medicalCertificate: userFormMedicalCert,
                      medicalCertificateExpiry: userFormMedicalCertExpiry,
                      membershipType: userFormMembershipType,
                      membershipStatus: userFormMembershipStatus,
                      membershipExpiry: userFormMembershipExpiry,
                      remainingEntries: parseInt(userFormRemainingEntries) || 0,
                      avatar: editingUser ? editingUser.avatar : `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop`,
                      totalCheckIns: editingUser ? editingUser.totalCheckIns : 0,
                      totalSpent: editingUser ? editingUser.totalSpent : 0,
                      weeklyWorkouts: editingUser ? editingUser.weeklyWorkouts : 0,
                      skills: editingUser ? editingUser.skills : [
                        { name: "Power", level: 1, exp: 0, maxExp: 100 },
                        { name: "Agility", level: 1, exp: 0, maxExp: 100 },
                        { name: "Stamina", level: 1, exp: 0, maxExp: 100 }
                      ],
                      badges: editingUser ? editingUser.badges : [],
                      checkInHistory: editingUser ? editingUser.checkInHistory : [],
                      registeredOnWeb: editingUser ? editingUser.registeredOnWeb : false,
                      level: editingUser ? editingUser.level : 1,
                      xp: editingUser ? editingUser.xp : 0,
                      nextLevelXp: editingUser ? editingUser.nextLevelXp : 100,
                      checkInDates: editingUser ? editingUser.checkInDates : [],
                      lastActive: editingUser ? editingUser.lastActive : 'Nessuna Presenza'
                    };

                    if(editingUser) {
                      onUpdateUser(newUser);
                    } else {
                      onAddUser(newUser);
                    }
                    setShowAddUserForm(false);
                  }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Nome</label>
                        <input type="text" value={userFormName} onChange={(e) => setUserFormName(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400" required />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Cognome</label>
                        <input type="text" value={userFormSurname} onChange={(e) => setUserFormSurname(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Email</label>
                        <input type="email" value={userFormEmail} onChange={(e) => setUserFormEmail(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400" required />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Telefono</label>
                        <input type="text" value={userFormPhone} onChange={(e) => setUserFormPhone(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Codice Fiscale</label>
                        <input type="text" value={userFormFiscalCode} onChange={(e) => setUserFormFiscalCode(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400 font-mono" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Compleanno</label>
                        <input type="date" value={userFormBirthday} onChange={(e) => setUserFormBirthday(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400 font-mono" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 font-bold block mb-1">Indirizzo di Residenza</label>
                      <input type="text" value={userFormAddress} onChange={(e) => setUserFormAddress(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400" />
                    </div>

                    <div className="border-t border-slate-800 pt-3 mt-3">
                      <h4 className="text-xs font-bold text-lime-400 mb-2 uppercase">Dati Abbonamento & Certificato</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Nome Abbonamento</label>
                        <input type="text" value={userFormMembershipType} onChange={(e) => setUserFormMembershipType(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Scadenza Abbonamento</label>
                        <input type="date" value={userFormMembershipExpiry} onChange={(e) => setUserFormMembershipExpiry(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400 font-mono" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Stato</label>
                        <select value={userFormMembershipStatus} onChange={(e) => setUserFormMembershipStatus(e.target.value as any)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400">
                          <option value="Attivo">Attivo</option>
                          <option value="Sospeso">Sospeso</option>
                          <option value="Scaduto">Scaduto</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Ingressi Rimanenti (se a scalare)</label>
                        <input type="number" value={userFormRemainingEntries} onChange={(e) => setUserFormRemainingEntries(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400 font-mono" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 pt-3">
                        <input type="checkbox" id="user-med-cert-check" checked={userFormMedicalCert} onChange={(e) => setUserFormMedicalCert(e.target.checked)} className="rounded border-slate-800 text-lime-400 bg-[#0a0a0a]" />
                        <label htmlFor="user-med-cert-check" className="text-xs text-slate-400 cursor-pointer select-none">Certificato Medico Presente</label>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Scadenza Certificato</label>
                        <input type="date" value={userFormMedicalCertExpiry} onChange={(e) => setUserFormMedicalCertExpiry(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400 font-mono" />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-800">
                      <button type="submit" className="flex-1 bg-lime-400 hover:bg-lime-500 text-black text-xs font-bold p-2.5 rounded-xl transition-all cursor-pointer">
                        Conferma
                      </button>
                      <button type="button" onClick={() => setShowAddUserForm(false)} className="flex-1 bg-slate-850 text-slate-300 text-xs font-bold p-2.5 rounded-xl hover:bg-slate-800 transition-all cursor-pointer">
                        Annulla
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PALINSESTO TAB (Creazione discipline, lezioni, coach, validità, sospensioni) */}
        {activeTab === 'palinsesto' && (
          <div className="space-y-6" id="palinsesto-tab-content">
            <div className="bg-[#0d0d0d] rounded-2xl border border-slate-800 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white font-display">Pianificazione Corsi e Palinsesto</h2>
                  <p className="text-xs text-slate-400">Pianifica le classi settimanali, imposta capienza min/max, assegna i coach e gestisci i periodi di validità o sospensioni.</p>
                </div>
                <button
                  onClick={openAddCourse}
                  className="bg-lime-400 hover:bg-lime-500 text-black text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-center"
                >
                  <Plus className="w-4 h-4 text-black stroke-[3]" /> Crea Lezione
                </button>
              </div>

              {/* Course Grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((c) => (
                  <div key={c.id} className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full font-mono text-slate-400">
                          {c.category}
                        </span>
                        {c.suspended ? (
                          <span className="text-[10px] bg-rose-950/40 border border-rose-900/30 text-rose-400 px-2 py-0.5 rounded-full font-bold">
                            SOSPESA
                          </span>
                        ) : (
                          <span className="text-[10px] bg-lime-950/40 border border-lime-900/30 text-lime-400 px-2 py-0.5 rounded-full font-bold">
                            ATTIVA
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white font-display">{c.name}</h3>
                      
                      <div className="space-y-1.5 text-xs text-slate-400 mt-3 font-mono">
                        <p>Istruttore/Coach: <strong className="text-slate-200 font-sans">{c.trainer}</strong></p>
                        <p>Orario Classe: <strong className="text-white">{c.time}</strong></p>
                        <p>Capienza: <strong className="text-white">{c.capacityMin} (min) - {c.capacityMax} (max)</strong></p>
                        <p>Data Programmata: <strong className="text-white">{c.date}</strong></p>
                        <p>Validità: <strong className="text-slate-400">dal {c.validityStart || 'N/D'} al {c.validityEnd || 'N/D'}</strong></p>
                      </div>
                    </div>

                    <div className="flex gap-2 border-t border-slate-800/40 pt-4 mt-4">
                      <button
                        onClick={() => openEditCourse(c)}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs py-2 rounded-lg cursor-pointer font-bold transition-all"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => {
                          if(confirm(`Rimuovere la lezione di ${c.name} dal palinsesto?`)) {
                            onDeleteCourse(c.id);
                          }
                        }}
                        className="bg-rose-950/40 border border-rose-900/20 text-rose-400 hover:text-rose-300 px-3 py-2 rounded-lg cursor-pointer text-xs font-bold transition-all"
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aggiunta / Modifica Lezione Overlay Form */}
            {showAddCourseForm && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-[#0d0d0d] rounded-2xl border border-slate-800 shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                    <h3 className="text-base font-bold text-white font-display">
                      {editingCourse ? 'Modifica Classe Palinsesto' : 'Nuova Classe Palinsesto'}
                    </h3>
                    <button onClick={() => setShowAddCourseForm(false)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const newCourse: Course = {
                      id: editingCourse ? editingCourse.id : `crs-${Date.now()}`,
                      name: courseFormName,
                      trainer: courseFormTrainer,
                      category: courseFormCategory,
                      time: courseFormTime,
                      date: courseFormDate,
                      capacityMin: parseInt(courseFormMin) || 5,
                      capacityMax: parseInt(courseFormMax) || 15,
                      bookings: editingCourse ? editingCourse.bookings : [],
                      bookingWindowHours: editingCourse ? editingCourse.bookingWindowHours : 24,
                      cancellationWindowHours: editingCourse ? editingCourse.cancellationWindowHours : 2,
                      suspended: courseFormSuspended,
                      validityStart: courseFormValidityStart,
                      validityEnd: courseFormValidityEnd
                    };

                    if(editingCourse) {
                      onUpdateCourse(newCourse);
                    } else {
                      onAddCourse(newCourse);
                    }
                    setShowAddCourseForm(false);
                  }} className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-400 font-bold block mb-1">Disciplina / Nome Lezione</label>
                      <input type="text" placeholder="Es. CrossFit Advanced, Yoga Vinyasa" value={courseFormName} onChange={(e) => setCourseFormName(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400" required />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Categoria</label>
                        <select value={courseFormCategory} onChange={(e) => setCourseFormCategory(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-lime-400">
                          <option value="CrossFit">CrossFit</option>
                          <option value="Calisthenics">Calisthenics</option>
                          <option value="Yoga">Yoga</option>
                          <option value="Powerlifting">Powerlifting</option>
                          <option value="Pilates">Pilates</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Coach / Istruttore</label>
                        <input type="text" value={courseFormTrainer} onChange={(e) => setCourseFormTrainer(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Data Giorno</label>
                        <input type="date" value={courseFormDate} onChange={(e) => setCourseFormDate(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400 font-mono" required />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Fascia Oraria</label>
                        <input type="text" placeholder="Es. 18:00 - 19:00" value={courseFormTime} onChange={(e) => setCourseFormTime(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Capienza Minima</label>
                        <input type="number" value={courseFormMin} onChange={(e) => setCourseFormMin(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400 font-mono" required />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Capienza Massima</label>
                        <input type="number" value={courseFormMax} onChange={(e) => setCourseFormMax(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400 font-mono" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Inizio Periodo Validità</label>
                        <input type="date" value={courseFormValidityStart} onChange={(e) => setCourseFormValidityStart(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400 font-mono" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Fine Periodo Validità</label>
                        <input type="date" value={courseFormValidityEnd} onChange={(e) => setCourseFormValidityEnd(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400 font-mono" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input type="checkbox" id="course-suspended-check" checked={courseFormSuspended} onChange={(e) => setCourseFormSuspended(e.target.checked)} className="rounded border-slate-800 text-lime-400 bg-[#0a0a0a]" />
                      <label htmlFor="course-suspended-check" className="text-xs text-slate-400 cursor-pointer select-none">Sospendi Classe Temporaneamente</label>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-800">
                      <button type="submit" className="flex-1 bg-lime-400 hover:bg-lime-500 text-black text-xs font-bold p-2.5 rounded-xl transition-all cursor-pointer">
                        Conferma
                      </button>
                      <button type="button" onClick={() => setShowAddCourseForm(false)} className="flex-1 bg-slate-850 text-slate-300 text-xs font-bold p-2.5 rounded-xl hover:bg-slate-800 transition-all cursor-pointer">
                        Annulla
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ABBONAMENTI TAB (Gestione listino pacchetti, immagini, discipline collegate, commissioni) */}
        {activeTab === 'abbonamenti' && (
          <div className="space-y-6" id="abbonamenti-tab-content">
            <div className="bg-[#0d0d0d] rounded-2xl border border-slate-800 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white font-display">Listino & Pacchetti Abbonamenti</h2>
                  <p className="text-xs text-slate-400">Crea nuovi pacchetti commerciali, associa copertine, definisci i canali e le discipline collegate con commissione app.</p>
                </div>
                <button
                  onClick={openAddSub}
                  className="bg-lime-400 hover:bg-lime-500 text-black text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-center font-display"
                >
                  <Plus className="w-4 h-4 text-black stroke-[3]" /> Nuovo Abbonamento
                </button>
              </div>

              {/* Subscriptions Grid List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="bg-[#0a0a0a] border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between" id={`sub-card-${sub.id}`}>
                    <div className="relative h-40 w-full">
                      <img src={sub.imageUrl} alt={sub.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                      <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-xs border border-slate-800 text-lime-400 font-extrabold text-sm px-2.5 py-1 rounded-lg font-mono">
                        €{sub.price}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white font-display">{sub.name}</h3>
                        <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed line-clamp-3">{sub.description}</p>
                        
                        <div className="space-y-1.5 border-t border-slate-850 pt-3 text-[11px] font-mono text-slate-400">
                          <p>Canale: <strong className="text-slate-300 font-sans uppercase">{sub.type === 'tempo' ? `Tempo (${sub.cadence || 'Mensile'})` : 'A Ingressi'}</strong></p>
                          <p>Commissione App: <strong className="text-slate-300">{sub.appFeePercentage || 0}%</strong></p>
                          <p>Visibilità App: <strong className="text-lime-400">dal {sub.validityStart} al {sub.validityEnd}</strong></p>
                          <p>Discipline Collegate:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {sub.allowedDisciplines.map(d => (
                              <span key={d} className="text-[9px] bg-slate-900 border border-slate-850 px-2 py-0.5 rounded font-sans text-slate-300">{d}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 border-t border-slate-850 pt-4 mt-5">
                        <button
                          onClick={() => openEditSub(sub)}
                          className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs py-2 rounded-lg cursor-pointer font-bold transition-all"
                        >
                          Modifica
                        </button>
                        <button
                          onClick={() => {
                            if(confirm(`Sei sicuro di voler rimuovere il pacchetto ${sub.name}?`)) {
                              onDeleteSubscription(sub.id);
                            }
                          }}
                          className="bg-rose-950/40 border border-rose-900/20 text-rose-400 hover:text-rose-300 px-3 py-2 rounded-lg cursor-pointer text-xs font-bold transition-all"
                        >
                          Rimuovi
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aggiunta o Modifica Pacchetto Abbonamento Overlay Form */}
            {showAddSubForm && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-[#0d0d0d] rounded-2xl border border-slate-800 shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                    <h3 className="text-base font-bold text-white font-display">
                      {editingSub ? 'Modifica Pacchetto Abbonamento' : 'Nuovo Pacchetto Abbonamento'}
                    </h3>
                    <button onClick={() => setShowAddSubForm(false)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const newSub: Subscription = {
                      id: editingSub ? editingSub.id : `sub-${Date.now()}`,
                      name: subFormName,
                      description: subFormDescription,
                      price: parseFloat(subFormPrice) || 0,
                      type: subFormType,
                      validityStart: subFormValidityStart,
                      validityEnd: subFormValidityEnd,
                      allowedDisciplines: subFormAllowedCategories,
                      imageUrl: subFormImage,
                      cadence: subFormCadence,
                      appFeePercentage: parseFloat(subFormAppFee) || 0,
                      image: subFormImage,
                      startDate: subFormValidityStart,
                      endDate: subFormValidityEnd,
                      disciplines: subFormAllowedCategories,
                      commissionFeePercentage: parseFloat(subFormAppFee) || 0
                    };

                    if(editingSub) {
                      onUpdateSubscription(newSub);
                    } else {
                      onAddSubscription(newSub);
                    }
                    setShowAddSubForm(false);
                  }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Nome Pacchetto</label>
                        <input type="text" placeholder="Es. Abbonamento Natale, Carnet 10" value={subFormName} onChange={(e) => setSubFormName(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400" required />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Immagine di Copertina (URL)</label>
                        <input type="text" value={subFormImage} onChange={(e) => setSubFormImage(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400" required />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 font-bold block mb-1">Descrizione Abbonamento</label>
                      <textarea rows={3} placeholder="Es. Accesso illimitato a tutte le lezioni di Yoga e CrossFit più zona pesi..." value={subFormDescription} onChange={(e) => setSubFormDescription(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400" required></textarea>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Prezzo Atleta (€)</label>
                        <input type="number" value={subFormPrice} onChange={(e) => setSubFormPrice(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400 font-mono" required />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Commissione App (%)</label>
                        <input type="number" value={subFormAppFee} onChange={(e) => setSubFormAppFee(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400 font-mono" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Canale</label>
                        <select value={subFormType} onChange={(e) => setSubFormType(e.target.value as any)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none">
                          <option value="time">A Tempo (Illimitati)</option>
                          <option value="entries">A Ingressi</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Frequenza Pagamento</label>
                        <select value={subFormCadence} onChange={(e) => setSubFormCadence(e.target.value as any)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none">
                          <option value="weekly">Settimanale</option>
                          <option value="monthly">Mensile</option>
                          <option value="yearly">Annuale</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Discipline Associate (scollega/collega)</label>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {['CrossFit', 'Calisthenics', 'Yoga', 'Powerlifting', 'Pilates'].map(cat => {
                            const isSelected = subFormAllowedCategories.includes(cat);
                            return (
                              <button
                                type="button"
                                key={cat}
                                onClick={() => {
                                  if(isSelected) {
                                    setSubFormAllowedCategories(subFormAllowedCategories.filter(x => x !== cat));
                                  } else {
                                    setSubFormAllowedCategories([...subFormAllowedCategories, cat]);
                                  }
                                }}
                                className={`text-[10px] px-2.5 py-1 rounded-md font-bold transition-all ${isSelected ? 'bg-lime-400 text-black' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
                              >
                                {cat}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Inizio Visibilità App</label>
                        <input type="date" value={subFormValidityStart} onChange={(e) => setSubFormValidityStart(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400 font-mono" required />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-bold block mb-1">Fine Visibilità App</label>
                        <input type="date" value={subFormValidityEnd} onChange={(e) => setSubFormValidityEnd(e.target.value)} className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400 font-mono" required />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-800">
                      <button type="submit" className="flex-1 bg-lime-400 hover:bg-lime-500 text-black text-xs font-bold p-2.5 rounded-xl transition-all cursor-pointer">
                        Conferma
                      </button>
                      <button type="button" onClick={() => setShowAddSubForm(false)} className="flex-1 bg-slate-850 text-slate-300 text-xs font-bold p-2.5 rounded-xl hover:bg-slate-800 transition-all cursor-pointer">
                        Annulla
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BROADCAST PUSH MESSAGING PANEL */}
        {activeTab === 'comunicazioni' && (
          <div className="bg-[#0d0d0d] rounded-2xl border border-slate-800 shadow-sm p-6 max-w-2xl mx-auto" id="comunicazioni-tab-content">
            <h2 className="text-lg font-bold text-white font-display mb-1">Invia Notifica Push Istantanea</h2>
            <p className="text-xs text-slate-400 mb-5">
              Notifica gli iscritti in tempo reale per cambi di orario dell'ultimo minuto, chiusure impreviste o avvisi importanti.
            </p>
 
            {broadcastStatus && (
              <div className="p-3.5 bg-lime-950/30 border border-lime-900/30 text-lime-300 text-xs font-semibold rounded-xl mb-6">
                {broadcastStatus}
              </div>
            )}
 
            <form onSubmit={handleBroadcast} className="space-y-4" id="broadcast-push-form">
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Titolo Notifica</label>
                <input
                  type="text"
                  placeholder="Es. Variazione Palinsesto: Lezione Yoga"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:border-lime-400 focus:outline-none"
                  id="input-broadcast-title"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Messaggio Push</label>
                <textarea
                  rows={4}
                  placeholder="La lezione delle 18:00 di oggi subirà una variazione di trainer..."
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:border-lime-400 focus:outline-none"
                  id="textarea-broadcast-body"
                  required
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-lime-400 hover:bg-lime-500 text-black text-xs font-bold p-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer" id="submit-broadcast-btn">
                <Send className="w-4 h-4 text-black stroke-[3]" /> Invia a Tutti i Dispositivi Mobile
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
