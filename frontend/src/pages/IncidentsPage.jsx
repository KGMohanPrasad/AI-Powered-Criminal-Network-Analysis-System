import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Calendar,
  MapPin,
  Briefcase,
  Users,
  FileText,
  X,
  Eye,
  CheckCircle2
} from 'lucide-react';
import EthicsNoticeBanner from '../components/EthicsNoticeBanner';
import { incidentsApi, casesApi } from '../services/api';
import { toast } from '../utils/toast';

export default function IncidentsPage({ onNavigate }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [newIncident, setNewIncident] = useState({
    incidentId: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
    incidentType: 'Theft',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    location: 'Central Logistics Hub, Dock 4',
    description: '',
    relatedCase: 'CASE-2026-0001',
    personsInvolved: 'DEMO-P001, DEMO-P002',
    witnesses: 'Security Guard R. Nair',
    status: 'ACTIVE',
  });

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await incidentsApi.getAll();
      setIncidents(res.data || []);
    } catch (err) {
      console.error('Failed to load incidents', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await incidentsApi.create(newIncident);
      setIncidents((prev) => [res.data || newIncident, ...prev]);
      setShowModal(false);
      toast.success('Synthetic incident created successfully.');
    } catch (err) {
      setIncidents((prev) => [newIncident, ...prev]);
      setShowModal(false);
      toast.info('Synthetic incident added to local view.');
    }
  };

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      (inc.incidentId || '').toLowerCase().includes(search.toLowerCase()) ||
      (inc.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (inc.location || '').toLowerCase().includes(search.toLowerCase()) ||
      (inc.relatedCase || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || inc.incidentType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CLOSED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'UNDER_INVESTIGATION':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'ACTIVE':
      default:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-intel-card border border-intel-border">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Incident Registry & Pattern Tracking
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                {incidents.length} Recorded
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Synthetic offense reports, temporal markers, and multi-case incident linkages.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-cyan-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Report Synthetic Incident</span>
        </button>
      </div>

      <EthicsNoticeBanner />

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded-2xl bg-intel-card border border-intel-border">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Incident ID, location, case, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-cyan-500"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Theft">Theft</option>
            <option value="Fraud">Fraud</option>
            <option value="Cyber">Cyber</option>
            <option value="Vehicle Theft">Vehicle Theft</option>
            <option value="Smuggling">Smuggling</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="UNDER_INVESTIGATION">UNDER_INVESTIGATION</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>
      </div>

      {/* Incidents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIncidents.map((inc) => (
          <div
            key={inc.id || inc.incidentId}
            className="p-4 rounded-2xl bg-intel-card border border-intel-border hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-rose-400">
                  {inc.incidentId}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${getStatusBadge(
                    inc.status
                  )}`}
                >
                  {inc.status}
                </span>
              </div>

              <div className="text-sm font-bold text-slate-100 flex items-center justify-between">
                <span>{inc.incidentType}</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {inc.time || '12:00'}
                </span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2">{inc.description}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-intel-border/60 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{inc.location}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{inc.date}</span>
                </span>
                <span className="font-mono text-cyan-400">{inc.relatedCase || 'Unlinked'}</span>
              </div>

              {inc.personsInvolved && (
                <div className="text-[10px] text-slate-500 font-mono truncate">
                  Entities: {inc.personsInvolved}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredIncidents.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-intel-card border border-intel-border text-slate-500">
          No synthetic incidents found matching your criteria.
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-intel-card border border-intel-border shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-intel-border pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Log Synthetic Incident
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Incident ID
                  </label>
                  <input
                    type="text"
                    required
                    value={newIncident.incidentId}
                    onChange={(e) =>
                      setNewIncident({ ...newIncident, incidentId: e.target.value })
                    }
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 font-mono outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Category
                  </label>
                  <select
                    value={newIncident.incidentType}
                    onChange={(e) =>
                      setNewIncident({ ...newIncident, incidentType: e.target.value })
                    }
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                  >
                    <option value="Theft">Theft</option>
                    <option value="Fraud">Fraud</option>
                    <option value="Cyber">Cyber</option>
                    <option value="Vehicle Theft">Vehicle Theft</option>
                    <option value="Smuggling">Smuggling</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={newIncident.location}
                  onChange={(e) =>
                    setNewIncident({ ...newIncident, location: e.target.value })
                  }
                  className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Incident Description *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detailed synthetic incident narrative..."
                  value={newIncident.description}
                  onChange={(e) =>
                    setNewIncident({ ...newIncident, description: e.target.value })
                  }
                  className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Related Case
                  </label>
                  <input
                    type="text"
                    value={newIncident.relatedCase}
                    onChange={(e) =>
                      setNewIncident({ ...newIncident, relatedCase: e.target.value })
                    }
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 font-mono outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Witnesses
                  </label>
                  <input
                    type="text"
                    value={newIncident.witnesses}
                    onChange={(e) =>
                      setNewIncident({ ...newIncident, witnesses: e.target.value })
                    }
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-intel-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-intel-panel border border-intel-border text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-cyan-glow"
                >
                  Save Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
