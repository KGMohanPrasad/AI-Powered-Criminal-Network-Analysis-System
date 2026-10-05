import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Network,
  AlertTriangle,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { aiApi } from '../services/api';
import EthicsNoticeBanner from '../components/EthicsNoticeBanner';
import { toast } from '../utils/toast';

export default function AiIntelligencePage({ onNavigate }) {
  const [analysis, setAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTool, setActiveTool] = useState('discovery');
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [aiRes, sugRes] = await Promise.all([
        aiApi.getGlobalAnalysis(),
        aiApi.getSuggestions()
      ]);
      if (aiRes.success) setAnalysis(aiRes.data);
      if (sugRes.success) setSuggestions(sugRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReviewSuggestion = async (id, action) => {
    try {
      const res = await aiApi.reviewSuggestion(id, action);
      if (res.success) {
        setActionSuccess(`Suggestion successfully ${action.toLowerCase()}ed.`);
        toast.success(`Suggestion successfully ${action.toLowerCase()}ed.`);
        setTimeout(() => setActionSuccess(''), 3000);
        loadData();
      }
    } catch (err) {
      toast.error(err.message || 'Error updating suggestion');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-intel-cyan uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Decision Support Laboratory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            AI Intelligence Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Analytical relationship discovery, Brandes graph betweenness centrality, case similarity comparison, and anomaly pattern identification.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-intel-card border border-intel-border hover:border-intel-cyan/40 text-slate-200 flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-intel-cyan" />
          <span>Re-compute Network Metrics</span>
        </button>
      </div>

      {/* Mandatory Ethics Compliance Banner (Section 61) */}
      <EthicsNoticeBanner />

      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Analytical Tool Selector Tabs (Section 25) */}
      <div className="flex border-b border-intel-border overflow-x-auto text-xs font-semibold gap-1">
        {[
          { id: 'discovery', label: 'Relationship Discovery (' + (suggestions.length || 4) + ')', icon: GitBranch },
          { id: 'centrality', label: 'Network Centrality Ranking', icon: Network },
          { id: 'similarity', label: 'Case Similarity Engine', icon: Sliders },
          { id: 'anomalies', label: 'Anomaly & Pattern Detection', icon: AlertTriangle },
        ].map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-intel-cyan text-intel-cyan bg-intel-cyan/10 rounded-t-xl'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOOL 1: Relationship Discovery & Suggestion Review (Section 28) */}
      {activeTool === 'discovery' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Potential connections derived from shared organizations, temporal co-occurrences, and multi-hop transport links.</span>
            <span className="font-mono text-intel-cyan">Human Investigator Acceptance Required</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((sug) => {
              const isPending = sug.status === 'PENDING';
              return (
                <div
                  key={sug.id}
                  className="p-5 rounded-2xl bg-intel-card border border-intel-border shadow-subtle flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-intel-cyan">
                        SUG-{sug.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {sug.analyticalScore}% Match Score
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-100">{sug.title}</h3>

                    {/* Structural Path Representation */}
                    <div className="p-3 rounded-xl bg-intel-panel/60 border border-intel-border flex items-center justify-between text-xs font-mono">
                      <span className="text-cyan-300 font-bold">{sug.sourceEntityName}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-purple-300">{sug.intermediateEntity || 'Shared Organization'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-cyan-300 font-bold">{sug.targetEntityName}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{sug.reason}</p>

                    <div className="p-2.5 rounded-xl bg-intel-panel/30 border border-intel-border/60 text-[11px] text-slate-400">
                      <strong>Supporting Evidence Signals:</strong> {sug.supportingSignals}
                    </div>
                  </div>

                  {/* Actions & Status (Section 28) */}
                  <div className="pt-3 border-t border-intel-border flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono">
                      <span className="text-slate-400">Status:</span>
                      <span className={`font-bold ${sug.status === 'ACCEPTED' ? 'text-emerald-400' : sug.status === 'REJECTED' ? 'text-rose-400' : 'text-amber-400'}`}>
                        {sug.status}
                      </span>
                    </div>

                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReviewSuggestion(sug.id, 'REJECT')}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleReviewSuggestion(sug.id, 'ACCEPT')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors"
                        >
                          Accept as Investigation Link
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">
                        Reviewed by {sug.reviewedBy || 'Investigator'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TOOL 2: Network Centrality Analysis (Section 27) */}
      {activeTool === 'centrality' && (
        <div className="rounded-2xl bg-intel-card border border-intel-border shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-intel-border bg-intel-panel/40 flex items-center justify-between text-xs">
            <div>
              <h3 className="font-bold text-slate-100">Graph Structural Centrality Measurements</h3>
              <p className="text-slate-400 text-[11px]">Rankings measured via graph theory algorithms (Degree, Brandes Betweenness, Closeness).</p>
            </div>
            <span className="text-[10px] text-intel-cyan font-mono">Decision-Support Only</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-intel-border bg-intel-panel/60 text-slate-400 font-semibold uppercase text-[11px]">
                  <th className="p-3.5 pl-5">Entity ID</th>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Structural Role</th>
                  <th className="p-3.5">Degree Centrality</th>
                  <th className="p-3.5">Betweenness Score</th>
                  <th className="p-3.5">Closeness Metric</th>
                  <th className="p-3.5 pr-5">Cluster</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-intel-border/40 text-slate-300 font-mono">
                {(analysis?.centralityRankings || []).map((cm) => (
                  <tr key={cm.entityId} className="hover:bg-intel-panel/30 transition-colors">
                    <td className="p-3.5 pl-5 font-bold text-intel-cyan">{cm.entityId}</td>
                    <td className="p-3.5 font-sans font-semibold text-slate-100">{cm.entityName}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                        cm.structuralRole.includes('Bridge') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        cm.structuralRole.includes('Hub') ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                        'bg-slate-700/30 text-slate-400 border border-slate-700'
                      }`}>
                        {cm.structuralRole}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-200">{cm.degreeCentrality} direct links</td>
                    <td className="p-3.5 text-amber-400 font-bold">{cm.betweennessCentrality}%</td>
                    <td className="p-3.5 text-slate-400">{cm.closenessCentrality}</td>
                    <td className="p-3.5 pr-5 text-purple-300">Cluster #{cm.communityCluster}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TOOL 3: Case Similarity Analysis (Section 29) */}
      {activeTool === 'similarity' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(analysis?.similarCases || []).map((cs, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-intel-card border border-intel-border shadow-subtle space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-intel-cyan">
                  {cs.sourceCaseNumber} ↔ {cs.targetCaseNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {cs.similarityScore}% Similarity
                </span>
              </div>
              <div className="text-xs text-slate-200 font-semibold">
                {cs.sourceCaseTitle} vs {cs.targetCaseTitle}
              </div>
              <div className="p-3 rounded-xl bg-intel-panel/50 border border-intel-border text-xs space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-300">Shared Indicators ({cs.sharedIndicatorsCount}):</div>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-400 text-[11px]">
                  {cs.sharedIndicators.map((ind, i) => (
                    <li key={i}>{ind}</li>
                  ))}
                </ul>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                * Note: Similarity identifies structural patterns and does not establish identical perpetrators.
              </p>
            </div>
          ))}
        </div>
      )}

      {/* TOOL 4: Anomaly Detection (Section 30) */}
      {activeTool === 'anomalies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(analysis?.detectedAnomalies || []).map((anom) => (
            <div key={anom.anomalyId} className="p-5 rounded-2xl bg-intel-card border border-intel-border shadow-subtle space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-400">{anom.anomalyId}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Severity: {anom.severityScore}/100
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-100">{anom.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{anom.description}</p>
              <div className="p-3 rounded-xl bg-intel-panel/50 border border-intel-border text-xs space-y-1">
                <div className="text-slate-400 text-[11px]">Involved Entity: <strong className="text-cyan-300">{anom.involvedEntity}</strong></div>
                <div className="text-slate-400 text-[11px]">Explanation: <span className="text-slate-200">{anom.explanation}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
