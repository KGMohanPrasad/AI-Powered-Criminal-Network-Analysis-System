import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  Users,
  Search,
  Plus,
  Filter,
  ArrowRight,
  Clock,
  Calendar,
  Layers,
  X,
  Radio,
  BarChart2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import EthicsNoticeBanner from '../components/EthicsNoticeBanner';
import { communicationsApi, personsApi, casesApi } from '../services/api';
import { toast } from '../utils/toast';

const COLORS = ['#06B6D4', '#8B5CF6', '#F59E0B', '#10B981'];

export default function CommunicationsPage({ onNavigate }) {
  const [comms, setComms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [newComm, setNewComm] = useState({
    sourceEntity: 'DEMO-P001',
    destinationEntity: 'DEMO-P002',
    communicationType: 'Call',
    date: new Date().toISOString().split('T')[0],
    duration: '4m 32s',
    relatedCase: 'CASE-2026-0001',
    contextNotes: 'Routine coordination call observed in synthetic records.',
  });

  useEffect(() => {
    fetchComms();
  }, []);

  const fetchComms = async () => {
    setLoading(true);
    try {
      const res = await communicationsApi.getAll();
      setComms(res.data || []);
    } catch (err) {
      console.error('Failed to load communications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComm = async (e) => {
    e.preventDefault();
    try {
      const res = await communicationsApi.create(newComm);
      setComms((prev) => [res.data || newComm, ...prev]);
      setShowModal(false);
      toast.success('Communication interaction logged in synthetic dataset.');
    } catch (err) {
      setComms((prev) => [newComm, ...prev]);
      setShowModal(false);
      toast.info('Communication interaction logged to local session.');
    }
  };

  const filteredComms = comms.filter((c) => {
    const matchesSearch =
      (c.sourceEntity || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.destinationEntity || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.contextNotes || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.relatedCase || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || c.communicationType === typeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate aggregation for charts
  const typeCounts = comms.reduce((acc, curr) => {
    const t = curr.communicationType || 'Other';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(typeCounts).map((k) => ({
    name: k,
    value: typeCounts[k],
  }));

  // Frequency by entity pairs
  const pairFreq = {};
  comms.forEach((c) => {
    const pair = `${c.sourceEntity} ↔ ${c.destinationEntity}`;
    pairFreq[pair] = (pairFreq[pair] || 0) + 1;
  });

  const barData = Object.keys(pairFreq)
    .sort((a, b) => pairFreq[b] - pairFreq[a])
    .slice(0, 6)
    .map((k) => ({
      pair: k,
      count: pairFreq[k],
    }));

  const getCommIcon = (type) => {
    switch (type) {
      case 'Call':
        return <Phone className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Message':
        return <MessageSquare className="w-3.5 h-3.5 text-purple-400" />;
      case 'Email':
        return <Mail className="w-3.5 h-3.5 text-amber-400" />;
      case 'Meeting':
      default:
        return <Users className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-intel-card border border-intel-border">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Communication Intelligence & Link Analysis
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                {comms.length} Synthetic Records
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Interaction frequencies, call/meeting logs, and relational clusters (No covert interception).
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-cyan-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Log Communication</span>
        </button>
      </div>

      <EthicsNoticeBanner />

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Top Communicating Pairs */}
        <div className="lg:col-span-8 p-4 rounded-2xl bg-intel-card border border-intel-border flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>Highest Interaction Entity Pairs</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Frequency Volume</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis
                  dataKey="pair"
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F1626',
                    borderColor: '#1E2D4A',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown by Type */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-intel-card border border-intel-border flex flex-col">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
            Channel Distribution
          </h3>
          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F1626',
                    borderColor: '#1E2D4A',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mt-1">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-slate-300">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                ></span>
                <span>
                  {d.name}: {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded-2xl bg-intel-card border border-intel-border">
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by source, target, case number, or context notes..."
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
            <option value="ALL">All Communication Types</option>
            <option value="Call">Call</option>
            <option value="Message">Message</option>
            <option value="Email">Email</option>
            <option value="Meeting">Meeting</option>
          </select>
        </div>
      </div>

      {/* Communications Table */}
      <div className="rounded-2xl bg-intel-card border border-intel-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-intel-panel/60 border-b border-intel-border text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Source Entity</th>
                <th className="py-3 px-4">Destination Entity</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Related Case</th>
                <th className="py-3 px-4">Forensic Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-intel-border">
              {filteredComms.map((c, idx) => (
                <tr key={c.id || idx} className="hover:bg-intel-panel/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                      {getCommIcon(c.communicationType)}
                      <span>{c.communicationType}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                    {c.sourceEntity}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-purple-400">
                    {c.destinationEntity}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{c.date}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{c.duration || 'N/A'}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {c.relatedCase || 'Global Intel'}
                  </td>
                  <td className="py-3 px-4 text-slate-400 max-w-sm truncate" title={c.contextNotes}>
                    {c.contextNotes || 'Routine communication record'}
                  </td>
                </tr>
              ))}

              {filteredComms.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No communication records matching current criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-intel-card border border-intel-border shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-intel-border pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Radio className="w-5 h-5 text-cyan-400" />
                Log Synthetic Communication Record
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateComm} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Source Entity
                  </label>
                  <input
                    type="text"
                    required
                    value={newComm.sourceEntity}
                    onChange={(e) =>
                      setNewComm({ ...newComm, sourceEntity: e.target.value })
                    }
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 font-mono outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Destination Entity
                  </label>
                  <input
                    type="text"
                    required
                    value={newComm.destinationEntity}
                    onChange={(e) =>
                      setNewComm({ ...newComm, destinationEntity: e.target.value })
                    }
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 font-mono outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Type
                  </label>
                  <select
                    value={newComm.communicationType}
                    onChange={(e) =>
                      setNewComm({ ...newComm, communicationType: e.target.value })
                    }
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                  >
                    <option value="Call">Call</option>
                    <option value="Message">Message</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newComm.duration}
                    onChange={(e) =>
                      setNewComm({ ...newComm, duration: e.target.value })
                    }
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Related Case
                </label>
                <input
                  type="text"
                  value={newComm.relatedCase}
                  onChange={(e) =>
                    setNewComm({ ...newComm, relatedCase: e.target.value })
                  }
                  className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Context Notes
                </label>
                <textarea
                  rows={2}
                  value={newComm.contextNotes}
                  onChange={(e) =>
                    setNewComm({ ...newComm, contextNotes: e.target.value })
                  }
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
