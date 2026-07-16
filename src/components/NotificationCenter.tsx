import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Info, AlertTriangle, Award, Cake, Trash2 } from 'lucide-react';
import { GymAlert } from '../types';

interface NotificationCenterProps {
  alerts: GymAlert[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

export default function NotificationCenter({ alerts, onDismiss, onClearAll }: NotificationCenterProps) {
  const unreadAlerts = alerts.filter(a => !a.read);

  const getIcon = (type: string) => {
    switch (type) {
      case 'birthday':
        return <Cake className="w-5 h-5 text-amber-400" />;
      case 'milestone':
        return <Award className="w-5 h-5 text-lime-400" />;
      case 'frequency_drop':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'expiry':
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'cancellation':
        return <Trash2 className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-sky-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'birthday':
        return 'bg-amber-950/20 border-amber-900/40 text-amber-300';
      case 'milestone':
        return 'bg-lime-950/20 border-lime-900/40 text-lime-300';
      case 'frequency_drop':
        return 'bg-rose-950/20 border-rose-900/40 text-rose-300';
      case 'expiry':
        return 'bg-orange-950/20 border-orange-900/40 text-orange-300';
      case 'cancellation':
        return 'bg-red-950/20 border-red-900/40 text-red-300';
      default:
        return 'bg-sky-950/20 border-sky-900/40 text-sky-300';
    }
  };

  return (
    <div className="bg-[#0d0d0d] rounded-xl shadow-lg border border-slate-800 p-4 max-h-[450px] overflow-y-auto" id="notif-center-panel">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-5 h-5 text-slate-300" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-lime-400 text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {unreadAlerts.length}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-white text-sm font-display">Notifiche Gestione Palestra</h3>
        </div>
        {alerts.length > 0 && (
          <button 
            onClick={onClearAll}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors cursor-pointer"
            id="clear-all-alerts-btn"
          >
            Cancella tutte
          </button>
        )}
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              Nessun avviso o evento recente da monitorare.
            </div>
          ) : (
            alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-3 rounded-lg border flex items-start gap-3 relative transition-all ${getBgColor(alert.type)}`}
                id={`alert-item-${alert.id}`}
              >
                <div className="mt-0.5 shrink-0">
                  {getIcon(alert.type)}
                </div>
                <div className="flex-1 pr-6">
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">{alert.message}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                    {new Date(alert.timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <button
                  onClick={() => onDismiss(alert.id)}
                  className="absolute top-2 right-2 text-slate-500 hover:text-slate-300 rounded-full p-0.5 hover:bg-slate-800 transition-all cursor-pointer"
                  id={`dismiss-alert-${alert.id}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
