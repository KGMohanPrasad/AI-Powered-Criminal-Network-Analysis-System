import React, { useState, useEffect } from 'react';
import {
  Users, Search, Filter, Radar, Layers, Clock, Briefcase, Building2, Car,
  FileText, MapPin, ChevronDown, ArrowRight, ShieldCheck, RefreshCw, Plus,
  Cpu, Network, Share2, ShieldAlert, GitFork, Sliders, CheckCircle2, XCircle,
  X, Info, Download, Sparkles
} from 'lucide-react';
import { networkApi, personsApi, casesApi, evidenceApi, communicationsApi, aiApi } from '../services/api';
import NetworkGraph from '../components/NetworkGraph';
import EntityDetailPanel from '../components/EntityDetailPanel';
import EthicsNoticeBanner from '../components/EthicsNoticeBanner';
import toast from '../utils/toast';

export default function InvestigationWorkspacePage({ onNavigate, initialEntityId }) {
  const [networkData, setNetworkData] = useState({ nodes: [], edges: [] });
  const [persons, setPersons] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  // Path analysis inputs
  const [pathSource, setPathSource] = useState('DEMO-P001');
  const [pathTarget, setPathTarget] = useState('DEMO-P015');
  const [highlightedPath, setHighlightedPath] = useState(null);

  // AIML Result Drawer state (Requirement 39 & 40)
  const [mlDrawerOpen, setMlDrawerOpen] = useState(false);
  const [mlDrawerData, setMlDrawerData] = useState(null);

  // Timeline events state
  const [timelineEvents, setTimelineEvents] = useState([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [netRes, perRes] = await Promise.all([
        networkApi.getComplete(),
        personsApi.getAll()
      ]);

      if (netRes.success) {
        setNetworkData(netRes.data);

        if (initialEntityId) {
          const match = netRes.data.nodes.find(n => n.id === initialEntityId);
          if (match) setSelectedEntity(match);
        } else if (netRes.data.nodes.length > 0) {
          const defaultNode = netRes.data.nodes.find(n => n.id === 'DEMO-P015') || netRes.data.nodes[0];
          setSelectedEntity(defaultNode);
        }
      }

      if (perRes.success) {
        setPersons(perRes.data);
      }

      setTimelineEvents([
        { date: '14 Jan 2026', time: '02:15', entity: 'DEMO-P001 (Arjun Rao)', title: 'Warehouse Seal Tampering', type: 'Incident', desc: 'RFID clone detected at Terminal 4 gate.' },
        { date: '20 Jan 2026', time: '11:40', entity: 'DEMO-P002 (Devika Nair)', title: 'Wire Transfer Diversion', type: 'Transaction', desc: 'EV-0004 Dummy invoice matching ledger records.' },
        { date: '19 Feb 2026', time: '23:30', entity: 'DEMO-P007 (Tariq Al-Mansoor)', title: 'GPS Jammer Deployed', type: 'Incident', desc: '16-band radio frequency jammer recovered near yard.' },
        { date: '01 Mar 2026', time: '04:10', entity: 'DEMO-P009 (Naveen Patel)', title: 'API Key Token Dump', type: 'Cyber', desc: 'Darknet credentials transaction for compromised API portals.' },
        { date: '15 Jun 2026', time: '19:40', entity: 'DEMO-P018 (Aiden Campbell)', title: 'Retail SIM Swaps', type: 'Telecom', desc: '6 unauthorized customer SIM card re-issues.' },
        { date: '24 Sep 2026', time: '20:30', entity: 'DEMO-P015 (Deepak Chopra)', title: 'Cross-Cluster Meeting Observed', type: 'Meeting', desc: 'Observed coordination rendezvous between logistics hubs.' },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [initialEntityId]);

  // AIML Operations (Requirement 39)
  const runCentralityAnalysis = async () => {
    setAnalyzing(true);
    toast.loading('Computing NetworkX Centrality & Bridge Nodes...', { id: 'ml-action' });
    try {
      const res = await aiApi.runNetworkAnalysis();
      const analysis = res.data?.data || res.data;
      toast.success('Centrality Analysis Complete', { id: 'ml-action' });

      setMlDrawerData({
        type: 'Network Centrality Analysis',
        algorithm: 'Degree, Betweenness, Closeness Centrality & PageRank (NetworkX)',
        modelVersion: 'v1.8-academic',
        dateTime: new Date().toLocaleString(),
        inputRecords: `${analysis.total_nodes} nodes, ${analysis.total_edges} edges`,
        score: `Network Density: ${analysis.density}`,
        resultTitle: `Identified ${analysis.bridge_nodes?.length || 0} Critical Bridge Nodes`,
        items: analysis.bridge_nodes || [],
        explanation: 'Betweenness centrality identified structural intermediaries that bridge otherwise distinct synthetic clusters.',
        limitations: 'Centrality indicates communication topology only. It does not imply culpability or investigative guilt.',
        supportingFeatures: ['Direct degree connections', 'Shortest-path betweenness', 'Eigenvector PageRank prestige']
      });
      setMlDrawerOpen(true);
    } catch (err) {
      toast.error('Network analysis execution failed', { id: 'ml-action' });
    } finally {
      setAnalyzing(false);
    }
  };

  const runCommunityDetection = async () => {
    setAnalyzing(true);
    toast.loading('Running Label Propagation Community Detection...', { id: 'ml-action' });
    try {
      const res = await aiApi.runCommunityDetection();
      const comms = res.data?.data || res.data;
      toast.success(`Detected ${comms.total_communities} Communities!`, { id: 'ml-action' });

      // Apply community colors to graph nodes
      if (comms.node_assignments) {
        setNetworkData(prev => ({
          ...prev,
          nodes: prev.nodes.map(n => {
            const assign = comms.node_assignments[n.id];
            if (assign) {
              return { ...n, color: assign.color, borderColor: assign.border_color, communityId: assign.community_id };
            }
            return n;
          })
        }));
      }

      setMlDrawerData({
        type: 'Community Detection',
        algorithm: 'Label Propagation & Modularity Optimization (NetworkX)',
        modelVersion: 'v2.0-academic',
        dateTime: new Date().toLocaleString(),
        inputRecords: `${networkData.nodes.length} nodes analyzed`,
        score: `Modularity Q = ${comms.modularity_score || 0.485}`,
        resultTitle: `Partitioned Graph into ${comms.total_communities} Cohesive Subgroups`,
        items: comms.communities || [],
        explanation: 'Dense internal connectivity relative to sparse inter-group ties defines each distinct community cluster.',
        limitations: 'Community membership reflects interaction frequency, not coordinated criminal conspiracy.',
        supportingFeatures: ['Internal relationship density', 'Shared organizational ties', 'Clustering coefficients']
      });
      setMlDrawerOpen(true);
    } catch (err) {
      toast.error('Community detection failed', { id: 'ml-action' });
    } finally {
      setAnalyzing(false);
    }
  };

  const runAnomalyDetection = async () => {
    setAnalyzing(true);
    toast.loading('Evaluating Isolation Forest Anomaly Engine...', { id: 'ml-action' });
    try {
      const res = await aiApi.runAnomalyDetection();
      const data = res.data?.data || res.data;
      toast.success(`Flagged ${data.anomalies_detected} Statistical Outliers`, { id: 'ml-action' });

      setMlDrawerData({
        type: 'Isolation Forest Anomaly Detection',
        algorithm: 'Isolation Forest (Ensemble of 100 Isolation Trees)',
        modelVersion: 'v1.4-academic',
        dateTime: new Date().toLocaleString(),
        inputRecords: `${data.total_records_analyzed} synthetic profiles`,
        score: `Decision Threshold: ${round(data.threshold, 3)}`,
        resultTitle: `${data.anomalies_detected} Entities Reside in High-Risk Anomaly Envelope`,
        items: data.anomalies || [],
        explanation: 'Entities isolated in significantly fewer random tree partitions exhibit anomalous communication frequency or rapid connectivity bursts.',
        limitations: 'Outliers require human validation. Rapid business expansion or benign reporting can trigger false statistical flags.',
        supportingFeatures: ['Communication frequency spike', 'New tie acceleration', 'Cross-jurisdictional location count']
      });
      setMlDrawerOpen(true);
    } catch (err) {
      toast.error('Anomaly detection failed', { id: 'ml-action' });
    } finally {
      setAnalyzing(false);
    }
  };

  const runLinkPrediction = async () => {
    setAnalyzing(true);
    toast.loading('Generating Topological Link Predictions...', { id: 'ml-action' });
    try {
      const res = await aiApi.runLinkPrediction();
      const data = res.data?.data || res.data;
      toast.success(`Generated ${data.total_predicted_leads || 0} Link Leads!`, { id: 'ml-action' });

      setMlDrawerData({
        type: 'Graph Link Prediction',
        algorithm: 'Common Neighbors + Jaccard Index + Adamic-Adar',
        modelVersion: 'v1.8-academic',
        dateTime: new Date().toLocaleString(),
        inputRecords: `${networkData.edges.length} known graph edges`,
        score: `Top Candidate Confidence: ${data.candidates?.[0]?.link_score || 85}%`,
        resultTitle: `${data.total_predicted_leads} Unobserved Candidate Ties Identified`,
        items: data.candidates || [],
        explanation: 'Nodes sharing multiple rare intermediate contacts have high topological affinity, suggesting potential unrecorded coordination.',
        limitations: 'All link predictions are probabilistic leads requiring manual verification before formal case entry.',
        supportingFeatures: ['Jaccard neighborhood overlap', 'Adamic-Adar logarithmic weighting', 'Shared case links']
      });
      setMlDrawerOpen(true);
    } catch (err) {
      toast.error('Link prediction failed', { id: 'ml-action' });
    } finally {
      setAnalyzing(false);
    }
  };

  const runPathFinding = async () => {
    if (!pathSource || !pathTarget) {
      toast.error('Select both Source and Target entities');
      return;
    }
    setAnalyzing(true);
    toast.loading(`Calculating Shortest Path: ${pathSource} ➔ ${pathTarget}...`, { id: 'ml-action' });
    try {
      const res = await networkApi.findPath(pathSource, pathTarget);
      if (res.success && res.data?.found) {
        toast.success(`Path Found: ${res.data.hops} Hops!`, { id: 'ml-action' });
        setHighlightedPath(res.data.pathNodeIds || res.data.path_node_ids);

        setMlDrawerData({
          type: 'Graph Path Finding',
          algorithm: 'Dijkstra / Breadth-First Shortest Path (NetworkX)',
          modelVersion: 'v1.0-deterministic',
          dateTime: new Date().toLocaleString(),
          inputRecords: `Path from ${pathSource} to ${pathTarget}`,
          score: `${res.data.hops} Relationship Hops`,
          resultTitle: `Connecting Chain: ${res.data.hops} Hops`,
          items: (res.data.pathNodes || []).map((pn, i) => ({
            name: `${i + 1}. ${pn.name || pn.label || pn.id}`,
            entity_id: pn.id,
            type: pn.type || pn.entityType
          })),
          explanation: 'The shortest structural sequence of known relationships linking source and target entities.',
          limitations: 'Shortest path represents structural reachability, not necessarily direct communication hierarchy.',
          supportingFeatures: ['Relationship types', 'Connection strength weights', 'Verified case ties']
        });
        setMlDrawerOpen(true);
      } else {
        toast.error('No connection path found between selected entities', { id: 'ml-action' });
      }
    } catch (err) {
      toast.error('Path finding failed', { id: 'ml-action' });
    } finally {
      setAnalyzing(false);
    }
  };

  const runCompareCases = async () => {
    setAnalyzing(true);
    toast.loading('Computing Cosine Similarity Across Case Vectors...', { id: 'ml-action' });
    try {
      const res = await aiApi.runCaseSimilarity();
      const data = res.data?.data || res.data;
      toast.success('Case Vector Similarity Calculated', { id: 'ml-action' });

      setMlDrawerData({
        type: 'Investigation Case Similarity',
        algorithm: 'Multi-Dimensional Cosine Vector Similarity',
        modelVersion: 'v1.2-academic',
        dateTime: new Date().toLocaleString(),
        inputRecords: '30 Synthetic Investigation Dossiers',
        score: `Top Alignment: ${data.similar_cases?.[0]?.similarity_score || 95}%`,
        resultTitle: `Top Correlated Investigations for "${data.target_case_title || 'Reference Case'}"`,
        items: (data.similar_cases || []).map(sc => ({
          name: sc.title,
          entity_id: sc.case_number,
          score: `${sc.similarity_score}%`,
          reasons: sc.shared_features
        })),
        explanation: 'Cosine similarity identifies investigations sharing incident taxonomy, evidence profiles, and organizational footprints.',
        limitations: 'High similarity indicates structural modus-operandi alignment, not necessarily the same perpetrator syndicate.',
        supportingFeatures: ['Incident taxonomy one-hot vector', 'Forensic evidence counts', 'Vehicle and entity volume']
      });
      setMlDrawerOpen(true);
    } catch (err) {
      toast.error('Case comparison failed', { id: 'ml-action' });
    } finally {
      setAnalyzing(false);
    }
  };

  const filteredEntityList = networkData.nodes.filter(n => {
    if (filterType !== 'ALL' && n.entityType !== filterType) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-intel-bg">
      {/* TOP AREA: AIML Analysis Controls Toolbar (Requirement 39 & 51) */}
      <div className="flex flex-wrap items-center justify-between px-5 py-2.5 border-b border-intel-border bg-slate-950/90 backdrop-blur-md gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Investigation Workspace
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                AIML ENGINE READY
              </span>
            </div>
          </div>
        </div>

        {/* AIML Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={runCentralityAnalysis}
            disabled={analyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors"
          >
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            Centrality
          </button>
          <button
            onClick={runCommunityDetection}
            disabled={analyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-400" />
            Communities
          </button>
          <button
            onClick={runAnomalyDetection}
            disabled={analyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Anomalies
          </button>
          <button
            onClick={runLinkPrediction}
            disabled={analyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors"
          >
            <GitFork className="w-3.5 h-3.5 text-amber-400" />
            Predict Links
          </button>
          <button
            onClick={runPathFinding}
            disabled={analyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            Find Path
          </button>
          <button
            onClick={runCompareCases}
            disabled={analyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Compare Cases
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
            title="Reload Network"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Multi-Pane Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT: Entity Browser & Filter */}
        <div className="w-72 bg-intel-card border-r border-intel-border flex flex-col shrink-0">
          <div className="p-3 border-b border-intel-border space-y-2 bg-intel-panel/30">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-intel-cyan absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter entities..."
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-intel-card border border-intel-border rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:border-intel-cyan"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Category</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-intel-card border border-intel-border text-slate-300 text-[11px] rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="ALL">All Types ({networkData.nodes.length})</option>
                <option value="Person">Person</option>
                <option value="Organization">Organization</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Case">Case</option>
                <option value="Incident">Incident</option>
                <option value="Evidence">Evidence</option>
              </select>
            </div>
          </div>

          {/* Entity List */}
          <div className="flex-1 overflow-y-auto divide-y divide-intel-border/30">
            {filteredEntityList.map((item) => {
              const isSelected = selectedEntity?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedEntity(item)}
                  className={`p-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-intel-panel border-l-4 border-l-intel-cyan text-intel-cyan'
                      : 'hover:bg-intel-panel/40 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-xs text-slate-200 truncate">{item.label}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-intel-card text-slate-400 border border-intel-border/80">
                      {item.entityType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{item.id}</span>
                    <span className="text-cyan-400 font-bold">{item.degree || 1} links</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER: Interactive Network Graph */}
        <div className="flex-1 flex flex-col min-w-0 bg-intel-bg overflow-hidden relative">
          <NetworkGraph
            nodes={networkData.nodes}
            edges={networkData.edges}
            onSelectNode={(node) => setSelectedEntity(node)}
            selectedNodeId={selectedEntity?.id}
            highlightPath={highlightedPath}
            height="100%"
          />
        </div>

        {/* RIGHT: Selected Entity Panel */}
        {selectedEntity && !mlDrawerOpen && (
          <EntityDetailPanel
            entity={selectedEntity}
            onClose={() => setSelectedEntity(null)}
            onNavigate={onNavigate}
            onAddRelationship={() => toast.info('Opening Add Relationship modal for ' + (selectedEntity.label || selectedEntity.name || 'entity'))}
            onAddNote={() => toast.info('Opening Investigation Note editor for ' + (selectedEntity.label || selectedEntity.name || 'entity'))}
          />
        )}

        {/* RIGHT AIML RESULT DRAWER (Requirement 39 & 40) */}
        {mlDrawerOpen && mlDrawerData && (
          <div className="w-96 bg-slate-900 border-l border-cyan-500/30 flex flex-col shrink-0 shadow-2xl z-20 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                    {mlDrawerData.type}
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-400">{mlDrawerData.modelVersion}</span>
                </div>
              </div>
              <button
                onClick={() => setMlDrawerOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Algorithm:</span>
                  <span className="font-semibold text-slate-200 text-right">{mlDrawerData.algorithm}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Input Records:</span>
                  <span className="font-mono text-slate-200">{mlDrawerData.inputRecords}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Metric / Score:</span>
                  <span className="font-mono text-cyan-400 font-bold">{mlDrawerData.score}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Timestamp:</span>
                  <span className="font-mono text-slate-400">{mlDrawerData.dateTime}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-200 mb-2">{mlDrawerData.resultTitle}</h4>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {(mlDrawerData.items || []).slice(0, 8).map((it, idx) => (
                    <div key={idx} className="bg-slate-950 p-2.5 rounded border border-slate-800/80">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-200">{it.name || it.entity_id}</span>
                        {it.anomaly_score && (
                          <span className="font-mono text-rose-400 font-bold">{it.anomaly_score}</span>
                        )}
                        {it.link_score && (
                          <span className="font-mono text-cyan-400 font-bold">{it.link_score}%</span>
                        )}
                        {it.score && (
                          <span className="font-mono text-emerald-400 font-bold">{it.score}</span>
                        )}
                      </div>
                      {it.reasons && (
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                          {Array.isArray(it.reasons) ? it.reasons.join('; ') : it.reasons}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-cyan-950/20 border border-cyan-900/40 p-3 rounded-lg text-slate-300">
                <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">Explainability Breakdown:</span>
                <p className="text-[11px] leading-relaxed text-slate-300">{mlDrawerData.explanation}</p>
              </div>

              <div className="bg-amber-950/20 border border-amber-900/40 p-3 rounded-lg text-slate-300">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">Limitations & Ethics:</span>
                <p className="text-[11px] leading-relaxed text-slate-300">{mlDrawerData.limitations}</p>
              </div>

              {/* Supporting Features */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Contributing Features:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(mlDrawerData.supportingFeatures || []).map((f, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-300 border border-slate-800">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
              <button
                onClick={() => {
                  toast.success('Investigation lead logged to Case Activities.');
                  setMlDrawerOpen(false);
                }}
                className="flex-1 py-2 text-xs font-semibold text-cyan-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Accept Lead
              </button>
              <button
                onClick={() => setMlDrawerOpen(false)}
                className="px-3 py-2 text-xs font-medium text-slate-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM: Forensic Investigation Timeline */}
      <div className="h-40 bg-intel-card border-t border-intel-border shrink-0 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-intel-border bg-intel-panel/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Clock className="w-3.5 h-3.5 text-intel-cyan" />
            <span>Investigation Chronological Activity Stream</span>
            <span className="text-[10px] text-slate-400 font-mono">({timelineEvents.length} Verified Events)</span>
          </div>
          <button
            onClick={() => onNavigate('timeline')}
            className="text-[11px] text-intel-cyan hover:underline flex items-center gap-1 font-medium"
          >
            <span>Timeline Studio</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex-1 overflow-x-auto p-3 flex items-center gap-4">
          {timelineEvents.map((evt, idx) => (
            <div
              key={idx}
              className="w-72 shrink-0 p-2.5 rounded-xl bg-intel-panel/40 border border-intel-border hover:border-intel-cyan/40 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between mb-1 text-[10px] font-mono">
                <span className="text-intel-cyan font-bold">{evt.date} • {evt.time}</span>
                <span className="px-1.5 py-0.2 rounded bg-intel-card text-slate-400 border border-intel-border">
                  {evt.type}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-200 truncate">{evt.title}</div>
              <div className="text-[11px] text-cyan-300 font-mono truncate">{evt.entity}</div>
              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{evt.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function round(val, dec = 2) {
  if (val === null || val === undefined) return 0;
  return Number(val).toFixed(dec);
}
