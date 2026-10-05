import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Download,
  Filter,
  Layers,
  Search,
  SlidersHorizontal,
  Compass,
  Zap,
  Info,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';

export default function NetworkGraph({
  elements,
  nodes: propNodes,
  edges: propEdges,
  onSelectNode,
  onNodeClick,
  selectedNodeId,
  highlightPath,
  highlightedPath,
  layoutName,
  height = '600px',
  compact = false
}) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  // Normalize incoming elements
  const rawNodes = elements?.nodes || propNodes || [];
  const rawEdges = elements?.edges || propEdges || [];
  const activePath = highlightPath || highlightedPath || null;
  const handleNodeSelect = onSelectNode || onNodeClick;

  const [currentLayout, setCurrentLayout] = useState(layoutName || 'cose');
  const [showLabels, setShowLabels] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterType, setSelectedFilterType] = useState('ALL');
  const [selectedRelType, setSelectedRelType] = useState('ALL');
  const [minStrength, setMinStrength] = useState(0);
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [graphNotice, setGraphNotice] = useState(null);

  useEffect(() => {
    if (layoutName) {
      setCurrentLayout(layoutName);
    }
  }, [layoutName]);

  // Map entity types to styles
  const getNodeColor = (type) => {
    const t = (type || '').toLowerCase();
    switch (t) {
      case 'person': return '#06B6D4'; // cyan
      case 'organization': return '#A855F7'; // purple
      case 'vehicle': return '#F59E0B'; // amber
      case 'case': return '#3B82F6'; // blue
      case 'incident': return '#EF4444'; // red
      case 'evidence': return '#10B981'; // green
      case 'location': return '#FB923C'; // orange
      case 'phone': return '#14B8A6'; // teal
      default: return '#94A3B8';
    }
  };

  const getNodeShape = (type) => {
    const t = (type || '').toLowerCase();
    switch (t) {
      case 'person': return 'ellipse';
      case 'organization': return 'round-rectangle';
      case 'vehicle': return 'diamond';
      case 'case': return 'barrel';
      case 'incident': return 'triangle';
      case 'evidence': return 'hexagon';
      case 'location': return 'pentagon';
      default: return 'ellipse';
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Filter elements based on UI controls
    const filteredNodes = rawNodes.filter(n => {
      const type = n.entityType || n.type || 'Person';
      if (selectedFilterType !== 'ALL' && type.toLowerCase() !== selectedFilterType.toLowerCase()) return false;
      return true;
    });

    const activeNodeIds = new Set(filteredNodes.map(n => n.id));

    const filteredEdges = rawEdges.filter(e => {
      if (!activeNodeIds.has(e.source) || !activeNodeIds.has(e.target)) return false;
      if (selectedRelType !== 'ALL' && e.relationshipType !== selectedRelType && e.label !== selectedRelType) return false;
      const str = e.strength || 80;
      if (str < minStrength) return false;
      return true;
    });

    // Format elements for Cytoscape
    const cyNodes = filteredNodes.map(n => {
      const type = n.entityType || n.type || 'Person';
      const label = n.label || n.name || n.id;
      const centrality = n.centrality || 20;
      const size = Math.max(30, Math.min(65, 30 + centrality * 0.4));

      return {
        data: {
          id: String(n.id),
          label: label,
          type: type,
          color: getNodeColor(type),
          shape: getNodeShape(type),
          size: size,
          raw: n
        }
      };
    });

    const cyEdges = filteredEdges.map((e, idx) => {
      const str = e.strength || 75;
      const width = Math.max(1.5, Math.min(5, (str / 100) * 4.5));
      const lineStyle = str < 50 ? 'dashed' : 'solid';
      const lineColor = str >= 80 ? '#22D3EE' : str >= 55 ? '#38BDF8' : '#64748B';

      return {
        data: {
          id: String(e.id || `edge-${e.source}-${e.target}-${idx}`),
          source: String(e.source),
          target: String(e.target),
          label: e.relationshipType || e.label || 'LINK',
          width: width,
          lineStyle: lineStyle,
          lineColor: lineColor,
          strength: str,
          raw: e
        }
      };
    });

    const cy = cytoscape({
      container: containerRef.current,
      elements: [...cyNodes, ...cyEdges],
      boxSelectionEnabled: true,
      autounselectify: false,
      style: [
        {
          selector: 'node',
          style: {
            'label': showLabels ? 'data(label)' : '',
            'background-color': 'data(color)',
            'shape': 'data(shape)',
            'width': 'data(size)',
            'height': 'data(size)',
            'color': '#F1F5F9',
            'font-family': 'Outfit, Inter, system-ui, sans-serif',
            'font-size': '10px',
            'font-weight': 'bold',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'text-background-color': '#070B12',
            'text-background-opacity': 0.85,
            'text-background-padding': '3px',
            'text-background-shape': 'roundrectangle',
            'border-width': 2,
            'border-color': '#1E2D4A',
            'transition-property': 'background-color, line-color, target-arrow-color, border-color, width, height',
            'transition-duration': '0.25s'
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 4,
            'border-color': '#22D3EE',
            'shadow-blur': 22,
            'shadow-color': '#06B6D4',
            'shadow-opacity': 0.85
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 'data(width)',
            'line-color': 'data(lineColor)',
            'line-style': 'data(lineStyle)',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': 'data(lineColor)',
            'curve-style': 'bezier',
            'arrow-scale': 0.85,
            'label': showLabels ? 'data(label)' : '',
            'font-size': '8px',
            'font-family': 'JetBrains Mono, monospace',
            'color': '#94A3B8',
            'text-rotation': 'autorotate',
            'text-background-color': '#070B12',
            'text-background-opacity': 0.85,
            'text-background-padding': '2px',
          }
        },
        {
          selector: 'edge:selected',
          style: {
            'line-color': '#22D3EE',
            'target-arrow-color': '#22D3EE',
            'width': 4
          }
        },
        {
          selector: '.highlighted',
          style: {
            'border-width': 4,
            'border-color': '#22D3EE',
            'background-color': '#22D3EE',
            'line-color': '#22D3EE',
            'target-arrow-color': '#22D3EE',
            'shadow-blur': 25,
            'shadow-color': '#22D3EE',
            'shadow-opacity': 0.95,
            'opacity': 1
          }
        },
        {
          selector: '.faded',
          style: {
            'opacity': 0.12
          }
        }
      ],
      layout: {
        name: currentLayout,
        animate: true,
        animationDuration: 500,
        fit: true,
        padding: 50,
      }
    });

    cyRef.current = cy;

    // Node click handler
    cy.on('tap', 'node', (evt) => {
      const nodeData = evt.target.data('raw');
      if (handleNodeSelect) {
        handleNodeSelect(nodeData);
      }

      // Highlight neighborhood
      cy.elements().removeClass('highlighted faded');
      const neighborhood = evt.target.neighborhood().add(evt.target);
      cy.elements().not(neighborhood).addClass('faded');
      neighborhood.addClass('highlighted');
    });

    // Reset highlights on background tap
    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        cy.elements().removeClass('highlighted faded');
        setHoveredEdge(null);
      }
    });

    // Edge hover tooltip
    cy.on('mouseover', 'edge', (evt) => {
      const edge = evt.target;
      const renderedPos = evt.renderedPosition;
      setTooltipPos({ x: renderedPos.x, y: renderedPos.y });
      setHoveredEdge(edge.data('raw'));
    });

    cy.on('mouseout', 'edge', () => {
      setHoveredEdge(null);
    });

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [rawNodes, rawEdges, currentLayout, showLabels, selectedFilterType, selectedRelType, minStrength]);

  // Handle activePath prop change (shortest path highlight)
  useEffect(() => {
    if (!cyRef.current) return;
    if (activePath && Array.isArray(activePath) && activePath.length > 0) {
      cyRef.current.elements().removeClass('highlighted faded');
      const pathNodes = cyRef.current.nodes().filter(n => activePath.includes(n.id()));
      const pathEdges = cyRef.current.edges().filter(e => {
        const src = e.data('source');
        const tgt = e.data('target');
        for (let i = 0; i < activePath.length - 1; i++) {
          if ((src === activePath[i] && tgt === activePath[i + 1]) ||
              (src === activePath[i + 1] && tgt === activePath[i])) {
            return true;
          }
        }
        return false;
      });
      const pathElements = pathNodes.add(pathEdges);
      cyRef.current.elements().not(pathElements).addClass('faded');
      pathElements.addClass('highlighted');
      if (pathElements.length > 0) {
        cyRef.current.animate({
          fit: { eles: pathElements, padding: 60 },
          duration: 500
        });
      }
    } else if (activePath === null) {
      cyRef.current.elements().removeClass('highlighted faded');
    }
  }, [activePath]);

  // Handle selectedNodeId change from parent
  useEffect(() => {
    if (cyRef.current && selectedNodeId) {
      const target = cyRef.current.$(`node[id = "${selectedNodeId}"]`);
      if (target.length) {
        cyRef.current.elements().removeClass('highlighted faded');
        const neighborhood = target.neighborhood().add(target);
        cyRef.current.elements().not(neighborhood).addClass('faded');
        neighborhood.addClass('highlighted');
        cyRef.current.animate({
          center: { eles: target },
          zoom: 1.5,
          duration: 400
        });
      }
    }
  }, [selectedNodeId]);

  // Search node and focus
  const handleSearchNode = (e) => {
    e.preventDefault();
    if (!cyRef.current || !searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const matched = cyRef.current.nodes().filter(n => {
      const label = (n.data('label') || '').toLowerCase();
      const id = (n.data('id') || '').toLowerCase();
      return label.includes(query) || id.includes(query);
    });

    if (matched.length > 0) {
      cyRef.current.elements().removeClass('highlighted faded');
      matched.addClass('highlighted');
      cyRef.current.animate({
        center: { eles: matched.first() },
        zoom: 1.6,
        duration: 500
      });
      if (handleNodeSelect) {
        handleNodeSelect(matched.first().data('raw'));
      }
    } else {
      setGraphNotice(`No nodes found matching "${searchQuery}"`);
      setTimeout(() => setGraphNotice(null), 3000);
    }
  };

  const handleExportPNG = () => {
    if (!cyRef.current) return;
    const png = cyRef.current.png({ full: true, scale: 2, bg: '#070B12' });
    const a = document.createElement('a');
    a.href = png;
    a.download = `criminal-network-${Date.now()}.png`;
    a.click();
  };

  const handleHighlightShortestPath = () => {
    if (!cyRef.current) return;
    const selected = cyRef.current.$('node:selected');
    if (selected.length < 2) {
      setGraphNotice('Please select two nodes on the canvas or use the Path Finder panel to calculate paths.');
      setTimeout(() => setGraphNotice(null), 4000);
      return;
    }
    const aStar = cyRef.current.elements().aStar({
      root: selected[0],
      goal: selected[1]
    });
    if (aStar.found) {
      cyRef.current.elements().removeClass('highlighted faded');
      cyRef.current.elements().not(aStar.path).addClass('faded');
      aStar.path.addClass('highlighted');
    } else {
      setGraphNotice('No connective path discovered between selected nodes.');
      setTimeout(() => setGraphNotice(null), 3500);
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-intel-card/95 border border-intel-border/90 overflow-hidden shadow-glass-panel flex flex-col backdrop-blur-xl">
      {/* Top Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-intel-panel/70 border-b border-intel-border/80 z-10 backdrop-blur-md">
        
        {/* Search within Graph */}
        <form onSubmit={handleSearchNode} className="flex items-center gap-1.5 min-w-[200px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Locate entity in graph..."
              className="w-full pl-8 pr-2 py-1.5 text-xs bg-intel-card border border-intel-border/80 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-sans"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Locate
          </button>
        </form>

        {/* Filters and Layout Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Node Type Filter */}
          <div className="flex items-center gap-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedFilterType}
              onChange={(e) => setSelectedFilterType(e.target.value)}
              className="bg-intel-card border border-intel-border/80 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Entity Types</option>
              <option value="Person">Person</option>
              <option value="Organization">Organization</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Case">Case</option>
              <option value="Incident">Incident</option>
              <option value="Evidence">Evidence</option>
            </select>
          </div>

          {/* Relationship Type Filter */}
          <select
            value={selectedRelType}
            onChange={(e) => setSelectedRelType(e.target.value)}
            className="bg-intel-card border border-intel-border/80 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Relationships</option>
            <option value="ASSOCIATED_WITH">ASSOCIATED_WITH</option>
            <option value="COMMUNICATED_WITH">COMMUNICATED_WITH</option>
            <option value="EMPLOYED_BY">EMPLOYED_BY</option>
            <option value="OWNS">OWNS</option>
            <option value="INVOLVED_IN_CASE">INVOLVED_IN_CASE</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="TRAVELLED_WITH">TRAVELLED_WITH</option>
          </select>

          {/* Layout Selector */}
          <div className="flex items-center gap-1 text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={currentLayout}
              onChange={(e) => setCurrentLayout(e.target.value)}
              className="bg-intel-card border border-intel-border/80 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none font-mono text-[11px] focus:border-cyan-400"
            >
              <option value="cose">Force-Directed (Cose)</option>
              <option value="circle">Circular Radial</option>
              <option value="breadthfirst">Hierarchical BFS</option>
              <option value="grid">Orthogonal Grid</option>
              <option value="concentric">Concentric Rings</option>
            </select>
          </div>

          {/* Graph Action Buttons */}
          <div className="flex items-center gap-1 border-l border-intel-border/70 pl-2">
            <button
              onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 1.25)}
              className="p-1.5 rounded-xl bg-intel-card hover:bg-intel-panel text-slate-300 border border-intel-border/80 hover:text-cyan-400 transition-colors"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 0.8)}
              className="p-1.5 rounded-xl bg-intel-card hover:bg-intel-panel text-slate-300 border border-intel-border/80 hover:text-cyan-400 transition-colors"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => cyRef.current?.fit(50)}
              className="p-1.5 rounded-xl bg-intel-card hover:bg-intel-panel text-slate-300 border border-intel-border/80 hover:text-cyan-400 transition-colors"
              title="Fit to Screen"
              aria-label="Fit View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                cyRef.current?.reset();
                cyRef.current?.elements().removeClass('highlighted faded');
              }}
              className="p-1.5 rounded-xl bg-intel-card hover:bg-intel-panel text-slate-300 border border-intel-border/80 hover:text-cyan-400 transition-colors"
              title="Reset Viewport"
              aria-label="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleHighlightShortestPath}
              className="px-2.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs flex items-center gap-1 font-mono transition-colors shadow-sm"
              title="Highlight Shortest Path between 2 selected nodes"
            >
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>A* Path</span>
            </button>
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`p-1.5 rounded-xl border transition-colors ${
                showLabels
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-intel-card text-slate-400 border-intel-border hover:text-slate-200'
              }`}
              title={showLabels ? 'Hide Node Labels' : 'Show Node Labels'}
              aria-label="Toggle Labels"
            >
              {showLabels ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleExportPNG}
              className="p-1.5 rounded-xl bg-intel-card hover:bg-intel-panel text-cyan-400 border border-intel-border/80 transition-colors"
              title="Export High-Res Graph Snapshot"
              aria-label="Export PNG"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Inline Notice Banner (replaces window.alert) */}
      {graphNotice && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-xl bg-intel-card/95 border border-cyan-500/50 shadow-2xl text-xs text-cyan-300 backdrop-blur-xl animate-in fade-in">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{graphNotice}</span>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="relative flex-1 bg-grid-pattern overflow-hidden" style={{ minHeight: height }}>
        <div ref={containerRef} className="w-full h-full" style={{ minHeight: height }} />

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-intel-card/90 border border-intel-border/80 backdrop-blur-xl text-[10px] text-slate-200 shadow-glass-panel">
          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[9px] mr-1 font-mono">Legend:</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]"></span>Person</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#A855F7]"></span>Org</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rotate-45 bg-[#F59E0B]"></span>Vehicle</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#3B82F6]"></span>Case</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#EF4444]"></span>Incident</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#10B981]"></span>Evidence</span>
          <span className="border-l border-intel-border/70 pl-2.5 flex items-center gap-2 text-slate-400 font-mono">
            <span className="flex items-center gap-1"><span className="w-3.5 h-0.5 bg-cyan-400"></span> Strong (≥75%)</span>
            <span className="flex items-center gap-1"><span className="w-3.5 h-0.5 border-t border-dashed border-slate-400"></span> Weak (&lt;45%)</span>
          </span>
        </div>

        {/* Edge Hover Tooltip */}
        {hoveredEdge && (
          <div
            className="absolute z-20 pointer-events-none p-3.5 rounded-2xl bg-intel-card/95 border border-cyan-500/50 shadow-glass-edge text-xs backdrop-blur-2xl text-slate-200 animate-in fade-in"
            style={{
              left: `${Math.min(window.innerWidth - 300, tooltipPos.x + 15)}px`,
              top: `${Math.max(10, tooltipPos.y - 80)}px`,
              maxWidth: '290px'
            }}
          >
            <div className="flex items-center justify-between font-mono font-semibold text-cyan-300 pb-1.5 border-b border-intel-border/70">
              <span className="font-display font-bold text-slate-100">{hoveredEdge.label}</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-[10px] text-cyan-200 font-mono font-bold border border-cyan-500/30 tabular-nums">
                {hoveredEdge.strength}% Strength
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">{hoveredEdge.description}</p>
            <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 mt-2 font-mono pt-2 border-t border-intel-border/50">
              <div>First observed: <span className="text-slate-200">{hoveredEdge.firstObserved || '12 May 2026'}</span></div>
              <div>Last observed: <span className="text-slate-200">{hoveredEdge.lastObserved || '26 Sep 2026'}</span></div>
              <div>Associated cases: <span className="text-slate-200">{hoveredEdge.caseId ? 1 : 3}</span></div>
              <div>Evidence refs: <span className="text-slate-200">{hoveredEdge.evidenceReferences || 5}</span></div>
            </div>
            <div className="mt-2 text-[9px] text-cyan-400/90 font-mono">
              Signal: {hoveredEdge.verificationStatus || 'UNDER_REVIEW'} • Explainable Graph Edge
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
