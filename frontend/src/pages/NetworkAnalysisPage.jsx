import React, { useState, useEffect } from 'react';
import {
  Network,
  Filter,
  Layers,
  Search,
  Maximize2,
  RefreshCw,
  GitCommit,
  Download,
  ShieldAlert,
  Info,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  ArrowRight,
  ChevronRight,
  Link2,
  Share2,
  Calendar,
  X,
  FileSpreadsheet
} from 'lucide-react';
import NetworkGraph from '../components/NetworkGraph';
import EntityDetailPanel from '../components/EntityDetailPanel';
import EthicsNoticeBanner from '../components/EthicsNoticeBanner';
import { networkApi, casesApi, personsApi } from '../services/api';

export default function NetworkAnalysisPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('graph'); // 'graph' | 'relationships'
  const [networkData, setNetworkData] = useState({ nodes: [], edges: [] });
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState('ALL');
  const [cases, setCases] = useState([]);
  const [persons, setPersons] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);

  // Filters & Controls for Graph
  const [layout, setLayout] = useState('cose');
  const [minStrength, setMinStrength] = useState(0);
  const [selectedNodeTypes, setSelectedNodeTypes] = useState({
    person: true,
    organization: true,
    vehicle: true,
    phone: true,
    location: true,
    case: true,
    incident: true,
    evidence: true,
  });
  const [selectedRelTypes, setSelectedRelTypes] = useState({
    ASSOCIATED_WITH: true,
    CONTACTED: true,
    COMMUNICATED_WITH: true,
    OWNS: true,
    WORKS_FOR: true,
    EMPLOYED_BY: true,
    LOCATED_AT: true,
    INVOLVED_IN_CASE: true,
    WITNESS_TO: true,
    TRAVELLED_WITH: true,
    SEEN_AT: true,
    RELATED_TO: true,
    CONNECTED_TO: true,
  });

  // Shortest Path Finder
  const [pathSource, setPathSource] = useState('');
  const [pathTarget, setPathTarget] = useState('');
  const [pathFinding, setPathFinding] = useState(false);
  const [pathResult, setPathResult] = useState(null);
  const [highlightedPath, setHighlightedPath] = useState(null);

  // Relationship Table State
  const [relSearch, setRelSearch] = useState('');
  const [relStrengthFilter, setRelStrengthFilter] = useState('ALL');
  const [relModalOpen, setRelModalOpen] = useState(false);
  const [editingRel, setEditingRel] = useState(null);
  const [relForm, setRelForm] = useState({
    sourceEntity: '',
    targetEntity: '',
    relationshipType: 'ASSOCIATED_WITH',
    description: '',
    strengthLevel: 'MEDIUM',
    strength: 50,
    firstKnownDate: '',
    lastKnownDate: '',
    relatedCaseNumber: '',
    status: 'ACTIVE'
  });
  const [formError, setFormError] = useState('');

  // Delete modal
  const [deleteRelTarget, setDeleteRelTarget] = useState(null);

  useEffect(() => {
    loadMetadata();
    fetchNetwork();
    fetchRelationships();
  }, [selectedCase]);

  const loadMetadata = async () => {
    try {
      const [caseRes, personRes] = await Promise.all([
        casesApi.getAll().catch(() => ({ data: [] })),
        personsApi.getAll().catch(() => ({ data: [] }))
      ]);
      setCases(caseRes.data || []);
      setPersons(personRes.data || []);
    } catch (err) {
      console.error('Metadata load error', err);
    }
  };

  const fetchNetwork = async () => {
    setLoading(true);
    try {
      let res;
      if (selectedCase === 'ALL') {
        res = await networkApi.getComplete();
      } else {
        res = await networkApi.getByCase(selectedCase);
      }
      setNetworkData(res.data || { nodes: [], edges: [] });
    } catch (err) {
      console.error('Failed to fetch network graph', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelationships = async () => {
    try {
      const res = await networkApi.getAllRelationships();
      setRelationships(res.data || []);
    } catch (err) {
      console.error('Failed to load relationships', err);
    }
  };

  // Filter nodes & edges for graph canvas
  const filteredNodes = (networkData.nodes || []).filter((n) => {
    const type = (n.entityType || n.type || 'person').toLowerCase();
    return selectedNodeTypes[type] !== false;
  });

  const validNodeIds = new Set(filteredNodes.map((n) => n.id));

  const filteredEdges = (networkData.edges || []).filter((e) => {
    const meetsStrength = (e.strength || 0) >= minStrength;
    const relType = e.label || e.type || e.relationshipType || '';
    const meetsType = selectedRelTypes[relType] !== false;
    const validEndpoints = validNodeIds.has(e.source) && validNodeIds.has(e.target);
    return meetsStrength && meetsType && validEndpoints;
  });

  const filteredGraphData = {
    nodes: filteredNodes,
    edges: filteredEdges,
  };

  const toggleNodeType = (type) => {
    setSelectedNodeTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const toggleRelType = (type) => {
    setSelectedRelTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // Graph Algorithm Shortest Path using backend BFS endpoint
  const handleFindPath = async () => {
    if (!pathSource || !pathTarget || pathSource === pathTarget) return;
    setPathFinding(true);
    setPathResult(null);
    try {
      const res = await networkApi.findPath(pathSource, pathTarget);
      if (res && res.data) {
        const d = res.data;
        const normalizedPath = d.pathNodeIds || d.path || [];
        const normalizedDetails = d.pathDetails || (d.pathEdges || []).map((e, idx) => ({
          from: e.source,
          to: e.target,
          relationship: e.relationshipType || 'CONNECTED_TO',
          caseNumber: d.associatedCases?.[idx]?.caseNumber || (e.caseId ? `CASE-${e.caseId}` : '')
        }));

        const resultObj = {
          found: d.found,
          hops: d.hops || (normalizedPath.length > 0 ? normalizedPath.length - 1 : 0),
          path: normalizedPath,
          pathDetails: normalizedDetails
        };

        setPathResult(resultObj);
        if (d.found && normalizedPath.length > 0) {
          setHighlightedPath(normalizedPath);
        } else {
          setHighlightedPath(null);
        }
      }
    } catch (err) {
      console.error('Path finding error', err);
      fallbackClientBfs();
    } finally {
      setPathFinding(false);
    }
  };

  const fallbackClientBfs = () => {
    const adj = {};
    filteredEdges.forEach((e) => {
      if (!adj[e.source]) adj[e.source] = [];
      if (!adj[e.target]) adj[e.target] = [];
      adj[e.source].push({ node: e.target, edge: e });
      adj[e.target].push({ node: e.source, edge: e });
    });

    const queue = [[{ node: pathSource, edge: null }]];
    const visited = new Set([pathSource]);
    let foundWalk = null;

    while (queue.length > 0) {
      const walk = queue.shift();
      const current = walk[walk.length - 1].node;

      if (current === pathTarget) {
        foundWalk = walk;
        break;
      }

      const neighbors = adj[current] || [];
      for (const n of neighbors) {
        if (!visited.has(n.node)) {
          visited.add(n.node);
          queue.push([...walk, n]);
        }
      }
    }

    if (foundWalk) {
      const nodePath = foundWalk.map(w => w.node);
      const details = [];
      for (let i = 0; i < foundWalk.length - 1; i++) {
        const edge = foundWalk[i + 1].edge;
        details.push({
          from: foundWalk[i].node,
          to: foundWalk[i + 1].node,
          relationship: edge?.label || 'CONNECTED_TO',
          caseNumber: edge?.caseNumber || 'N/A'
        });
      }
      setPathResult({
        found: true,
        hops: nodePath.length - 1,
        path: nodePath,
        pathDetails: details
      });
      setHighlightedPath(nodePath);
    } else {
      setPathResult({ found: false, hops: 0, path: [], pathDetails: [] });
      setHighlightedPath(null);
    }
  };

  const handleClearPath = () => {
    setHighlightedPath(null);
    setPathResult(null);
  };

  // Relationship CRUD
  const handleOpenAddRel = (presetSource) => {
    setEditingRel(null);
    setRelForm({
      sourceEntity: presetSource?.id || '',
      targetEntity: '',
      relationshipType: 'ASSOCIATED_WITH',
      description: '',
      strengthLevel: 'MEDIUM',
      strength: 50,
      firstKnownDate: '',
      lastKnownDate: '',
      relatedCaseNumber: '',
      status: 'ACTIVE'
    });
    setFormError('');
    setRelModalOpen(true);
  };

  const handleOpenEditRel = (rel) => {
    setEditingRel(rel);
    setRelForm({
      sourceEntity: rel.sourceEntity || rel.sourcePersonId || '',
      targetEntity: rel.targetEntity || rel.targetPersonId || '',
      relationshipType: rel.relationshipType || rel.type || 'ASSOCIATED_WITH',
      description: rel.description || '',
      strengthLevel: rel.strengthLevel || (rel.strength >= 80 ? 'VERIFIED' : rel.strength >= 60 ? 'STRONG' : rel.strength >= 40 ? 'MEDIUM' : 'WEAK'),
      strength: rel.strength || 50,
      firstKnownDate: rel.firstKnownDate || rel.firstObserved || '',
      lastKnownDate: rel.lastKnownDate || rel.lastObserved || '',
      relatedCaseNumber: rel.relatedCaseNumber || rel.caseNumber || '',
      status: rel.status || 'ACTIVE'
    });
    setFormError('');
    setRelModalOpen(true);
  };

  const handleSaveRelationship = async (e) => {
    e.preventDefault();
    if (!relForm.sourceEntity || !relForm.targetEntity) {
      setFormError('Source and target entities are required.');
      return;
    }
    if (relForm.sourceEntity === relForm.targetEntity) {
      setFormError('Source and target cannot be the same entity.');
      return;
    }

    // Map strength level to numerical score
    let strVal = 50;
    switch (relForm.strengthLevel) {
      case 'WEAK': strVal = 25; break;
      case 'MEDIUM': strVal = 50; break;
      case 'STRONG': strVal = 75; break;
      case 'VERIFIED': strVal = 95; break;
      default: strVal = 50;
    }

    const payload = {
      ...relForm,
      strength: strVal
    };

    try {
      if (editingRel && editingRel.id) {
        await networkApi.updateRelationship(editingRel.id, payload);
      } else {
        await networkApi.createRelationship(payload);
      }
      setRelModalOpen(false);
      fetchRelationships();
      fetchNetwork();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save relationship.');
    }
  };

  const handleDeleteRelationship = async () => {
    if (!deleteRelTarget) return;
    try {
      await networkApi.deleteRelationship(deleteRelTarget.id);
      setDeleteRelTarget(null);
      fetchRelationships();
      fetchNetwork();
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const exportRelationshipsCSV = () => {
    const headers = ['ID', 'Source Entity', 'Target Entity', 'Relationship Type', 'Strength Level', 'Strength (%)', 'First Known Date', 'Last Known Date', 'Related Case', 'Status', 'Description'];
    const rows = relationships.map(r => [
      r.id,
      r.sourceEntity || r.sourcePersonId || '',
      r.targetEntity || r.targetPersonId || '',
      r.relationshipType || r.type || '',
      r.strengthLevel || 'MEDIUM',
      r.strength || 50,
      r.firstKnownDate || '',
      r.lastKnownDate || '',
      r.relatedCaseNumber || '',
      r.status || 'ACTIVE',
      `"${(r.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relationships_registry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered relationships for table view
  const filteredRelationships = relationships.filter(r => {
    const q = relSearch.toLowerCase();
    const matchesSearch = !q ||
      (r.sourceEntity || '').toLowerCase().includes(q) ||
      (r.targetEntity || '').toLowerCase().includes(q) ||
      (r.relationshipType || '').toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q);

    const matchesStrength = relStrengthFilter === 'ALL' || (r.strengthLevel || 'MEDIUM') === relStrengthFilter;
    return matchesSearch && matchesStrength;
  });

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-intel-card border border-intel-border">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Criminal Network Analysis & Relationship Registry
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                Pure Graph Engine
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Interactive Cytoscape visualization, BFS path finding, and database-backed relationship registry without AI.
            </p>
          </div>
        </div>

        {/* Global Controls & Tab Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Tab Buttons */}
          <div className="flex bg-intel-panel p-1 rounded-xl border border-intel-border text-xs">
            <button
              onClick={() => setActiveTab('graph')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'graph'
                  ? 'bg-intel-cyan text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Network Graph</span>
            </button>
            <button
              onClick={() => setActiveTab('relationships')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'relationships'
                  ? 'bg-intel-cyan text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Relationship Registry ({relationships.length})</span>
            </button>
          </div>

          {activeTab === 'graph' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Scope:</span>
              <select
                value={selectedCase}
                onChange={(e) => setSelectedCase(e.target.value)}
                className="bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
              >
                <option value="ALL">Entire Global Network</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.caseNumber} - {c.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => { fetchNetwork(); fetchRelationships(); }}
            className="p-2 rounded-xl bg-intel-panel border border-intel-border text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mandatory Ethics Notice */}
      <EthicsNoticeBanner />

      {/* TAB 1: GRAPH VIEW */}
      {activeTab === 'graph' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[640px]">
          {/* Left Panel: Graph Configuration + Path Finder (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            
            {/* Graph Controls */}
            <div className="p-4 rounded-2xl bg-intel-card border border-intel-border space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Graph Configuration</span>
                </div>
                <button
                  onClick={() => handleOpenAddRel()}
                  className="px-2 py-1 rounded-lg bg-intel-cyan/15 hover:bg-intel-cyan/25 text-intel-cyan border border-intel-cyan/30 text-[10px] flex items-center gap-1 font-medium transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>New Link</span>
                </button>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1.5">
                  Layout Engine
                </label>
                <select
                  value={layout}
                  onChange={(e) => setLayout(e.target.value)}
                  className="w-full bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                >
                  <option value="cose">Force-Directed (Organic COSE)</option>
                  <option value="circle">Circular (Ring Cluster)</option>
                  <option value="breadthfirst">Hierarchical (Tree Flow)</option>
                  <option value="concentric">Concentric (Hub vs Rim)</option>
                  <option value="grid">Grid (Matrix)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                  <span>Minimum Link Strength</span>
                  <span className="font-mono text-cyan-400 font-semibold">{minStrength}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={minStrength}
                  onChange={(e) => setMinStrength(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-intel-panel rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>All (0%)</span>
                  <span>Medium (50%)</span>
                  <span>Verified (80%)</span>
                </div>
              </div>
            </div>

            {/* Path Finding Section (Mandatory Spec 8) */}
            <div className="p-4 rounded-2xl bg-intel-card border border-intel-border space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-cyan-400" />
                  <span>Graph Path Analysis</span>
                </div>
                <span className="text-[10px] text-cyan-400 font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                  BFS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Trace exact connection pathways between any two entities using deterministic BFS graph traversal.
              </p>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                    Entity A (Source)
                  </label>
                  <select
                    value={pathSource}
                    onChange={(e) => setPathSource(e.target.value)}
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                  >
                    <option value="">Select starting entity...</option>
                    {filteredNodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.label} ({n.entityType || n.type || 'Entity'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                    Entity B (Target)
                  </label>
                  <select
                    value={pathTarget}
                    onChange={(e) => setPathTarget(e.target.value)}
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                  >
                    <option value="">Select destination entity...</option>
                    {filteredNodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.label} ({n.entityType || n.type || 'Entity'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleFindPath}
                    disabled={!pathSource || !pathTarget || pathSource === pathTarget || pathFinding}
                    className="flex-1 py-2 px-3 rounded-xl bg-intel-cyan hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-cyan-glow"
                  >
                    <GitCommit className="w-3.5 h-3.5" />
                    <span>{pathFinding ? 'Searching...' : 'Find Connection'}</span>
                  </button>
                  {highlightedPath && (
                    <button
                      onClick={handleClearPath}
                      className="py-2 px-3 rounded-xl bg-intel-panel hover:bg-intel-card border border-intel-border text-slate-300 text-xs transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Path Result Breakdown */}
                {pathResult && (
                  <div className="mt-3 p-3 rounded-xl bg-intel-panel/60 border border-intel-border space-y-2">
                    {pathResult.found ? (
                      <>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Connected
                          </span>
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                            {pathResult.hops} Hop{pathResult.hops > 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Step by step chain */}
                        <div className="space-y-1.5 pt-1">
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                            Connection Chain:
                          </div>
                          <div className="space-y-1">
                            {pathResult.path && pathResult.path.map((nodeId, idx) => (
                              <div key={idx} className="flex items-center gap-1 text-[11px] text-slate-200 font-mono">
                                <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[9px] font-bold">
                                  {idx + 1}
                                </span>
                                <span className="text-cyan-200 font-medium">{nodeId}</span>
                                {idx < pathResult.path.length - 1 && (
                                  <ChevronRight className="w-3 h-3 text-slate-500 inline" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Edge & Case details */}
                        {pathResult.pathDetails && pathResult.pathDetails.length > 0 && (
                          <div className="pt-2 border-t border-intel-border space-y-1">
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                              Intermediary Links:
                            </div>
                            {pathResult.pathDetails.map((seg, sIdx) => (
                              <div key={sIdx} className="text-[10px] bg-intel-card p-1.5 rounded-lg border border-intel-border font-mono text-slate-300">
                                <div><span className="text-cyan-400">{seg.from}</span> → <span className="text-cyan-400">{seg.to}</span></div>
                                <div className="text-slate-400 text-[9px] flex justify-between mt-0.5">
                                  <span>Type: <strong className="text-slate-200">{seg.relationship}</strong></span>
                                  {seg.caseNumber && <span>Case: {seg.caseNumber}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-400 text-xs py-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>No graph path connects these two entities within current scope.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Entity and Relationship Filters */}
            <div className="p-4 rounded-2xl bg-intel-card border border-intel-border space-y-3 flex-1 overflow-y-auto max-h-[320px]">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
                <Filter className="w-4 h-4 text-cyan-400" />
                <span>Entity Types</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.keys(selectedNodeTypes).map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleNodeType(type)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium border text-left capitalize transition-all ${
                      selectedNodeTypes[type]
                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                        : 'bg-intel-panel/40 border-intel-border text-slate-500'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-intel-border">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Relationship Types</span>
                </div>
                <div className="space-y-1">
                  {Object.keys(selectedRelTypes).map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 text-[11px] text-slate-300 hover:text-white cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRelTypes[type]}
                        onChange={() => toggleRelType(type)}
                        className="accent-cyan-500 rounded bg-intel-panel border-intel-border cursor-pointer"
                      />
                      <span className="font-mono text-[10px] text-slate-400">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Center Canvas (6 or 9 cols depending on inspector) */}
          <div
            className={`${
              selectedEntity ? 'lg:col-span-6' : 'lg:col-span-9'
            } rounded-2xl bg-intel-card border border-intel-border p-3 flex flex-col relative overflow-hidden transition-all duration-300`}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-intel-border/60 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">
                  Entities:{' '}
                  <strong className="text-cyan-400 font-mono">{filteredNodes.length}</strong>
                </span>
                <span className="text-slate-400">
                  Connections:{' '}
                  <strong className="text-cyan-400 font-mono">{filteredEdges.length}</strong>
                </span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Click any node to inspect profile and links</span>
              </div>
            </div>

            <div className="flex-1 w-full h-full min-h-[580px]">
              <NetworkGraph
                elements={filteredGraphData}
                layoutName={layout}
                onSelectNode={(entity) => setSelectedEntity(entity)}
                highlightPath={highlightedPath}
              />
            </div>
          </div>

          {/* Right Inspector Drawer */}
          {selectedEntity && (
            <div className="lg:col-span-3 flex flex-col">
              <EntityDetailPanel
                entity={selectedEntity}
                onClose={() => setSelectedEntity(null)}
                onNavigate={onNavigate}
                onAddRelationship={(ent) => handleOpenAddRel(ent)}
              />
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RELATIONSHIP REGISTRY TABLE (Mandatory Spec 7) */}
      {activeTab === 'relationships' && (
        <div className="flex-1 p-4 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-cyan-400" />
                Relationship Registry & Association Index
              </h2>
              <p className="text-xs text-slate-400">
                Manage, verify, and maintain all entity associations with explicit strength classifications.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportRelationshipsCSV}
                className="px-3 py-2 rounded-xl bg-intel-panel hover:bg-intel-card border border-intel-border text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => handleOpenAddRel()}
                className="px-3.5 py-2 rounded-xl bg-intel-cyan hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-cyan-glow transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Relationship</span>
              </button>
            </div>
          </div>

          {/* Table Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search relationships by entity, type, or description..."
                value={relSearch}
                onChange={(e) => setRelSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-intel-panel border border-intel-border rounded-xl text-xs text-slate-200 placeholder-slate-400 outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Strength:</span>
              <select
                value={relStrengthFilter}
                onChange={(e) => setRelStrengthFilter(e.target.value)}
                className="bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Strengths</option>
                <option value="VERIFIED">VERIFIED</option>
                <option value="STRONG">STRONG</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="WEAK">WEAK</option>
              </select>
            </div>
          </div>

          {/* Registry Table */}
          <div className="overflow-x-auto rounded-xl border border-intel-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-intel-panel/70 border-b border-intel-border text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Source Entity</th>
                  <th className="py-3 px-4">Relationship</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Strength Level</th>
                  <th className="py-3 px-4">First / Last Known</th>
                  <th className="py-3 px-4">Case Link</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-intel-border/60">
                {filteredRelationships.length > 0 ? (
                  filteredRelationships.map((r) => {
                    const str = r.strengthLevel || (r.strength >= 80 ? 'VERIFIED' : r.strength >= 60 ? 'STRONG' : r.strength >= 40 ? 'MEDIUM' : 'WEAK');
                    return (
                      <tr key={r.id} className="hover:bg-intel-panel/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-cyan-300">
                          {r.sourceEntity || r.sourcePersonId || 'N/A'}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <span className="px-2 py-0.5 rounded bg-intel-panel text-slate-200 border border-intel-border text-[11px]">
                            {r.relationshipType || r.type || 'ASSOCIATED_WITH'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-cyan-300">
                          {r.targetEntity || r.targetPersonId || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            str === 'VERIFIED'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : str === 'STRONG'
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                              : str === 'MEDIUM'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-500/20 text-slate-300 border-slate-500/40'
                          }`}>
                            {str}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {r.firstKnownDate || r.firstObserved || '—'}
                          {r.lastKnownDate ? ` / ${r.lastKnownDate}` : ''}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">
                          {r.relatedCaseNumber || r.caseNumber || '—'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                            {r.status || 'ACTIVE'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditRel(r)}
                              className="p-1.5 rounded-lg bg-intel-panel hover:bg-intel-card text-slate-300 hover:text-cyan-400 transition-colors border border-intel-border"
                              title="Edit Relationship"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteRelTarget(r)}
                              className="p-1.5 rounded-lg bg-intel-panel hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors border border-intel-border"
                              title="Delete Relationship"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-slate-400">
                      No relationships match the filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Relationship Modal */}
      {relModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-intel-card border border-intel-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-intel-border bg-intel-panel/40">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-cyan-400" />
                {editingRel ? 'Edit Relationship Record' : 'Record New Association Link'}
              </h3>
              <button
                onClick={() => setRelModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRelationship} className="p-4 space-y-3 text-xs">
              {formError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Source Entity ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DEMO-P001"
                    value={relForm.sourceEntity}
                    onChange={(e) => setRelForm({ ...relForm, sourceEntity: e.target.value })}
                    className="w-full px-3 py-2 bg-intel-panel border border-intel-border rounded-xl text-slate-200 outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Target Entity ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ORG-0001 or DEMO-P002"
                    value={relForm.targetEntity}
                    onChange={(e) => setRelForm({ ...relForm, targetEntity: e.target.value })}
                    className="w-full px-3 py-2 bg-intel-panel border border-intel-border rounded-xl text-slate-200 outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Relationship Type *</label>
                  <select
                    value={relForm.relationshipType}
                    onChange={(e) => setRelForm({ ...relForm, relationshipType: e.target.value })}
                    className="w-full px-3 py-2 bg-intel-panel border border-intel-border rounded-xl text-slate-200 outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="ASSOCIATED_WITH">ASSOCIATED_WITH</option>
                    <option value="OWNS">OWNS</option>
                    <option value="WORKS_FOR">WORKS_FOR</option>
                    <option value="EMPLOYED_BY">EMPLOYED_BY</option>
                    <option value="INVOLVED_IN_CASE">INVOLVED_IN_CASE</option>
                    <option value="SEEN_AT">SEEN_AT</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="COMMUNICATED_WITH">COMMUNICATED_WITH</option>
                    <option value="RELATED_TO">RELATED_TO</option>
                    <option value="CONNECTED_TO">CONNECTED_TO</option>
                    <option value="TRAVELLED_WITH">TRAVELLED_WITH</option>
                    <option value="WITNESS_TO">WITNESS_TO</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Connection Strength Level *</label>
                  <select
                    value={relForm.strengthLevel}
                    onChange={(e) => setRelForm({ ...relForm, strengthLevel: e.target.value })}
                    className="w-full px-3 py-2 bg-intel-panel border border-intel-border rounded-xl text-slate-200 outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="WEAK">WEAK (25%)</option>
                    <option value="MEDIUM">MEDIUM (50%)</option>
                    <option value="STRONG">STRONG (75%)</option>
                    <option value="VERIFIED">VERIFIED (95%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Investigative Description</label>
                <textarea
                  rows="2"
                  placeholder="Specific evidentiary basis for this association..."
                  value={relForm.description}
                  onChange={(e) => setRelForm({ ...relForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-intel-panel border border-intel-border rounded-xl text-slate-200 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">First Known Date</label>
                  <input
                    type="date"
                    value={relForm.firstKnownDate}
                    onChange={(e) => setRelForm({ ...relForm, firstKnownDate: e.target.value })}
                    className="w-full px-3 py-2 bg-intel-panel border border-intel-border rounded-xl text-slate-200 outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Last Known Date</label>
                  <input
                    type="date"
                    value={relForm.lastKnownDate}
                    onChange={(e) => setRelForm({ ...relForm, lastKnownDate: e.target.value })}
                    className="w-full px-3 py-2 bg-intel-panel border border-intel-border rounded-xl text-slate-200 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Related Case Number</label>
                  <input
                    type="text"
                    placeholder="e.g. CASE-2026-0001"
                    value={relForm.relatedCaseNumber}
                    onChange={(e) => setRelForm({ ...relForm, relatedCaseNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-intel-panel border border-intel-border rounded-xl text-slate-200 outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Status</label>
                  <select
                    value={relForm.status}
                    onChange={(e) => setRelForm({ ...relForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-intel-panel border border-intel-border rounded-xl text-slate-200 outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="UNVERIFIED">UNVERIFIED</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-intel-border">
                <button
                  type="button"
                  onClick={() => setRelModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-intel-panel hover:bg-intel-card border border-intel-border text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-intel-cyan hover:bg-cyan-400 text-slate-950 font-bold shadow-cyan-glow"
                >
                  {editingRel ? 'Save Changes' : 'Create Association'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteRelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-intel-card border border-intel-border rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Delete Association Link?</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove the relationship between{' '}
              <strong className="text-cyan-300 font-mono">{deleteRelTarget.sourceEntity || deleteRelTarget.sourcePersonId}</strong> and{' '}
              <strong className="text-cyan-300 font-mono">{deleteRelTarget.targetEntity || deleteRelTarget.targetPersonId}</strong>?
              This will update the criminal network graph and link matrices.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteRelTarget(null)}
                className="px-4 py-2 rounded-xl bg-intel-panel hover:bg-intel-card border border-intel-border text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRelationship}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
              >
                Delete Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
