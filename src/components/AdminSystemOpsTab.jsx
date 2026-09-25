import React, { useState, useEffect } from 'react';
import {
  Shield, AlertTriangle, HardDrive, Download, Upload, Trash2, RefreshCw,
  Clock, Server, CheckCircle2, XCircle, Bell, Database, Activity, Lock
} from 'lucide-react';

export function AdminSystemOpsTab({ getHeaders, showNotification }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [purging, setPurging] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const [ops, setOps] = useState({
    maintenanceMode: false,
    maintenanceNotice: 'System is currently undergoing scheduled infrastructure upgrades. Document processing may be briefly queued.',
    maintenanceEstimatedReturn: '15 minutes',
    allowAdminBypass: true,
    fileRetentionMinutes: 120,
    maxUploadSizeMB: 100,
    enforceCaptcha: false,
    rateLimitPerMinute: 60,
    announcement: {
      enabled: true,
      text: '🚀 New Release: High-fidelity Neural OCR with multi-language detection is now live!',
      colorTheme: 'blue',
      dismissible: true,
      link: '/pricing'
    }
  });

  useEffect(() => {
    fetchOps();
  }, []);

  const fetchOps = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/system/ops', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setOps(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Failed to load system ops:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOps = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/system/ops', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(ops)
      });
      if (res.ok) {
        showNotification('System operations & maintenance configuration updated successfully!');
      } else {
        const err = await res.json();
        showNotification(`Failed: ${err.error || 'Could not update system ops'}`);
      }
    } catch (err) {
      showNotification(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePurgeTempFiles = async () => {
    if (!window.confirm('Are you sure you want to purge expired temporary binary files from storage?')) return;
    setPurging(true);
    try {
      const res = await fetch('/api/admin/system/purge-temp', {
        method: 'POST',
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        showNotification(`Storage Cleanup Complete: Purged ${data.purgedCount || 0} temporary artifacts.`);
      }
    } catch (err) {
      showNotification(`Purge error: ${err.message}`);
    } finally {
      setPurging(false);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      const res = await fetch('/api/admin/system/backup', { headers: getHeaders() });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vansh_system_snapshot_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        showNotification('Full system database backup exported successfully!');
      }
    } catch (err) {
      showNotification(`Backup error: ${err.message}`);
    }
  };

  const handleRestoreFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (!window.confirm(`Restore configuration from "${file.name}"? This will overwrite existing plans, gateways, and settings.`)) {
          return;
        }
        setRestoring(true);
        const res = await fetch('/api/admin/system/restore', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(json)
        });
        if (res.ok) {
          showNotification('System state restored successfully from backup!');
          fetchOps();
        } else {
          const err = await res.json();
          showNotification(`Restore failed: ${err.error}`);
        }
      } catch (err) {
        showNotification(`Invalid JSON backup file: ${err.message}`);
      } finally {
        setRestoring(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Maintenance Mode Alert Box */}
      {ops.maintenanceMode && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="text-sm font-bold text-amber-900">
                Maintenance Mode is ACTIVE
              </div>
              <p className="text-xs text-amber-700">
                Regular visitors see the scheduled maintenance page. Admin bypass is {ops.allowAdminBypass ? 'ENABLED' : 'DISABLED'}.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setOps({ ...ops, maintenanceMode: false });
              handleSaveOps();
            }}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            Turn Off Now
          </button>
        </div>
      )}

      {/* Grid: Maintenance Mode & File Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Module 1: Maintenance Mode Controls */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Platform Maintenance Mode</span>
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              ops.maintenanceMode ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {ops.maintenanceMode ? 'Maintenance ON' : 'System Live'}
            </span>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100">
            <div>
              <div className="text-xs font-bold text-gray-900">Enable Maintenance Mode</div>
              <p className="text-[11px] text-gray-500">Route unauthenticated visitors to maintenance splash</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={ops.maintenanceMode}
                onChange={(e) => setOps({ ...ops, maintenanceMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Public Maintenance Notice Headline
            </label>
            <textarea
              rows={2}
              value={ops.maintenanceNotice}
              onChange={(e) => setOps({ ...ops, maintenanceNotice: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Estimated Downtime
              </label>
              <input
                type="text"
                value={ops.maintenanceEstimatedReturn}
                onChange={(e) => setOps({ ...ops, maintenanceEstimatedReturn: e.target.value })}
                placeholder="e.g. 15 minutes"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={ops.allowAdminBypass}
                  onChange={(e) => setOps({ ...ops, allowAdminBypass: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-xs font-medium text-gray-700">Allow Admins to Bypass</span>
              </label>
            </div>
          </div>
        </div>

        {/* Module 2: Storage Retention & Max File Ceiling */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-indigo-600" />
              <span>Storage Policy & File Retention</span>
            </h3>
            <button
              onClick={handlePurgeTempFiles}
              disabled={purging}
              className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              {purging ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              <span>Clean Vault Cache</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Temporary File Auto-Purge Window
            </label>
            <select
              value={ops.fileRetentionMinutes}
              onChange={(e) => setOps({ ...ops, fileRetentionMinutes: parseInt(e.target.value, 10) })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-medium"
            >
              <option value={30}>30 Minutes (Ultra Strict Privacy)</option>
              <option value={60}>1 Hour (Standard GDPR)</option>
              <option value={120}>2 Hours (Recommended Default)</option>
              <option value={360}>6 Hours</option>
              <option value={1440}>24 Hours</option>
              <option value={10080}>7 Days (Enterprise Retention)</option>
            </select>
            <p className="text-[11px] text-gray-400 mt-1">Processed PDF and OCR result files are automatically shredded after this duration.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Maximum Upload File Size Ceiling (MB)
            </label>
            <input
              type="number"
              value={ops.maxUploadSizeMB}
              onChange={(e) => setOps({ ...ops, maxUploadSizeMB: parseInt(e.target.value, 10) })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Rate Limit per IP / Min
              </label>
              <input
                type="number"
                value={ops.rateLimitPerMinute}
                onChange={(e) => setOps({ ...ops, rateLimitPerMinute: parseInt(e.target.value, 10) })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={ops.enforceCaptcha}
                  onChange={(e) => setOps({ ...ops, enforceCaptcha: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-xs font-medium text-gray-700">Enforce Captcha on Auth</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Module 3: Global Top Announcement Banner */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-600" />
            <span>Global Header Announcement Banner</span>
          </h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={ops.announcement?.enabled}
              onChange={(e) => setOps({
                ...ops,
                announcement: { ...ops.announcement, enabled: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Banner Announcement Message
            </label>
            <input
              type="text"
              value={ops.announcement?.text || ''}
              onChange={(e) => setOps({
                ...ops,
                announcement: { ...ops.announcement, text: e.target.value }
              })}
              placeholder="e.g. 🚀 High-fidelity Neural OCR suite with multi-language detection is live!"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Action Link / Button URL
            </label>
            <input
              type="text"
              value={ops.announcement?.link || ''}
              onChange={(e) => setOps({
                ...ops,
                announcement: { ...ops.announcement, link: e.target.value }
              })}
              placeholder="/pricing or /tool/ocr-pdf"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Module 4: Disaster Recovery & Backup / Restore */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Disaster Recovery & System State Backup</span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Export a full JSON snapshot of plans, payment gateway configs, coupons, branding, and user accounts, or restore from a previous backup file.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-100 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-sm font-bold text-blue-950 flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-600" />
                <span>Export System Snapshot</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                Generates a secure JSON file containing all platform settings, active plans, integrations, and branding variables.
              </p>
            </div>
            <button
              onClick={handleDownloadBackup}
              className="mt-4 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download System Backup (JSON)</span>
            </button>
          </div>

          <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-100 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-sm font-bold text-amber-950 flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-600" />
                <span>Restore Snapshot</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Upload a verified backup JSON file to recover configuration state. Passwords and sensitive keys remain protected.
              </p>
            </div>
            <label className="mt-4 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all">
              <Upload className="w-4 h-4" />
              <span>{restoring ? 'Restoring State...' : 'Upload & Restore Backup'}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleRestoreFile}
                className="hidden"
                disabled={restoring}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveOps}
          disabled={saving}
          className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Apply System Operations Changes'}</span>
        </button>
      </div>
    </div>
  );
}
