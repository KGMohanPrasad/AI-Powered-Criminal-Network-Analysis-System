import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Users,
  ShieldAlert,
  FileText,
  Network,
  AlertTriangle,
  Flame,
  Clock,
  CheckCircle2,
  UserCheck,
  TrendingUp,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Car,
  Building2,
  FolderOpen,
  Cpu,
  GitFork,
  Share2,
  Activity,
  Layers,
  Compass
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { dashboardApi, alertsApi } from '../services/api';

// Custom Tactical Tooltip for Recharts
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl bg-intel-card/95 border border-cyan-500/40 shadow-glass-edge backdrop-blur-xl text-xs space-y-1 z-50">
        {label && <div className="font-mono text-cyan-300 font-semibold mb-1 text-[11px]">{label}</div>}
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-3 text-slate-200">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              <span className="text-slate-400 text-[11px]">{entry.name}:</span>
            </div>
            <span className="font-mono font-bold text-slate-100 tabular-nums text-[12px]">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage({ onNavigate }) {
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sumRes, altRes] = await Promise.all([
        dashboardApi.getSummary(),
        alertsApi.getAll({ status: 'NEW' }),
      ]);
      if (sumRes.success) setSummary(sumRes.data);
      if (altRes.success) setAlerts(altRes.data.slice(0, 4));
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const PALETTE = ['#06B6D4', '#3B82F6', '#10B981', '#F59E0B', '#A855F7', '#EC4899', '#64748B'];

  const casesTrajectory = React.useMemo(() => {
    const created = summary?.casesCreatedByMonth || [];
    const closed = summary?.casesClosedByMonth || [];
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const allMonths = Array.from(new Set([...created.map(c => c.month), ...closed.map(c => c.month)]))
      .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
    return allMonths.map(m => {
      const c = created.find(x => x.month === m);
      const cl = closed.find(x => x.month === m);
      return {
        month: m,
        created: c ? c.cases : 0,
        closed: cl ? cl.closed : 0
      };
    });
  }, [summary]);

  // 10 KPI Cards (Section 2)
  const kpis = [
    {
      label: 'Active Cases',
      value: summary?.activeCases ?? 0,
      sub: summary?.activeCasesTrend || 'Active investigations',
      icon: Briefcase,
      color: 'text-cyan-400',
      accentColor: 'from-cyan-500 to-sky-500',
      border: 'border-cyan-500/25',
      bg: 'bg-cyan-500/10',
      target: 'cases',
    },
    {
      label: 'Open Inquiries',
      value: summary?.openInvestigations ?? 0,
      sub: 'Under active inquiry',
      icon: FolderOpen,
      color: 'text-sky-400',
      accentColor: 'from-sky-500 to-blue-500',
      border: 'border-sky-500/25',
      bg: 'bg-sky-500/10',
      target: 'cases',
    },
    {
      label: 'Persons of Interest',
      value: summary?.personsOfInterest ?? 0,
      sub: summary?.personsTrend || 'Dossiers on record',
      icon: Users,
      color: 'text-indigo-400',
      accentColor: 'from-indigo-500 to-violet-500',
      border: 'border-indigo-500/25',
      bg: 'bg-indigo-500/10',
      target: 'persons',
    },
    {
      label: 'Evidence Records',
      value: summary?.evidenceRecords ?? 0,
      sub: 'Vaulted forensic items',
      icon: FileText,
      color: 'text-emerald-400',
      accentColor: 'from-emerald-500 to-teal-500',
      border: 'border-emerald-500/25',
      bg: 'bg-emerald-500/10',
      target: 'evidence',
    },
    {
      label: 'Network Links',
      value: summary?.networkConnections ?? 0,
      sub: 'Verified relationship edges',
      icon: Network,
      color: 'text-teal-400',
      accentColor: 'from-teal-500 to-cyan-500',
      border: 'border-teal-500/25',
      bg: 'bg-teal-500/10',
      target: 'network',
    },
    {
      label: 'Recent Incidents',
      value: summary?.recentIncidents ?? 0,
      sub: 'Geocoded crime events',
      icon: AlertTriangle,
      color: 'text-amber-400',
      accentColor: 'from-amber-500 to-orange-500',
      border: 'border-amber-500/25',
      bg: 'bg-amber-500/10',
      target: 'incidents',
    },
    {
      label: 'High Priority Cases',
      value: summary?.highPriorityCases ?? 0,
      sub: 'High & Critical severity',
      icon: Flame,
      color: 'text-rose-400',
      accentColor: 'from-rose-500 to-red-500',
      border: 'border-rose-500/25',
      bg: 'bg-rose-500/10',
      target: 'cases',
    },
    {
      label: 'Evidence In Review',
      value: summary?.pendingEvidenceReview ?? 0,
      sub: 'Awaiting lab intake',
      icon: Clock,
      color: 'text-orange-400',
      accentColor: 'from-orange-500 to-amber-500',
      border: 'border-orange-500/25',
      bg: 'bg-orange-500/10',
      target: 'evidence',
    },
    {
      label: 'Closed Cases',
      value: summary?.closedCases ?? 0,
      sub: 'Resolved & archived',
      icon: CheckCircle2,
      color: 'text-blue-400',
      accentColor: 'from-blue-500 to-indigo-500',
      border: 'border-blue-500/25',
      bg: 'bg-blue-500/10',
      target: 'cases',
    },
    {
      label: 'Investigators',
      value: summary?.investigators ?? 0,
      sub: 'Active sworn personnel',
      icon: UserCheck,
      color: 'text-purple-400',
      accentColor: 'from-purple-500 to-pink-500',
      border: 'border-purple-500/25',
      bg: 'bg-purple-500/10',
      target: 'settings',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Tactical Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-intel-card via-intel-panel/50 to-intel-card border border-intel-border/80 shadow-glass-panel backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Central Investigation Command & Telemetry Operations</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Tactical Operations Command
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time database analytics, criminal network telemetry, and cross-case intelligence tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-intel-panel hover:bg-intel-card border border-intel-border/80 text-slate-300 hover:text-cyan-400 transition-all cursor-pointer shadow-sm"
            title="Refresh Database Analytics"
            aria-label="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
          <button
            onClick={() => onNavigate('workspace')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-cyan-glow flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Investigation Studio</span>
          </button>
        </div>
      </div>

      {/* 10 KPI Metric Cards with True Glassmorphism & Top Glowing Edge */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => kpi.target && onNavigate(kpi.target)}
              className={`p-4 rounded-2xl bg-intel-card/95 border ${kpi.border} hover:border-cyan-400/50 hover:shadow-cyan-glow-sm transition-all cursor-pointer group shadow-glass-panel relative overflow-hidden flex flex-col justify-between`}
            >
              {/* Top glowing gradient stripe */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${kpi.accentColor} opacity-70 group-hover:opacity-100 transition-opacity`}></div>

              <div className="flex items-center justify-between mb-3 pt-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider truncate">
                  {kpi.label}
                </span>
                <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform shadow-inner`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-100 tracking-tight font-mono tabular-nums">
                  {loading ? (
                    <span className="inline-block w-12 h-7 bg-intel-panel/80 animate-pulse rounded-lg"></span>
                  ) : (
                    kpi.value.toLocaleString()
                  )}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate font-sans">{kpi.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Database Rule-Based Alert Banner */}
      {alerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-200 font-display">
                Automated Intelligence Alert: {alerts[0]?.reason}
              </div>
              <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                Analytical Trigger: <span className="text-amber-400">{alerts[0]?.analyticalLevel || 'LEVEL-3'}</span> • Risk Severity: <span className="text-rose-400 font-bold">{alerts[0]?.alertLevel || 'HIGH'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('alerts')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 border border-amber-500/40 transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <span>Review Active Alerts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 10 Professional Analytics Charts (Section 3) - Database Driven */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Cases Created vs Closed by Month */}
        <div className="p-5 rounded-2xl bg-intel-card/95 border border-intel-border/90 shadow-glass-panel space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-intel-border/60">
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-display">Monthly Investigation Trajectory</h3>
              <p className="text-[11px] text-slate-400">Cases created vs closed by month from live database</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              LIVE DB
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={casesTrajectory}>
                <defs>
                  <linearGradient id="createdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="closedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" opacity={0.6} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend formatter={(val) => <span className="text-xs text-slate-300 font-mono">{val}</span>} />
                <Area type="monotone" dataKey="created" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#createdGrad)" name="Cases Created" />
                <Area type="monotone" dataKey="closed" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#closedGrad)" name="Cases Closed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Crime Categories Breakdown */}
        <div className="p-5 rounded-2xl bg-intel-card/95 border border-intel-border/90 shadow-glass-panel space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-intel-border/60">
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-display">Crime Categories Breakdown</h3>
              <p className="text-[11px] text-slate-400">Case volume distribution by offense category</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
              DISTRIBUTION
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary?.crimeCategories?.slice(0, 6) || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" horizontal={false} opacity={0.6} />
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis dataKey="category" type="category" stroke="#94A3B8" fontSize={11} width={120} tickLine={false} />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 6, 6, 0]} name="Cases Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Cases by Status */}
        <div className="p-5 rounded-2xl bg-intel-card/95 border border-intel-border/90 shadow-glass-panel space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-intel-border/60">
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-display">Case Status Distribution</h3>
              <p className="text-[11px] text-slate-400">Active, review, inquiry & closed lifecycle stages</p>
            </div>
          </div>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary?.casesByStatus || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="status"
                >
                  {(summary?.casesByStatus || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  formatter={(val) => <span className="text-xs text-slate-300 font-mono">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Cases by Priority Level */}
        <div className="p-5 rounded-2xl bg-intel-card/95 border border-intel-border/90 shadow-glass-panel space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-intel-border/60">
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-display">Investigation Priority Matrix</h3>
              <p className="text-[11px] text-slate-400">Dossiers categorized by risk tier</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary?.casesByPriority || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" opacity={0.6} />
                <XAxis dataKey="priority" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="count" fill="#06B6D4" radius={[6, 6, 0, 0]} name="Cases Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Evidence Types Distribution */}
        <div className="p-5 rounded-2xl bg-intel-card/95 border border-intel-border/90 shadow-glass-panel space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-intel-border/60">
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-display">Evidence Registry Breakdown</h3>
              <p className="text-[11px] text-slate-400">Distribution by forensic classification</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary?.evidenceDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" opacity={0.6} />
                <XAxis dataKey="type" stroke="#64748B" fontSize={10} tickLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} name="Evidence Records" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Incident Velocity Trends */}
        <div className="p-5 rounded-2xl bg-intel-card/95 border border-intel-border/90 shadow-glass-panel space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-intel-border/60">
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-display">Incident Frequency Velocity</h3>
              <p className="text-[11px] text-slate-400">Total incidents vs resolved incidents over time</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              TRENDS
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary?.incidentTrends || []}>
                <defs>
                  <linearGradient id="incidentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" opacity={0.6} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend formatter={(val) => <span className="text-xs text-slate-300 font-mono">{val}</span>} />
                <Area type="monotone" dataKey="incidents" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#incidentGrad)" name="Recorded Incidents" />
                <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#resolvedGrad)" name="Resolved Incidents" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 7: Organization Connections (Syndicate Clustering) */}
        <div className="p-5 rounded-2xl bg-intel-card/95 border border-intel-border/90 shadow-glass-panel space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-intel-border/60">
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-display">Syndicate & Org Connectivity</h3>
              <p className="text-[11px] text-slate-400">Entities with highest relational link counts</p>
            </div>
            <Building2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary?.organizationConnections || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" horizontal={false} opacity={0.6} />
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} width={130} tickLine={false} />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="connections" fill="#A855F7" radius={[0, 6, 6, 0]} name="Network Links" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 8: Vehicle Involvement */}
        <div className="p-5 rounded-2xl bg-intel-card/95 border border-intel-border/90 shadow-glass-panel space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-intel-border/60">
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-display">Vehicle Distribution in Cases</h3>
              <p className="text-[11px] text-slate-400">Fleet profile of transshipment & suspect vehicles</p>
            </div>
            <Car className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary?.vehicleInvolvement || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  nameKey="type"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(summary?.vehicleInvolvement || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PALETTE[(index + 2) % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 9: Investigation Workload (Cases per Investigator) */}
        <div className="p-5 rounded-2xl bg-intel-card/95 border border-intel-border/90 shadow-glass-panel space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between pb-2 border-b border-intel-border/60">
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-display">Investigator Caseload Distribution</h3>
              <p className="text-[11px] text-slate-400">Active assigned dossiers by lead investigator</p>
            </div>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary?.investigationWorkload || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" opacity={0.6} />
                <XAxis dataKey="investigator" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="cases" fill="#0EA5E9" radius={[6, 6, 0, 0]} name="Assigned Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
