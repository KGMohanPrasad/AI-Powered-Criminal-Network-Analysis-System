import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  User,
  Briefcase,
  FileText,
  AlertCircle,
  Building2,
  Car,
  ArrowRight,
  Radar,
  Network,
  MapPin,
  Command,
  CornerDownLeft
} from 'lucide-react';
import { searchApi } from '../services/api';

export default function CommandPalette({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({});
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchApi.searchAll(query);
        if (res.data) {
          setResults(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const quickActions = [
    { label: 'Live Public Intelligence Feed', page: 'data-intelligence', icon: Radar, desc: 'Real-time open data, police bulletins, and crime trends' },
    { label: 'Data Sources & Scraper Engine', page: 'data-sources', icon: Network, desc: 'Manage approved open-data crawlers and sync jobs' },
    { label: 'External Review Queue', page: 'external-review', icon: Briefcase, desc: 'Human-in-the-loop review of incoming external data' },
    { label: 'Investigation Workspace', page: 'workspace', icon: Radar, desc: 'Open multi-pane criminal graph inspector' },
    { label: 'Network Studio & Path Finding', page: 'network', icon: Network, desc: 'Interactive graph visualization and BFS path finder' },
    { label: 'Geographic Crime Map', page: 'crime-map', icon: MapPin, desc: 'OpenStreetMap incident clusters & waypoints' },
    { label: 'Cases Registry', page: 'cases', icon: Briefcase, desc: 'Dossier management & case workflows' },
  ];

  const getIconForType = (type) => {
    switch (type) {
      case 'PERSON': return <User className="w-4 h-4 text-cyan-400" />;
      case 'CASE': return <Briefcase className="w-4 h-4 text-blue-400" />;
      case 'EVIDENCE': return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'INCIDENT': return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'ORGANIZATION': return <Building2 className="w-4 h-4 text-purple-400" />;
      case 'VEHICLE': return <Car className="w-4 h-4 text-rose-400" />;
      default: return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/75 backdrop-blur-xl transition-all duration-200">
      <div className="w-full max-w-2xl bg-intel-card/95 border border-cyan-500/30 rounded-2xl shadow-glass-edge overflow-hidden flex flex-col max-h-[82vh] animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-intel-border/80 bg-intel-panel/60">
          <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
          <input
            type="text"
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm focus:outline-none font-sans"
            placeholder="Search suspects, dossiers, evidence vault, plates, or commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:text-slate-100 text-slate-400 transition-colors"
              aria-label="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="ml-3 px-2 py-0.5 text-[10px] font-mono bg-intel-panel text-slate-400 border border-intel-border rounded-md shadow-sm">
            ESC
          </kbd>
        </div>

        {/* Search Results / Quick Actions */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2.5">
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="font-mono">Querying relational intelligence indices...</span>
            </div>
          )}

          {!query && (
            <div>
              <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Command className="w-3.5 h-3.5 text-cyan-400" />
                <span>Command Actions & Tactical Workspaces</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickActions.map((qa, i) => (
                  <button
                    key={i}
                    onClick={() => { onNavigate(qa.page); onClose(); }}
                    className="flex items-center gap-3 p-3 text-left rounded-xl bg-intel-panel/40 border border-intel-border/70 hover:border-cyan-500/50 hover:bg-intel-panel/80 transition-all group shadow-sm"
                  >
                    <div className="p-2 rounded-xl bg-intel-card border border-intel-border/80 text-cyan-400 group-hover:scale-105 transition-transform shadow-inner">
                      <qa.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 truncate font-sans">
                        {qa.label}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{qa.desc}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {Object.keys(results).length > 0 && (
            <div className="space-y-4">
              {Object.entries(results).map(([category, items]) => (
                <div key={category}>
                  <div className="text-[10px] font-mono font-semibold text-cyan-400 tracking-wider uppercase mb-2 flex items-center gap-1.5">
                    <span>{category}</span>
                    <span className="text-[10px] text-slate-400">({items.length} records)</span>
                  </div>
                  <div className="space-y-1">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if (item.type === 'CASE') onNavigate('case-workspace', item.id);
                          else if (item.type === 'PERSON') onNavigate('person-profile', item.id);
                          else if (item.type === 'EVIDENCE') onNavigate('evidence');
                          else if (item.type === 'INCIDENT') onNavigate('crime-map');
                          else onNavigate('workspace');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-intel-panel/30 border border-intel-border/50 hover:border-cyan-500/50 hover:bg-intel-panel/70 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-intel-card border border-intel-border/80 shrink-0">
                            {getIconForType(item.type)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-100 group-hover:text-cyan-200 truncate">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate font-sans">{item.subtitle}</div>
                          </div>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-intel-card border border-intel-border text-cyan-300 font-semibold shrink-0 ml-2">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {query && !loading && Object.keys(results).length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400 font-mono">
              No matching intelligence entries found for query "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-intel-border/70 bg-intel-base/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="truncate">Search suspects, case dossiers, evidence & vehicles</span>
          <span className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-intel-panel border border-intel-border text-[9px]">ESC</kbd> close
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-intel-panel border border-intel-border text-[9px]">↵</kbd> select
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
