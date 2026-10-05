import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Key,
  Sliders,
  Bell,
  Eye,
  CheckCircle2,
  Lock,
  Database,
  Info,
  Laptop
} from 'lucide-react';
import EthicsNoticeBanner from '../components/EthicsNoticeBanner';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();

  const [graphPhysics, setGraphPhysics] = useState(true);
  const [edgeStrengthColor, setEdgeStrengthColor] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const demoAccounts = [
    {
      role: 'ADMIN',
      badge: 'System Administrator',
      email: 'admin@demo.local',
      username: 'admin',
      scope: 'Manage investigators, audit logs, system configuration, global security settings.',
      color: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
    },
    {
      role: 'INVESTIGATOR',
      badge: 'Lead Investigator',
      email: 'investigator@demo.local',
      username: 'investigator',
      scope: 'Create cases, register suspects, manage evidence custody, run AI network analyses.',
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    },
    {
      role: 'ANALYST',
      badge: 'Intelligence Analyst',
      email: 'analyst@demo.local',
      username: 'analyst',
      scope: 'Analyze criminal network topology, review link proposals, export investigative reports.',
      color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    },
    {
      role: 'VIEWER',
      badge: 'Authorized Viewer',
      email: 'viewer@demo.local',
      username: 'viewer',
      scope: 'Read-only access to authorized cases and intelligence dashboards.',
      color: 'border-slate-500/40 text-slate-400 bg-slate-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-intel-card border border-intel-border">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              System Settings & Security Configuration
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                RBAC v2.4
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Investigator profile preferences, graph engine rendering params, and demo role registry.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      <EthicsNoticeBanner />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: User Profile & Graph Preferences (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Investigator Profile Card */}
          <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Investigator Profile Dossier</span>
            </h3>

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-cyan-glow shrink-0">
                {user?.fullName?.charAt(0) || 'M'}
              </div>
              <div className="space-y-1">
                <div className="text-base font-bold text-slate-100">
                  {user?.fullName || 'Marcus Holloway'}
                </div>
                <div className="text-xs text-cyan-400 font-mono">
                  Badge: #INV-4921 • Department of Intelligence
                </div>
                <div className="text-xs text-slate-400">{user?.email || 'investigator@demo.local'}</div>
                <div className="pt-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/40">
                    Role: {user?.role || 'INVESTIGATOR'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Graph Preferences */}
          <form
            onSubmit={handleSavePreferences}
            className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4"
          >
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Cytoscape Graph & Telemetry Options</span>
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-intel-panel/50 border border-intel-border cursor-pointer hover:border-cyan-500/30 transition-colors">
                <div>
                  <div className="font-semibold text-slate-200">Force-Directed Physics Simulation</div>
                  <div className="text-[11px] text-slate-400">
                    Enable active node repulsion and organic clustering during layout recalculations.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={graphPhysics}
                  onChange={(e) => setGraphPhysics(e.target.checked)}
                  className="accent-cyan-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-intel-panel/50 border border-intel-border cursor-pointer hover:border-cyan-500/30 transition-colors">
                <div>
                  <div className="font-semibold text-slate-200">Dynamic Edge Strength Rendering</div>
                  <div className="text-[11px] text-slate-400">
                    Thicken connection lines automatically for relationships exceeding 75% strength score.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={edgeStrengthColor}
                  onChange={(e) => setEdgeStrengthColor(e.target.checked)}
                  className="accent-cyan-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-intel-panel/50 border border-intel-border cursor-pointer hover:border-cyan-500/30 transition-colors">
                <div>
                  <div className="font-semibold text-slate-200">Real-Time Anomaly Notifications</div>
                  <div className="text-[11px] text-slate-400">
                    Flash alerts on the global navigation bar when new high-severity signals are recorded.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="accent-cyan-500 rounded"
                />
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-cyan-glow"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Demo Accounts & RBAC Guide (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Role-Based Access Control (RBAC) Registry</span>
            </h3>
            <p className="text-xs text-slate-400">
              The system supports four distinct operational tiers with BCrypt password authentication.
              All seeded demo accounts share the password: <code className="text-cyan-400 font-mono">Password@123</code>
            </p>

            <div className="space-y-3 pt-2">
              {demoAccounts.map((acc) => (
                <div
                  key={acc.role}
                  className="p-3.5 rounded-xl bg-intel-panel/40 border border-intel-border space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${acc.color}`}
                    >
                      {acc.role}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      User: <strong>{acc.username}</strong>
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-200">{acc.badge}</div>
                  <p className="text-[11px] text-slate-400 leading-tight">{acc.scope}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
