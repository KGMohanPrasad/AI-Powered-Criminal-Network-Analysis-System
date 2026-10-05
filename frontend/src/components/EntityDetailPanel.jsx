import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  Briefcase,
  Users,
  Building2,
  Car,
  MapPin,
  MessageSquare,
  FileText,
  Clock,
  Plus,
  ExternalLink,
  Share2,
  CheckCircle2,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export default function EntityDetailPanel({ entity, onClose, onNavigate, onAddRelationship, onAddNote }) {
  // Hook must be called unconditionally before early returns (React Rules of Hooks)
  const [activeTab, setActiveTab] = useState('overview');

  if (!entity) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUSPECT':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">SUSPECT</span>;
      case 'PERSON_OF_INTEREST':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">PERSON OF INTEREST</span>;
      case 'WITNESS':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">WITNESS</span>;
      case 'ASSOCIATE':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">ASSOCIATE</span>;
      case 'CLEARED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">CLEARED</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-500/20 text-slate-300 border border-slate-500/40">{status || 'ACTIVE'}</span>;
    }
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-700/60">CRITICAL RISK</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-700/60">HIGH RISK</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60">MEDIUM RISK</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-900/80 text-slate-400 border border-slate-700/60">LOW RISK</span>;
    }
  };

  const isPerson = entity.entityType === 'Person';

  return (
    <div className="w-full sm:w-96 bg-intel-card/95 border-l border-intel-border/90 h-full flex flex-col shadow-glass-edge z-20 overflow-hidden animate-in slide-in-from-right duration-200 backdrop-blur-2xl">
      {/* Header */}
      <div className="p-4 border-b border-intel-border/80 bg-intel-base/60 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-600 to-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-cyan-glow-sm">
            {entity.label ? entity.label.slice(0, 2).toUpperCase() : 'ID'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-100 font-display">{entity.label}</span>
            </div>
            <div className="text-xs text-cyan-400 font-mono tracking-tight">{entity.id}</div>
            <div className="flex items-center gap-1.5 mt-1">
              {getStatusBadge(entity.status)}
              {getRiskBadge(entity.riskLevel)}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-intel-panel border border-transparent hover:border-intel-border transition-all"
          aria-label="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-intel-border/70 bg-intel-base/40 px-3 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-2.5 font-medium border-b-2 transition-all font-display tracking-tight ${
            activeTab === 'overview'
              ? 'border-cyan-400 text-cyan-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('connections')}
          className={`px-3 py-2.5 font-medium border-b-2 transition-all font-display tracking-tight flex items-center gap-1.5 ${
            activeTab === 'connections'
              ? 'border-cyan-400 text-cyan-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Relations</span>
          <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
            {entity.degree || 1}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-3 py-2.5 font-medium border-b-2 transition-all font-display tracking-tight ${
            activeTab === 'timeline'
              ? 'border-cyan-400 text-cyan-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Timeline
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Synthetic Person / Entity Info */}
            <div className="p-3.5 rounded-2xl bg-intel-panel/60 border border-intel-border/80 shadow-sm space-y-2.5">
              <div className="text-[10px] font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                <span>Investigative Parameters</span>
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="grid grid-cols-2 gap-2.5 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Entity Type</span>
                  <span className="font-semibold text-slate-100">{entity.entityType}</span>
                </div>
                {isPerson && (
                  <>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">Moniker / Alias</span>
                      <span className="font-semibold text-cyan-300">{entity.subLabel || 'None recorded'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">Demographics</span>
                      <span className="font-medium text-slate-200">{entity.details?.age || 38} y/o • {entity.details?.gender || 'Male'}</span>
                    </div>
                  </>
                )}
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Primary Coordinates</span>
                  <span className="font-medium text-slate-200">{entity.details?.location || 'Central Metro Hub'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Graph Centrality</span>
                  <span className="font-bold text-amber-400 tabular-nums">{entity.centrality || 24}% (Indexed)</span>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="p-3.5 rounded-2xl bg-intel-panel/40 border border-intel-border/70 shadow-sm">
              <div className="text-[11px] font-bold text-slate-200 mb-1 font-display">Investigative Assessment</div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {entity.details?.notes || entity.details?.description || 'Subject identified in cross-agency freight interception monitoring log. Observed coordinating logistical transshipments with associated shell entities.'}
              </p>
            </div>

            {/* Associated Cases */}
            <div className="p-3.5 rounded-2xl bg-intel-panel/40 border border-intel-border/70 shadow-sm space-y-2">
              <div className="text-[11px] font-bold text-slate-200 flex items-center justify-between font-display">
                <span>Associated Dossiers</span>
                <span className="text-[10px] text-cyan-400 font-mono">2 Active</span>
              </div>
              <div className="space-y-1.5">
                <div
                  onClick={() => onNavigate && onNavigate('case-workspace', 'CASE-2026-0001')}
                  className="p-2.5 rounded-xl bg-intel-card border border-intel-border/80 hover:border-cyan-500/50 hover:bg-intel-panel/80 cursor-pointer transition-all shadow-sm group"
                >
                  <div className="font-mono font-bold text-xs text-cyan-300 group-hover:text-cyan-200">CASE-2026-0001</div>
                  <div className="text-[11px] text-slate-400">Warehouse High-Value Cargo Theft</div>
                </div>
                <div
                  onClick={() => onNavigate && onNavigate('case-workspace', 'CASE-2026-0002')}
                  className="p-2.5 rounded-xl bg-intel-card border border-intel-border/80 hover:border-cyan-500/50 hover:bg-intel-panel/80 cursor-pointer transition-all shadow-sm group"
                >
                  <div className="font-mono font-bold text-xs text-cyan-300 group-hover:text-cyan-200">CASE-2026-0002</div>
                  <div className="text-[11px] text-slate-400">Fraudulent Shell Invoice Syndicate</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'connections' && (
          <div className="space-y-2.5">
            <div className="text-[11px] text-slate-400 mb-2">
              Verified & under-review multi-hop connections with this entity:
            </div>
            {[
              { id: 'DEMO-P008', name: 'Samantha Reed', role: 'ASSOCIATED_WITH', str: '85%', tag: 'Verified' },
              { id: 'ORG-0001', name: 'Orion Logistics International', role: 'EMPLOYED_BY', str: '90%', tag: 'Verified' },
              { id: 'VEH-0002', name: 'Defender 110 (TN-00-DEMO-002)', role: 'OWNS', str: '95%', tag: 'Verified' },
              { id: 'DEMO-P017', name: 'Leonidas Drake', role: 'COMMUNICATED_WITH', str: '82%', tag: 'Verified' },
            ].map((conn, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-intel-panel/50 border border-intel-border/70 flex items-center justify-between shadow-sm">
                <div>
                  <div className="font-semibold text-slate-100">{conn.name}</div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{conn.role} • <span className="tabular-nums">{conn.str}</span> Strength</div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-semibold border border-emerald-500/30">
                  {conn.tag}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="relative pl-5 space-y-4 border-l border-intel-border/70 mt-2">
            <div className="relative">
              <span className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-intel-card"></span>
              <div className="text-[10px] text-slate-400 font-mono tabular-nums">14 Jan 2026, 02:15 AM</div>
              <div className="font-semibold text-slate-100 text-xs mt-0.5">Incident INC-2026-0001 Observed</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Terminal 4 gate seal breached; RFID transponder clone detected.</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-amber-400 ring-4 ring-intel-card"></span>
              <div className="text-[10px] text-slate-400 font-mono tabular-nums">20 Jan 2026, 11:40 AM</div>
              <div className="font-semibold text-slate-100 text-xs mt-0.5">Wire Transfer Verification</div>
              <p className="text-[11px] text-slate-400 mt-0.5">EV-0004 Dummy invoice matching ledger records recovered.</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-purple-400 ring-4 ring-intel-card"></span>
              <div className="text-[10px] text-slate-400 font-mono tabular-nums">24 Sep 2026, 08:30 PM</div>
              <div className="font-semibold text-slate-100 text-xs mt-0.5">The Obsidian Club Meeting</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Unscheduled meeting logged with financial consultants.</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-3.5 border-t border-intel-border/80 bg-intel-base/70 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onNavigate && onNavigate(isPerson ? 'person-profile' : 'workspace', entity.id)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-intel-card border border-intel-border/80 hover:border-cyan-500/50 hover:text-cyan-300 transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Full Profile</span>
          </button>
          <button
            onClick={() => onNavigate && onNavigate('network', entity.id)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all flex items-center justify-center gap-1.5 shadow-cyan-glow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-950" />
            <span>View Network</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onAddRelationship && onAddRelationship(entity)}
            className="px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-intel-panel/60 border border-intel-border/70 hover:bg-intel-panel hover:text-white transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Add Relation</span>
          </button>
          <button
            onClick={() => onAddNote && onAddNote(entity)}
            className="px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-intel-panel/60 border border-intel-border/70 hover:bg-intel-panel hover:text-white transition-all flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Add Note</span>
          </button>
        </div>
      </div>
    </div>
  );
}
