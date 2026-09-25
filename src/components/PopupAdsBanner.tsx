import React, { useEffect, useState } from 'react';
import { useSite } from '../cms/SiteContext';
import { Sparkles, X, ArrowRight, BellRing } from 'lucide-react';

interface PopupAdsBannerProps {
  onNavigate?: (path: string) => void;
}

export const PopupAdsBanner: React.FC<PopupAdsBannerProps> = ({ onNavigate }) => {
  const { popupSettings, dismissPopup } = useSite();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!popupSettings.enabled || popupSettings.isDismissed) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, popupSettings.delaySeconds * 1000);

    return () => clearTimeout(timer);
  }, [popupSettings.enabled, popupSettings.isDismissed, popupSettings.delaySeconds]);

  if (!visible || !popupSettings.enabled || popupSettings.isDismissed) {
    return null;
  }

  // The preview notification popup is strictly positioned at the TOP of the screen as requested
  return (
    <div
      role="alert"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-2xl transition-all duration-300 transform animate-in fade-in slide-in-from-top-6 shadow-2xl"
    >
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-stone-900/95 p-4 shadow-2xl backdrop-blur-xl text-white">
        {/* Ambient Top Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-20 bg-indigo-500/30 blur-2xl pointer-events-none" />

        <div className="flex items-start gap-3.5 relative z-10">
          <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400 shrink-0 mt-0.5">
            <BellRing className="w-5 h-5 animate-bounce" />
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {popupSettings.showBadge && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  {popupSettings.badgeText || 'TOP PREVIEW NOTIFICATION'}
                </span>
              )}
              <span className="text-xs text-indigo-300/80 font-mono">Live Announcement</span>
            </div>

            <h4 className="text-sm font-bold text-white tracking-tight">
              {popupSettings.title}
            </h4>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed line-clamp-2">
              {popupSettings.message}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => {
                  dismissPopup();
                  if (onNavigate) {
                    onNavigate(popupSettings.ctaLink || '/pricing');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                <span>{popupSettings.ctaText || 'Learn More'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={dismissPopup}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={dismissPopup}
            aria-label="Close notification"
            className="absolute top-2 right-2 p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
