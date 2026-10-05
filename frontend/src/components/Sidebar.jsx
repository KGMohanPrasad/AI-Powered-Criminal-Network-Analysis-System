import React from 'react';
import {
  LayoutDashboard,
  Network,
  Users,
  Briefcase,
  AlertTriangle,
  FileText,
  Building2,
  MapPin,
  Car,
  MessageSquare,
  BarChart3,
  BellRing,
  ClipboardList,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  Radar,
  UserCog,
  Map,
  Cpu,
  Globe,
  Radio,
  ShieldAlert,
  Activity
} from 'lucide-react';

export default function Sidebar({ currentPage, onNavigate, isCollapsed, onToggleCollapse }) {
  const navigationSections = [
    {
      title: 'Operational Intel',
      items: [
        { id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
        { id: 'workspace', label: 'Investigation Workspace', icon: Radar, badge: 'CORE', highlight: true },
        { id: 'ai-analysis', label: 'AI Intelligence Hub', icon: Cpu, badge: 'AIML', highlight: true },
        { id: 'data-intelligence', label: 'Live Data Intel', icon: Radio, badge: 'LIVE', highlight: true },
        { id: 'external-review', label: 'External Review Queue', icon: ShieldAlert },
        { id: 'data-sources', label: 'Data Sources & Feeds', icon: Globe },
      ]
    },
    {
      title: 'Investigation Entities',
      items: [
        { id: 'cases', label: 'Cases Registry', icon: Briefcase },
        { id: 'persons', label: 'Persons of Interest', icon: Users },
        { id: 'network', label: 'Network Studio', icon: Network },
        { id: 'incidents', label: 'Incident Records', icon: AlertTriangle },
        { id: 'evidence', label: 'Evidence & Custody', icon: FileText },
        { id: 'organizations', label: 'Organizations', icon: Building2 },
        { id: 'vehicles', label: 'Vehicles Registry', icon: Car },
        { id: 'locations', label: 'Location Registry', icon: MapPin },
      ]
    },
    {
      title: 'Geospatial & Telemetry',
      items: [
        { id: 'crime-map', label: 'Geographic Crime Map', icon: Map },
        { id: 'communications', label: 'Communications Traffic', icon: MessageSquare },
        { id: 'analytics', label: 'Crime Analytics', icon: BarChart3 },
        { id: 'alerts', label: 'Rule-Based Alerts', icon: BellRing },
      ]
    },
    {
      title: 'Governance & Admin',
      items: [
        { id: 'reports', label: 'Investigative Reports', icon: ClipboardList },
        { id: 'audit-logs', label: 'Security Audit Logs', icon: Shield },
        { id: 'users', label: 'User Management', icon: UserCog },
        { id: 'settings', label: 'System Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside
      className={`relative z-20 flex flex-col border-r border-intel-border/80 bg-intel-card/95 backdrop-blur-xl transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-intel-border/70 bg-intel-base/40">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative p-2 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-blue-600 shadow-cyan-glow-sm text-white shrink-0">
              <Network className="w-5 h-5 animate-pulse-subtle" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-intel-card"></span>
            </div>
            <div className="leading-tight">
              <div className="font-display text-sm font-black tracking-wider uppercase bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent">
                Aegis Intel
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-tight flex items-center gap-1">
                <span>SEC-CORE</span>
                <span className="text-cyan-500/80">•</span>
                <span>v3.4.1</span>
              </div>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mx-auto relative p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-cyan-glow-sm">
            <Network className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-intel-card"></span>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-intel-panel border border-intel-border/40 hover:border-cyan-500/30 transition-all hidden sm:flex items-center justify-center"
          title={isCollapsed ? 'Expand Navigation (Click)' : 'Collapse Navigation (Click)'}
          aria-label={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4 text-cyan-400" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navigationSections.map((section, idx) => (
          <div key={section.title || idx} className="space-y-1">
            {/* Section Header */}
            {!isCollapsed ? (
              <div className="px-3 pt-2 pb-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>{section.title}</span>
                <span className="text-[9px] text-slate-400 opacity-60">0{idx + 1}</span>
              </div>
            ) : (
              <div className="my-2 border-t border-intel-border/40 mx-2" />
            )}

            {/* Section Items */}
            {section.items.map((item) => {
              const isActive = currentPage === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center w-full px-3 py-2 rounded-xl text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/25 via-cyan-500/15 to-transparent text-cyan-200 border-l-4 border-l-cyan-400 border-y border-r border-intel-border shadow-sm'
                      : item.highlight
                      ? 'text-slate-200 hover:bg-intel-panel/60 border border-cyan-500/20 hover:border-cyan-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-intel-panel/40 border border-transparent'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive
                        ? 'text-cyan-300 scale-110'
                        : item.highlight
                        ? 'text-cyan-400'
                        : 'text-slate-300 group-hover:text-cyan-300 group-hover:scale-105'
                    }`}
                  />

                  {!isCollapsed && (
                    <span className="ml-3 truncate font-sans text-left flex-1 tracking-tight">
                      {item.label}
                    </span>
                  )}

                  {!isCollapsed && item.badge && (
                    <span
                      className={`ml-auto px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider font-semibold border ${
                        isActive
                          ? 'bg-cyan-400/20 text-cyan-200 border-cyan-400/40'
                          : 'bg-cyan-950/60 text-cyan-400 border-cyan-800/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Collapsed Tooltip */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-intel-card border border-intel-border text-slate-100 text-xs shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Info / Deterministic Assurance Capsule */}
      {!isCollapsed ? (
        <div className="p-3 border-t border-intel-border/70 bg-intel-base/60">
          <div className="p-2.5 rounded-xl bg-gradient-to-b from-intel-panel/70 to-intel-card border border-intel-border/80 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200 mb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="font-display tracking-tight">Deterministic Core</span>
              </div>
              <Activity className="w-3 h-3 text-cyan-400" />
            </div>
            <p className="text-[10px] text-slate-300 leading-snug">
              Graph relational intelligence with verified audit trails & RBAC enforcement.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-intel-border/70 text-center">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 mx-auto animate-pulse" title="System Active & Encrypted" />
        </div>
      )}
    </aside>
  );
}
