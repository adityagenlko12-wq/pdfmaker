import React, { useState } from 'react';
import {
  FileText, Sparkles, Plus, Trash2, Check, X,
  Save, AlertCircle, Layers, CheckCircle2
} from 'lucide-react';

export function AdminPlanManagerTab({ plans, onRefresh, getHeaders, showNotification }) {
  const [editingPlans, setEditingPlans] = useState(() => {
    const map = {};
    (plans || []).forEach((p) => {
      map[p.id] = {
        name: p.name,
        priceMonthly: p.priceMonthly ?? p.price ?? 0,
        priceYearly: p.priceYearly ?? p.annualPrice ?? 0,
        dailyQuota: p.dailyQuota ?? p.limits?.dailyOperations ?? 50,
        maxFileSizeMB: p.limits?.maxFileSizeMB ?? 50,
        isPopular: Boolean(p.isPopular),
        features: Array.isArray(p.features) ? [...p.features] : []
      };
    });
    return map;
  });

  const [savingPlanId, setSavingPlanId] = useState(null);
  const [newFeatureText, setNewFeatureText] = useState({});

  // Create Custom Plan Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlanForm, setNewPlanForm] = useState({
    id: '',
    name: '',
    priceMonthly: 19,
    priceYearly: 190,
    dailyQuota: 100,
    maxFileSizeMB: 100,
    isPopular: false,
    features: ['High-speed batch processing', 'No watermark', 'Priority 24/7 email support']
  });

  const handleFieldChange = (planId, field, value) => {
    setEditingPlans((prev) => ({
      ...prev,
      [planId]: {
        ...(prev[planId] || {}),
        [field]: value
      }
    }));
  };

  const handleAddFeature = (planId) => {
    const text = (newFeatureText[planId] || '').trim();
    if (!text) return;
    setEditingPlans((prev) => {
      const cur = prev[planId] || {};
      return {
        ...prev,
        [planId]: {
          ...cur,
          features: [...(cur.features || []), text]
        }
      };
    });
    setNewFeatureText((prev) => ({ ...prev, [planId]: '' }));
  };

  const handleRemoveFeature = (planId, idx) => {
    setEditingPlans((prev) => {
      const cur = prev[planId] || {};
      const updated = [...(cur.features || [])];
      updated.splice(idx, 1);
      return {
        ...prev,
        [planId]: { ...cur, features: updated }
      };
    });
  };

  const handleSavePlan = async (planId) => {
    const data = editingPlans[planId];
    if (!data) return;
    setSavingPlanId(planId);
    try {
      const res = await fetch(`/api/admin/plans/${planId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (res.ok) {
        showNotification(`✓ Plan "${data.name}" saved and live across system!`);
        onRefresh();
      } else {
        alert(result.error || 'Failed to update plan');
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setSavingPlanId(null);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!confirm(`Are you sure you want to permanently delete plan "${planId}"?`)) return;
    try {
      const res = await fetch(`/api/admin/plans/${planId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const result = await res.json();
      if (res.ok) {
        showNotification(`Plan deleted.`);
        onRefresh();
      } else {
        alert(result.error || 'Failed to delete plan');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newPlanForm)
      });
      const result = await res.json();
      if (res.ok) {
        showNotification(`✓ New plan "${newPlanForm.name}" created!`);
        setShowCreateModal(false);
        setNewPlanForm({
          id: '',
          name: '',
          priceMonthly: 19,
          priceYearly: 190,
          dailyQuota: 100,
          maxFileSizeMB: 100,
          isPopular: false,
          features: ['High-speed batch processing', 'No watermark', 'Priority 24/7 email support']
        });
        onRefresh();
      } else {
        alert(result.error || 'Failed to create plan');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-gray-900">SaaS Subscription Plans &amp; Pricing Control</h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time control over monthly prices, annual discounts, daily operations quotas, and feature tiering.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>+ Add Custom Plan Tier</span>
        </button>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((pl) => {
          const form = editingPlans[pl.id] || {
            name: pl.name,
            priceMonthly: pl.priceMonthly ?? pl.price ?? 0,
            priceYearly: pl.priceYearly ?? pl.annualPrice ?? 0,
            dailyQuota: pl.dailyQuota ?? 50,
            maxFileSizeMB: pl.limits?.maxFileSizeMB ?? 50,
            isPopular: Boolean(pl.isPopular),
            features: pl.features || []
          };

          return (
            <div
              key={pl.id}
              className={`p-6 bg-white rounded-3xl border shadow-sm space-y-4 flex flex-col justify-between transition ${
                form.isPopular ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-gray-200'
              }`}
            >
              <div className="space-y-4 text-xs">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      ID: {pl.id}
                    </span>
                    {form.isPopular && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-900">
                        Popular
                      </span>
                    )}
                  </div>

                  {pl.id !== 'free' && pl.id !== 'pro' && (
                    <button
                      onClick={() => handleDeletePlan(pl.id)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Plan Name */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleFieldChange(pl.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold text-gray-900"
                  />
                </div>

                {/* Pricing Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Monthly ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.priceMonthly}
                      onChange={(e) => handleFieldChange(pl.id, 'priceMonthly', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Annual ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.priceYearly}
                      onChange={(e) => handleFieldChange(pl.id, 'priceYearly', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
                    />
                  </div>
                </div>

                {/* Quotas */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Daily Operations</label>
                    <input
                      type="number"
                      value={form.dailyQuota}
                      onChange={(e) => handleFieldChange(pl.id, 'dailyQuota', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Max File (MB)</label>
                    <input
                      type="number"
                      value={form.maxFileSizeMB}
                      onChange={(e) => handleFieldChange(pl.id, 'maxFileSizeMB', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id={`popular_${pl.id}`}
                    checked={form.isPopular}
                    onChange={(e) => handleFieldChange(pl.id, 'isPopular', e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                  />
                  <label htmlFor={`popular_${pl.id}`} className="font-semibold text-gray-700 cursor-pointer">
                    Highlight as "Most Popular"
                  </label>
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <label className="block font-bold text-gray-700">Features Checklist</label>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {(form.features || []).map((feat, idx) => (
                      <div key={idx} className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg text-[11px]">
                        <span className="truncate pr-2">• {feat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(pl.id, idx)}
                          className="text-gray-400 hover:text-rose-600 p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      value={newFeatureText[pl.id] || ''}
                      onChange={(e) => setNewFeatureText((prev) => ({ ...prev, [pl.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature(pl.id);
                        }
                      }}
                      placeholder="Add bullet point..."
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddFeature(pl.id)}
                      className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-bold text-[11px] cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Plan Button */}
              <button
                type="button"
                onClick={() => handleSavePlan(pl.id)}
                disabled={savingPlanId === pl.id}
                className="w-full mt-4 py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>{savingPlanId === pl.id ? 'Saving Plan...' : 'Save Plan Changes'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Create Plan Tier Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleCreatePlan} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h4 className="font-bold text-base text-gray-900">Create New Custom SaaS Tier</h4>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Plan Identifier (ID)</label>
                  <input
                    type="text"
                    value={newPlanForm.id}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '_') })}
                    placeholder="e.g. student_plan"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={newPlanForm.name}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, name: e.target.value })}
                    placeholder="e.g. Student Special"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Monthly Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPlanForm.priceMonthly}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, priceMonthly: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Annual Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPlanForm.priceYearly}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, priceYearly: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Daily Operations Quota</label>
                  <input
                    type="number"
                    value={newPlanForm.dailyQuota}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, dailyQuota: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Max File Size (MB)</label>
                  <input
                    type="number"
                    value={newPlanForm.maxFileSizeMB}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, maxFileSizeMB: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
              >
                Publish New Plan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
