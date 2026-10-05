import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Filter,
  Layers,
  Calendar,
  AlertTriangle,
  Building2,
  Briefcase,
  Flame,
  CheckCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import EthicsNoticeBanner from '../components/EthicsNoticeBanner';
import { incidentsApi, casesApi, organizationsApi } from '../services/api';

// Create custom DOM icons for Leaflet without relying on external PNG assets
const createCustomIcon = (color, symbol) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 12px ${color}88, 0 4px 6px rgba(0,0,0,0.5);
        border: 2px solid #ffffff;
      ">
        <span style="
          transform: rotate(45deg);
          color: #ffffff;
          font-weight: 800;
          font-size: 13px;
        ">${symbol}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const incidentIcon = createCustomIcon('#F43F5E', '!'); // Red
const caseIcon = createCustomIcon('#06B6D4', 'C');     // Cyan
const orgIcon = createCustomIcon('#8B5CF6', 'O');      // Purple

export default function CrimeMapPage({ onNavigate }) {
  const [incidents, setIncidents] = useState([]);
  const [cases, setCases] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [caseFilter, setCaseFilter] = useState('ALL');
  const [showIncidents, setShowIncidents] = useState(true);
  const [showCases, setShowCases] = useState(true);
  const [showOrgs, setShowOrgs] = useState(true);

  // Default coordinate center (Chennai / Metropolitan coastal hub coordinate range for demo)
  const defaultCenter = [13.0827, 80.2707];

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    setLoading(true);
    try {
      const [incRes, casesRes, orgsRes] = await Promise.all([
        incidentsApi.getAll(),
        casesApi.getAll(),
        organizationsApi.getAll(),
      ]);

      setIncidents(incRes.data || []);
      setCases(casesRes.data || []);
      setOrganizations(orgsRes.data || []);
    } catch (err) {
      console.error('Failed to load geographic data', err);
    } finally {
      setLoading(false);
    }
  };

  // Derive coordinates for items if not explicitly set in synthetic records
  // Deterministic jitter based on ID string
  const getCoordinates = (item, baseIndex = 0) => {
    if (item.latitude && item.longitude) {
      return [item.latitude, item.longitude];
    }
    // Deterministic pseudo-locations around metro center for visualization
    const hash = (item.id || item.incidentId || item.caseNumber || 'item')
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const latOffset = (((hash * 13) % 100) - 50) * 0.0035;
    const lngOffset = (((hash * 17) % 100) - 50) * 0.0035;
    return [defaultCenter[0] + latOffset, defaultCenter[1] + lngOffset];
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (!showIncidents) return false;
    if (categoryFilter !== 'ALL' && inc.incidentType !== categoryFilter) return false;
    if (caseFilter !== 'ALL' && inc.relatedCase !== caseFilter) return false;
    return true;
  });

  const categories = Array.from(new Set(incidents.map((i) => i.incidentType).filter(Boolean)));

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-intel-card border border-intel-border">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Geographic Crime Intelligence Map
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                Leaflet / OSM
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Spatial clustering of synthetic incidents, case locations, and entity headquarters.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-rose-glow"></span>
            <span className="text-slate-300">Incidents ({filteredIncidents.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-cyan-glow"></span>
            <span className="text-slate-300">Cases ({cases.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-500 shadow-purple-glow"></span>
            <span className="text-slate-300">Organizations ({organizations.length})</span>
          </div>
        </div>
      </div>

      <EthicsNoticeBanner />

      {/* Map + Filter Sidebar */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[620px]">
        {/* Filter Controls (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Layer Visibility */}
          <div className="p-4 rounded-2xl bg-intel-card border border-intel-border space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Visible Map Layers</span>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-intel-panel/50 border border-intel-border text-xs cursor-pointer hover:border-cyan-500/30 transition-colors">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  Synthetic Incidents
                </span>
                <input
                  type="checkbox"
                  checked={showIncidents}
                  onChange={(e) => setShowIncidents(e.target.checked)}
                  className="accent-cyan-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-intel-panel/50 border border-intel-border text-xs cursor-pointer hover:border-cyan-500/30 transition-colors">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  Active Case Locations
                </span>
                <input
                  type="checkbox"
                  checked={showCases}
                  onChange={(e) => setShowCases(e.target.checked)}
                  className="accent-cyan-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-intel-panel/50 border border-intel-border text-xs cursor-pointer hover:border-cyan-500/30 transition-colors">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  Known Organizations
                </span>
                <input
                  type="checkbox"
                  checked={showOrgs}
                  onChange={(e) => setShowOrgs(e.target.checked)}
                  className="accent-cyan-500 rounded"
                />
              </label>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 rounded-2xl bg-intel-card border border-intel-border space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span>Spatial Filters</span>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1.5">
                Incident Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Categories ({incidents.length})</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1.5">
                Associated Case
              </label>
              <select
                value={caseFilter}
                onChange={(e) => setCaseFilter(e.target.value)}
                className="w-full bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Cases</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.caseNumber}>
                    {c.caseNumber} - {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 border-t border-intel-border text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">Spatial Intelligence Note:</p>
              <p>
                Synthetically mapped to anonymized metropolitan zones. Demonstrates proximity analysis
                and hotspot correlation across multiple cases.
              </p>
            </div>
          </div>
        </div>

        {/* Leaflet Map Canvas (9 cols) */}
        <div className="lg:col-span-9 rounded-2xl bg-intel-card border border-intel-border overflow-hidden relative shadow-2xl">
          <MapContainer
            center={defaultCenter}
            zoom={12}
            scrollWheelZoom={true}
            className="w-full h-full min-h-[580px] z-10"
          >
            {/* Dark Mode CartoDB TileLayer for intelligence aesthetic */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Incidents Markers */}
            {showIncidents &&
              filteredIncidents.map((inc) => {
                const pos = getCoordinates(inc);
                return (
                  <Marker key={inc.id || inc.incidentId} position={pos} icon={incidentIcon}>
                    <Popup className="intel-popup">
                      <div className="p-1 space-y-1.5 text-slate-800">
                        <div className="flex items-center justify-between gap-2 border-b pb-1">
                          <span className="font-mono font-bold text-xs text-rose-600">
                            {inc.incidentId}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-semibold">
                            {inc.incidentType}
                          </span>
                        </div>
                        <div className="text-xs font-semibold">{inc.location}</div>
                        <p className="text-[11px] text-slate-600 line-clamp-2">
                          {inc.description}
                        </p>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Date: {inc.date} | Case: {inc.relatedCase || 'None'}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

            {/* Cases Markers */}
            {showCases &&
              cases.map((c) => {
                const pos = getCoordinates(c);
                return (
                  <Marker key={c.id} position={pos} icon={caseIcon}>
                    <Popup className="intel-popup">
                      <div className="p-1 space-y-1.5 text-slate-800">
                        <div className="flex items-center justify-between gap-2 border-b pb-1">
                          <span className="font-mono font-bold text-xs text-cyan-600">
                            {c.caseNumber}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-700 font-semibold">
                            {c.priority}
                          </span>
                        </div>
                        <div className="text-xs font-semibold">{c.title}</div>
                        <div className="text-[10px] text-slate-500">
                          Lead: {c.leadInvestigator} | Status: {c.status}
                        </div>
                        <button
                          onClick={() => onNavigate && onNavigate('cases')}
                          className="w-full mt-1 py-1 rounded bg-cyan-600 text-white text-[11px] font-medium hover:bg-cyan-700 transition-colors"
                        >
                          Open Case Workspace
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

            {/* Organizations Markers */}
            {showOrgs &&
              organizations.map((org) => {
                const pos = getCoordinates(org);
                return (
                  <Marker key={org.id} position={pos} icon={orgIcon}>
                    <Popup className="intel-popup">
                      <div className="p-1 space-y-1 text-slate-800">
                        <div className="font-bold text-xs text-purple-700">{org.name}</div>
                        <div className="text-[10px] text-slate-600">
                          Type: {org.type} | Loc: {org.location}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Status: {org.status}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
