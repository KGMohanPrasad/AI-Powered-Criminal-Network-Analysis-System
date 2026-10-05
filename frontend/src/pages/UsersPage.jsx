import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Shield,
  UserPlus,
  KeyRound,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Search,
  Lock,
  Mail,
  Building,
  Phone,
  Clock,
  AlertTriangle,
  X,
  BadgeCheck
} from 'lucide-react';
import { usersApi } from '../services/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    badgeNumber: '',
    department: 'Special Investigations Directorate',
    role: 'ROLE_INVESTIGATOR',
    phone: '+1 (555) 019-2831',
    password: '',
    active: true,
  });
  const [formErrors, setFormErrors] = useState({});

  const [newPassword, setNewPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await usersApi.getAll();
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        u.fullName?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q) ||
        u.badgeNumber?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q);

      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const validateUserForm = () => {
    const errs = {};
    if (!formData.fullName?.trim()) errs.fullName = 'Full Name is required.';
    if (!formData.username?.trim()) errs.username = 'Username is required.';
    if (!formData.email?.trim() || !formData.email.includes('@')) {
      errs.email = 'Valid email address is required (e.g. investigator@agency.local).';
    }
    if (!selectedUser && (!formData.password || formData.password.length < 6)) {
      errs.password = 'Initial password must be at least 6 characters.';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!validateUserForm()) return;

    try {
      if (selectedUser) {
        await usersApi.update(selectedUser.id, formData);
        showToast('User account updated successfully.');
      } else {
        await usersApi.create(formData);
        showToast('User account created successfully.');
      }
      setIsFormModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Error saving user:', err);
      showToast('Error saving user account.');
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await usersApi.toggleStatus(user.id, !user.active);
      showToast(`User ${user.username} ${user.active ? 'deactivated' : 'activated'}.`);
      fetchUsers();
    } catch (err) {
      console.error('Error toggling user status:', err);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('Password must be at least 6 characters.');
      return;
    }

    try {
      await usersApi.resetPassword(selectedUser.id, newPassword);
      showToast(`Password reset successfully for ${selectedUser.username}.`);
      setIsPasswordModalOpen(false);
      setSelectedUser(null);
      setNewPassword('');
    } catch (err) {
      console.error('Error resetting password:', err);
      showToast('Failed to reset password.');
    }
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setFormData({
      username: '',
      fullName: '',
      email: '',
      badgeNumber: 'BADGE-INV-' + Math.floor(10 + Math.random() * 89),
      department: 'Special Investigations Directorate',
      role: 'ROLE_INVESTIGATOR',
      phone: '+1 (555) 019-2831',
      password: 'Password@123',
      active: true,
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const openEditModal = (u) => {
    setSelectedUser(u);
    setFormData({
      username: u.username,
      fullName: u.fullName,
      email: u.email,
      badgeNumber: u.badgeNumber || '',
      department: u.department || '',
      role: u.role || 'ROLE_INVESTIGATOR',
      phone: u.phone || '',
      password: '',
      active: u.active,
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'ROLE_INVESTIGATOR':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'ROLE_ANALYST':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'ROLE_VIEWER':
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <BadgeCheck className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Security Directorate & RBAC Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            User Management & Access Control
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Administer investigator credentials, RBAC clearances (Admin, Investigator, Analyst, Viewer), and credentials.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 shadow-cyan-glow flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create User</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-intel-card border border-intel-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, username, badge, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-intel-base border border-intel-border text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-mono">Role Clearance:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-intel-base border border-intel-border text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="ALL">All Roles</option>
            <option value="ROLE_ADMIN">ADMIN (Full Control)</option>
            <option value="ROLE_INVESTIGATOR">INVESTIGATOR (Cases & Evidence)</option>
            <option value="ROLE_ANALYST">ANALYST (Graph Analytics)</option>
            <option value="ROLE_VIEWER">VIEWER (Read-Only)</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-intel-border bg-intel-card overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-intel-panel text-slate-400 font-mono uppercase tracking-wider text-[11px] border-b border-intel-border">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Employee ID (Badge)</th>
                <th className="py-3.5 px-4">Contact & Department</th>
                <th className="py-3.5 px-4">Role Clearance</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-intel-border/60">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="py-4 px-4">
                      <div className="h-6 bg-intel-panel rounded-lg w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-intel-panel/50 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold font-mono text-xs">
                          {u.fullName?.charAt(0) || u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100">{u.fullName}</div>
                          <div className="text-[11px] font-mono text-slate-400">@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400 font-medium whitespace-nowrap">
                      {u.badgeNumber || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-slate-200">{u.email}</div>
                      <div className="text-[11px] text-slate-400">{u.department}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${getRoleBadge(u.role)}`}>
                        {u.role.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono border transition-all ${
                          u.active
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30'
                        }`}
                        title="Click to toggle active status"
                      >
                        {u.active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{u.active ? 'ACTIVE' : 'DEACTIVATED'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Recent Session'}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setNewPassword('');
                            setIsPasswordModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-intel-panel border border-transparent hover:border-intel-border transition-colors"
                          title="Reset Password"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-intel-panel border border-transparent hover:border-intel-border transition-colors"
                          title="Edit User"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Create / Edit Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-intel-card border border-intel-border p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-intel-border">
              <h3 className="text-base font-bold text-slate-100">
                {selectedUser ? `Edit User: ${selectedUser.username}` : 'Create Investigation User'}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-intel-panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Inspector Marcus Holloway"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-base border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                  {formErrors.fullName && <p className="text-rose-400 text-[10px] mt-0.5">{formErrors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    disabled={!!selectedUser}
                    placeholder="e.g. mholloway"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-base border border-intel-border text-slate-200 disabled:opacity-50 focus:outline-none focus:border-cyan-500/50"
                  />
                  {formErrors.username && <p className="text-rose-400 text-[10px] mt-0.5">{formErrors.username}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="investigator@agency.local"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-base border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                  {formErrors.email && <p className="text-rose-400 text-[10px] mt-0.5">{formErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Badge / Employee ID</label>
                  <input
                    type="text"
                    placeholder="e.g. BADGE-INV-44"
                    value={formData.badgeNumber}
                    onChange={(e) => setFormData({ ...formData, badgeNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-base border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="Organized Crime Division"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-base border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Role Clearance *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-base border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="ROLE_ADMIN">ADMIN (Full Access)</option>
                    <option value="ROLE_INVESTIGATOR">INVESTIGATOR (Cases & Evidence)</option>
                    <option value="ROLE_ANALYST">ANALYST (Network Analytics)</option>
                    <option value="ROLE_VIEWER">VIEWER (Read-Only)</option>
                  </select>
                </div>
              </div>

              {!selectedUser && (
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Initial Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-base border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                  {formErrors.password && <p className="text-rose-400 text-[10px] mt-0.5">{formErrors.password}</p>}
                </div>
              )}

              <div className="pt-3 border-t border-intel-border flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-intel-panel hover:bg-intel-border text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 shadow-cyan-glow"
                >
                  {selectedUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {isPasswordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-intel-card border border-intel-border p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Reset Password</h3>
                <p className="text-xs text-slate-400">User: {selectedUser.fullName} (@{selectedUser.username})</p>
              </div>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter new secure password (min 6 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-intel-base border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-intel-panel hover:bg-intel-border text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 shadow-lg"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
