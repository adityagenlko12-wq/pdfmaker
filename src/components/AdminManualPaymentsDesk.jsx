import React, { useState } from 'react';
import {
  CreditCard, CheckCircle2, XCircle, Download, Eye,
  Copy, Check, AlertTriangle, Search, Filter, ShieldCheck,
  UserCheck, ExternalLink, Calendar, RefreshCw, X
} from 'lucide-react';

export function AdminManualPaymentsDesk({ payments, onRefresh, getHeaders, showNotification, adminUsers, adminPlans }) {
  const [filterTab, setFilterTab] = useState('pending'); // 'all' | 'pending' | 'paid' | 'failed'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [rejectingPayment, setRejectingPayment] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Direct Grant Modal State
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [grantData, setGrantData] = useState({
    userId: adminUsers[0]?.id || '',
    planId: 'pro',
    durationDays: 365,
    notes: 'Direct administrative promotion'
  });

  const copyToClipboard = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const pendingPayments = payments.filter(
    (p) => p.status === 'pending' || p.status === 'pending_manual' || p.verificationStatus?.toLowerCase().includes('pending')
  );

  const filteredPayments = payments.filter((p) => {
    const isPending = p.status === 'pending' || p.status === 'pending_manual' || p.verificationStatus?.toLowerCase().includes('pending');
    if (filterTab === 'pending' && !isPending) return false;
    if (filterTab === 'paid' && p.status !== 'paid') return false;
    if (filterTab === 'failed' && p.status !== 'failed' && p.status !== 'rejected' && p.status !== 'refunded') return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.invoiceId?.toLowerCase().includes(q) ||
      p.orderId?.toLowerCase().includes(q) ||
      p.transactionId?.toLowerCase().includes(q) ||
      p.userEmail?.toLowerCase().includes(q) ||
      p.userName?.toLowerCase().includes(q) ||
      p.paymentData?.bankReference?.toLowerCase().includes(q) ||
      p.paymentData?.payerUpiOrAccount?.toLowerCase().includes(q)
    );
  });

  const handleApprove = async (paymentId) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/confirm`, {
        method: 'POST',
        headers: getHeaders()
      });
      const d = await res.json();
      if (res.ok) {
        showNotification('✓ Manual transfer verified & User plan immediately upgraded!');
        onRefresh();
      } else {
        alert(d.error || 'Failed to approve payment');
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectingPayment) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/payments/${rejectingPayment.id}/reject`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ reason: rejectReason || 'Payment proof verification unconfirmed' })
      });
      const d = await res.json();
      if (res.ok) {
        showNotification('Transfer order rejected and logged in security audit.');
        setRejectingPayment(null);
        setRejectReason('');
        onRefresh();
      } else {
        alert(d.error || 'Failed to reject payment');
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGrantPlan = async (e) => {
    e.preventDefault();
    if (!grantData.userId) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${grantData.userId}/grant-plan`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(grantData)
      });
      const d = await res.json();
      if (res.ok) {
        showNotification(`✓ Plan successfully granted to ${d.user?.email || 'user'}!`);
        setShowGrantModal(false);
        onRefresh();
      } else {
        alert(d.error || 'Failed to grant plan');
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Quick Grant Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent rounded-3xl border border-amber-200">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-base text-gray-900">
              Manual Transfer Reconciliation Desk
            </h3>
            {pendingPayments.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white animate-pulse">
                {pendingPayments.length} Action Needed
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Audit bank transfer UTRs, inspect uploaded payment receipts, verify bank wires, or grant complimentary access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGrantModal(true)}
            className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>+ Direct Grant Plan to User</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl text-xs font-bold w-fit">
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'pending' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>⚠️ Pending Verification</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-900">
              {pendingPayments.length}
            </span>
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              filterTab === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            All Orders ({payments.length})
          </button>
          <button
            onClick={() => setFilterTab('paid')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              filterTab === 'paid' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Paid &amp; Active
          </button>
          <button
            onClick={() => setFilterTab('failed')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              filterTab === 'failed' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Rejected / Refunded
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by UTR, Order, Email..."
            className="pl-8 pr-3 py-2 bg-white rounded-xl border border-gray-200 text-xs w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Order / Invoice</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Plan / Amount</th>
                <th className="py-3 px-4">UTR / Reference</th>
                <th className="py-3 px-4">Receipt Proof</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Reconciliation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    No orders match current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const isManual = p.gateway === 'manual';
                  const isPending = p.status === 'pending' || p.status === 'pending_manual';
                  const receiptUrl = p.paymentData?.receiptUrl;
                  const utr = p.paymentData?.bankReference || p.paymentData?.manualReference || p.transactionId;

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-gray-50/50 transition ${
                        isPending ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-gray-900 flex items-center gap-1">
                          <span>{p.invoiceId || p.orderId}</span>
                          <button
                            onClick={() => copyToClipboard(p.invoiceId || p.orderId, p.id + '_inv')}
                            className="text-gray-400 hover:text-gray-700"
                            title="Copy ID"
                          >
                            {copiedId === p.id + '_inv' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 capitalize">{p.gateway}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-gray-800">{p.userName}</p>
                        <p className="text-[11px] text-gray-400 font-mono">{p.userEmail}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900">${p.amount}</span>
                        <span className="ml-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
                          {p.planName || p.planId}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {utr ? (
                          <div className="flex items-center gap-1.5 font-mono text-gray-800 bg-gray-50 px-2 py-1 rounded-md border border-gray-200 w-fit">
                            <span className="font-bold">{utr}</span>
                            <button
                              onClick={() => copyToClipboard(utr, p.id + '_utr')}
                              className="text-gray-400 hover:text-gray-700"
                              title="Copy UTR"
                            >
                              {copiedId === p.id + '_utr' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 font-mono text-[11px]">—</span>
                        )}
                        {p.paymentData?.payerUpiOrAccount && (
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            From: {p.paymentData.payerUpiOrAccount}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {receiptUrl ? (
                          <button
                            onClick={() => setSelectedReceipt({ url: receiptUrl, p })}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg border border-amber-200 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Proof</span>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-[11px]">No file attached</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            p.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isPending
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {p.status === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                          {isPending && <AlertTriangle className="w-3 h-3" />}
                          <span>{p.verificationStatus || p.status.toUpperCase()}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => handleApprove(p.id)}
                              disabled={isProcessing}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer inline-flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Approve &amp; Upgrade</span>
                            </button>
                            <button
                              onClick={() => setRejectingPayment(p)}
                              disabled={isProcessing}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 cursor-pointer inline-flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </>
                        ) : (
                          <a
                            href={`/api/admin/invoices/${p.orderId || p.id}/download`}
                            download
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs inline-flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Tax Invoice</span>
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full-Screen Receipt Inspection Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="font-bold text-base text-gray-900">Payment Screenshot / Transfer Proof</h4>
                <p className="text-xs text-gray-500">
                  Order {selectedReceipt.p.invoiceId || selectedReceipt.p.orderId} • {selectedReceipt.p.userName} (${selectedReceipt.p.amount})
                </p>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-auto flex-1 flex items-center justify-center bg-gray-50 rounded-2xl p-2 border border-gray-200">
              {selectedReceipt.url.startsWith('data:image') || selectedReceipt.url.startsWith('http') ? (
                <img
                  src={selectedReceipt.url}
                  alt="Transfer receipt"
                  className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-xs"
                />
              ) : (
                <div className="text-center p-8">
                  <p className="font-bold text-gray-700 mb-2">Attached Document (PDF / Binary)</p>
                  <a
                    href={selectedReceipt.url}
                    download="payment_proof.pdf"
                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Attached File</span>
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={selectedReceipt.url}
                download="payment_receipt.png"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs inline-flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Save Full Image</span>
              </a>

              {selectedReceipt.p.status === 'pending' || selectedReceipt.p.status === 'pending_manual' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const id = selectedReceipt.p.id;
                      setSelectedReceipt(null);
                      handleApprove(id);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Wire Transfer</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Reject Payment Reason Modal */}
      {rejectingPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-gray-900">Reject Bank Transfer</h4>
                <p className="text-xs text-gray-500">Order {rejectingPayment.invoiceId || rejectingPayment.orderId}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">Rejection Reason for User Notification</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. UTR reference not reflected in bank statement, or amount received was insufficient."
                rows="3"
                className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingPayment(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Grant Plan Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleGrantPlan} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-amber-500" />
                <h4 className="font-bold text-base text-gray-900">Directly Grant SaaS Plan</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowGrantModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Target User</label>
                <select
                  value={grantData.userId}
                  onChange={(e) => setGrantData({ ...grantData, userId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
                  required
                >
                  <option value="">-- Choose User --</option>
                  {adminUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email}) — Current: {u.planId}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Plan Tier</label>
                  <select
                    value={grantData.planId}
                    onChange={(e) => setGrantData({ ...grantData, planId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
                  >
                    {adminPlans.map((pl) => (
                      <option key={pl.id} value={pl.id}>
                        {pl.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Duration (Days)</label>
                  <select
                    value={grantData.durationDays}
                    onChange={(e) => setGrantData({ ...grantData, durationDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
                  >
                    <option value={30}>30 Days (1 Month)</option>
                    <option value={90}>90 Days (Quarterly)</option>
                    <option value={365}>365 Days (1 Year)</option>
                    <option value={3650}>Lifetime (10 Years)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Administrative Note / Reason</label>
                <input
                  type="text"
                  value={grantData.notes}
                  onChange={(e) => setGrantData({ ...grantData, notes: e.target.value })}
                  placeholder="e.g. VIP Partnership, Offline Wire Settlement, or Support Courtesy"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowGrantModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
              >
                Grant Subscription Now
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
