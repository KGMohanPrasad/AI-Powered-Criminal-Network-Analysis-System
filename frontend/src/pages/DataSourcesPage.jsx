import React, { useState, useEffect } from 'react';
import {
  Globe,
  RefreshCw,
  Plus,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Shield,
  FileText,
  Search,
  Check,
  X,
  Play,
  Activity,
  Database,
  ExternalLink,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { dataSourcesApi, syncJobsApi } from '../services/api';
import toast from '../utils/toast';

export default function DataSourcesPage({ onNavigate }) {
  const [sources, setSources] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedSourceLogs, setSelectedSourceLogs] = useState([]);
  const [selectedSourceName, setSelectedSourceName] = useState('');

  // Sync Progress State
  const [activeSyncJob, setActiveSyncJob] = useState(null);
  const [showSyncModal, setShowSyncModal] = useState(false);

  // Test source state
  const [testUrl, setTestUrl] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  // New source form state
  const [formData, setFormData] = useState({
    sourceName: '',
    sourceType: 'API',
    baseUrl: '',
    category: 'CYBER_FRAUD',
    updateFrequency: 'DAILY',
    license: 'Open Government Data License (OGD)',
    scrapingPermissionNotes: 'Permitted for academic research and public statistical analysis',
    sourceBadge: 'OFFICIAL',
    reliabilityLevel: 'Official Government Source'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await dataSourcesApi.getAll();
      setSources(Array.isArray(data) ? data : []);
      const recentLogs = await dataSourcesApi.getRecentLogs();
      setLogs(Array.isArray(recentLogs) ? recentLogs : []);
    } catch (err) {
      console.error('Error fetching data sources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncNow = async (source) => {
    try {
      const res = await dataSourcesApi.sync(source.id);
      setActiveSyncJob({
        id: res.id,
        sourceName: source.sourceName,
        status: 'RUNNING',
        progress: 10,
        stepMessage: 'Connecting to source crawler...',
        recordsSaved: 0,
        recordsSkipped: 0
      });
      setShowSyncModal(true);
      pollJob(res.id, source.sourceName);
    } catch (err) {
      toast.error(err.error || 'Failed to trigger sync for source');
    }
  };

  const pollJob = (jobId, sourceName) => {
    const interval = setInterval(async () => {
      try {
        const job = await syncJobsApi.getStatus(jobId);
        setActiveSyncJob(job);
        if (job.status === 'SUCCESS' || job.status === 'FAILED' || job.status === 'PARTIAL_SUCCESS') {
          clearInterval(interval);
          fetchData();
        }
      } catch (e) {
        clearInterval(interval);
      }
    }, 800);
  };

  const handleToggleStatus = async (source) => {
    const nextStatus = source.status === 'APPROVED' ? 'DISABLED' : 'APPROVED';
    try {
      await dataSourcesApi.update(source.id, { status: nextStatus });
      toast.success(`Source status updated to ${nextStatus}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update source status');
    }
  };

  const handleViewLogs = async (source) => {
    try {
      setSelectedSourceName(source.sourceName);
      const res = await dataSourcesApi.getLogs(source.id);
      setSelectedSourceLogs(Array.isArray(res) ? res : []);
      setShowLogsModal(true);
    } catch (err) {
      toast.error('Could not fetch logs for source');
    }
  };

  const handleRunTest = async (e) => {
    e.preventDefault();
    if (!testUrl) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res = await dataSourcesApi.testSource(testUrl);
      setTestResult(res);
    } catch (err) {
      setTestResult({ success: false, message: err.error || 'Failed to connect' });
    } finally {
      setTesting(false);
    }
  };

  const handleCreateSource = async (e) => {
    e.preventDefault();
    try {
      await dataSourcesApi.create(formData);
      setShowAddModal(false);
      setFormData({
        sourceName: '',
        sourceType: 'API',
        baseUrl: '',
        category: 'CYBER_FRAUD',
        updateFrequency: 'DAILY',
        license: 'Open Government Data License (OGD)',
        scrapingPermissionNotes: 'Permitted for academic research and public statistical analysis',
        sourceBadge: 'OFFICIAL',
        reliabilityLevel: 'Official Government Source'
      });
      fetchData();
    } catch (err) {
      toast.error(err.error || 'Failed to create source. Check SSRF and URL constraints.');
    }
  };

  const filteredSources = sources.filter((s) => {
    const matchesSearch =
      s.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.baseUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || s.sourceType === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-intel-card border border-intel-border shadow-intel-card backdrop-blur-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                Public Data Sources & Scraper Registry
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  SSRF-PROTECTED
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-sans">
                Official Government Open Data, NCRB Aggregates, RSS Feeds, and Permitted Public Safety Bulletins
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setTestUrl('https://ncrb.gov.in');
              setTestResult(null);
              setShowTestModal(true);
            }}
            className="px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-intel-panel hover:bg-intel-panel/80 border border-intel-border hover:border-cyan-500/40 transition-all flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            Test Connection / SSRF
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-glow transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Approved Source
          </button>

          <button
            onClick={fetchData}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 bg-intel-panel border border-intel-border hover:border-intel-border/80 transition-all"
            title="Refresh Sources"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-intel-card border border-intel-border">
          <div className="text-[11px] text-slate-400 font-medium">Approved Sources</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
            {sources.filter((s) => s.status === 'APPROVED').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Verified for automatic crawling</div>
        </div>

        <div className="p-4 rounded-xl bg-intel-card border border-intel-border">
          <div className="text-[11px] text-slate-400 font-medium">Total Imported Records</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {sources.reduce((acc, s) => acc + (s.recordsImported || 0), 0)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Open public dataset entries</div>
        </div>

        <div className="p-4 rounded-xl bg-intel-card border border-intel-border">
          <div className="text-[11px] text-slate-400 font-medium">Duplicates Prevented</div>
          <div className="text-xl font-bold font-mono text-purple-400 mt-1">
            {sources.reduce((acc, s) => acc + (s.recordsSkipped || 0), 0)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">SHA-256 fingerprints matched</div>
        </div>

        <div className="p-4 rounded-xl bg-intel-card border border-intel-border">
          <div className="text-[11px] text-slate-400 font-medium">Source Health Rating</div>
          <div className="text-xl font-bold font-mono text-cyan-300 mt-1">100% Online</div>
          <div className="text-[10px] text-slate-500 mt-1">Zero blocked robots.txt errors</div>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-intel-card border border-intel-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sources, category, URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-intel-panel border border-intel-border text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'JSON', 'RSS', 'CSV', 'HTML', 'API'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedType === type
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 bg-intel-panel border border-transparent'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Sources */}
      <div className="rounded-xl bg-intel-card border border-intel-border overflow-hidden shadow-intel-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-intel-panel border-b border-intel-border text-slate-400 font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4">Source Name & License</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Health</th>
                <th className="py-3 px-3">Last Sync</th>
                <th className="py-3 px-3 text-right">Imported</th>
                <th className="py-3 px-3 text-right">Skipped</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-intel-border/60">
              {filteredSources.map((s) => (
                <tr key={s.id} className="hover:bg-intel-panel/30 transition-colors group">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                      {s.sourceName}
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {s.sourceBadge || 'OFFICIAL'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-sm font-mono mt-0.5">
                      {s.baseUrl}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      License: {s.license || 'OGD-India'}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {s.sourceType}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-[11px] text-slate-300 font-sans">
                      {s.category ? s.category.replace('_', ' ') : 'General'}
                    </span>
                    <div className="text-[9px] text-slate-500 font-mono">
                      Freq: {s.updateFrequency}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                        s.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : s.status === 'BLOCKED'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {s.status === 'APPROVED' ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                      {s.status}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      {s.healthStatus || 'ONLINE'}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-400 font-mono text-[10px]">
                    {s.lastSync ? s.lastSync.replace('T', ' ').substring(0, 16) : 'Pending'}
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-slate-200">
                    {s.recordsImported || 0}
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-purple-400">
                    {s.recordsSkipped || 0}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleSyncNow(s)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all flex items-center gap-1"
                        title="Sync Now"
                      >
                        <Play className="w-3 h-3" />
                        Sync Now
                      </button>

                      <button
                        onClick={() => handleViewLogs(s)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 bg-intel-panel hover:bg-intel-panel/80 border border-intel-border transition-all"
                        title="View Scraper Logs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggleStatus(s)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          s.status === 'APPROVED'
                            ? 'text-amber-400 hover:bg-amber-500/10 border-intel-border'
                            : 'text-emerald-400 hover:bg-emerald-500/10 border-intel-border'
                        }`}
                        title={s.status === 'APPROVED' ? 'Disable Source' : 'Enable Source'}
                      >
                        {s.status === 'APPROVED' ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Syncing Modal */}
      {showSyncModal && activeSyncJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-intel-card border border-intel-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                <h3 className="font-bold text-white text-sm">
                  Synchronizing: {activeSyncJob.sourceName}
                </h3>
              </div>
              {activeSyncJob.status !== 'RUNNING' && (
                <button onClick={() => setShowSyncModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Progress: {activeSyncJob.progress || 0}%</span>
                <span className="text-cyan-400 font-semibold">{activeSyncJob.status}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-intel-panel overflow-hidden border border-intel-border">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${activeSyncJob.progress || 10}%` }}
                />
              </div>
            </div>

            {/* Step Message */}
            <div className="p-3 rounded-xl bg-intel-panel border border-intel-border text-xs text-slate-300 font-mono">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Current Operation</div>
              {activeSyncJob.stepMessage || 'Executing crawl...'}
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                Saved: {activeSyncJob.recordsSaved || 0}
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                Duplicates Removed: {activeSyncJob.recordsSkipped || 0}
              </div>
            </div>

            {activeSyncJob.status !== 'RUNNING' && (
              <button
                onClick={() => setShowSyncModal(false)}
                className="w-full py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors shadow-cyan-glow"
              >
                Close & View Dataset
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-intel-card border border-intel-border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-intel-border pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Add Approved Public Source</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSource} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Source Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NCRB District Crime Statistics Portal"
                  value={formData.sourceName}
                  onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-intel-panel border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Source Type</label>
                  <select
                    value={formData.sourceType}
                    onChange={(e) => setFormData({ ...formData, sourceType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-intel-panel border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="API">API (REST / Open Data)</option>
                    <option value="JSON">JSON Dataset</option>
                    <option value="CSV">CSV Dataset</option>
                    <option value="RSS">RSS Feed</option>
                    <option value="HTML">HTML Public Page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-intel-panel border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="CYBER_FRAUD">Cyber Fraud / Online Scams</option>
                    <option value="FINANCIAL_CRIME">Financial Crime</option>
                    <option value="VEHICLE_THEFT">Vehicle Theft</option>
                    <option value="PROPERTY_CRIME">Property Crime</option>
                    <option value="PUBLIC_SAFETY">Public Safety Advisory</option>
                    <option value="AGGREGATE_STATISTICS">Aggregate Crime Statistics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Target URL / Endpoint (SSRF Protected)
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://data.gov.in/resource/..."
                  value={formData.baseUrl}
                  onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-intel-panel border border-intel-border text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Only public URLs on approved government or official open-data domains are permitted.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Update Frequency</label>
                  <select
                    value={formData.updateFrequency}
                    onChange={(e) => setFormData({ ...formData, updateFrequency: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-intel-panel border border-intel-border text-slate-200 font-mono"
                  >
                    <option value="HOURLY">Hourly (News / Bulletins)</option>
                    <option value="DAILY">Daily (General)</option>
                    <option value="WEEKLY">Weekly (Government Reports)</option>
                    <option value="MANUAL">Manual On-Demand</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Data License</label>
                  <input
                    type="text"
                    value={formData.license}
                    onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-intel-panel border border-intel-border text-slate-200"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-cyan-300 text-[11px] flex gap-2">
                <Info className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                <div>
                  <strong>Academic Research Bot Policy:</strong> Transparent User-Agent{' '}
                  <code className="text-cyan-200">CriminalNetworkAcademicResearchBot/1.0</code> will be transmitted.
                  Robots.txt is automatically checked before crawling.
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-intel-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-intel-panel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-glow"
                >
                  Register Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Test Connection Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-intel-card border border-intel-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-intel-border pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">SSRF & Robots.txt Verification</h3>
              </div>
              <button onClick={() => setShowTestModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRunTest} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Target Endpoint / Domain</label>
                <input
                  type="text"
                  required
                  placeholder="https://ncrb.gov.in"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-intel-panel border border-intel-border text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={testing}
                className="w-full py-2 rounded-xl text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors shadow-cyan-glow flex items-center justify-center gap-1.5"
              >
                {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                {testing ? 'Testing Endpoint...' : 'Execute Security & Robots Check'}
              </button>
            </form>

            {testResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                  testResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {testResult.success ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {testResult.success ? 'Security Verification Passed' : 'Security Check Failed'}
                </div>
                <div className="font-mono text-[11px]">{testResult.message}</div>
                <div className="grid grid-cols-2 gap-1 text-[10px] font-mono pt-1 text-slate-400">
                  <div>Robots: {testResult.robotsStatus || 'ALLOWED'}</div>
                  <div>SSRF Guard: {testResult.ssrfStatus || 'PASSED'}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logs Modal */}
      {showLogsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-intel-card border border-intel-border p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-intel-border pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">
                  Execution Audit Logs: {selectedSourceName}
                </h3>
              </div>
              <button onClick={() => setShowLogsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {selectedSourceLogs.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs font-mono">
                  No execution logs recorded yet for this source.
                </div>
              ) : (
                selectedSourceLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-intel-panel border border-intel-border text-xs space-y-1.5 font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {log.status}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {log.startTime ? log.startTime.replace('T', ' ') : ''}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-[10px] text-slate-300 pt-1">
                      <div>Found: {log.recordsFound}</div>
                      <div>Created: {log.recordsCreated}</div>
                      <div>Skipped: {log.recordsSkipped}</div>
                      <div>Errors: {log.errors}</div>
                    </div>

                    {log.errorMessage && (
                      <div className="text-[11px] text-rose-400 bg-rose-500/5 p-1.5 rounded border border-rose-500/20">
                        {log.errorMessage}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-intel-border flex justify-end shrink-0">
              <button
                onClick={() => setShowLogsModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-intel-panel hover:bg-intel-panel/80 border border-intel-border"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
