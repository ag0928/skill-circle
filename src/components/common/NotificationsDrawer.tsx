import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, CheckCircle2, AlertTriangle, Info, Check } from 'lucide-react';

export const NotificationsDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationsRead } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-400" />
            <h2 className="font-semibold text-white">Notifications</h2>
            <span className="text-xs bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded-full font-medium">
              {notifications.filter(n => !n.read).length} new
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={markNotificationsRead}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded bg-slate-800"
            >
              <Check className="w-3 h-3" /> Mark all read
            </button>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No notifications yet.
            </div>
          ) : (
            notifications.map(item => (
              <div 
                key={item.id}
                className={`p-3.5 rounded-xl border text-sm transition-all ${
                  item.read ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-800/80 border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {item.type === 'alert' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    {item.type === 'info' && <Info className="w-4 h-4 text-brand-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white text-xs">{item.title}</span>
                      <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-slate-800 bg-slate-950/50 text-center">
          <p className="text-[11px] text-slate-500">
            Escrow events, assessment results, and session updates are synced here.
          </p>
        </div>
      </div>
    </div>
  );
};
