import React, { useState } from 'react';
import {
  Users, UserPlus, Search, Edit2, Trash2, Eye,
  Shield, Check, X, RefreshCw, Key, Zap, KeyRound, Sparkles
} from 'lucide-react';

export function AdminUserManagerTab({ users, plans, onRefresh, getHeaders, showNotification, startImpersonation, onNavigateHome }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  // Modals state
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [resetTargetUser, setResetTargetUser] = useState(null);
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    planId: 'pro'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpenResetPassword = (u) => {
    setResetTargetUser(u);
    setAdminNewPassword('');
  };

  const handleGenerateRandomPass = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#%';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAdminNewPassword(pass);
  };

  const handleAdminResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!adminNewPassword || adminNewPassword.length < 6) {
      showNotification('Password must be at least 6 characters long.', 'error');
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${resetTargetUser.id}/reset-password`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ newPassword: adminNewPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        showNotification(data.error || 'Failed to reset password.', 'error');
      } else {
        showNotification(`Password for ${resetTargetUser.email} reset successfully!`, 'success');
        setResetTargetUser(null);
        setAdminNewPassword('');
        onRefresh && onRefresh();
      }
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (planFilter !== 'all' && u.planId !== planFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.id?.toLowerCase().includes(q)
    );
  });

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      planId: user.planId,
      planStatus: user.planStatus,
      extendDays: 0,
      resetDailyQuota: false
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(editForm)
      });
      const d = await res.json();
      if (res.ok) {
        showNotification(`✓ User ${d.email || editingUser.email} updated!`);
        setEditingUser(null);
        onRefresh();
      } else {
        alert(d.error || 'Failed to update user');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.role === 'admin') {
      alert('Cannot delete administrator accounts directly.');
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete user ${user.name} (${user.email})?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const d = await res.json();
      if (res.ok) {
        showNotification('User deleted from system.');
        onRefresh();
      } else {
        alert(d.error || 'Failed to delete user');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newUserForm)
      });
      const d = await res.json();
      if (res.ok) {
        showNotification(`✓ User account created for ${newUserForm.email}!`);
        setShowAddModal(false);
        setNewUserForm({ name: '', email: '', password: '', role: 'user', planId: 'pro' });
        onRefresh();
      } else {
        alert(d.error || 'Failed to create user');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImpersonate = (u) => {
    startImpersonation(u);
    onNavigateHome && onNavigateHome();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-gray-900">User Account Administration &amp; RBAC</h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage user roles, upgrade plans directly, reset quotas, or use one-click session impersonation.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-amber-400" />
          <span>+ Create New User</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="pl-8 pr-3 py-2 bg-white rounded-xl border border-gray-200 text-xs w-48 sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Regular Users</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold"
          >
            <option value="all">All Plans</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs font-bold text-gray-500">
          Showing {filteredUsers.length} of {users.length} Users
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Plan / Status</th>
                <th className="py-3 px-4">Usage (Today / Total)</th>
                <th className="py-3 px-4">Expires</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-gray-900">{u.name}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{u.email}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900 capitalize">{u.planId}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          u.planStatus === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {u.planStatus}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-gray-700">
                    {u.usage?.todayJobs || 0} / {u.usage?.totalJobs || 0} jobs
                  </td>

                  <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                    {u.planExpiresAt ? new Date(u.planExpiresAt).toLocaleDateString() : 'Never'}
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => handleOpenEdit(u)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs cursor-pointer inline-flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleOpenResetPassword(u)}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg text-xs cursor-pointer inline-flex items-center gap-1"
                      title="Reset user password"
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>Password</span>
                    </button>

                    <button
                      onClick={() => handleImpersonate(u)}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs cursor-pointer inline-flex items-center gap-1"
                      title="Act as this user"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Impersonate</span>
                    </button>

                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(u)}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs cursor-pointer"
                        title="Delete user"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h4 className="font-bold text-base text-gray-900">Edit User Account: {editingUser.email}</h4>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Role / Permissions</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  >
                    <option value="user">Regular User</option>
                    <option value="admin">Super Administrator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subscription Plan</label>
                  <select
                    value={editForm.planId}
                    onChange={(e) => setEditForm({ ...editForm, planId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 capitalize font-bold"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Plan Status</label>
                  <select
                    value={editForm.planStatus}
                    onChange={(e) => setEditForm({ ...editForm, planStatus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
                <span className="font-bold text-blue-950 block">Quick Administrative Actions</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Extend Access (Days)</label>
                    <select
                      value={editForm.extendDays}
                      onChange={(e) => setEditForm({ ...editForm, extendDays: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 rounded-lg border border-gray-200 bg-white"
                    >
                      <option value={0}>No extension</option>
                      <option value={30}>+30 Days</option>
                      <option value={90}>+90 Days</option>
                      <option value={365}>+1 Year (365 Days)</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-4">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700 text-[11px]">
                      <input
                        type="checkbox"
                        checked={editForm.resetDailyQuota}
                        onChange={(e) => setEditForm({ ...editForm, resetDailyQuota: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <span>Reset Today's Usage</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
              >
                Save User Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleCreateUser} className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h4 className="font-bold text-base text-gray-900">Create New User Account</h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="e.g. Alex Turner"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="e.g. alex@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  >
                    <option value="user">Regular User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Initial Plan</label>
                  <select
                    value={newUserForm.planId}
                    onChange={(e) => setNewUserForm({ ...newUserForm, planId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 capitalize font-bold"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admin Password Reset Modal */}
      {resetTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 sm:p-7 overflow-hidden">
            <button
              onClick={() => setResetTargetUser(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Reset User Password</h3>
                <p className="text-xs text-gray-500 font-mono">{resetTargetUser.email}</p>
              </div>
            </div>

            <form onSubmit={handleAdminResetPasswordSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700">New Password</label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomPass}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Strong Password</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={adminNewPassword}
                  onChange={(e) => setAdminNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 chars)"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  required
                  autoFocus
                />
              </div>

              <p className="text-[11px] text-gray-500 leading-relaxed bg-amber-50/60 border border-amber-200/60 p-3 rounded-xl">
                Changing this password takes effect immediately. The user will be able to log in with this new password and an audit log event will be created.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetTargetUser(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  {isProcessing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isProcessing ? 'Updating...' : 'Set Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
