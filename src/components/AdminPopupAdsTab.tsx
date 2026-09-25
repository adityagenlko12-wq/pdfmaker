import React, { useState } from 'react';
import { useSite } from '../cms/SiteContext';
import { BellRing, Sparkles, Check, ArrowUp, ArrowDown, Eye, Save } from 'lucide-react';

export const AdminPopupAdsTab: React.FC = () => {
  const { popupSettings, updatePopupSettings, triggerPreviewPopup } = useSite();

  const [formData, setFormData] = useState({
    enabled: popupSettings.enabled,
    position: popupSettings.position, // Defaults to 'top'
    title: popupSettings.title,
    message: popupSettings.message,
    ctaText: popupSettings.ctaText,
    ctaLink: popupSettings.ctaLink,
    delaySeconds: popupSettings.delaySeconds,
    showBadge: popupSettings.showBadge,
    badgeText: popupSettings.badgeText,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePopupSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-stone-900 to-purple-950/60 border border-indigo-500/20 text-white">
        <div>
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base">Top Notification Popup &amp; Ad Manager</h3>
          </div>
          <p className="text-xs text-stone-300 mt-1 max-w-xl">
            Configure system-wide notifications and announcement banners. As specified, the preview notification popup is configured to display at the top of the screen.
          </p>
        </div>

        <button
          type="button"
          onClick={triggerPreviewPopup}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg transition cursor-pointer shrink-0"
        >
          <Eye className="w-4 h-4" />
          <span>Trigger Live Preview at Top</span>
        </button>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-5">
        {/* Toggle & Position */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-stone-900 dark:text-white block">
                Announcement Status
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                Display notification banner to website visitors
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={e => setFormData({ ...formData, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-stone-900 dark:text-white block">
                Screen Position
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                Placement of the notification popup
              </span>
            </div>
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, position: 'top' })}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  formData.position === 'top'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                }`}
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Top of Screen</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, position: 'bottom' })}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  formData.position === 'bottom'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                }`}
              >
                <ArrowDown className="w-3.5 h-3.5" />
                <span>Bottom</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Inputs */}
        <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Notification Content &amp; Copy
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Announcement Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Special Pro Launch Announcement"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Badge Text
              </label>
              <input
                type="text"
                value={formData.badgeText}
                onChange={e => setFormData({ ...formData, badgeText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. TOP PREVIEW NOTIFICATION"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Announcement Message
            </label>
            <textarea
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter message for the popup notification..."
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Call-to-Action Text
              </label>
              <input
                type="text"
                value={formData.ctaText}
                onChange={e => setFormData({ ...formData, ctaText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Upgrade to Pro"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Target URL / Route
              </label>
              <input
                type="text"
                value={formData.ctaLink}
                onChange={e => setFormData({ ...formData, ctaLink: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="/pricing"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Trigger Delay (Seconds)
              </label>
              <input
                type="number"
                min={0}
                max={60}
                value={formData.delaySeconds}
                onChange={e => setFormData({ ...formData, delaySeconds: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Note: Changes reflect immediately in live user sessions.
          </p>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition cursor-pointer"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Configuration Saved!' : 'Save Notification Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
