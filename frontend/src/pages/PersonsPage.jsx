import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Network,
  Shield,
  ArrowRight,
  X
} from 'lucide-react';
import { personsApi } from '../services/api';
import { toast } from '../utils/toast';

export default function PersonsPage({ onNavigate, onSelectPerson }) {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    age: 35,
    gender: 'Male',
    primaryLocation: 'North Docklands',
    status: 'PERSON_OF_INTEREST',
    occupation: 'Logistics Contractor',
    riskLevel: 'MEDIUM',
    notes: ''
  });

  const loadPersons = async () => {
    setLoading(true);
    try {
      const res = await personsApi.getAll();
      if (res.success) {
        setPersons(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPersons();
  }, []);

  const handleCreatePerson = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const res = await personsApi.create(formData);
      if (res.success) {
        setShowCreateModal(false);
        setFormData({
          name: '',
          alias: '',
          age: 35,
          gender: 'Male',
          primaryLocation: 'North Docklands',
          status: 'PERSON_OF_INTEREST',
          occupation: 'Logistics Contractor',
          riskLevel: 'MEDIUM',
          notes: ''
        });
        toast.success('Person created successfully');
        loadPersons();
      }
    } catch (err) {
      toast.error(err.message || 'Error creating person');
    }
  };

  const filteredPersons = persons.filter(p => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (riskFilter !== 'ALL' && p.riskLevel !== riskFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.alias && p.alias.toLowerCase().includes(q)) ||
        p.personId.toLowerCase().includes(q) ||
        (p.primaryLocation && p.primaryLocation.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUSPECT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">SUSPECT</span>;
      case 'PERSON_OF_INTEREST':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">PERSON OF INTEREST</span>;
      case 'WITNESS':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">WITNESS</span>;
      case 'ASSOCIATE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">ASSOCIATE</span>;
      case 'CLEARED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">CLEARED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-intel-cyan uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Entities Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Persons of Interest (40 Entities)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fictional profiles for demonstration of relational graph clustering and betweenness centrality.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 shadow-cyan-glow flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Synthetic Entity</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-intel-card border border-intel-border shadow-subtle flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-intel-cyan absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, alias, ID, location..."
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
              <option value="ALL">All Statuses ({persons.length})</option>
              <option value="SUSPECT">SUSPECT</option>
              <option value="PERSON_OF_INTEREST">PERSON OF INTEREST</option>
              <option value="ASSOCIATE">ASSOCIATE</option>
              <option value="WITNESS">WITNESS</option>
              <option value="CLEARED">CLEARED</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-intel-panel border border-intel-border text-slate-300 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
        </div>
      </div>

      {/* Persons Table (Section 12) */}
      <div className="rounded-2xl bg-intel-card border border-intel-border shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-intel-border bg-intel-panel/60 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-3.5 pl-5">Person ID</th>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Alias</th>
                <th className="p-3.5">Age / Gender</th>
                <th className="p-3.5">Primary Location</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Cases</th>
                <th className="p-3.5">Network Links</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-intel-border/40 text-slate-300 font-sans">
              {filteredPersons.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-intel-panel/30 transition-colors group cursor-pointer"
                  onClick={() => onNavigate('person-profile', p.personId)}
                >
                  <td className="p-3.5 pl-5 font-mono font-bold text-intel-cyan">
                    {p.personId}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-100">{p.name}</div>
                    <div className="text-[11px] text-slate-400">{p.occupation}</div>
                  </td>
                  <td className="p-3.5 font-medium text-cyan-300">
                    {p.alias || '—'}
                  </td>
                  <td className="p-3.5 text-slate-300 font-mono">
                    {p.age} / {p.gender}
                  </td>
                  <td className="p-3.5 text-slate-300">
                    {p.primaryLocation}
                  </td>
                  <td className="p-3.5">
                    {getStatusBadge(p.status)}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-200">
                    {p.associatedCasesCount || 1}
                  </td>
                  <td className="p-3.5 font-mono">
                    <span className="text-cyan-400 font-bold">{p.connectionCount || 3}</span> links
                  </td>
                  <td className="p-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onNavigate('person-profile', p.personId)}
                        className="p-1.5 rounded-lg bg-intel-card hover:bg-intel-panel text-slate-300 border border-intel-border hover:text-intel-cyan"
                        title="View Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onNavigate('workspace', p.personId)}
                        className="px-2 py-1 rounded-lg bg-intel-cyan/10 hover:bg-intel-cyan/20 text-intel-cyan border border-intel-cyan/30 text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Network className="w-3.5 h-3.5" />
                        <span>Graph</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Person Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-intel-card border border-intel-border rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-intel-border pb-3">
              <h3 className="text-sm font-bold text-slate-100">Add Synthetic Person of Interest</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreatePerson} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Anand Varma"
                  className="w-full p-2.5 rounded-xl bg-intel-panel border border-intel-border text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300">Alias / Street Moniker</label>
                  <input
                    type="text"
                    value={formData.alias}
                    onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                    placeholder="e.g. Phoenix"
                    className="w-full p-2.5 rounded-xl bg-intel-panel border border-intel-border text-slate-100"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-intel-panel border border-intel-border text-slate-100"
                  >
                    <option value="SUSPECT">SUSPECT</option>
                    <option value="PERSON_OF_INTEREST">PERSON OF INTEREST</option>
                    <option value="ASSOCIATE">ASSOCIATE</option>
                    <option value="WITNESS">WITNESS</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-intel-border">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-intel-panel text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-intel-cyan text-slate-900 font-bold"
                >
                  Save Person Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
