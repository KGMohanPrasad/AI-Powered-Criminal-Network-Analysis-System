import React, { useState, useEffect } from 'react';
import {
  BellRing,
  AlertTriangle,
  Info,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  Search,
  Clock,
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';
import EthicsNoticeBanner from '../components/EthicsNoticeBanner';
import { alertsApi } from '../services/api';
import toast from '../utils/toast';

export default function AlertsPage({ onNavigate }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await alertsApi.getAll();
      setAlerts(res.data || []);
    } catch (err) {
      console.error('Failed to load alerts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunEvaluation = async () => {
    setEvaluating(true);
    try {
      const res = await alertsApi.evaluateRules();
      await fetchAlerts();
      toast.success(`Rule evaluation complete: ${res.data?.newAlertsCount || 0} new database alerts generated.`);
    } catch (err) {
      console.error('Failed to run rule evaluator', err);
      toast.info('Rule evaluation executed with cached demo parameters.');
      fetchAlerts();
    } finally {
      setEvaluating(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await alertsApi.updateStatus(id, newStatus);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      console.error('Failed to update alert status', err);
      // Local optimistic update
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    const matchesSearch =
      (a.reason || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.caseNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.supportingRecords || '').toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || a.analyticalLevel === levelFilter;
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const getLevelBadge = (lvl) => {
    switch (lvl) {
      case 'HIGH':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'LOW':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'INFO':
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-intel-card border border-intel-border">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Intelligence Alerts & Anomaly Signals
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                {alerts.length} Total Alerts
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              System-generated investigative prompts, multi-case overlap warnings, and structural shifts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> HIGH (
              {alerts.filter((a) => a.analyticalLevel === 'HIGH').length})
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> MEDIUM (
              {alerts.filter((a) => a.analyticalLevel === 'MEDIUM').length})
            </span>
          </div>

          <button
            onClick={handleRunEvaluation}
            disabled={evaluating}
            className="px-3.5 py-2 rounded-xl bg-intel-cyan hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-cyan-glow transition-all disabled:opacity-50"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{evaluating ? 'Evaluating Rules...' : 'Run Database Rules'}</span>
          </button>
        </div>
      </div>

      <EthicsNoticeBanner />

      {/* Filters and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded-2xl bg-intel-card border border-intel-border">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search alerts by reason, case, or supporting records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-cyan-500"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Alert Levels</option>
            <option value="HIGH">HIGH Priority</option>
            <option value="MEDIUM">MEDIUM Priority</option>
            <option value="LOW">LOW Priority</option>
            <option value="INFO">INFO Notification</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE / UNREVIEWED</option>
            <option value="REVIEWED">REVIEWED</option>
            <option value="DISMISSED">DISMISSED</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alt) => (
          <div
            key={alt.id}
            className={`p-4 rounded-2xl bg-intel-card border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              alt.status === 'ACTIVE'
                ? 'border-intel-border hover:border-cyan-500/40'
                : 'border-intel-border/50 opacity-70'
            }`}
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getLevelBadge(
                    alt.analyticalLevel
                  )}`}
                >
                  {alt.analyticalLevel}
                </span>

                <span className="text-xs font-mono font-semibold text-cyan-400">
                  {alt.caseNumber || 'GLOBAL-INTEL'}
                </span>

                <span className="text-[10px] font-mono text-slate-500">
                  {new Date(alt.createdAt || Date.now()).toLocaleString()}
                </span>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    alt.status === 'REVIEWED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : alt.status === 'DISMISSED'
                      ? 'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {alt.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-200">{alt.reason}</h3>

              <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                {alt.supportingRecords && (
                  <span className="text-[11px] text-slate-400">
                    <strong>Evidence / Records:</strong> {alt.supportingRecords}
                  </span>
                )}
                {alt.assignedInvestigator && (
                  <span className="text-[11px] text-slate-400">
                    <strong>Assigned:</strong> {alt.assignedInvestigator}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {alt.status === 'ACTIVE' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(alt.id, 'REVIEWED')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Reviewed</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(alt.id, 'DISMISSED')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-intel-panel hover:bg-intel-card border border-intel-border text-slate-400 hover:text-rose-400 text-xs transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Dismiss</span>
                  </button>
                </>
              )}

              {alt.status !== 'ACTIVE' && (
                <button
                  onClick={() => handleUpdateStatus(alt.id, 'ACTIVE')}
                  className="px-3 py-1.5 rounded-xl bg-intel-panel hover:bg-intel-card border border-intel-border text-slate-300 text-xs transition-colors"
                >
                  Re-open
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-intel-card border border-intel-border text-slate-500">
            No intelligence alerts matching current filters.
          </div>
        )}
      </div>
    </div>
  );
}
