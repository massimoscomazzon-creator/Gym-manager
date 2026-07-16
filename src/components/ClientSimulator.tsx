import React, { useState } from 'react';
import { 
  Dumbbell, Calendar, Flame, Award, Clock, ArrowUpRight, CheckCircle2, AlertCircle, 
  Smartphone, FileSpreadsheet, Download, RefreshCw, User as UserIcon, LogIn, Sparkles, ChevronRight, Check
} from 'lucide-react';
import { User, Course, Workout, Sale, PushNotification } from '../types';
import { exportToExcel, printUserPDF } from '../utils/export';

interface ClientSimulatorProps {
  currentUser: User;
  courses: Course[];
  workouts: Workout[];
  sales: Sale[];
  notifications: PushNotification[];
  onBookCourse: (courseId: string) => void;
  onCancelCourse: (courseId: string) => void;
  onUpdatePR: (skillName: string, levelValue: number) => void;
  onXpGain: (amount: number) => void;
  onClearNotifications: () => void;
}

export default function ClientSimulator({
  currentUser,
  courses,
  workouts,
  sales,
  notifications,
  onBookCourse,
  onCancelCourse,
  onUpdatePR,
  onXpGain,
  onClearNotifications
}: ClientSimulatorProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'prenota' | 'wod' | 'profilo' | 'esporta'>('home');
  const [categoryFilter, setCategoryFilter] = useState<string>('Tutti');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter courses
  const filteredCourses = categoryFilter === 'Tutti' 
    ? courses 
    : courses.filter(c => c.category === categoryFilter);

  // Time utilities to check booking deadline (e.g. 2 hours before)
  const isActionAllowedWithTimeLimit = (course: Course, hoursLimit: number): boolean => {
    // For simulation, we assume today's current time is 11:30 AM
    // Let's check the course starting hour
    const [startHourStr] = course.time.split(' - ')[0].split(':');
    const startHour = parseInt(startHourStr);
    
    // Simulate current time is 11:30 on 2026-07-16
    const simulatedCurrentHour = 11.5; // 11:30 AM
    const isToday = course.date === '2026-07-16';
    
    if (isToday) {
      const hoursUntilCourse = startHour - simulatedCurrentHour;
      if (hoursUntilCourse < hoursLimit) {
        return false;
      }
    }
    return true;
  };

  const handleBook = (course: Course) => {
    setErrorMessage(null);
    
    // 1. Check if course is already full
    if (course.bookings.length >= course.capacityMax) {
      setErrorMessage("Spiacenti, il corso ha raggiunto la capienza massima consentita.");
      return;
    }
    
    // 2. Check temporal limits (2 hours)
    if (!isActionAllowedWithTimeLimit(course, course.bookingWindowHours)) {
      setErrorMessage(`Iscrizione non consentita! Limite temporale superato (minimo ${course.bookingWindowHours} ore prima del corso).`);
      return;
    }

    onBookCourse(course.id);
    onXpGain(100); // Level gamification reward!
  };

  const handleCancel = (course: Course) => {
    setErrorMessage(null);

    // Check cancellation temporal limits (e.g. 2 hours)
    if (!isActionAllowedWithTimeLimit(course, course.cancellationWindowHours)) {
      setErrorMessage(`Disdetta non consentita! Mancano meno di ${course.cancellationWindowHours} ore all'inizio della sessione.`);
      return;
    }

    onCancelCourse(course.id);
  };

  // Skill progression increment simulation
  const handleTrainSkill = (skillIndex: number) => {
    const updatedSkills = [...currentUser.skills];
    const skill = updatedSkills[skillIndex];
    
    let newExp = skill.exp + 25;
    let newLevel = skill.level;
    
    if (newExp >= skill.maxExp) {
      newExp = newExp - skill.maxExp;
      newLevel += 1;
      onXpGain(250); // Massive overall XP reward!
    }
    
    skill.exp = newExp;
    skill.level = newLevel;
    onUpdatePR(skill.name, newLevel);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-[#0a0a0a] font-sans" id="client-mobile-simulator">
      <div className="text-center mb-6">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5 font-display">
          <Smartphone className="w-4 h-4 text-lime-400" /> Simulatore App Mobile
        </h2>
        <p className="text-xs text-slate-500 mt-1">Stato atleti - Test in corso come <strong className="text-slate-300">{currentUser.name}</strong></p>
      </div>

      {/* iPhone Simulator Shell Frame */}
      <div className="w-[375px] h-[780px] bg-[#0d0d0d] rounded-[48px] p-3.5 shadow-[0_0_50px_rgba(163,230,53,0.05)] border-4 border-slate-800 relative flex flex-col overflow-hidden">
        
        {/* Notch / Speaker */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#0d0d0d] w-36 h-6 rounded-b-2xl z-40 flex items-center justify-center gap-1 border-b border-x border-slate-800">
          <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800"></div>
        </div>

        {/* Dynamic Status Bar */}
        <div className="flex justify-between items-center px-6 pt-3 pb-1 text-white text-[11px] font-bold tracking-wide select-none z-30">
          <span className="font-mono">11:30</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] bg-lime-950/40 text-lime-400 border border-lime-500/30 px-1.5 py-0.5 rounded font-mono font-bold">LIVE SYNC</span>
            <div className="w-4.5 h-2.5 border border-white/60 rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-white rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Live Notification Popup Drawer */}
        {notifications.length > 0 && (
          <div className="absolute top-12 left-3 right-3 z-50">
            {notifications.slice(0, 1).map(notif => (
              <div key={notif.id} className="bg-[#0d0d0d]/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-800 flex items-start gap-2.5 animate-bounce">
                <div className="p-1.5 bg-lime-950/30 text-lime-400 border border-lime-900/30 rounded-lg">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-white font-display">{notif.title}</h4>
                  <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">{notif.body}</p>
                </div>
                <button onClick={onClearNotifications} className="text-slate-500 hover:text-slate-300 text-xs font-bold px-1 cursor-pointer">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Inner Phone Screen Canvas */}
        <div className="flex-1 bg-[#0a0a0a] rounded-[36px] flex flex-col overflow-hidden text-slate-200 relative border border-slate-800/40">
          
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20 scrollbar-none" id="mobile-inner-screen">
            
            {/* Error Message banner */}
            {errorMessage && (
              <div className="bg-red-950/80 border border-red-900 text-red-200 p-3 rounded-2xl text-[11px] font-semibold mb-4 flex items-center gap-2 animate-pulse">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
                <button onClick={() => setErrorMessage(null)} className="ml-auto font-black cursor-pointer">✕</button>
              </div>
            )}

            {/* TAB: HOME */}
            {activeTab === 'home' && (
              <div className="space-y-5 animate-fadeIn" id="mobile-tab-home">
                {/* Profile Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={currentUser.avatar} alt="User avatar" className="w-11 h-11 rounded-full object-cover border-2 border-lime-400 shadow-sm" />
                    <div>
                      <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider font-mono">Bentornato atleta,</span>
                      <h3 className="text-sm font-bold text-white font-display">{currentUser.name}</h3>
                    </div>
                  </div>
                  <div className="p-2 bg-[#0d0d0d] rounded-xl border border-slate-800 text-lime-400 flex items-center gap-1 text-xs font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Lvl <strong>{currentUser.level}</strong></span>
                  </div>
                </div>

                {/* Gamification Levels Bar */}
                <div className="bg-[#0d0d0d] border border-slate-800 rounded-2xl p-3.5">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400 font-semibold text-[11px]">Grado Exp Generale</span>
                    <span className="text-lime-400 font-bold font-mono">{currentUser.xp} / {currentUser.nextLevelXp} XP</span>
                  </div>
                  <div className="w-full h-2 bg-[#0a0a0a] rounded-full overflow-hidden border border-slate-800/40">
                    <div 
                      className="h-full bg-gradient-to-r from-lime-400 to-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${(currentUser.xp / currentUser.nextLevelXp) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-2 block leading-relaxed">
                    Completa prenotazioni (+100 XP) o aumenta le tue abilità (+250 XP) per sbloccare badge e salire di livello!
                  </span>
                </div>

                {/* Unlocked Badges */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5 font-mono">Badge Sbloccati</h4>
                  <div className="flex gap-2">
                    {currentUser.badges.map(badge => (
                      <div key={badge.id} className="bg-[#0d0d0d] border border-slate-800 p-2.5 rounded-xl flex items-center gap-2 flex-1">
                        <div className="p-1.5 bg-lime-950/30 text-lime-400 border border-lime-900/30 rounded-lg shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-[10px] font-bold text-white leading-tight font-display">{badge.name}</h5>
                          <p className="text-[8px] text-slate-400 leading-none mt-0.5">{badge.description}</p>
                        </div>
                      </div>
                    ))}
                    {currentUser.badges.length === 0 && (
                      <span className="text-xs text-slate-500 italic">Nessun badge sbloccato. Allenati per ottenerli!</span>
                    )}
                  </div>
                </div>

                {/* Skills Interactive Rings */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 font-mono">Abilità & Livello Skill</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {currentUser.skills.map((skill, index) => {
                      return (
                        <div key={skill.name} className="bg-[#0d0d0d] border border-slate-800 p-3 rounded-2xl flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-300">{skill.name}</span>
                            <span className="text-xs font-bold text-lime-400 font-mono">Lvl {skill.level}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-1">
                            <button 
                              onClick={() => handleTrainSkill(index)}
                              className="bg-lime-400 hover:bg-lime-500 text-black text-[10px] font-extrabold px-2 py-1.5 rounded-lg w-full transition-all cursor-pointer"
                            >
                              + Allena (+25 EXP)
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Upcoming Active Booked Lessons */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 font-mono">Le Mie Prenotazioni Attive</h4>
                  <div className="space-y-2">
                    {courses.filter(c => c.bookings.includes(currentUser.id)).map(course => (
                      <div key={course.id} className="bg-gradient-to-r from-[#0d0d0d] to-lime-950/10 p-3.5 rounded-2xl border border-lime-500/10">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-bold bg-lime-950/40 text-lime-300 border border-lime-900/30 px-1.5 py-0.5 rounded uppercase">
                              {course.category}
                            </span>
                            <h5 className="text-xs font-bold text-white mt-1.5 font-display">{course.name}</h5>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                              <span>Orario: <strong className="text-slate-300 font-mono">{course.time}</strong></span>
                              <span>•</span>
                              <span>Data: <strong className="text-slate-300 font-mono">{course.date}</strong></span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleCancel(course)}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold px-2 py-1 rounded-lg border border-rose-500/20 transition-all cursor-pointer"
                          >
                            Disdici
                          </button>
                        </div>
                      </div>
                    ))}
                    {courses.filter(c => c.bookings.includes(currentUser.id)).length === 0 && (
                      <div className="text-center py-6 bg-[#0d0d0d]/40 rounded-2xl border border-dashed border-slate-800 text-xs text-slate-500">
                        Nessun corso prenotato per i prossimi giorni.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BOOKING TIMETABLE */}
            {activeTab === 'prenota' && (
              <div className="space-y-4 animate-fadeIn" id="mobile-tab-prenota">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">Palinsesto Corsi</h4>
                  <span className="text-[9px] text-lime-400 font-bold bg-lime-950/30 px-1.5 py-0.5 rounded border border-lime-500/30 font-mono">
                    Limite disdetta: 2h
                  </span>
                </div>

                {/* Filter Categories */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {['Tutti', 'Crossfit', 'Yoga', 'Calisthenics', 'Pilates', 'Spinning'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap transition-all border cursor-pointer ${categoryFilter === cat ? 'bg-lime-400 text-black border-lime-400 shadow' : 'bg-[#0d0d0d] text-slate-400 border-slate-800 hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Class list */}
                <div className="space-y-3">
                  {filteredCourses.map(course => {
                    const isEnrolled = course.bookings.includes(currentUser.id);
                    const isFull = course.bookings.length >= course.capacityMax;
                    const seatsLeft = course.capacityMax - course.bookings.length;

                    return (
                      <div key={course.id} className="bg-[#0d0d0d] border border-slate-800 p-3.5 rounded-2xl hover:bg-[#0d0d0d]/80 transition-all">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-black bg-lime-950/40 text-lime-300 px-1.5 py-0.5 rounded border border-lime-900/30 uppercase">
                                {course.category}
                              </span>
                              <span className="text-[9px] text-slate-400 font-medium">Posti liberi: {seatsLeft}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white mt-1.5 font-display">{course.name}</h4>
                            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                              <span>Trainer: {course.trainer}</span>
                              <span>•</span>
                              <span>Giorno: {course.date === '2026-07-16' ? 'Oggi' : 'Domani'}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-300">
                              <Clock className="w-3 h-3 text-lime-400" />
                              <span className="font-mono">{course.time}</span>
                            </div>
                          </div>

                          <div>
                            {isEnrolled ? (
                              <button 
                                onClick={() => handleCancel(course)}
                                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold px-3 py-1.5 border border-rose-500/20 rounded-xl transition-all cursor-pointer"
                              >
                                Disdici
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleBook(course)}
                                disabled={isFull}
                                className={`text-[10px] font-extrabold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${isFull ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-lime-400 hover:bg-lime-500 text-black'}`}
                              >
                                {isFull ? 'Pieno' : 'Prenota'}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Capacity meter */}
                        <div className="mt-3">
                          <div className="w-full h-1.5 bg-[#0a0a0a] rounded-full overflow-hidden border border-slate-800/40">
                            <div 
                              className="h-full bg-lime-400 rounded-full"
                              style={{ width: `${(course.bookings.length / course.capacityMax) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: WORKOUT BACHECA */}
            {activeTab === 'wod' && (
              <div className="space-y-4 animate-fadeIn" id="mobile-tab-wod">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-1 font-mono">Bacheca Allenamenti (WOD)</h4>
                
                {workouts.filter(w => w.published).map(w => (
                  <div key={w.id} className="bg-[#0d0d0d] border border-slate-800 p-4 rounded-2xl">
                    <span className="text-[9px] text-lime-400 font-bold uppercase tracking-wider block mb-1 font-mono">Allenamento del {w.date}</span>
                    <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 mb-3 font-display">{w.title}</h3>
                    <p className="text-[11px] text-slate-300 font-mono whitespace-pre-line leading-relaxed bg-[#0a0a0a] p-3 rounded-xl border border-slate-800/50">
                      {w.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: PROFILO & RECIPES */}
            {activeTab === 'profilo' && (
              <div className="space-y-5 animate-fadeIn" id="mobile-tab-profilo">
                <div className="text-center py-2">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-lime-400 mb-2 shadow-md" />
                  <h3 className="text-sm font-bold text-white font-display">{currentUser.name}</h3>
                  <span className="text-[10px] text-slate-500 font-mono">{currentUser.email}</span>
                </div>

                {/* Subscriptions Card */}
                <div className="bg-[#0d0d0d] border border-slate-800 p-4 rounded-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300">Abbonamento Palestra</span>
                    <span className="bg-lime-950/40 text-lime-300 border border-lime-900/30 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono">{currentUser.membershipStatus}</span>
                  </div>
                  <p className="text-xs text-white font-semibold font-display">{currentUser.membershipType}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Scadenza il {currentUser.membershipExpiry}</p>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0d0d0d] border border-slate-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Spesa Totale</span>
                    <span className="text-base font-black text-lime-400 mt-1 block font-mono">€ {currentUser.totalSpent}</span>
                  </div>
                  <div className="bg-[#0d0d0d] border border-slate-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-mono">Ingressi Totali</span>
                    <span className="text-base font-black text-lime-400 mt-1 block font-mono">{currentUser.totalCheckIns}</span>
                  </div>
                </div>

                {/* Personal Records tracker */}
                <div className="bg-[#0d0d0d] border border-slate-800 p-4 rounded-2xl">
                  <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 font-display">I Miei Personal Records (PR)</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                      <span className="text-slate-400">Back Squat</span>
                      <strong className="text-lime-400 font-mono">140 kg</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                      <span className="text-slate-400">Deadlift</span>
                      <strong className="text-lime-400 font-mono">180 kg</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                      <span className="text-slate-400">Clean & Jerk</span>
                      <strong className="text-lime-400 font-mono">95 kg</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                      <span className="text-slate-400">Snatch</span>
                      <strong className="text-lime-400 font-mono">75 kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tempo Murph</span>
                      <strong className="text-lime-400 font-mono">41m 20s</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: EXPORT DATA */}
            {activeTab === 'esporta' && (
              <div className="space-y-4 animate-fadeIn" id="mobile-tab-esporta">
                <div className="bg-gradient-to-br from-[#0d0d0d] to-lime-950/10 p-5 rounded-2xl border border-lime-500/10 text-center">
                  <FileSpreadsheet className="w-10 h-10 text-lime-400 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-white mb-1 font-display">Esporta Statistiche & Dati</h3>
                  <p className="text-[11px] text-slate-300 mb-4 leading-relaxed">
                    Estrai i tuoi dati atletici relativi agli ingressi effettuati, alla spesa totale e ai tuoi record personali in formato digitale.
                  </p>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => exportToExcel(currentUser, sales)}
                      className="w-full bg-lime-400 hover:bg-lime-500 text-black text-xs font-extrabold p-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                      id="export-excel-client-btn"
                    >
                      <Download className="w-4 h-4 text-black stroke-[2.5]" /> Esporta in Excel (CSV)
                    </button>
                    <button
                      onClick={() => printUserPDF(currentUser, sales)}
                      className="w-full bg-[#0a0a0a] hover:bg-[#0a0a0a]/80 text-white border border-slate-800 text-xs font-bold p-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                      id="export-pdf-client-btn"
                    >
                      <Download className="w-4 h-4 text-rose-500" /> Esporta Dossier PDF
                    </button>
                  </div>
                </div>

                <div className="bg-[#0d0d0d] border border-slate-800 p-4 rounded-2xl">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block font-mono">Dati Pronti per l'esportazione:</h4>
                  <ul className="space-y-2 text-[11px] text-slate-300 list-disc pl-4 font-mono">
                    <li>Registro di <strong className="text-white">{currentUser.totalCheckIns}</strong> accessi</li>
                    <li>Rendimento e livello <strong className="text-white">{currentUser.level}</strong> di Gamification</li>
                    <li>Ricevute pagamenti per <strong className="text-white">€ {currentUser.totalSpent}</strong></li>
                    <li>Profilo dei record personali (Squat, Deadlift, Snatch, ecc.)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Custom Navigation Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-900 px-4 py-2 flex justify-between items-center z-30">
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 flex-1 py-1 cursor-pointer ${activeTab === 'home' ? 'text-lime-400 font-extrabold' : 'text-slate-500'}`}
              id="mobile-nav-home"
            >
              <Flame className="w-4 h-4" />
              <span className="text-[8px] font-bold">Home</span>
            </button>
            <button 
              onClick={() => setActiveTab('prenota')}
              className={`flex flex-col items-center gap-1 flex-1 py-1 cursor-pointer ${activeTab === 'prenota' ? 'text-lime-400 font-extrabold' : 'text-slate-500'}`}
              id="mobile-nav-prenota"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-[8px] font-bold">Prenota</span>
            </button>
            <button 
              onClick={() => setActiveTab('wod')}
              className={`flex flex-col items-center gap-1 flex-1 py-1 cursor-pointer ${activeTab === 'wod' ? 'text-lime-400 font-extrabold' : 'text-slate-500'}`}
              id="mobile-nav-wod"
            >
              <Dumbbell className="w-4 h-4" />
              <span className="text-[8px] font-bold">WOD</span>
            </button>
            <button 
              onClick={() => setActiveTab('profilo')}
              className={`flex flex-col items-center gap-1 flex-1 py-1 cursor-pointer ${activeTab === 'profilo' ? 'text-lime-400 font-extrabold' : 'text-slate-500'}`}
              id="mobile-nav-profilo"
            >
              <UserIcon className="w-4 h-4" />
              <span className="text-[8px] font-bold">Profilo</span>
            </button>
            <button 
              onClick={() => setActiveTab('esporta')}
              className={`flex flex-col items-center gap-1 flex-1 py-1 cursor-pointer ${activeTab === 'esporta' ? 'text-lime-400 font-extrabold' : 'text-slate-500'}`}
              id="mobile-nav-esporta"
            >
              <Download className="w-4 h-4" />
              <span className="text-[8px] font-bold">Esporta</span>
            </button>
          </div>

        </div>

        {/* iPhone bottom bar home indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-40"></div>
      </div>
    </div>
  );
}
