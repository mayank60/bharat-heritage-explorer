import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:right-6 sm:bottom-6 z-50 flex flex-col gap-2 max-w-[calc(100vw-1.5rem)] sm:max-w-sm mx-auto sm:mx-0 w-full pointer-events-none items-center sm:items-end">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3 sm:p-3.5 rounded-xl shadow-2xl border text-xs sm:text-sm backdrop-blur-md transition-all transform translate-y-0 opacity-100 w-full max-w-full ${
            toast.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-600/70 text-emerald-100'
              : toast.type === 'error'
              ? 'bg-rose-950/95 border-rose-600/70 text-rose-100'
              : 'bg-stone-900/95 border-amber-500/40 text-stone-100 shadow-amber-500/5'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0 pr-1">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-amber-400 shrink-0" />}
            <span className="font-medium text-xs leading-snug break-words">{toast.text}</span>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="btn-glass-clay btn-glass-clay-icon w-6 h-6 rounded-full text-white/70 hover:text-white cursor-pointer shrink-0 ml-2"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
