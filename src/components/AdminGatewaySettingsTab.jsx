import React, { useState } from 'react';
import {
  Key, Shield, Check, Copy, AlertCircle, RefreshCw,
  QrCode, Building, CreditCard, Eye, EyeOff, Save, ExternalLink
} from 'lucide-react';

export function AdminGatewaySettingsTab({ gateways, onSaveGateway, onTestConnection, showNotification }) {
  const [selectedGwId, setSelectedGwId] = useState('manual');
  const [showSecrets, setShowSecrets] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);
  const [testAmount, setTestAmount] = useState(29);
  const [testingGw, setTestingGw] = useState(null);

  // Local editing copy for each gateway to avoid lost focus
  const [localForms, setLocalForms] = useState(() => {
    const initial = {};
    (gateways || []).forEach((g) => {
      initial[g.id] = { ...g };
    });
    return initial;
  });

  const toggleShowSecret = (field) => {
    setShowSecrets((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFieldChange = (gwId, field, val) => {
    setLocalForms((prev) => ({
      ...prev,
      [gwId]: {
        ...(prev[gwId] || {}),
        [field]: val
      }
    }));
  };

  const handleSaveCurrent = async (gwId) => {
    const current = localForms[gwId];
    if (!current) return;
    await onSaveGateway(gwId, current);
    showNotification(`✓ ${current.name || gwId.toUpperCase()} settings saved successfully!`);
  };

  const handleTest = async (gwId) => {
    setTestingGw(gwId);
    try {
      await onTestConnection(gwId);
    } finally {
      setTestingGw(null);
    }
  };

  const currentGw = localForms[selectedGwId] || gateways.find((g) => g.id === selectedGwId) || {};

  return (
    <div className="space-y-6">
      {/* Gateway Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto text-xs font-bold">
        {[
          { id: 'manual', label: 'Manual Wire & UPI / QR', icon: Building, color: 'text-amber-600' },
          { id: 'stripe', label: 'Stripe Global (Credit Cards)', icon: CreditCard, color: 'text-indigo-600' },
          { id: 'paypal', label: 'PayPal Checkout', icon: CreditCard, color: 'text-blue-600' },
          { id: 'razorpay', label: 'Razorpay (India UPI / Cards)', icon: CreditCard, color: 'text-emerald-600' }
        ].map((item) => {
          const ItemIcon = item.icon;
          const isActive = selectedGwId === item.id;
          const gwObj = localForms[item.id] || {};
          return (
            <button
              key={item.id}
              onClick={() => setSelectedGwId(item.id)}
              className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 cursor-pointer transition whitespace-nowrap ${
                isActive
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <ItemIcon className={`w-4 h-4 ${isActive ? 'text-amber-400' : item.color}`} />
              <span>{item.label}</span>
              <span
                className={`ml-1 px-2 py-0.2 rounded-full text-[9px] font-bold ${
                  gwObj.enabled
                    ? isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                    : isActive ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {gwObj.enabled ? 'ACTIVE' : 'OFF'}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* GATEWAY 1: MANUAL WIRE / UPI / QR FULL CONTROL */}
      {/* ========================================================================= */}
      {selectedGwId === 'manual' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base text-gray-900">Manual Wire &amp; Instant UPI Payment Gateway</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Configure your corporate bank account, UPI ID, and interactive QR generator shown at checkout.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-bold text-gray-700">Enable at Checkout</span>
                <input
                  type="checkbox"
                  checked={Boolean(currentGw.enabled)}
                  onChange={(e) => handleFieldChange('manual', 'enabled', e.target.checked)}
                  className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500"
                />
              </label>
              <button
                onClick={() => handleSaveCurrent('manual')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Manual Settings</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
            {/* Form Fields Column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Corporate Bank Name</label>
                  <input
                    type="text"
                    value={currentGw.bankName || ''}
                    onChange={(e) => handleFieldChange('manual', 'bankName', e.target.value)}
                    placeholder="e.g. HDFC Bank, Chase, SBI"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Beneficiary Account Name</label>
                  <input
                    type="text"
                    value={currentGw.accountName || ''}
                    onChange={(e) => handleFieldChange('manual', 'accountName', e.target.value)}
                    placeholder="e.g. Vansh PDF Technologies Inc"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Account Number / IBAN</label>
                  <input
                    type="text"
                    value={currentGw.accountNumber || ''}
                    onChange={(e) => handleFieldChange('manual', 'accountNumber', e.target.value)}
                    placeholder="e.g. 99201948102934"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">IFSC / SWIFT / BIC Code</label>
                  <input
                    type="text"
                    value={currentGw.ifscSwift || ''}
                    onChange={(e) => handleFieldChange('manual', 'ifscSwift', e.target.value)}
                    placeholder="e.g. HDFC0001892"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Bank Branch Location</label>
                  <input
                    type="text"
                    value={currentGw.branchName || ''}
                    onChange={(e) => handleFieldChange('manual', 'branchName', e.target.value)}
                    placeholder="e.g. Financial Center Branch"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Primary UPI ID / VPA</label>
                  <input
                    type="text"
                    value={currentGw.upiId || ''}
                    onChange={(e) => handleFieldChange('manual', 'upiId', e.target.value)}
                    placeholder="e.g. vanshpdf@icici or business@upi"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Static Custom QR Code Image URL (Optional)</label>
                <input
                  type="text"
                  value={currentGw.upiQrUrl || ''}
                  onChange={(e) => handleFieldChange('manual', 'upiQrUrl', e.target.value)}
                  placeholder="Leave empty to use automatic dynamic UPI QR generator"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Payer Instructions at Checkout</label>
                <textarea
                  rows="3"
                  value={currentGw.instructions || ''}
                  onChange={(e) => handleFieldChange('manual', 'instructions', e.target.value)}
                  placeholder="Instructions displayed to users on the payment checkout page..."
                  className="w-full p-3 rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={currentGw.requireProof !== false}
                    onChange={(e) => handleFieldChange('manual', 'requireProof', e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600"
                  />
                  <span>Mandate Transfer Receipt Screenshot Upload</span>
                </label>

                <button
                  type="button"
                  onClick={() => handleTest('manual')}
                  disabled={testingGw === 'manual'}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                >
                  {testingGw === 'manual' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
                  <span>Verify Configuration Parameters</span>
                </button>
              </div>
            </div>

            {/* Dynamic QR Live Generator Preview Box */}
            <div className="lg:col-span-4 bg-amber-50/50 rounded-3xl p-5 border border-amber-200 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-amber-600" />
                    <span>Live QR Code Preview</span>
                  </h4>
                  <span className="text-[10px] font-bold bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-full">
                    Dynamic
                  </span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-amber-200 flex flex-col items-center justify-center text-center shadow-xs">
                  {(() => {
                    const upiId = currentGw.upiId || 'vanshpdf@icici';
                    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=Vansh%20PDF&am=${testAmount}&cu=USD&tn=TestOrder`;
                    const qrUrl = currentGw.upiQrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUri)}`;
                    return (
                      <>
                        <img
                          src={qrUrl}
                          alt="Live Preview QR"
                          className="w-44 h-44 object-contain rounded-xl border border-gray-100 shadow-xs"
                        />
                        <p className="text-[11px] font-mono font-bold text-gray-800 mt-2">
                          UPI ID: {upiId}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Scan with PhonePe, Google Pay, Paytm, or BHIM
                        </p>
                      </>
                    );
                  })()}
                </div>

                <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1 text-[11px]">
                  <label className="block text-[10px] font-bold text-gray-500">Test Order Amount ($)</label>
                  <input
                    type="number"
                    value={testAmount}
                    onChange={(e) => setTestAmount(Number(e.target.value))}
                    className="w-full px-2 py-1 border border-gray-200 rounded font-bold text-gray-900"
                  />
                </div>
              </div>

              <p className="text-[10px] text-amber-800 mt-4 leading-relaxed">
                When users choose Manual Payment, this QR is automatically rendered with their real order ID and exact total.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GATEWAY 2: STRIPE FULL CREDENTIALS & WEBHOOKS */}
      {/* ========================================================================= */}
      {selectedGwId === 'stripe' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-gray-900">Stripe Global Payment Gateway</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Configure Stripe API keys, sandbox/live modes, and webhook automation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-bold text-gray-700">Enable at Checkout</span>
                <input
                  type="checkbox"
                  checked={Boolean(currentGw.enabled)}
                  onChange={(e) => handleFieldChange('stripe', 'enabled', e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>
              <button
                onClick={() => handleSaveCurrent('stripe')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Stripe Keys</span>
              </button>
            </div>
          </div>

          <div className="space-y-4 text-xs max-w-3xl">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <span className="font-bold text-gray-900 block">Operating Environment</span>
                <span className="text-[11px] text-gray-500">Switch between Stripe test sandbox and production live charges</span>
              </div>
              <select
                value={currentGw.mode || 'test'}
                onChange={(e) => handleFieldChange('stripe', 'mode', e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-bold text-xs"
              >
                <option value="test">Test / Sandbox (pk_test / sk_test)</option>
                <option value="live">Live Production (pk_live / sk_live)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Stripe Publishable Key</label>
              <input
                type="text"
                value={currentGw.publishableKey || ''}
                onChange={(e) => handleFieldChange('stripe', 'publishableKey', e.target.value)}
                placeholder="pk_test_51..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Stripe Secret Key</label>
              <div className="relative">
                <input
                  type={showSecrets.stripe_sec ? 'text' : 'password'}
                  value={currentGw.secretKey || ''}
                  onChange={(e) => handleFieldChange('stripe', 'secretKey', e.target.value)}
                  placeholder="sk_test_51..."
                  className="w-full px-3 py-2 pr-10 rounded-xl border border-gray-200 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => toggleShowSecret('stripe_sec')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {showSecrets.stripe_sec ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Stripe Webhook Signing Secret</label>
              <div className="relative">
                <input
                  type={showSecrets.stripe_wh ? 'text' : 'password'}
                  value={currentGw.webhookSecret || ''}
                  onChange={(e) => handleFieldChange('stripe', 'webhookSecret', e.target.value)}
                  placeholder="whsec_..."
                  className="w-full px-3 py-2 pr-10 rounded-xl border border-gray-200 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => toggleShowSecret('stripe_wh')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {showSecrets.stripe_wh ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Webhook Endpoint Helper */}
            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-2">
              <span className="font-bold text-indigo-950 block">Authoritative Webhook Target URL</span>
              <p className="text-[11px] text-indigo-800">
                Paste this destination into your Stripe Dashboard Webhooks (listen to <code>checkout.session.completed</code>):
              </p>
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-indigo-200 font-mono text-[11px] text-gray-800">
                <span>{window.location.origin}/api/payments/webhook/stripe</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(`${window.location.origin}/api/payments/webhook/stripe`, 'wh_stripe')}
                  className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'wh_stripe' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'wh_stripe' ? 'Copied!' : 'Copy URL'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleTest('stripe')}
                disabled={testingGw === 'stripe'}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {testingGw === 'stripe' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                <span>Test API Keys Connection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GATEWAY 3: PAYPAL FULL CONFIG */}
      {/* ========================================================================= */}
      {selectedGwId === 'paypal' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-gray-900">PayPal Express Checkout</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Configure PayPal Developer Client ID, Secret, and Sandbox parameters.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-bold text-gray-700">Enable at Checkout</span>
                <input
                  type="checkbox"
                  checked={Boolean(currentGw.enabled)}
                  onChange={(e) => handleFieldChange('paypal', 'enabled', e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>
              <button
                onClick={() => handleSaveCurrent('paypal')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save PayPal Keys</span>
              </button>
            </div>
          </div>

          <div className="space-y-4 text-xs max-w-3xl">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <span className="font-bold text-gray-900 block">Environment</span>
                <span className="text-[11px] text-gray-500">Sandbox testing vs Live production charges</span>
              </div>
              <select
                value={currentGw.mode || 'sandbox'}
                onChange={(e) => handleFieldChange('paypal', 'mode', e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-bold text-xs"
              >
                <option value="sandbox">Sandbox (api.sandbox.paypal.com)</option>
                <option value="live">Live (api.paypal.com)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">PayPal Client ID</label>
              <input
                type="text"
                value={currentGw.clientId || ''}
                onChange={(e) => handleFieldChange('paypal', 'clientId', e.target.value)}
                placeholder="A21AA..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">PayPal Client Secret</label>
              <div className="relative">
                <input
                  type={showSecrets.paypal_sec ? 'text' : 'password'}
                  value={currentGw.clientSecret || ''}
                  onChange={(e) => handleFieldChange('paypal', 'clientSecret', e.target.value)}
                  placeholder="EK_..."
                  className="w-full px-3 py-2 pr-10 rounded-xl border border-gray-200 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => toggleShowSecret('paypal_sec')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {showSecrets.paypal_sec ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleTest('paypal')}
                disabled={testingGw === 'paypal'}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {testingGw === 'paypal' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                <span>Test PayPal Sandbox Connection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GATEWAY 4: RAZORPAY FULL CONFIG */}
      {/* ========================================================================= */}
      {selectedGwId === 'razorpay' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-gray-900">Razorpay (India UPI, Cards &amp; NetBanking)</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Configure Razorpay Key ID and Secret for automated INR checkout.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-bold text-gray-700">Enable at Checkout</span>
                <input
                  type="checkbox"
                  checked={Boolean(currentGw.enabled)}
                  onChange={(e) => handleFieldChange('razorpay', 'enabled', e.target.checked)}
                  className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                />
              </label>
              <button
                onClick={() => handleSaveCurrent('razorpay')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Razorpay Keys</span>
              </button>
            </div>
          </div>

          <div className="space-y-4 text-xs max-w-3xl">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <span className="font-bold text-gray-900 block">Mode</span>
                <span className="text-[11px] text-gray-500">Test vs Live Transactions</span>
              </div>
              <select
                value={currentGw.mode || 'test'}
                onChange={(e) => handleFieldChange('razorpay', 'mode', e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-bold text-xs"
              >
                <option value="test">Test Mode (rzp_test_...)</option>
                <option value="live">Live Mode (rzp_live_...)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Razorpay Key ID</label>
              <input
                type="text"
                value={currentGw.keyId || ''}
                onChange={(e) => handleFieldChange('razorpay', 'keyId', e.target.value)}
                placeholder="rzp_test_..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Razorpay Key Secret</label>
              <div className="relative">
                <input
                  type={showSecrets.rzp_sec ? 'text' : 'password'}
                  value={currentGw.keySecret || ''}
                  onChange={(e) => handleFieldChange('razorpay', 'keySecret', e.target.value)}
                  placeholder="Key secret from Razorpay Dashboard"
                  className="w-full px-3 py-2 pr-10 rounded-xl border border-gray-200 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => toggleShowSecret('rzp_sec')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {showSecrets.rzp_sec ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleTest('razorpay')}
                disabled={testingGw === 'razorpay'}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {testingGw === 'razorpay' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                <span>Test Razorpay Connection</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
