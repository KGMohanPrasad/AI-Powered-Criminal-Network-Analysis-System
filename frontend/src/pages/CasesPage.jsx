import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Plus,
  Filter,
  Eye,
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  X
} from 'lucide-react';
import { casesApi } from '../services/api';

export default function CasesPage({ onNavigate }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Case Form
  const [formData, setFormData] = useState({
    title: '',
    caseType: 'Commercial Theft',
    leadInvestigator: 'Marcus Holloway',
    priority: 'HIGH',
    status: 'NEW',
    incidentDate: '2026-09-29',
    incidentLocation: 'North Docklands Terminal 4',
    assignedTeam: 'Alpha Tactical Team',
    description: '',
    notes: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadCases = async () => {
    setLoading(true);
    try {
      const res = await casesApi.getAll();
      if (res.success) {
        setCases(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  const handleCreateCase = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Case title is required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await casesApi.create(formData);
      if (res.success) {
        setShowCreateModal(false);
        setFormData({
          title: '',
          caseType: 'Commercial Theft',
          leadInvestigator: 'Marcus Holloway',
          priority: 'HIGH',
          status: 'NEW',
          incidentDate: '2026-09-29',
          incidentLocation: 'North Docklands Terminal 4',
          assignedTeam: 'Alpha Tactical Team',
          description: '',
          notes: ''
        });
        loadCases();
      }
    } catch (err) {
      setFormError(err.message || 'Failed to create case');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCases = cases.filter(c => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.caseNumber.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.caseType.toLowerCase().includes(q) ||
        c.leadInvestigator.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getPriorityBadge = (prio) => {
    switch (prio) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30">LOW</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">ACTIVE</span>;
      case 'UNDER_INVESTIGATION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">UNDER INVESTIGATION</span>;
      case 'REVIEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">REVIEW</span>;
      case 'CLOSED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-600/30 text-slate-400 border border-slate-600">CLOSED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">{status}</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-intel-cyan uppercase tracking-wider mb-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Case Management Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Investigation Dossiers
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage active investigations, track suspect involvement, evidentiary chain of custody, and case closure states.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 shadow-cyan-glow flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Investigation Case</span>
        </button>
      </div>

      {/* Filter and Search Bar (Section 33) */}
      <div className="p-4 rounded-2xl bg-intel-card border border-intel-border shadow-subtle flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-intel-cyan absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cases by number, title, category, lead..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-intel-panel border border-intel-border rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-intel-cyan"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-intel-panel border border-intel-border text-slate-300 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
            >
              <option value="ALL">All Statuses ({cases.length})</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="UNDER_INVESTIGATION">UNDER INVESTIGATION</option>
              <option value="REVIEW">REVIEW</option>
              <option value="ON_HOLD">ON HOLD</option>
              <option value="CLOSED">CLOSED</option>
              <option value="NEW">NEW</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-intel-panel border border-intel-border text-slate-300 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
        </div>
      </div>

      {/* Case Table (Section 14) */}
      <div className="rounded-2xl bg-intel-card border border-intel-border shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-intel-border bg-intel-panel/60 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-3.5 pl-5">Case Number</th>
                <th className="p-3.5">Case Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Lead Investigator</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Incident Date</th>
                <th className="p-3.5">Suspects / Evidence</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-intel-border/40 text-slate-300 font-sans">
              {filteredCases.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-intel-panel/30 transition-colors group cursor-pointer"
                  onClick={() => onNavigate('case-workspace', c.caseNumber)}
                >
                  <td className="p-3.5 pl-5 font-mono font-bold text-intel-cyan">
                    {c.caseNumber}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-100 max-w-xs truncate">
                    {c.title}
                  </td>
                  <td className="p-3.5 text-slate-400">
                    {c.caseType}
                  </td>
                  <td className="p-3.5 text-slate-300">
                    {c.leadInvestigator}
                  </td>
                  <td className="p-3.5">
                    {getPriorityBadge(c.priority)}
                  </td>
                  <td className="p-3.5">
                    {getStatusBadge(c.status)}
                  </td>
                  <td className="p-3.5 font-mono text-slate-400">
                    {c.incidentDate || '2026-01-14'}
                  </td>
                  <td className="p-3.5 font-mono">
                    <span className="text-cyan-400 font-bold">{c.associatedPersonsCount || 4}</span> pers / <span className="text-emerald-400 font-bold">{c.evidenceCount || 3}</span> evid
                  </td>
                  <td className="p-3.5 pr-5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('case-workspace', c.caseNumber);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-intel-cyan/10 hover:bg-intel-cyan/20 text-intel-cyan border border-intel-cyan/30 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Workspace</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCases.length === 0 && (
          <div className="py-12 text-center text-xs text-slate-400">
            No active investigation cases matched the current search filters.
          </div>
        )}
      </div>

      {/* CREATE CASE MODAL (Section 15) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-intel-card border border-intel-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-intel-border bg-intel-panel/50">
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-5 h-5 text-intel-cyan" />
                <h3 className="text-sm font-bold text-slate-100">
                  Register New Investigation Case
                </h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateCase} className="p-6 space-y-4 overflow-y-auto text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Case Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Organized Property Theft Investigation"
                  className="w-full px-3 py-2 rounded-xl bg-intel-panel border border-intel-border text-slate-100 focus:outline-none focus:border-intel-cyan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Crime Category</label>
                  <select
                    value={formData.caseType}
                    onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-panel border border-intel-border text-slate-200 focus:outline-none"
                  >
                    <option value="Commercial Theft">Commercial Theft</option>
                    <option value="Financial Fraud">Financial Fraud</option>
                    <option value="Vehicle Theft">Vehicle Theft</option>
                    <option value="Cyber Fraud">Cyber Fraud</option>
                    <option value="Contraband Diversion">Contraband Diversion</option>
                    <option value="Public Procurement Fraud">Public Procurement Fraud</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Lead Investigator</label>
                  <input
                    type="text"
                    required
                    value={formData.leadInvestigator}
                    onChange={(e) => setFormData({ ...formData, leadInvestigator: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-panel border border-intel-border text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-panel border border-intel-border text-slate-200 focus:outline-none"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Incident Date</label>
                  <input
                    type="date"
                    value={formData.incidentDate}
                    onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-panel border border-intel-border text-slate-100 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Primary Incident Location</label>
                <input
                  type="text"
                  value={formData.incidentLocation}
                  onChange={(e) => setFormData({ ...formData, incidentLocation: e.target.value })}
                  placeholder="e.g. North Docklands Terminal 4"
                  className="w-full px-3 py-2 rounded-xl bg-intel-panel border border-intel-border text-slate-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Brief Operational Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of criminal network indicators observed..."
                  className="w-full px-3 py-2 rounded-xl bg-intel-panel border border-intel-border text-slate-100 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-intel-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-intel-panel text-slate-300 hover:bg-intel-border transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-900 font-bold shadow-cyan-glow hover:from-cyan-300 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Generating Case ID...' : 'Initialize Case Dossier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
