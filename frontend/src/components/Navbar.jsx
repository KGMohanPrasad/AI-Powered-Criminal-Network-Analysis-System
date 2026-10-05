import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Settings,
  LogOut,
  Shield,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  X,
  Trash2,
  ExternalLink,
  Clock,
  Radio,
  Sliders,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationsApi } from '../services/api';

export default function Navbar({ currentPage, onOpenSearch, onNavigate }) {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentTime, setCurrentTime] = useState('');

  // Live tactical UTC/Local time indicator
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utcStr = now.toISOString().slice(11, 19) + ' UTC';
      setCurrentTime(utcStr);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000); // 1 min poll
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await notificationsApi.getNotifications();
      const list = res.data || [];
      setNotifications(list);
      setUnreadCount(list.filter(n => !n.read).length);
    } catch (err) {
      // Fallback local notifications
      setNotifications([
        { id: 1, title: 'Evidence Transfer Logged', message: 'Physical item EV-0001 transferred to State Forensics Vault.', createdAt: '10m ago', read: false, linkUrl: 'evidence' },
        { id: 2, title: 'Case Dossier Priority Updated', message: 'CASE-2026-0001 status confirmed HIGH following syndicate review.', createdAt: '45m ago', read: false, linkUrl: 'cases' },
        { id: 3, title: 'Network Association Verified', message: 'Verified 85% strength relationship established for DEMO-P008.', createdAt: '2h ago', read: true, linkUrl: 'network' },
      ]);
      setUnreadCount(2);
    }
  };

  const handleMarkAsRead = async (id, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const handleDeleteNotif = async (id, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      await notificationsApi.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => notifications.find(n => n.id === id)?.read ? prev : Math.max(0, prev - 1));
    } catch (err) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleNotificationClick = (notif) => {
    if (!notif.read) {
      handleMarkAsRead(notif.id, { stopPropagation: () => {} });
    }
    setShowNotifications(false);
    if (notif.linkUrl && onNavigate) {
      onNavigate(notif.linkUrl);
    } else if (onNavigate) {
      onNavigate('alerts');
    }
  };

  const getPageTitle = (page) => {
    const titles = {
      dashboard: 'Tactical Command Center',
      workspace: 'Investigation Workspace',
      cases: 'Case Dossiers & Records',
      'case-workspace': 'Case Dossier Studio',
      persons: 'Persons of Interest Registry',
      'person-profile': 'Target Profile Dossier',
      network: 'Network Analysis & BFS Graph',
      'ai-analysis': 'AI Intelligence & Prediction Hub',
      incidents: 'Incident Master Log',
      evidence: 'Evidence & Chain of Custody',
      organizations: 'Syndicate & Org Intelligence',
      locations: 'Geographic Infrastructure',
      'crime-map': 'Incident Clusters & Heatmap',
      vehicles: 'Tactical Vehicle Tracking',
      communications: 'Telecommunication Intercepts',
      analytics: 'Crime Pattern Analytics',
      alerts: 'Automated Rule Alerts',
      reports: 'Investigative Briefings',
      'audit-logs': 'Security Audit & Compliance',
      users: 'Operator & Access Control',
      settings: 'System Configuration',
      'data-sources': 'Data Connectors & Scrapers',
      'data-intelligence': 'Live Public Intelligence Feeds',
      'external-review': 'External Ingestion Review Queue',
    };
    return titles[page] || 'Platform Operations';
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 tracking-wider">ADMIN</span>;
      case 'ROLE_INVESTIGATOR':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 tracking-wider">INVESTIGATOR</span>;
      case 'ROLE_ANALYST':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 tracking-wider">ANALYST</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-500/20 text-slate-300 border border-slate-500/40 tracking-wider">OPERATOR</span>;
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-intel-card/90 border-b border-intel-border/80 backdrop-blur-xl">
      {/* Left: Breadcrumbs & Tactical Context */}
      <div className="flex items-center gap-3 md:gap-5 flex-1 max-w-xl">
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-cyan-400 font-bold tracking-wider">AEGIS</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200 font-semibold truncate">{getPageTitle(currentPage)}</span>
        </div>

        {/* Global Search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center justify-between w-full max-w-md px-3.5 py-1.5 text-xs text-slate-400 bg-intel-panel/70 border border-intel-border/80 rounded-xl hover:border-cyan-500/50 hover:bg-intel-panel transition-all group shadow-inner"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="font-sans truncate text-slate-300 group-hover:text-slate-100">
              Quick search entities, cases, plates...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-cyan-300 bg-intel-card border border-intel-border rounded-md shadow-sm">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Center: Live UTC Telemetry indicator (visible on large screens) */}
      <div className="hidden xl:flex items-center gap-3 px-3 py-1 rounded-full bg-intel-base/70 border border-intel-border/60 text-slate-400 font-mono text-xs">
        <Clock className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-slate-300 tabular-nums">{currentTime || '00:00:00 UTC'}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60"></span>
        <span className="text-emerald-400 text-[11px] font-semibold tracking-wider">ENCRYPTED</span>
      </div>

      {/* Right: Operational Status, Notifications & Profile */}
      <div className="flex items-center gap-2.5 md:gap-3">
        {/* Live operational clearance badge */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono tracking-wider font-semibold">SECURE // LIVE</span>
        </div>

        {/* Notifications Center Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-intel-panel border border-intel-border/50 hover:border-cyan-500/40 transition-all shadow-sm"
            title="Investigation Alerts & Feeds"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 shadow-sm"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-intel-card border border-intel-border/90 rounded-2xl shadow-glass-edge py-3 z-50 animate-in fade-in zoom-in-95 backdrop-blur-2xl">
              <div className="flex items-center justify-between px-4 pb-2.5 border-b border-intel-border/70">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-100 font-display">Tactical Intel Feeds</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-500/30">
                      {unreadCount} UNREAD
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium hover:underline transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-intel-border/40 max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-3.5 hover:bg-intel-panel/60 cursor-pointer transition-all ${
                        !notif.read ? 'bg-cyan-500/5 border-l-2 border-l-cyan-400' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                          {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>}
                          <span className="leading-tight">{notif.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {notif.createdAt?.includes('T') ? notif.createdAt.split('T')[0] : notif.createdAt || 'Recent'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {notif.message || notif.desc}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-intel-border/30 text-[10px]">
                        <span className="text-cyan-400 hover:underline flex items-center gap-1 font-medium">
                          Open record <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                        <div className="flex items-center gap-2">
                          {!notif.read && (
                            <button
                              onClick={(e) => handleMarkAsRead(notif.id, e)}
                              className="text-slate-400 hover:text-cyan-300 transition-colors"
                              title="Mark read"
                            >
                              Mark read
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDeleteNotif(notif.id, e)}
                            className="text-slate-500 hover:text-rose-400 transition-colors"
                            title="Dismiss notification"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    All intelligence streams clear. No active alerts.
                  </div>
                )}
              </div>

              <div className="pt-2 px-4 border-t border-intel-border/70 text-center">
                <button
                  onClick={() => { setShowNotifications(false); onNavigate && onNavigate('alerts'); }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium tracking-wide flex items-center justify-center gap-1 mx-auto"
                >
                  <span>Review All Rule Alerts</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Capsule */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-intel-panel/60 border border-intel-border/80 hover:border-cyan-500/40 hover:bg-intel-panel transition-all shadow-sm"
          >
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 via-sky-600 to-blue-700 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : 'OP'}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-intel-card"></span>
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-100 leading-tight">
                {user?.fullName || 'Senior Investigator'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-tight">
                {user?.badgeNumber || 'BADGE-AEGIS-01'}
              </div>
            </div>
            <div className="hidden md:block ml-1">
              {getRoleBadge(user?.role)}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2.5 w-60 bg-intel-card border border-intel-border/90 rounded-2xl shadow-glass-edge py-2 z-50 animate-in fade-in zoom-in-95 backdrop-blur-2xl">
              <div className="px-4 py-2.5 border-b border-intel-border/70 bg-intel-base/40">
                <div className="text-xs font-bold text-slate-100 font-display">{user?.fullName || 'Senior Investigator'}</div>
                <div className="text-[11px] text-slate-400 font-mono truncate">{user?.email || 'investigator@aegis.gov'}</div>
                <div className="mt-2 flex items-center justify-between">
                  {getRoleBadge(user?.role)}
                  <span className="text-[10px] font-mono text-emerald-400">CLR: TOP-SECRET</span>
                </div>
              </div>

              <div className="py-1.5">
                <button
                  onClick={() => { setShowProfileMenu(false); onNavigate && onNavigate('settings'); }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-xs text-slate-300 hover:bg-intel-panel hover:text-cyan-300 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profile & Encryption Keys</span>
                </button>
                <button
                  onClick={() => { setShowProfileMenu(false); onNavigate && onNavigate('audit-logs'); }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-xs text-slate-300 hover:bg-intel-panel hover:text-cyan-300 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Security Audit Logs</span>
                </button>
                {user?.role === 'ROLE_ADMIN' && (
                  <button
                    onClick={() => { setShowProfileMenu(false); onNavigate && onNavigate('users'); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2 text-xs text-slate-300 hover:bg-intel-panel hover:text-cyan-300 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Investigator Access Control</span>
                  </button>
                )}
              </div>

              <div className="pt-1.5 border-t border-intel-border/70">
                <button
                  onClick={logout}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Terminate Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
