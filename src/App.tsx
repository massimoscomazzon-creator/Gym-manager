import React, { useState, useEffect } from 'react';
import { 
  Shield, User as UserIcon, RefreshCw, Bell, Sparkles, Smartphone, 
  Activity, Flame, Info, CheckCircle2, AlertTriangle, ArrowRight
} from 'lucide-react';
import { User, Course, Workout, Sale, GymAlert, PushNotification, Subscription } from './types';
import { 
  INITIAL_USERS, INITIAL_COURSES, INITIAL_WORKOUTS, INITIAL_SALES, INITIAL_ALERTS, INITIAL_SUBSCRIPTIONS 
} from './mockData';
import AdminDashboard from './components/AdminDashboard';
import ClientSimulator from './components/ClientSimulator';
import NotificationCenter from './components/NotificationCenter';

export default function App() {
  // Primary View Mode Selector
  const [viewMode, setViewMode] = useState<'admin' | 'client'>('admin');
  
  // Real-time synced core states
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('gym_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('gym_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('gym_subscriptions');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('gym_workouts');
    return saved ? JSON.parse(saved) : INITIAL_WORKOUTS;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('gym_sales');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  const [alerts, setAlerts] = useState<GymAlert[]>(() => {
    const saved = localStorage.getItem('gym_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  // Mobile client active notifications
  const [clientNotifications, setClientNotifications] = useState<PushNotification[]>(() => {
    const saved = localStorage.getItem('gym_client_notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'not-init',
        title: 'Benvenuto in Palestra!',
        body: 'La tua sincronizzazione in tempo reale mobile & desktop è attiva.',
        timestamp: new Date().toISOString(),
        type: 'reminder'
      }
    ];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('gym_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('gym_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('gym_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('gym_workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('gym_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('gym_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('gym_client_notifications', JSON.stringify(clientNotifications));
  }, [clientNotifications]);

  // Selected client for mobile simulation (defaulting to Massimiliano Scomazzon / usr-web)
  const [selectedClientId, setSelectedClientId] = useState<string>('usr-web');
  const activeUser = users.find(u => u.id === selectedClientId) || users[0];

  // Trigger automated notification and warnings logic on startup or client switch
  const triggerAutomatedChecks = (currentUsers: User[]) => {
    const newAlerts: GymAlert[] = [];
    const newClientNotifications: PushNotification[] = [];
    const todayStr = '2026-07-16'; // standard simulated date
    const today = new Date(todayStr);

    currentUsers.forEach(u => {
      // 1. Subscription expiry (10 days before)
      if (u.membershipExpiry) {
        const expDate = new Date(u.membershipExpiry);
        const diffTime = expDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 10) {
          const alertMsg = `AVVISO ABBONAMENTO: L'abbonamento di ${u.name} ${u.surname} scade tra esattamente 10 giorni (${u.membershipExpiry}).`;
          newAlerts.push({
            id: `alt-auto-sub-${u.id}`,
            type: 'expiry',
            message: alertMsg,
            timestamp: new Date().toISOString(),
            read: false,
            user: { id: u.id, name: `${u.name} ${u.surname}`, avatar: u.avatar }
          });
          if (u.id === selectedClientId) {
            newClientNotifications.push({
              id: `not-auto-sub-${u.id}`,
              title: 'Abbonamento in Scadenza! ⚠️',
              body: `Il tuo abbonamento "${u.membershipType}" scade tra 10 giorni (${u.membershipExpiry}). Rinnovalo in segreteria!`,
              timestamp: new Date().toISOString(),
              type: 'reminder'
            });
          }
        }
      }

      // 2. Remaining entries (if subscription is based on entries and <= 3 entries)
      if (u.remainingEntries !== undefined && u.remainingEntries <= 3) {
        const alertMsg = `AVVISO INGRESSI: A ${u.name} ${u.surname} rimangono solo ${u.remainingEntries} ingressi.`;
        newAlerts.push({
          id: `alt-auto-entries-${u.id}`,
          type: 'frequency_drop',
          message: alertMsg,
          timestamp: new Date().toISOString(),
          read: false,
          user: { id: u.id, name: `${u.name} ${u.surname}`, avatar: u.avatar }
        });
        if (u.id === selectedClientId) {
          newClientNotifications.push({
            id: `not-auto-entries-${u.id}`,
            title: 'Ingressi Quasi Terminati! 🚨',
            body: `Ti rimangono solo ${u.remainingEntries} ingressi. Ricarica il tuo abbonamento!`,
            timestamp: new Date().toISOString(),
            type: 'reminder'
          });
        }
      }

      // 3. Medical certificate expiry (60 days before)
      if (u.medicalCertificateExpiry) {
        const certDate = new Date(u.medicalCertificateExpiry);
        const diffTime = certDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // Trigger if they are exactly 60 days before
        if (diffDays === 60) {
          const alertMsg = `AVVISO CERTIFICATO MEDICO: Il certificato medico di ${u.name} ${u.surname} scade tra esattamente 60 giorni (${u.medicalCertificateExpiry}).`;
          newAlerts.push({
            id: `alt-auto-cert-${u.id}`,
            type: 'expiry',
            message: alertMsg,
            timestamp: new Date().toISOString(),
            read: false,
            user: { id: u.id, name: `${u.name} ${u.surname}`, avatar: u.avatar }
          });
          if (u.id === selectedClientId) {
            newClientNotifications.push({
              id: `not-auto-cert-${u.id}`,
              title: 'Certificato Medico in Scadenza! 🩺',
              body: `Il tuo certificato medico scade il ${u.medicalCertificateExpiry} (tra esattamente 60 giorni). Presenta il rinnovo!`,
              timestamp: new Date().toISOString(),
              type: 'reminder'
            });
          }
        }
      }

      // 4. Birthday notification (on the day itself)
      if (u.birthday) {
        const bDate = u.birthday.substring(5); // "MM-DD" e.g. "07-16"
        const todayMD = todayStr.substring(5); // "07-16"
        if (bDate === todayMD) {
          const alertMsg = `AUGURI! Oggi alle 10:00 è il compleanno di ${u.name} ${u.surname}! Notifica di auguri inviata.`;
          newAlerts.push({
            id: `alt-auto-bday-${u.id}`,
            type: 'birthday',
            message: alertMsg,
            timestamp: new Date().toISOString(),
            read: false,
            user: { id: u.id, name: `${u.name} ${u.surname}`, avatar: u.avatar }
          });
          if (u.id === selectedClientId) {
            newClientNotifications.push({
              id: `not-auto-bday-${u.id}`,
              title: 'Tanti Auguri di Buon Compleanno! 🎉🎂',
              body: `Tutto lo staff di Gym Manager ti augura un fantastico compleanno! Oggi l'ingresso è speciale!`,
              timestamp: new Date().toISOString(),
              type: 'reminder'
            });
          }
        }
      }
    });

    if (newAlerts.length > 0) {
      setAlerts(prev => {
        const existingIds = new Set(prev.map(a => a.id));
        const toAdd = newAlerts.filter(a => !existingIds.has(a.id));
        if (toAdd.length === 0) return prev;
        return [...toAdd, ...prev];
      });
    }

    if (newClientNotifications.length > 0) {
      setClientNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const toAdd = newClientNotifications.filter(n => !existingIds.has(n.id));
        if (toAdd.length === 0) return prev;
        return [...toAdd, ...prev];
      });
    }
  };

  useEffect(() => {
    if (users.length > 0) {
      triggerAutomatedChecks(users);
    }
  }, [selectedClientId]);

  // Reset helper
  const handleResetToMockData = () => {
    if (confirm("Sei sicuro di voler ripristinare i dati di fabbrica per il test?")) {
      localStorage.clear();
      setUsers(INITIAL_USERS);
      setCourses(INITIAL_COURSES);
      setSubscriptions(INITIAL_SUBSCRIPTIONS);
      setWorkouts(INITIAL_WORKOUTS);
      setSales(INITIAL_SALES);
      setAlerts(INITIAL_ALERTS);
      setClientNotifications([
        {
          id: 'not-init',
          title: 'Dati Ripristinati!',
          body: 'Il database simulato è stato reimpostato con successo.',
          timestamp: new Date().toISOString(),
          type: 'reminder'
        }
      ]);
      alert("Database ripristinato con successo!");
    }
  };

  // --- MEMBER INTERACTIONS (Real-time sync actions) ---
  
  const handleBookCourse = (courseId: string) => {
    // 1. Register booking
    setCourses(prevCourses => prevCourses.map(c => {
      if (c.id === courseId && !c.bookings.includes(activeUser.id)) {
        return { ...c, bookings: [...c.bookings, activeUser.id] };
      }
      return c;
    }));

    // 2. Increment check-ins and check for Milestones
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.id === activeUser.id) {
        const newCheckIns = u.totalCheckIns + 1;
        const newCheckInDates = [new Date().toISOString().split('T')[0], ...u.checkInDates];
        
        // Trigger landmark milestone alerts if training milestones are reached
        if (newCheckIns === 50 || newCheckIns === 100) {
          const milestoneAlert: GymAlert = {
            id: `alt-ms-${Date.now()}`,
            type: 'milestone',
            message: `Pietra Miliare Raggiunta! ${u.name} ha appena effettuato ${newCheckIns} ingressi in totale. Festeggia con lui!`,
            timestamp: new Date().toISOString(),
            read: false,
            user: { id: u.id, name: u.name, avatar: u.avatar }
          };
          setAlerts(prev => [milestoneAlert, ...prev]);
        }

        if (newCheckIns === 500 || newCheckIns === 1000 || newCheckIns === 2000) {
          const emailAlert: GymAlert = {
            id: `alt-loyalty-email-${Date.now()}`,
            type: 'milestone',
            message: `NOTIFICA EMAIL INVIATA a massimoscomazzon@gmail.com: L'utente ${u.name} ${u.surname} ha raggiunto quota ${newCheckIns} ingressi!`,
            timestamp: new Date().toISOString(),
            read: false,
            user: { id: u.id, name: `${u.name} ${u.surname}`, avatar: u.avatar }
          };
          setAlerts(prev => [emailAlert, ...prev]);
        }

        return {
          ...u,
          totalCheckIns: newCheckIns,
          checkInDates: newCheckInDates,
          lastActive: new Date().toISOString().split('T')[0],
          weeklyWorkouts: Math.min(5, u.weeklyWorkouts + 1)
        };
      }
      return u;
    }));

    // Toast/Alert simulation for the client app itself
    const userCourseName = courses.find(c => c.id === courseId)?.name || "Corso";
    const newNotif: PushNotification = {
      id: `not-${Date.now()}`,
      title: 'Prenotazione Confermata! 🏋️‍♂️',
      body: `Ti sei iscritto con successo a "${userCourseName}". Ti aspettiamo!`,
      timestamp: new Date().toISOString(),
      type: 'reminder'
    };
    setClientNotifications(prev => [newNotif, ...prev]);
  };

  const handleCancelCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    // 1. Remove user booking
    setCourses(prevCourses => prevCourses.map(c => {
      if (c.id === courseId) {
        return { ...c, bookings: c.bookings.filter(id => id !== activeUser.id) };
      }
      return c;
    }));

    // 2. Decrement check-ins
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.id === activeUser.id) {
        return {
          ...u,
          totalCheckIns: Math.max(0, u.totalCheckIns - 1),
          checkInDates: u.checkInDates.slice(1),
          weeklyWorkouts: Math.max(0, u.weeklyWorkouts - 1)
        };
      }
      return u;
    }));

    // 3. Trigger immediate real-time Admin notification for cancellation
    const cancelAlert: GymAlert = {
      id: `alt-cancel-${Date.now()}`,
      type: 'cancellation',
      message: `Disdetta in tempo reale: ${activeUser.name} si è cancellato dal corso "${course.name}" di oggi.`,
      timestamp: new Date().toISOString(),
      read: false,
      user: { id: activeUser.id, name: activeUser.name, avatar: activeUser.avatar }
    };
    setAlerts(prev => [cancelAlert, ...prev]);

    // Client notification feedback
    const newNotif: PushNotification = {
      id: `not-${Date.now()}`,
      title: 'Prenotazione Annullata ❌',
      body: `Hai cancellato la tua iscrizione da "${course.name}". Il posto è tornato disponibile.`,
      timestamp: new Date().toISOString(),
      type: 'reminder'
    };
    setClientNotifications(prev => [newNotif, ...prev]);
  };

  // Gamification XP gain & Level progression
  const handleXpGain = (amount: number) => {
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.id === activeUser.id) {
        let newXp = u.xp + amount;
        let newLevel = u.level;
        let leveledUp = false;

        if (newXp >= u.nextLevelXp) {
          newXp = newXp - u.nextLevelXp;
          newLevel += 1;
          leveledUp = true;
        }

        if (leveledUp) {
          // Push client native toast
          const levelNotif: PushNotification = {
            id: `not-lvl-${Date.now()}`,
            title: `🎉 LIVELLO SBLOCCATO: LVL ${newLevel}!`,
            body: `Sei salito di livello grazie alle tue attività costanti! Continua così.`,
            timestamp: new Date().toISOString(),
            type: 'level_up'
          };
          setClientNotifications(prev => [levelNotif, ...prev]);

          // Trigger milestone alert for administrative congratulations
          const alertAdmin: GymAlert = {
            id: `alt-lvl-${Date.now()}`,
            type: 'milestone',
            message: `Traguardo Gamification: ${u.name} è salito al livello ${newLevel}! Frequenza eccellente.`,
            timestamp: new Date().toISOString(),
            read: false,
            user: { id: u.id, name: u.name, avatar: u.avatar }
          };
          setAlerts(prev => [alertAdmin, ...prev]);
        }

        return { ...u, xp: newXp, level: newLevel };
      }
      return u;
    }));
  };

  const handleUpdatePR = (skillName: string, levelValue: number) => {
    // Already updated inside ClientSimulator, sync notification
    const newNotif: PushNotification = {
      id: `not-pr-${Date.now()}`,
      title: `⚡ Skill ${skillName} Incrementata!`,
      body: `Ottimo lavoro! La tua abilità di ${skillName} ha raggiunto il livello ${levelValue}.`,
      timestamp: new Date().toISOString(),
      type: 'level_up'
    };
    setClientNotifications(prev => [newNotif, ...prev]);
  };

  // --- ADMINISTRATIVE INTERACTIONS (Proprietario Desk actions) ---
  
  const handleAddWorkout = (newWod: Omit<Workout, 'id'>) => {
    const createdWod: Workout = {
      ...newWod,
      id: `wod-${Date.now()}`
    };
    setWorkouts(prev => [createdWod, ...prev]);

    // Push client notification that a new workout is ready in bacheca
    if (newWod.published) {
      const clientNotif: PushNotification = {
        id: `not-wod-${Date.now()}`,
        title: '🏋️‍♂️ Nuovo Workout Pubblicato!',
        body: `Il WOD "${newWod.title}" è disponibile in bacheca. Controlla il piano del giorno!`,
        timestamp: new Date().toISOString(),
        type: 'reminder'
      };
      setClientNotifications(prev => [clientNotif, ...prev]);
    }
  };

  const handleUpdateSale = (updatedSale: Sale) => {
    setSales(prev => prev.map(s => s.id === updatedSale.id ? updatedSale : s));

    // Re-sync user's total spent based on the modified sales history
    setUsers(prevUsers => prevUsers.map(u => {
      const userSales = sales.map(s => s.id === updatedSale.id ? updatedSale : s)
                            .filter(s => s.userId === u.id && s.status === 'Completato');
      const spentTotal = userSales.reduce((acc, curr) => acc + curr.amount, 0);
      return { ...u, totalSpent: spentTotal };
    }));
  };

  const handleAddSale = (newSale: Omit<Sale, 'id'>) => {
    const createdSale: Sale = {
      ...newSale,
      id: `sal-${Date.now()}`
    };
    setSales(prev => [createdSale, ...prev]);

    // Instantly add spent credits to the user's statistics
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.id === newSale.userId) {
        return {
          ...u,
          totalSpent: u.totalSpent + newSale.amount
        };
      }
      return u;
    }));
  };

  const handleSendBroadcast = (title: string, body: string) => {
    const broadcastNotif: PushNotification = {
      id: `not-bc-${Date.now()}`,
      title: `📣 AVVISO PALESTRA: ${title}`,
      body: body,
      timestamp: new Date().toISOString(),
      type: 'gym_broadcast'
    };
    setClientNotifications(prev => [broadcastNotif, ...prev]);

    // Also register in system alerts
    const broadcastAlert: GymAlert = {
      id: `alt-bc-${Date.now()}`,
      type: 'class_change',
      message: `Notifica push inviata agli iscritti: "${title}"`,
      timestamp: new Date().toISOString(),
      read: true
    };
    setAlerts(prev => [broadcastAlert, ...prev]);
  };

  // Dismiss alerts
  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const handleClearAllAlerts = () => {
    setAlerts([]);
  };

  const handleClearNotifications = () => {
    setClientNotifications([]);
  };

  // --- SUB AND COURSE ACTIONS ---
  const handleAddSubscription = (newSub: Omit<Subscription, 'id'>) => {
    const created: Subscription = {
      ...newSub,
      id: `sub-${Date.now()}`
    };
    setSubscriptions(prev => [...prev, created]);
  };

  const handleUpdateSubscription = (updatedSub: Subscription) => {
    setSubscriptions(prev => prev.map(s => s.id === updatedSub.id ? updatedSub : s));
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  };

  const handleAddCourse = (newCourse: Omit<Course, 'id' | 'bookings'>) => {
    const created: Course = {
      ...newCourse,
      id: `crs-${Date.now()}`,
      bookings: []
    };
    setCourses(prev => [...prev, created]);
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const handleAddUserToClass = (courseId: string, userId: string, forced: boolean) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId && !c.bookings.includes(userId)) {
        return { ...c, bookings: [...c.bookings, userId] };
      }
      return c;
    }));

    const course = courses.find(c => c.id === courseId);
    const user = users.find(u => u.id === userId);
    if (!course || !user) return;

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newCheckIns = u.totalCheckIns + 1;
        const newCheckInDates = [course.date, ...u.checkInDates];
        const newHistory = [
          {
            date: course.date,
            time: course.time.split(' ')[0],
            courseName: course.name,
            forced: forced
          },
          ...(u.checkInHistory || [])
        ];

        // Trigger loyalty email notification when 500, 1000, 2000 check-ins is reached
        if (newCheckIns === 500 || newCheckIns === 1000 || newCheckIns === 2000) {
          const emailAlert: GymAlert = {
            id: `alt-loyalty-email-${Date.now()}`,
            type: 'milestone',
            message: `NOTIFICA EMAIL INVIATA a massimoscomazzon@gmail.com: L'utente ${u.name} ${u.surname} ha raggiunto quota ${newCheckIns} ingressi!`,
            timestamp: new Date().toISOString(),
            read: false,
            user: { id: u.id, name: `${u.name} ${u.surname}`, avatar: u.avatar }
          };
          setAlerts(prevAlerts => [emailAlert, ...prevAlerts]);
        }

        return {
          ...u,
          totalCheckIns: newCheckIns,
          checkInDates: newCheckInDates,
          checkInHistory: newHistory,
          lastActive: course.date
        };
      }
      return u;
    }));
  };

  const handleRemoveUserFromClass = (courseId: string, userId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, bookings: c.bookings.filter(id => id !== userId) };
      }
      return c;
    }));

    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newHistory = (u.checkInHistory || []).filter(h => !(h.date === course.date && h.courseName === course.name));
        return {
          ...u,
          totalCheckIns: Math.max(0, u.totalCheckIns - 1),
          checkInHistory: newHistory
        };
      }
      return u;
    }));
  };

  const handleAddUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-slate-200 font-sans antialiased" id="gym-suite-main-wrapper">
      {/* Simulation Workspace Switcher Bar */}
      <div className="bg-[#0d0d0d] border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
            </span>
            <div className="text-sm font-bold tracking-tight flex items-center gap-1.5 text-white font-display">
              <Activity className="w-4 h-4 text-lime-400" />
              <span>Sincronizzazione Live Attiva</span>
            </div>
            <span className="text-slate-500 text-xs hidden md:inline">| Iscrizioni, Disdette e WOD si propagano all'istante</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Ruolo Test:</span>
            
            <div className="inline-flex bg-[#0a0a0a] border border-slate-800 p-1 rounded-xl shadow-inner">
              <button
                onClick={() => setViewMode('admin')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'admin' ? 'bg-lime-400 text-black shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                id="role-switch-admin"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Proprietario (Desktop)</span>
              </button>
              <button
                onClick={() => setViewMode('client')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'client' ? 'bg-lime-400 text-black shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                id="role-switch-client"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Atleta (Mobile)</span>
              </button>
            </div>

            <button 
              onClick={handleResetToMockData}
              title="Ripristina Database di Fabbrica"
              className="p-1.5 bg-[#0d0d0d] border border-slate-800 rounded-xl hover:bg-slate-800 hover:text-white transition-all text-slate-400"
              id="reset-mock-data-btn"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Primary Panels Switcher Grid / Window */}
      {viewMode === 'admin' ? (
        <div className="animate-fadeIn" id="admin-view-panel">
          {/* Top Real-time synchronization guide banner */}
          <div className="bg-[#0d0d0d]/90 border-b border-slate-800 py-3 px-6 text-xs text-center text-slate-300 flex items-center justify-center gap-2 flex-wrap">
            <span className="font-semibold text-lime-400">Suggerimento interattivo:</span>
            <span>Passa alla visualizzazione "Atleta (Mobile)" in alto per prenotare/disdire corsi. Vedrai comparire notifiche in tempo reale qui sul pannello!</span>
            <button onClick={() => setViewMode('client')} className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1 text-[10px] ml-2">
              Prova Atleta <ArrowRight className="w-3 h-3 text-lime-400" />
            </button>
          </div>

          <AdminDashboard 
            users={users}
            courses={courses}
            workouts={workouts}
            sales={sales}
            alerts={alerts}
            subscriptions={subscriptions}
            onAddWorkout={handleAddWorkout}
            onUpdateSale={handleUpdateSale}
            onAddSale={handleAddSale}
            onSendBroadcast={handleSendBroadcast}
            onForceRefreshAlerts={() => {}}
            onAddSubscription={handleAddSubscription}
            onUpdateSubscription={handleUpdateSubscription}
            onDeleteSubscription={handleDeleteSubscription}
            onAddCourse={handleAddCourse}
            onUpdateCourse={handleUpdateCourse}
            onDeleteCourse={handleDeleteCourse}
            onAddUserToClass={handleAddUserToClass}
            onRemoveUserFromClass={handleRemoveUserFromClass}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        </div>
      ) : (
        <div className="py-10 bg-[#0a0a0a] animate-fadeIn" id="client-view-panel">
          {/* Simulation Header */}
          <div className="max-w-md mx-auto px-6 mb-4 bg-[#0d0d0d] border border-slate-800 rounded-2xl p-4 text-xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lime-400 flex items-center gap-1 font-display">
                <Info className="w-4 h-4" /> Simulazione Profilo
              </span>
              <span className="text-slate-400">Cambia l'utente per simulare diversi atleti:</span>
            </div>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-slate-800 p-2 rounded-xl text-xs text-white focus:outline-none focus:border-lime-400"
              id="select-active-simulated-member"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} (Lvl {u.level}) {u.id === 'usr-web' ? '- Iscritto da SITO WEB' : ''} {u.id === 'usr-3' ? '- In Scadenza / Calo Frequenza' : ''}
                </option>
              ))}
            </select>
          </div>

          <ClientSimulator 
            currentUser={activeUser}
            courses={courses}
            workouts={workouts}
            sales={sales}
            notifications={clientNotifications}
            onBookCourse={handleBookCourse}
            onCancelCourse={handleCancelCourse}
            onUpdatePR={handleUpdatePR}
            onXpGain={handleXpGain}
            onClearNotifications={handleClearNotifications}
          />
        </div>
      )}
    </div>
  );
}
