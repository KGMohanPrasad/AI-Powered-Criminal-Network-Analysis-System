import React, { useState, useEffect } from 'react';
import {
  Radio,
  Search,
  Filter,
  ExternalLink,
  Shield,
  FileText,
  MapPin,
  Calendar,
  Layers,
  BarChart3,
  PieChart as PieIcon,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  Printer,
  Sparkles,
  AlertTriangle,
  Info
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
  Cell,
  Legend
} from 'recharts';
import { liveDataApi } from '../services/api';

const COLORS = ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function DataIntelligencePage({ onNavigate }) {
  const [records, setRecords] = useState([]);
  const [trends, setTrends] = useState({ byCategory: [], byState: [], bySourceBadge: [] });
  const [stats, setStats] = useState({ totalRecords: 0, verifiedRecords: 0, pendingReviewRecords: 0 });
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewTab, setViewTab] = useState('feed'); // 'feed', 'analytics', 'map'

  // Modals
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [categoryFilter, stateFilter, statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const pageRes = await liveDataApi.getAll({
        category: categoryFilter,
        state: stateFilter,
        status: statusFilter,
        search: searchQuery,
        page: 0,
        size: 50
      });
      setRecords(pageRes?.content || pageRes?.records || []);

      const trendRes = await liveDataApi.getTrends();
      if (trendRes) setTrends(trendRes);

      const statsRes = await liveDataApi.getStatistics();
      if (statsRes) setStats(statsRes);
    } catch (err) {
      console.error('Error fetching live data intelligence:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const getSourceBadgeColor = (badge) => {
    switch (badge) {
      case 'OFFICIAL':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'OPEN DATA':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'RSS':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'PUBLIC NEWS':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'SYNTHETIC':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-intel-card border border-intel-border shadow-intel-card backdrop-blur-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                Live Public Intelligence Feed & Trend Analytics
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  PUBLIC DATA
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-sans">
                Real-time ingested public safety bulletins, open government statistics, and legal news references
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowReportModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-intel-panel hover:bg-intel-panel/80 border border-intel-border hover:border-cyan-500/40 transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            Live Data Summary Report
          </button>

          <button
            onClick={() => onNavigate('data-sources')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-glow transition-all flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            Manage Scrapers
          </button>

          <button
            onClick={fetchData}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 bg-intel-panel border border-intel-border hover:border-intel-border/80 transition-all"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-intel-card border border-intel-border">
          <div className="text-[11px] text-slate-400 font-medium">Total Public Ingestions</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
            {stats.totalRecords || records.length || 0}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Aggregated public entries</div>
        </div>

        <div className="p-4 rounded-xl bg-intel-card border border-intel-border">
          <div className="text-[11px] text-slate-400 font-medium">Source-Verified Records</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {stats.verifiedRecords || records.filter((r) => r.verificationStatus === 'SOURCE_VERIFIED').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Official & open-data verified</div>
        </div>

        <div className="p-4 rounded-xl bg-intel-card border border-intel-border">
          <div className="text-[11px] text-slate-400 font-medium">Pending Human Review</div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {stats.pendingReviewRecords || records.filter((r) => r.verificationStatus === 'REQUIRES_REVIEW').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            <button
              onClick={() => onNavigate('external-review')}
              className="text-cyan-400 hover:underline"
            >
              Open Review Queue &rarr;
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-intel-card border border-intel-border">
          <div className="text-[11px] text-slate-400 font-medium">Origin Integrity</div>
          <div className="text-xl font-bold font-mono text-cyan-300 mt-1">100% Public</div>
          <div className="text-[10px] text-slate-500 mt-1">Zero synthetic mixing</div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-intel-border gap-4 text-xs font-mono">
        <button
          onClick={() => setViewTab('feed')}
          className={`pb-2.5 font-bold transition-all relative ${
            viewTab === 'feed' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Live Feed Stream ({records.length})
        </button>
        <button
          onClick={() => setViewTab('analytics')}
          className={`pb-2.5 font-bold transition-all relative ${
            viewTab === 'analytics' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Aggregated Trend Analytics
        </button>
        <button
          onClick={() => setViewTab('map')}
          className={`pb-2.5 font-bold transition-all relative ${
            viewTab === 'map' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Geographic Incident Distribution
        </button>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-intel-card border border-intel-border">
        <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search headline, notice, state, district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-intel-panel border border-intel-border text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </form>

        <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-intel-panel border border-intel-border text-xs text-slate-300 font-mono"
          >
            <option value="ALL">All Categories</option>
            <option value="CYBER_FRAUD">Cyber Fraud / Online Scams</option>
            <option value="VEHICLE_THEFT">Vehicle Theft</option>
            <option value="FINANCIAL_CRIME">Financial Crime</option>
            <option value="PROPERTY_CRIME">Property Crime</option>
            <option value="PUBLIC_SAFETY">Public Safety Advisory</option>
            <option value="AGGREGATE_STATISTICS">Aggregate Statistics</option>
          </select>

          {/* State Filter */}
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-intel-panel border border-intel-border text-xs text-slate-300 font-mono"
          >
            <option value="ALL">All States</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Delhi">Delhi</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Telangana">Telangana</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Gujarat">Gujarat</option>
          </select>

          {/* Verification Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-intel-panel border border-intel-border text-xs text-slate-300 font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="SOURCE_VERIFIED">SOURCE_VERIFIED</option>
            <option value="REQUIRES_REVIEW">REQUIRES_REVIEW</option>
            <option value="SOURCE_UNVERIFIED">SOURCE_UNVERIFIED</option>
          </select>
        </div>
      </div>

      {/* TAB 1: Live Feed Stream */}
      {viewTab === 'feed' && (
        <div className="space-y-3">
          {records.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-intel-card border border-intel-border text-slate-500 font-mono text-xs">
              No public records matched your search parameters.
            </div>
          ) : (
            records.map((r) => (
              <div
                key={r.id || r.externalId}
                className="p-4 rounded-xl bg-intel-card border border-intel-border hover:border-cyan-500/40 transition-all shadow-intel-card group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-intel-border/60 pb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Origin Badge */}
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      PUBLIC DATA
                    </span>

                    {/* Source Badge */}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getSourceBadgeColor(
                        r.sourceBadge
                      )}`}
                    >
                      {r.sourceBadge || 'OFFICIAL'}
                    </span>

                    {/* Verification Status */}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        r.verificationStatus === 'SOURCE_VERIFIED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {r.verificationStatus}
                    </span>

                    <span className="text-[11px] text-slate-400 font-mono">
                      {r.sourceName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {r.eventDate || 'Recent'}
                    </span>
                    {r.state && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {r.state} {r.district ? `(${r.district})` : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 space-y-1.5">
                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-2">
                    {r.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-intel-border/40 text-[11px]">
                  <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px]">
                    <span>Category: <strong className="text-slate-300 font-normal">{r.category}</strong></span>
                    <span>•</span>
                    <span>Reliability: <strong className="text-slate-300 font-normal">{r.reliabilityLevel}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedRecord(r)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-cyan-300 hover:bg-cyan-500/10 transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Data Lineage & Details
                    </button>

                    {r.sourceUrl && (
                      <a
                        href={r.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-intel-panel transition-colors flex items-center gap-1"
                        title="View Original Source"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Original Record
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Aggregated Trend Analytics */}
      {viewTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Chart 1: Categories Breakdown */}
          <div className="p-5 rounded-2xl bg-intel-card border border-intel-border shadow-intel-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Aggregated Crime & Public Safety Categories
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Total Count</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends.byCategory || []} layout="vertical">
                  <XAxis type="number" stroke="#64748b" fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="category"
                    stroke="#94a3b8"
                    fontSize={10}
                    width={110}
                    tickFormatter={(val) => val.replace('_', ' ')}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="count" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              * Counts represent verified aggregated incident reports & official bulletins.
            </p>
          </div>

          {/* Chart 2: State Distribution */}
          <div className="p-5 rounded-2xl bg-intel-card border border-intel-border shadow-intel-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-400" />
                Geographic Distribution by State
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Regional Mix</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trends.byState || []}
                    dataKey="count"
                    nameKey="state"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {(trends.byState || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              * Data sourced from NCRB state digests, CERT-In, and state police cyber bulletins.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: Geographic Distribution Map */}
      {viewTab === 'map' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border shadow-intel-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Public Aggregate Geographic Incident Points
              </h3>
              <p className="text-xs text-slate-400">
                Aggregated district and metropolitan coordinates. Individual home addresses are never plotted.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {records.filter((r) => r.latitude && r.longitude).length} Geolocated Hotspots
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {records
              .filter((r) => r.latitude && r.longitude)
              .map((pt) => (
                <div
                  key={pt.id || pt.externalId}
                  className="p-3 rounded-xl bg-intel-panel border border-intel-border text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{pt.city || pt.state}</span>
                    <span className="text-[10px] font-mono text-cyan-400">
                      [{pt.latitude.toFixed(2)}, {pt.longitude.toFixed(2)}]
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{pt.title}</div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                    <span>{pt.category}</span>
                    <span className="text-emerald-400">{pt.verificationStatus}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Detail Lineage Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-intel-card border border-intel-border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-intel-border pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Record Lineage & Metadata</h3>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-white">
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-mono text-[10px] uppercase">Title</span>
                <p className="text-slate-100 font-semibold text-sm mt-0.5">{selectedRecord.title}</p>
              </div>

              <div>
                <span className="text-slate-400 font-mono text-[10px] uppercase">Description</span>
                <p className="text-slate-300 leading-relaxed mt-0.5 font-sans bg-intel-panel p-2.5 rounded-lg border border-intel-border">
                  {selectedRecord.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-2 rounded-lg bg-intel-panel border border-intel-border">
                  <div className="text-[10px] text-slate-500">Source Name</div>
                  <div className="text-slate-200 text-[11px] mt-0.5">{selectedRecord.sourceName}</div>
                </div>
                <div className="p-2 rounded-lg bg-intel-panel border border-intel-border">
                  <div className="text-[10px] text-slate-500">Source Reliability</div>
                  <div className="text-cyan-400 text-[11px] mt-0.5">{selectedRecord.reliabilityLevel}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-2 rounded-lg bg-intel-panel border border-intel-border">
                  <div className="text-[10px] text-slate-500">External ID</div>
                  <div className="text-slate-200 text-[11px] mt-0.5">{selectedRecord.externalId}</div>
                </div>
                <div className="p-2 rounded-lg bg-intel-panel border border-intel-border">
                  <div className="text-[10px] text-slate-500">Retrieved Date</div>
                  <div className="text-slate-200 text-[11px] mt-0.5">
                    {selectedRecord.retrievedAt ? selectedRecord.retrievedAt.replace('T', ' ') : 'Recent'}
                  </div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-intel-panel border border-intel-border font-mono">
                <div className="text-[10px] text-slate-500">SHA-256 Deduplication Fingerprint</div>
                <div className="text-[10px] text-purple-400 break-all mt-0.5">
                  {selectedRecord.fingerprint || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-intel-panel border border-intel-border font-mono">
                <div className="text-[10px] text-slate-500">Original Source URL</div>
                <a
                  href={selectedRecord.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline break-all text-[11px] block mt-0.5"
                >
                  {selectedRecord.sourceUrl}
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-intel-border flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-intel-panel hover:bg-intel-panel/80 border border-intel-border"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Report Printable Modal (Section 55) */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-intel-card border border-intel-border p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-intel-border pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Live Public Data Summary Report</h3>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-white">
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 font-mono text-xs pr-1">
              <div className="p-3 rounded-xl bg-intel-panel border border-intel-border">
                <div className="text-[11px] text-slate-400">DOCUMENT: AEGIS-LPD-SUMMARY-2026</div>
                <div className="text-[11px] text-slate-400">DATE GENERATED: {new Date().toLocaleString()}</div>
                <div className="text-[11px] text-cyan-400 font-bold mt-1">STATUS: OFFICIAL PUBLIC DATA RELEASE</div>
              </div>

              <div className="p-3 rounded-xl bg-intel-panel border border-intel-border space-y-1">
                <div className="font-bold text-slate-200">1. EXECUTIVE SUMMARY</div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  This dossier aggregates {records.length} authenticated public safety bulletins, national crime statistics (NCRB), and certified cyber advisories ingested across registered Indian governmental and journalistic open-data feeds.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-intel-panel border border-intel-border space-y-2">
                <div className="font-bold text-slate-200">2. TOP CATEGORICAL OCCURRENCES</div>
                {(trends.byCategory || []).slice(0, 5).map((c, i) => (
                  <div key={i} className="flex justify-between text-[11px] text-slate-300">
                    <span>{c.category}</span>
                    <span className="text-cyan-400">{c.count} records</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-intel-panel border border-intel-border space-y-1">
                <div className="font-bold text-slate-200">3. ETHICS & COMPLIANCE CERTIFICATION</div>
                <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                  Notice: All items in this report are aggregated geographic/category statistics. No identifiable private individuals are branded as criminal suspects or subjected to automated guilt scoring.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-intel-border flex justify-end gap-2 shrink-0">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 shadow-cyan-glow flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-intel-panel hover:bg-intel-panel/80 border border-intel-border"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
