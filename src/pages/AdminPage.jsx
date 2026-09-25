import React, { useState, useEffect } from 'react';
import {
  Shield, Users, CreditCard, Wrench, Layers, Settings,
  HardDrive, FileText, BellRing, Sparkles, Check, Trash2,
  Edit2, Eye, Plus, ArrowUpRight, AlertTriangle, RefreshCw,
  Search, Lock, CheckCircle2, XCircle, Download, Key, Smartphone,
  Palette, Database
} from 'lucide-react';
import { useSite } from '../cms/SiteContext';
import { StatCard3D, BarChart3D, DonutChart3D } from '../components/Charts3D';
import { AdminPopupAdsTab } from '../components/AdminPopupAdsTab';
import { AdminManualPaymentsDesk } from '../components/AdminManualPaymentsDesk';
import { AdminGatewaySettingsTab } from '../components/AdminGatewaySettingsTab';
import { AdminPlanManagerTab } from '../components/AdminPlanManagerTab';
import { AdminUserManagerTab } from '../components/AdminUserManagerTab';
import { AdminIntegrationsTab } from '../components/AdminIntegrationsTab';
import { AdminBrandingTab } from '../components/AdminBrandingTab';
import { AdminSystemOpsTab } from '../components/AdminSystemOpsTab';

