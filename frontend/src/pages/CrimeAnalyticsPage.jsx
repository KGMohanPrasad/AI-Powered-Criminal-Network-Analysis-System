import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Activity,
  Layers,
  Calendar,
  Filter,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import EthicsNoticeBanner from '../components/EthicsNoticeBanner';
import { dashboardApi, incidentsApi, casesApi } from '../services/api';

const COLORS = ['#06B6D4', '#8B5CF6', '#10B981', '#F59E0B', '#F43F5E', '#3B82F6'];

export default function CrimeAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6M');

  // Multi-series incident trends by month
  const monthlyTrends = [
    { month: 'Apr 2026', incidents: 14, casesOpened: 3, casesResolved: 2, networkLinks: 18 },
    { month: 'May 2026', incidents: 22, casesOpened: 5, casesResolved: 4, networkLinks: 32 },
    { month: 'Jun 2026', incidents: 18, casesOpened: 4, casesResolved: 3, networkLinks: 28 },
    { month: 'Jul 2026', incidents: 29, casesOpened: 7, casesResolved: 5, networkLinks: 45 },
    { month: 'Aug 2026', incidents: 24, casesOpened: 6, casesResolved: 6, networkLinks: 38 },
    { month: 'Sep 2026', incidents: 31, casesOpened: 8, casesResolved: 7, networkLinks: 52 },
  ];

  // Category distribution
  const categoryData = [
    { name: 'Cargo & Logistics Theft', value: 34 },
    { name: 'Invoice Fraud & Shell Co.', value: 26 },
    { name: 'Cyber Intrusion & Phishing', value: 18 },
    { name: 'Vehicle Theft Ring', value: 14 },
    { name: 'Property Burglary', value: 8 },
  ];

  // Workload per Lead Investigator
  const investigatorWorkload = [
    { investigator: 'M. Holloway', activeCases: 6, closedCases: 8, verifiedLinks: 24 },
    { investigator: 'A. Chen', activeCases: 4, closedCases: 5, verifiedLinks: 18 },
    { investigator: 'S. Rodriguez', activeCases: 3, closedCases: 7, verifiedLinks: 15 },
    { investigator: 'R. Sterling', activeCases: 2, closedCases: 4, verifiedLinks: 11 },
  ];

  // Hotspot locations
  const hotspotLocations = [
    { location: 'Central Logistics Hub, Dock 4', incidentCount: 8, severity: 'High' },
    { location: 'Harbor Road Freight Checkpoint', incidentCount: 6, severity: 'Medium' },
    { location: 'Metro Financial District, Tower 2', incidentCount: 5, severity: 'Medium' },
    { location: 'East Warehouse District, Shed 9', incidentCount: 4, severity: 'Low' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-intel-card border border-intel-border">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Crime Intelligence & Network Analytics
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                Executive Telemetry
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Aggregated temporal trends, investigator workload distribution, and hotspot analytics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['1M', '3M', '6M', '1Y', 'ALL'].map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors ${
                timeRange === r
                  ? 'bg-cyan-600 text-white shadow-cyan-glow'
                  : 'bg-intel-panel border border-intel-border text-slate-400 hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <EthicsNoticeBanner />

      {/* Row 1: Crime Trends Area Chart + Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Longitudinal Incident & Network Growth */}
        <div className="lg:col-span-8 p-4 rounded-2xl bg-intel-card border border-intel-border flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Longitudinal Incident Velocity & Network Expansion</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Monthly incidents reported vs synthetic relational connections discovered.
              </p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Incidents
              </span>
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Network Links
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLinks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
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
                <Area
                  type="monotone"
                  dataKey="incidents"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorIncidents)"
                />
                <Area
                  type="monotone"
                  dataKey="networkLinks"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorLinks)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crime Category Share Donut */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-intel-card border border-intel-border flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <span>Offense Category Breakdown</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-2">
              Proportional distribution of active offenses.
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
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

          <div className="space-y-1 text-[11px]">
            {categoryData.slice(0, 4).map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  ></span>
                  <span className="truncate max-w-[170px]">{d.name}</span>
                </span>
                <span className="font-mono text-cyan-400 font-semibold">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Investigator Workload Bar Chart + Hotspot Repeat Incident Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Workload */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-intel-card border border-intel-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Investigator Case Load & Verified Linkage Volume</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Staff distribution of active vs resolved cases and verified associations.
              </p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={investigatorWorkload}>
                <XAxis
                  dataKey="investigator"
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
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar
                  dataKey="activeCases"
                  name="Active Cases"
                  fill="#06B6D4"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="closedCases"
                  name="Closed Cases"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="verifiedLinks"
                  name="Verified Links"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hotspots */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-intel-card border border-intel-border flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Locations with Repeated Incidents</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">
              Spatial recurring markers in synthetic case portfolios.
            </p>
          </div>

          <div className="space-y-2.5">
            {hotspotLocations.map((loc, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-intel-panel/50 border border-intel-border flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-200 text-xs">{loc.location}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Temporal cluster: 4 unique cases
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-xs text-rose-400">
                    {loc.incidentCount} Incidents
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                      loc.severity === 'High'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {loc.severity} Density
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
