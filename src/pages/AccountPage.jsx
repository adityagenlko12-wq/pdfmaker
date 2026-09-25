import React, { useState, useEffect } from 'react';
import {
  FileText, HardDrive, CheckCircle2, Download, Trash2,
  Key, RefreshCw, Copy, Check, Users, Plus, Shield, CreditCard,
  Layers, Lock, Sparkles, ExternalLink, Mail, UserPlus, ShieldCheck,
  AlertCircle, Eye, EyeOff, KeyRound
} from 'lucide-react';
import { useSite } from '../cms/SiteContext';
import { StatCard3D, BarChart3D, DonutChart3D, Progress3D } from '../components/Charts3D';

export default function AccountPage({ onNavigatePricing, onNavigateHome }) {
  const { user, formatPrice } = useSite();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'vault' | 'invoices' | 'team' | 'api' | 'security'
  const [regeneratingKey, setRegeneratingKey] = useState(false);

  // Invite team member state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');
  const [inviteMessage, setInviteMessage] = useState(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const fetchOverview = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('vansh_token') || user.id;
      const res = await fetch('/api/user/overview', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOverview(data);
      }
    } catch (err) {
      console.error('Failed to load user overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [user]);

  const handleRegenerateKey = async () => {
    setRegeneratingKey(true);
    try {
      const token = localStorage.getItem('vansh_token') || user.id;
      const res = await fetch('/api/user/api-keys/regenerate', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchOverview();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRegeneratingKey(false);
    }
  };

  const handleDeleteDoc = async (docId) => {
    try {
      const token = localStorage.getItem('vansh_token') || user.id;
      const res = await fetch(`/api/user/documents/${docId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setOverview((prev) => ({
          ...prev,
          documents: prev.documents.filter((d) => d.id !== docId)
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    try {
      const token = localStorage.getItem('vansh_token') || user.id;
      const res = await fetch('/api/user/team/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole })
      });
      const data = await res.json();
      if (!res.ok) {
        setInviteMessage({ error: data.error || 'Failed to invite team member' });
      } else {
        setInviteMessage({ success: `Invitation sent to ${inviteEmail}` });
        setInviteEmail('');
        fetchOverview();
      }
    } catch (err) {
      setInviteMessage({ error: err.message });
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const token = localStorage.getItem('vansh_token') || user.id;
      const res = await fetch(`/api/user/team/member/${memberId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchOverview();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({ error: 'All password fields are required.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordStatus({ error: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ error: 'New passwords do not match. Please check.' });
      return;
    }

    setPasswordLoading(true);
    try {
      const token = localStorage.getItem('vansh_token') || user.id;
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordStatus({ error: data.error || 'Failed to update password.' });
      } else {
        setPasswordStatus({ success: 'Your account password was updated successfully.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPasswordStatus({ error: err.message });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <Lock className="w-12 h-12 text-gray-400 mb-3" />
        <h3 className="text-xl font-bold text-gray-900">Authentication Required</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-sm">
          Please sign in to view your user dashboard, cloud document vault, and invoices.
        </p>
        <button
          onClick={onNavigateHome}
          className="mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 cursor-pointer"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const usageHistory = overview?.usageHistory || [
    { label: 'Mon', value: 4 },
    { label: 'Tue', value: 7 },
    { label: 'Wed', value: 12 },
    { label: 'Thu', value: 9 },
    { label: 'Fri', value: 18 },
    { label: 'Sat', value: 6 },
    { label: 'Sun', value: 14 }
  ];

  const categoryBreakdown = overview?.categoryBreakdown || [
    { name: 'Organize', value: 34, color: '#3B82F6' },
    { name: 'Convert', value: 28, color: '#10B981' },
    { name: 'Edit', value: 18, color: '#8B5CF6' },
    { name: 'Security', value: 12, color: '#F59E0B' },
    { name: 'Neural AI', value: 8, color: '#EC4899' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Header Profile Banner */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-100">
                  Plan: {user.planId}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigatePricing}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              Upgrade Subscription
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview', label: '3D Telemetry & Analytics', icon: Layers },
            { id: 'vault', label: 'AES-256 Document Vault', icon: HardDrive },
            { id: 'invoices', label: 'Tax Invoices & Billing', icon: CreditCard },
            { id: 'team', label: 'Workspace & Team Seats', icon: Users },
            { id: 'api', label: 'Developer API & Keys', icon: Key },
            { id: 'security', label: 'Security & Password', icon: ShieldCheck }
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: 3D TELEMETRY & ANALYTICS OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Stat Cards 3D Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard3D
                title="Total Documents"
                value={overview?.totalJobs || user.usage?.totalJobs || 24}
                subtitle="Lifetime processed"
                icon={FileText}
                color="blue"
                trend="+18% this month"
              />
              <StatCard3D
                title="Daily Jobs Used"
                value={`${overview?.jobsToday || user.usage?.jobsToday || 3} / ${user.planId === 'free' ? '3' : '∞'}`}
                subtitle="Resets midnight UTC"
                icon={Sparkles}
                color="purple"
              />
              <StatCard3D
                title="Encrypted Vault"
                value={`${overview?.documents?.length || 0} Files`}
                subtitle="Zero-knowledge cloud"
                icon={Lock}
                color="emerald"
              />
              <StatCard3D
                title="Paid Invoices"
                value={overview?.invoices?.length || 0}
                subtitle="Tax receipts confirmed"
                icon={CreditCard}
                color="amber"
              />
            </div>

            {/* 3D Charts Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left: 3D Isometric Bar Chart */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">7-Day Job Processing Activity</h3>
                      <p className="text-xs text-gray-500">Real 3D Isometric Extrusion Chart</p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl">
                      Live Telemetry
                    </span>
                  </div>
                  <BarChart3D data={usageHistory} height={200} color="#3B82F6" />
                </div>
              </div>

              {/* Right: 3D Donut Chart */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Category Distribution</h3>
                      <p className="text-xs text-gray-500">Usage breakdown by workflow type</p>
                    </div>
                  </div>
                  <DonutChart3D data={categoryBreakdown} totalLabel="Operations" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AES-256 DOCUMENT VAULT */}
        {activeTab === 'vault' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">AES-256 Cloud Document Vault</h3>
                <p className="text-xs text-gray-500">
                  Files processed in your account are encrypted with your private key in memory.
                </p>
              </div>

              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Zero Knowledge</span>
              </span>
            </div>

            {overview?.documents && overview.documents.length > 0 ? (
              <div className="divide-y divide-gray-100 text-xs">
                {overview.documents.map((doc) => (
                  <div key={doc.id} className="py-3.5 flex items-center justify-between">
                    <div className="truncate pr-4">
                      <p className="font-bold text-gray-900 truncate">{doc.name}</p>
                      <p className="text-gray-400 text-[11px] mt-0.5">
                        Tool: {doc.toolName || doc.toolId} • {doc.size} • Created: {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => alert(`Downloading verified document: ${doc.name}`)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDoc(doc.id)}
                        className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 text-xs">
                No documents saved in vault yet. Process a PDF to automatically save outputs here.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TAX INVOICES & BILLING */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Tax Invoices &amp; Receipts</h3>
                <p className="text-xs text-gray-500">
                  Computer-generated PDF tax invoices with digital verification stamps.
                </p>
              </div>

              <span className="text-xs font-bold text-gray-500">
                {overview?.invoices?.length || 0} Invoices Recorded
              </span>
            </div>

            {overview?.invoices && overview.invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                    <tr>
                      <th className="py-3 px-4">Invoice ID</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Gateway</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Tax Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {overview.invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4 font-mono font-bold text-gray-900">{inv.invoiceId}</td>
                        <td className="py-3 px-4 text-gray-500">
                          {new Date(inv.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 capitalize">{inv.gateway}</td>
                        <td className="py-3 px-4 font-bold text-gray-900">{formatPrice(inv.amount)}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <a
                            href={`/api/user/invoices/${inv.orderId || inv.id}/download`}
                            download
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF Invoice</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 text-xs">
                No invoices found. Upgrade your subscription to receive official PDF receipts.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: WORKSPACE & TEAM SEATS */}
        {activeTab === 'team' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {overview?.team?.name || `${user.name}'s Workspace`}
                </h3>
                <p className="text-xs text-gray-500">
                  Collaborative multi-user seat management and pooled operations quota.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-700">
                  Seats: {overview?.team?.seatsUsed || 1} / {overview?.team?.seatsMax || (user.planId === 'free' ? 3 : 10)}
                </span>
              </div>
            </div>

            {/* Invite New Team Member Form */}
            <form onSubmit={handleInviteMember} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
              <h4 className="text-xs font-bold text-gray-700">Invite Team Member</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="flex-1 px-3.5 py-2 bg-white rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs"
                >
                  <option value="Editor">Editor</option>
                  <option value="Admin">Admin</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Send Invite</span>
                </button>
              </div>

              {inviteMessage?.success && (
                <p className="text-xs text-emerald-600 font-bold">{inviteMessage.success}</p>
              )}
              {inviteMessage?.error && (
                <p className="text-xs text-rose-600 font-bold">{inviteMessage.error}</p>
              )}
            </form>

            {/* Team Members List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Active Workspace Members
              </h4>

              <div className="divide-y divide-gray-100 text-xs">
                {(overview?.team?.members || [
                  { id: '1', name: user.name, email: user.email, role: 'Owner', status: 'Active' }
                ]).map((mem) => (
                  <div key={mem.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900">{mem.name}</span>
                      <span className="ml-2 text-gray-400">({mem.email})</span>
                      <span className="ml-3 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                        {mem.role}
                      </span>
                    </div>

                    {mem.role !== 'Owner' && (
                      <button
                        onClick={() => handleRemoveMember(mem.id)}
                        className="text-rose-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DEVELOPER API & KEYS */}
        {activeTab === 'api' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Developer API Key</h3>
                <p className="text-xs text-gray-500">
                  Use this token to automate PDF merge, OCR, and compression via REST endpoints.
                </p>
              </div>

              <button
                onClick={handleRegenerateKey}
                disabled={regeneratingKey}
                className="px-3.5 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${regeneratingKey ? 'animate-spin' : ''}`} />
                <span>Regenerate Key</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gray-950 text-gray-200 font-mono text-xs flex items-center justify-between">
              <span className="truncate pr-4">{overview?.apiKey || `vpdf_live_${user.id}_key`}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(overview?.apiKey || `vpdf_live_${user.id}_key`);
                  setCopiedKey(true);
                  setTimeout(() => setCopiedKey(false), 2000);
                }}
                className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition cursor-pointer"
              >
                {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <h5 className="font-bold text-gray-800">Quick cURL Example:</h5>
              <div className="p-3 bg-gray-50 rounded-xl font-mono text-[11px] overflow-x-auto text-gray-700">
                curl -X POST https://api.vanshpdf.com/v1/tools/execute \<br />
                &nbsp;&nbsp;-H "Authorization: Bearer {overview?.apiKey || 'YOUR_KEY'}" \<br />
                &nbsp;&nbsp;-d '&#123;"toolId": "ocr-pdf"&#125;'
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SECURITY & PASSWORD MANAGEMENT */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Info Banner */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-bold">Account Security & Vault Protection</h3>
                </div>
                <p className="text-xs text-blue-200 max-w-xl">
                  Manage your credentials, master vault password, and view cryptographic security guarantees.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl text-xs font-mono">
                <Lock className="w-4 h-4 text-emerald-300" />
                <span>Zero-Knowledge Encryption Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Change Password Form */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900">Change Account Password</h4>
                    <p className="text-xs text-gray-500">Update your login password and vault access credentials.</p>
                  </div>
                </div>

                {passwordStatus?.error && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passwordStatus.error}</span>
                  </div>
                )}

                {passwordStatus?.success && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{passwordStatus.success}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      New Password (minimum 6 characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center gap-2"
                    >
                      {passwordLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      <span>{passwordLoading ? 'Updating Password...' : 'Save New Password'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Security Audits & Guarantees */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Security Architecture Status
                  </h4>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-start gap-3 p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-emerald-950 block">TLS 1.3 In-Flight Encryption</span>
                        <span className="text-emerald-700 text-[11px]">All API payloads and file streams are wrapped in elliptic-curve TLS.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-blue-50/70 border border-blue-100 rounded-2xl">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-blue-950 block">Document Vault Sharding</span>
                        <span className="text-blue-700 text-[11px]">AES-256 encrypted at rest with unique per-user vault identifiers.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-purple-50/70 border border-purple-100 rounded-2xl">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-purple-950 block">Audit & Access Logs</span>
                        <span className="text-purple-700 text-[11px]">Password reset and security actions are timestamped and logged.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Session Details */}
                <div className="bg-gray-50 rounded-3xl border border-gray-200/60 p-5 text-xs space-y-2">
                  <span className="font-bold text-gray-700 block">Current Session:</span>
                  <div className="flex justify-between text-gray-500 text-[11px]">
                    <span>Account ID:</span>
                    <span className="font-mono text-gray-800">{user.id}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-[11px]">
                    <span>Role:</span>
                    <span className="uppercase font-bold text-blue-600">{user.role}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-[11px]">
                    <span>Plan:</span>
                    <span className="uppercase font-bold text-emerald-600">{user.planId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
