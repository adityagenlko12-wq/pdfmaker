import React, { useState } from 'react';
import {
  HardDrive, Mail, Globe, Check, AlertCircle, RefreshCw,
  Send, Save, Eye, EyeOff
} from 'lucide-react';

export function AdminIntegrationsTab({ integrations, onRefresh, getHeaders, showNotification }) {
  const [formData, setFormData] = useState({
    smtpHost: integrations.smtp?.host || 'smtp.sendgrid.net',
    smtpPort: integrations.smtp?.port || 587,
    smtpUser: integrations.smtp?.user || 'apikey',
    smtpPass: integrations.smtp?.pass || '',
    smtpSender: integrations.smtp?.sender || 'no-reply@vanshpdf.com',
    smtpSenderName: integrations.smtp?.senderName || 'Vansh PDF Automated',
    smtpSecure: integrations.smtp?.secure || false,

    s3Bucket: integrations.s3?.bucket || 'vansh-pdf-vault',
    s3Region: integrations.s3?.region || 'us-east-1',
    s3AccessKey: integrations.s3?.accessKey || '',
    s3SecretKey: integrations.s3?.secretKey || '',

    webhookUrl: integrations.webhooks?.url || '',
    webhookSecret: integrations.webhooks?.secret || ''
  });

  const [showSecret, setShowSecret] = useState(false);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testEmailTarget, setTestEmailTarget] = useState('admin@vanshpdf.com');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        smtp: {
          host: formData.smtpHost,
          port: Number(formData.smtpPort),
          user: formData.smtpUser,
          pass: formData.smtpPass,
          sender: formData.smtpSender,
          senderName: formData.smtpSenderName,
          secure: formData.smtpSecure
        },
        s3: {
          bucket: formData.s3Bucket,
          region: formData.s3Region,
          accessKey: formData.s3AccessKey,
          secretKey: formData.s3SecretKey
        },
        webhooks: {
          url: formData.webhookUrl,
          secret: formData.webhookSecret
        }
      };

      const res = await fetch('/api/admin/integrations', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showNotification('✓ System integrations and SMTP credentials saved!');
        onRefresh();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to save integrations');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestSmtp = async () => {
    setTestingSmtp(true);
    try {
      const res = await fetch('/api/admin/integrations/test-smtp', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ to: testEmailTarget })
      });
      const d = await res.json();
      if (d.success) {
        alert(`✓ Test Email Handshake Success: ${d.message}`);
      } else {
        alert(`✗ SMTP Error: ${d.error}`);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setTestingSmtp(false);
    }
  };

  const handleTestWebhook = async () => {
    setTestingWebhook(true);
    try {
      const res = await fetch('/api/admin/integrations/test-webhook', {
        method: 'POST',
        headers: getHeaders()
      });
      const d = await res.json();
      if (d.success) {
        alert(`✓ Outgoing Webhook Ping Dispatched: HTTP ${d.statusCode || 200}`);
      } else {
        alert(`✗ Webhook Ping Failed: ${d.error}`);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setTestingWebhook(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-in fade-in">
      {/* SMTP Email Server */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-base text-gray-900">SMTP Transactional Email Relay</h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Powers automatic order invoices, plan renewal alerts, and password resets.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">SMTP Host</label>
            <input
              type="text"
              value={formData.smtpHost}
              onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Port</label>
            <input
              type="number"
              value={formData.smtpPort}
              onChange={(e) => setFormData({ ...formData, smtpPort: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Username / API Key</label>
            <input
              type="text"
              value={formData.smtpUser}
              onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Password / Secret</label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                value={formData.smtpPass}
                onChange={(e) => setFormData({ ...formData, smtpPass: e.target.value })}
                className="w-full px-3 py-2 pr-9 rounded-xl border border-gray-200 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-700"
              >
                {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Sender Email</label>
            <input
              type="email"
              value={formData.smtpSender}
              onChange={(e) => setFormData({ ...formData, smtpSender: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Sender Name</label>
            <input
              type="text"
              value={formData.smtpSenderName}
              onChange={(e) => setFormData({ ...formData, smtpSenderName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={testEmailTarget}
              onChange={(e) => setTestEmailTarget(e.target.value)}
              placeholder="recipient@example.com"
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs w-56 font-mono"
            />
            <button
              type="button"
              onClick={handleTestSmtp}
              disabled={testingSmtp}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
            >
              {testingSmtp ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              <span>Send Test Email</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cloud Storage Vault (S3 / R2) */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <HardDrive className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-base text-gray-900">Cloud Storage Vault (AWS S3 / Cloudflare R2)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Bucket Name</label>
            <input
              type="text"
              value={formData.s3Bucket}
              onChange={(e) => setFormData({ ...formData, s3Bucket: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Region</label>
            <input
              type="text"
              value={formData.s3Region}
              onChange={(e) => setFormData({ ...formData, s3Region: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Outgoing Webhooks */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <Globe className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-base text-gray-900">Outgoing Automation Webhooks</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Target Endpoint URL</label>
            <input
              type="url"
              value={formData.webhookUrl}
              onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
              placeholder="https://hooks.zapier.com/... or your server"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Secret Signing Token</label>
            <input
              type="text"
              value={formData.webhookSecret}
              onChange={(e) => setFormData({ ...formData, webhookSecret: e.target.value })}
              placeholder="wh_sec_..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleTestWebhook}
            disabled={testingWebhook}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
          >
            {testingWebhook ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Globe className="w-3 h-3" />}
            <span>Dispatch Test Webhook Ping</span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl text-xs shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4 text-amber-400" />
          <span>{saving ? 'Saving Integrations...' : 'Save All Cloud Integrations'}</span>
        </button>
      </div>
    </form>
  );
}
