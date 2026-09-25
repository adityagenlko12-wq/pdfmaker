import React from 'react';
import { useSite } from '../cms/SiteContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastHost: React.FC = () => {
  const { toasts, removeToast } = useSite();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const iconMap = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-indigo-400 shrink-0" />
        };

        const borderMap = {
          success: 'border-emerald-500/30 bg-stone-900/95',
          error: 'border-rose-500/30 bg-stone-900/95',
          warning: 'border-amber-500/30 bg-stone-900/95',
          info: 'border-indigo-500/30 bg-stone-900/95'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border ${borderMap[toast.type]} shadow-xl backdrop-blur-md text-white transition-all transform animate-in slide-in-from-bottom-2`}
          >
            {iconMap[toast.type]}
            <div className="flex-1 min-w-0">
              {toast.title && <h5 className="text-xs font-bold text-white mb-0.5">{toast.title}</h5>}
              <p className="text-xs text-stone-300 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-white p-1 rounded transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
