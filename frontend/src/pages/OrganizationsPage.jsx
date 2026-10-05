import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Filter,
  Plus,
  MapPin,
  Briefcase,
  Users,
  Shield,
  Eye,
  X,
  ExternalLink,
  Layers
} from 'lucide-react';
import EthicsNoticeBanner from '../components/EthicsNoticeBanner';
import { organizationsApi } from '../services/api';
import { toast } from '../utils/toast';

export default function OrganizationsPage({ onNavigate }) {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [newOrg, setNewOrg] = useState({
    name: '',
    type: 'Logistics Front',
    location: 'North Port Container Terminal',
    status: 'ACTIVE_INVESTIGATION',
    associatedPersons: 'DEMO-P001, DEMO-P004',
    associatedCases: 'CASE-2026-0001',
    description: 'Fictional commercial entity used for freight routing.',
  });

  useEffect(() => {
    fetchOrgs();
  }, []);

  const fetchOrgs = async () => {
    setLoading(true);
    try {
      const res = await organizationsApi.getAll();
      setOrgs(res.data || []);
    } catch (err) {
      console.error('Failed to load organizations', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await organizationsApi.create(newOrg);
      setOrgs((prev) => [res.data || newOrg, ...prev]);
      setShowModal(false);
      toast.success('Synthetic organization registered.');
    } catch (err) {
      setOrgs((prev) => [newOrg, ...prev]);
      setShowModal(false);
      toast.info('Synthetic organization added to local view.');
    }
  };

  const filteredOrgs = orgs.filter((org) => {
    const matchesSearch =
      (org.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (org.location || '').toLowerCase().includes(search.toLowerCase()) ||
      (org.type || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || org.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-intel-card border border-intel-border">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Corporate & Commercial Entity Directory
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                {orgs.length} Fictional Orgs
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Synthetic commercial fronts, shell companies, and registered holding networks.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-cyan-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Register Organization</span>
        </button>
      </div>

      <EthicsNoticeBanner />

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded-2xl bg-intel-card border border-intel-border">
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search organizations by name, registration location, or sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-cyan-500"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Entity Types</option>
            <option value="Logistics Front">Logistics Front</option>
            <option value="Shell Corporation">Shell Corporation</option>
            <option value="Financial Consulting">Financial Consulting</option>
            <option value="Automotive Workshop">Automotive Workshop</option>
            <option value="Import/Export">Import/Export</option>
          </select>
        </div>
      </div>

      {/* Grid of Orgs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrgs.map((org) => (
          <div
            key={org.id || org.name}
            className="p-4 rounded-2xl bg-intel-card border border-intel-border hover:border-cyan-500/40 transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 font-mono">
                  {org.type}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                  {org.status || 'ACTIVE'}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-100">{org.name}</h3>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{org.location}</span>
              </div>

              {org.description && (
                <p className="text-xs text-slate-400 line-clamp-2">{org.description}</p>
              )}
            </div>

            <div className="pt-2 border-t border-intel-border/60 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Linked Persons:</span>
                </span>
                <span className="font-mono text-cyan-400">{org.associatedPersons || 'None'}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Involved Cases:</span>
                </span>
                <span className="font-mono text-purple-400">{org.associatedCases || 'None'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrgs.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-intel-card border border-intel-border text-slate-500">
          No synthetic organizations match your search filter.
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-intel-card border border-intel-border shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-intel-border pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                Register Synthetic Organization
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Organization Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Marine Freight Ltd."
                  value={newOrg.name}
                  onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                  className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Entity Type
                  </label>
                  <select
                    value={newOrg.type}
                    onChange={(e) => setNewOrg({ ...newOrg, type: e.target.value })}
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                  >
                    <option value="Logistics Front">Logistics Front</option>
                    <option value="Shell Corporation">Shell Corporation</option>
                    <option value="Financial Consulting">Financial Consulting</option>
                    <option value="Automotive Workshop">Automotive Workshop</option>
                    <option value="Import/Export">Import/Export</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={newOrg.location}
                    onChange={(e) => setNewOrg({ ...newOrg, location: e.target.value })}
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newOrg.description}
                  onChange={(e) => setNewOrg({ ...newOrg, description: e.target.value })}
                  className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                ></textarea>
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
                  Register Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