export default function AdminPage({ onNavigateHome }) {
  const { user, startImpersonation, formatPrice } = useSite();

  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sub-modules state
  const [payments, setPayments] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminTools, setAdminTools] = useState([]);
  const [adminPlans, setAdminPlans] = useState([]);
  const [appDownloads, setAppDownloads] = useState({
    androidAppUrl: '',
    iosAppUrl: '',
    desktopAppUrl: '',
    androidAppEnabled: true,
    iosAppEnabled: true,
    desktopAppEnabled: true,
    androidVersion: 'v2.4.1',
    iosVersion: 'v2.4.0',
    desktopVersion: 'v1.9.8',
    totalDownloads: '142,800+'
  });
  const [guestLimits, setGuestLimits] = useState({
    maxOperations: 3,
    maxFileSizeMB: 15,
    sessionHours: 24,
    enableGuestAccess: true
  });
  const [coupons, setCoupons] = useState([]);
  const [integrations, setIntegrations] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);
  const [actionNotice, setActionNotice] = useState(null);

  // New Coupon Form state
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountPercent: 20,
    validUntil: '2026-12-31',
    maxUses: 500
  });

  const getHeaders = () => {
    const token = localStorage.getItem('vansh_token') || user?.id;
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
  };

  const fetchAllAdminData = async () => {
    if (!user || user.role !== 'admin') return;
    try {
      const [
        ovRes, payRes, gwRes, usrRes, toolRes, planRes, appRes, guestRes, cpnRes, intRes, logRes
      ] = await Promise.all([
        fetch('/api/admin/overview', { headers: getHeaders() }),
        fetch('/api/admin/payments', { headers: getHeaders() }),
        fetch('/api/admin/gateways', { headers: getHeaders() }),
        fetch('/api/admin/users', { headers: getHeaders() }),
        fetch('/api/admin/tools', { headers: getHeaders() }),
        fetch('/api/admin/plans', { headers: getHeaders() }),
        fetch('/api/admin/settings/app-downloads', { headers: getHeaders() }),
        fetch('/api/admin/guest-limits', { headers: getHeaders() }),
        fetch('/api/admin/coupons', { headers: getHeaders() }),
        fetch('/api/admin/integrations', { headers: getHeaders() }),
        fetch('/api/admin/audit-logs', { headers: getHeaders() })
      ]);

      if (ovRes.ok) setOverview(await ovRes.json());
      if (payRes.ok) {
        const d = await payRes.json();
        setPayments(d.payments || []);
      }
      if (gwRes.ok) {
        const d = await gwRes.json();
        setGateways(d.gateways || []);
      }
      if (usrRes.ok) {
        const d = await usrRes.json();
        setAdminUsers(d.users || []);
      }
      if (toolRes.ok) {
        const d = await toolRes.json();
        setAdminTools(d.tools || []);
      }
      if (planRes.ok) {
        const d = await planRes.json();
        setAdminPlans(d.plans || []);
      }
      if (appRes.ok) setAppDownloads(await appRes.json());
      if (guestRes.ok) {
        const d = await guestRes.json();
        setGuestLimits(d.config || guestLimits);
      }
      if (cpnRes.ok) {
        const d = await cpnRes.json();
        setCoupons(d.coupons || []);
      }
      if (intRes.ok) setIntegrations(await intRes.json());
      if (logRes.ok) {
        const d = await logRes.json();
        setAuditLogs(d.logs || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, [user]);

  const showNotification = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Payment Actions
  const handleConfirmManual = async (paymentId) => {
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/confirm`, {
        method: 'POST',
        headers: getHeaders()
      });
      const d = await res.json();
      if (res.ok) {
        showNotification('Manual payment verified and user plan upgraded!');
        fetchAllAdminData();
      } else {
        alert(d.error || 'Failed to confirm payment');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleRefund = async (paymentId) => {
    if (!confirm('Are you sure you want to refund this transaction?')) return;
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (res.ok) {
        showNotification('Transaction refunded and logged in audit trail.');
        fetchAllAdminData();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  // Update Gateway Config
  const handleSaveGateway = async (gwKey, payload) => {
    try {
      const res = await fetch(`/api/admin/gateways/${gwKey}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showNotification(`Gateway ${gwKey.toUpperCase()} settings saved.`);
        fetchAllAdminData();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  // Test Gateway Connection
  const handleTestConnection = async (gwKey) => {
    try {
      const res = await fetch(`/api/admin/gateways/${gwKey}/test-connection`, {
        method: 'POST',
        headers: getHeaders()
      });
      const d = await res.json();
      if (d.success) {
        alert(`✓ Connection verified: ${d.message}`);
      } else {
        alert(`✗ Connection error: ${d.error}`);
      }
    } catch (e) {
      alert(e.message);
    }
  };

  // Update Tool Pro / Enabled
  const handleToggleToolPro = async (tool) => {
    try {
      const res = await fetch(`/api/admin/tools/${tool.id}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ isProOnly: !tool.isProOnly })
      });
      if (res.ok) {
        setAdminTools((prev) =>
          prev.map((t) => (t.id === tool.id ? { ...t, isProOnly: !t.isProOnly } : t))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Impersonate User
  const handleImpersonate = (targetUser) => {
    startImpersonation(targetUser);
    onNavigateHome && onNavigateHome();
  };

  // Save App Downloads Settings
  const handleSaveAppDownloads = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings/app-downloads', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(appDownloads)
      });
      if (res.ok) {
        showNotification('Mobile App download links updated!');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  // Save Guest Limits
  const handleSaveGuestLimits = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/guest-limits', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(guestLimits)
      });
      if (res.ok) {
        showNotification('Guest unauthenticated access limits updated.');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  // Create Coupon
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newCoupon)
      });
      if (res.ok) {
        showNotification(`Coupon ${newCoupon.code} created!`);
        setNewCoupon({ code: '', discountPercent: 20, validUntil: '2026-12-31', maxUses: 500 });
        fetchAllAdminData();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <Shield className="w-12 h-12 text-rose-500 mb-3" />
        <h3 className="text-xl font-bold text-gray-900">Administrator Access Required</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-sm">
          You do not have permission to access the SaaS Administration Control Center.
        </p>
        <button
          onClick={onNavigateHome}
          className="mt-4 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const revenueHistory = overview?.revenueHistory || [
    { label: 'Jan', value: 1240 },
    { label: 'Feb', value: 1890 },
    { label: 'Mar', value: 2340 },
    { label: 'Apr', value: 2980 },
    { label: 'May', value: 3450 },
    { label: 'Jun', value: 4890 },
    { label: 'Jul', value: 5410 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header & Breadcrumb */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-gray-950 flex items-center justify-center font-bold text-2xl shadow-lg shadow-amber-500/20">
              <Shield className="w-8 h-8 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  SaaS Administration Center
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time telemetry, automated gateway security, RBAC, and system configuration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
              ● Engine Live (Port 3000)
            </span>
          </div>
        </div>

        {/* Global Action Notification Pill */}
        {actionNotice && (
          <div className="p-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold text-center shadow-lg animate-in fade-in">
            {actionNotice}
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto text-xs font-semibold">
          {(() => {
            const pendingCount = payments.filter(
              (p) => p.status === 'pending' || p.status === 'pending_manual' || p.verificationStatus?.toLowerCase().includes('pending')
            ).length;

            return [
              { id: 'overview', label: 'Overview & 3D Metrics', icon: Layers },
              { id: 'branding', label: 'Site Branding & Identity', icon: Palette },
              { id: 'system_ops', label: 'System Ops & Backup', icon: Database },
              { id: 'payments', label: 'Manual Reconciliation & Orders', icon: CreditCard, badge: pendingCount },
              { id: 'gateways', label: 'Payment Gateways & UPI', icon: Key },
              { id: 'users', label: 'Users & Impersonation', icon: Users },
              { id: 'plans', label: 'Plans & Pricing Control', icon: FileText },
              { id: 'tools', label: 'Tools Catalog & OCR Suite', icon: Wrench },
              { id: 'integrations', label: 'Cloud & SMTP Integrations', icon: HardDrive },
              { id: 'guest', label: 'Guest Access Limits', icon: Lock },
              { id: 'apps', label: 'Mobile Apps Store', icon: Smartphone },
              { id: 'popups', label: 'Top Announcement / Ads', icon: BellRing },
              { id: 'coupons', label: 'Coupons & Promos', icon: Sparkles },
              { id: 'audit', label: 'Audit & Security Logs', icon: Shield }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-gray-900 text-white font-bold shadow-xs'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {Boolean(tab.badge && tab.badge > 0) && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            });
          })()}
        </div>

        {/* ==================================================================== */}
        {/* TAB 1: OVERVIEW & 3D METRICS */}
        {/* ==================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            {/* 3D KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard3D
                title="Total SaaS Revenue"
                value={`$${(overview?.totalRevenue || 12480).toLocaleString()}`}
                subtitle="From verified orders"
                icon={CreditCard}
                color="blue"
                trend="+24% YoY"
              />
              <StatCard3D
                title="Registered Users"
                value={overview?.totalUsers || adminUsers.length || 14}
                subtitle="Active customer accounts"
                icon={Users}
                color="indigo"
                trend="+6 this week"
              />
              <StatCard3D
                title="PDF Jobs Processed"
                value={(overview?.totalJobs || 4820).toLocaleString()}
                subtitle="Across all 78 tools"
                icon={FileText}
                color="emerald"
                trend="+340 today"
              />
              <StatCard3D
                title="Pro Conversion"
                value="22.4%"
                subtitle="Free to paid ratio"
                icon={Sparkles}
                color="purple"
              />
            </div>

            {/* 3D Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Monthly Revenue Inflow (3D Extrusion)</h3>
                      <p className="text-xs text-gray-500">Verified server-side payments across all gateways</p>
                    </div>
                  </div>
                  <BarChart3D data={revenueHistory} valuePrefix="$" height={220} color="#2563eb" />
                </div>
              </div>

              <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Subscriber Breakdown</h3>
                  <p className="text-xs text-gray-500 mb-4">User distribution by tier</p>
                  <DonutChart3D
                    data={[
                      { name: 'Free Starter', value: 68, color: '#9CA3AF' },
                      { name: 'Pro Tier', value: 24, color: '#3B82F6' },
                      { name: 'Enterprise', value: 8, color: '#8B5CF6' }
                    ]}
                    totalLabel="Subscribers"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: MANUAL RECONCILIATION & ORDERS DESK */}
        {/* ==================================================================== */}
        {activeTab === 'payments' && (
          <AdminManualPaymentsDesk
            payments={payments}
            onRefresh={fetchAllAdminData}
            getHeaders={getHeaders}
            showNotification={showNotification}
            adminUsers={adminUsers}
            adminPlans={adminPlans}
          />
        )}

        {/* ==================================================================== */}
        {/* TAB 3: PAYMENT GATEWAYS CONFIG & DYNAMIC QR */}
        {/* ==================================================================== */}
        {activeTab === 'gateways' && (
          <AdminGatewaySettingsTab
            gateways={gateways}
            onSaveGateway={handleSaveGateway}
            onTestConnection={handleTestConnection}
            showNotification={showNotification}
          />
        )}

        {/* ==================================================================== */}
        {/* TAB 4: USERS & IMPERSONATION & RBAC */}
        {/* ==================================================================== */}
        {activeTab === 'users' && (
          <AdminUserManagerTab
            users={adminUsers}
            plans={adminPlans}
            onRefresh={fetchAllAdminData}
            getHeaders={getHeaders}
            showNotification={showNotification}
            startImpersonation={startImpersonation}
            onNavigateHome={onNavigateHome}
          />
        )}

        {/* ==================================================================== */}
        {/* TAB 5: TOOLS CATALOG OVERRIDES */}
        {/* ==================================================================== */}
        {activeTab === 'tools' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">PDF Tools Catalog (78 Tools)</h3>
                <p className="text-xs text-gray-500">
                  Toggle pro-only requirements and inspect usage telemetry per tool.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {adminTools.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <p className="font-bold text-gray-900 truncate">{t.name}</p>
                    <p className="text-gray-400 text-[10px]">Step {t.step} • {t.totalExecutions || 0} runs</p>
                  </div>
                  <button
                    onClick={() => handleToggleToolPro(t)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] cursor-pointer ${
                      t.isProOnly ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {t.isProOnly ? 'Pro Only' : 'Free Starter'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 6: PLANS & PRICING CONTROL */}
        {/* ==================================================================== */}
        {activeTab === 'plans' && (
          <AdminPlanManagerTab
            plans={adminPlans}
            onRefresh={fetchAllAdminData}
            getHeaders={getHeaders}
            showNotification={showNotification}
          />
        )}

        {/* ==================================================================== */}
        {/* TAB: CLOUD & SMTP INTEGRATIONS */}
        {/* ==================================================================== */}
        {activeTab === 'integrations' && (
          <AdminIntegrationsTab
            integrations={integrations}
            onRefresh={fetchAllAdminData}
            getHeaders={getHeaders}
            showNotification={showNotification}
          />
        )}

        {/* ==================================================================== */}
        {/* TAB 7: GUEST ACCESS LIMITS */}
        {/* ==================================================================== */}
        {activeTab === 'guest' && (
          <div className="max-w-2xl bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in">
            <h3 className="text-base font-bold text-gray-900">Unauthenticated Guest Governance</h3>
            <p className="text-xs text-gray-500">
              Control usage limits for anonymous visitors before mandating registration.
            </p>

            <form onSubmit={handleSaveGuestLimits} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Max Daily Operations</label>
                <input
                  type="number"
                  value={guestLimits.maxOperations}
                  onChange={(e) => setGuestLimits({ ...guestLimits, maxOperations: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Max File Size Limit (MB)</label>
                <input
                  type="number"
                  value={guestLimits.maxFileSizeMB}
                  onChange={(e) => setGuestLimits({ ...guestLimits, maxFileSizeMB: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md"
              >
                Save Guest Limits
              </button>
            </form>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 8: MOBILE APPS DOWNLOADS SETTINGS */}
        {/* ==================================================================== */}
        {activeTab === 'apps' && (
          <div className="max-w-3xl bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div>
              <h3 className="text-base font-bold text-gray-900">Mobile Apps Ecosystem Links</h3>
              <p className="text-xs text-gray-500">
                Configure direct Google Play Store and Apple App Store links shown on homepage.
              </p>
            </div>

            <form onSubmit={handleSaveAppDownloads} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Google Play Store URL</label>
                <input
                  type="text"
                  value={appDownloads.androidAppUrl}
                  onChange={(e) => setAppDownloads({ ...appDownloads, androidAppUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Apple App Store URL</label>
                <input
                  type="text"
                  value={appDownloads.iosAppUrl}
                  onChange={(e) => setAppDownloads({ ...appDownloads, iosAppUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Total Verified Downloads Counter</label>
                <input
                  type="text"
                  value={appDownloads.totalDownloads}
                  onChange={(e) => setAppDownloads({ ...appDownloads, totalDownloads: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md"
              >
                Save Store Configuration
              </button>
            </form>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 9: POPUP ADS / ANNOUNCEMENT BANNER */}
        {/* ==================================================================== */}
        {activeTab === 'popups' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 animate-in fade-in">
            <AdminPopupAdsTab />
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 10: COUPONS & PROMOS */}
        {/* ==================================================================== */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8 animate-in fade-in">
            <h3 className="text-base font-bold text-gray-900">Promotional Coupon Codes</h3>

            <form onSubmit={handleCreateCoupon} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <input
                type="text"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                placeholder="Coupon Code (e.g. FLASH50)"
                className="px-3 py-2 bg-white rounded-xl border border-gray-200 font-mono font-bold"
                required
              />
              <input
                type="number"
                value={newCoupon.discountPercent}
                onChange={(e) => setNewCoupon({ ...newCoupon, discountPercent: Number(e.target.value) })}
                placeholder="Discount %"
                className="px-3 py-2 bg-white rounded-xl border border-gray-200"
                required
              />
              <input
                type="date"
                value={newCoupon.validUntil}
                onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                className="px-3 py-2 bg-white rounded-xl border border-gray-200"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl font-bold"
              >
                Create Coupon
              </button>
            </form>

            <div className="divide-y divide-gray-100 text-xs">
              {coupons.map((cpn) => (
                <div key={cpn.code} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-gray-900">{cpn.code}</span>
                    <span className="ml-3 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      {cpn.discountPercent}% OFF
                    </span>
                    <span className="ml-3 text-gray-400">Used: {cpn.uses || 0} times</span>
                  </div>
                  <button
                    onClick={async () => {
                      await fetch(`/api/admin/coupons/${cpn.code}`, { method: 'DELETE', headers: getHeaders() });
                      fetchAllAdminData();
                    }}
                    className="text-rose-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB: SITE BRANDING & IDENTITY */}
        {/* ==================================================================== */}
        {activeTab === 'branding' && (
          <AdminBrandingTab
            getHeaders={getHeaders}
            showNotification={showNotification}
          />
        )}

        {/* ==================================================================== */}
        {/* TAB: SYSTEM OPS & BACKUP */}
        {/* ==================================================================== */}
        {activeTab === 'system_ops' && (
          <AdminSystemOpsTab
            getHeaders={getHeaders}
            showNotification={showNotification}
          />
        )}

        {/* ==================================================================== */}
        {/* TAB 11: AUDIT & SECURITY LOGS */}
        {/* ==================================================================== */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in">
            <h3 className="text-base font-bold text-gray-900">Security &amp; Administrative Audit Trail</h3>
            <div className="divide-y divide-gray-100 text-xs font-mono max-h-96 overflow-y-auto">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-800">[{log.action}]</span>
                    <span className="ml-2 text-gray-500">{log.details}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 ml-4">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
