import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Briefcase,
  Network,
  Car,
  Building2,
  FileText,
  MapPin,
  MessageSquare,
  Clock,
  ArrowLeft,
  Share2,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Plus,
  Pin,
  Calendar,
  PhoneCall,
  Link2,
  Send,
  Trash2,
  Search,
  Cpu,
  Sparkles
} from 'lucide-react';
import {
  personsApi,
  networkApi,
  casesApi,
  vehiclesApi,
  organizationsApi,
  evidenceApi,
  locationsApi,
  communicationsApi,
  notesApi,
  aiApi
} from '../services/api';
import EthicsNoticeBanner from '../components/EthicsNoticeBanner';

export default function PersonProfilePage({ personId = 'DEMO-P001', onNavigate }) {
  const [person, setPerson] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Tab Data States
  const [cases, setCases] = useState([]);
  const [associates, setAssociates] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [locations, setLocations] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [notes, setNotes] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [mlInsights, setMlInsights] = useState(null);

  // New Note state
  const [newNoteText, setNewNoteText] = useState('');
  const [newNotePriority, setNewNotePriority] = useState('MEDIUM');

  useEffect(() => {
    loadProfile();
  }, [personId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const [persRes, casesRes, vehRes, orgRes, evRes, locRes, commRes, notesRes, relRes] = await Promise.all([
        personsApi.getByPersonId(personId).catch(() => ({ data: null })),
        casesApi.getAll().catch(() => ({ data: [] })),
        vehiclesApi.getAll().catch(() => ({ data: [] })),
        organizationsApi.getAll().catch(() => ({ data: [] })),
        evidenceApi.getAll().catch(() => ({ data: [] })),
        locationsApi.getAll().catch(() => ({ data: [] })),
        communicationsApi.getAll().catch(() => ({ data: [] })),
        notesApi.getAll({ personId }).catch(() => ({ data: [] })),
        networkApi.getAllRelationships().catch(() => ({ data: [] }))
      ]);

      const pData = persRes.data || {
        personId: personId,
        fullName: 'Arjun Rao',
        name: 'Arjun Rao',
        alias: 'The Architect',
        status: 'SUSPECT',
        riskLevel: 'HIGH',
        age: 42,
        gender: 'Male',
        occupation: 'Freight Operations Broker',
        location: 'North Docklands Terminal 4',
        updatedAt: '2026-09-29 18:30'
      };
      setPerson(pData);

      setCases((casesRes.data || []).slice(0, 3));
      setVehicles((vehRes.data || []).slice(0, 3));
      setOrganizations((orgRes.data || []).slice(0, 3));
      setEvidence((evRes.data || []).slice(0, 4));
      setLocations((locRes.data || []).slice(0, 4));
      setCommunications((commRes.data || []).slice(0, 5));

      // Filter relationships relevant to this person
      const allRels = relRes.data || [];
      const myRels = allRels.filter(r =>
        (r.sourceEntity === personId || r.targetEntity === personId ||
         r.sourcePersonId === personId || r.targetPersonId === personId)
      );
      setRelationships(myRels.length > 0 ? myRels : allRels.slice(0, 6));

      // Associates derived from relationships
      setAssociates([
        { id: 'DEMO-P008', name: 'Samantha Reed', alias: 'Silver', role: 'ASSOCIATED_WITH', str: '85%', tag: 'Verified' },
        { id: 'DEMO-P003', name: 'Vikram Malhotra', alias: 'V-Six', role: 'COMMUNICATED_WITH', str: '78%', tag: 'Verified' },
        { id: 'DEMO-P017', name: 'Leonidas Drake', alias: 'The Bridge', role: 'COMMUNICATED_WITH', str: '82%', tag: 'Verified' },
        { id: 'DEMO-P006', name: 'Kavita Menon', alias: 'Vanguard', role: 'CONTACTED', str: '72%', tag: 'Under Review' },
      ]);

      const initialNotes = notesRes.data || [];
      if (initialNotes.length > 0) {
        setNotes(initialNotes);
      } else {
        setNotes([
          { id: 1, title: 'RFID Transponder Acquisition', content: 'Observed meeting electronics contact near North Terminal gate. Physical transponder frequencies match INC-2026-0001.', priority: 'HIGH', authorName: 'Marcus Holloway', createdAt: '2026-09-28 14:10' },
          { id: 2, title: 'Nominee Ledger Cross-Reference', content: 'Direct signatory links to Orion Logistics shell registration confirmed through commercial registrar filing.', priority: 'MEDIUM', authorName: 'Sophia Sterling', createdAt: '2026-09-29 11:20' }
        ]);
      }

      // Fetch AIML Topological & Outlier Insights (Spec 32)
      try {
        const aiRes = await aiApi.getPersonInsights(personId);
        if (aiRes && aiRes.data) {
          setMlInsights(aiRes.data?.data || aiRes.data);
        }
      } catch (e) {
        console.warn('AI insights fetch skipped', e);
      }
    } catch (err) {
      console.error('Failed to load person profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const payload = {
      personId: person?.personId || personId,
      title: 'Investigative Dossier Note',
      content: newNoteText.trim(),
      priority: newNotePriority,
      pinned: false
    };

    try {
      const res = await notesApi.create(payload);
      if (res && res.data) {
        setNotes([res.data, ...notes]);
      } else {
        setNotes([
          {
            id: Date.now(),
            title: 'Investigative Dossier Note',
            content: newNoteText.trim(),
            priority: newNotePriority,
            authorName: 'Active Investigator',
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
          },
          ...notes
        ]);
      }
      setNewNoteText('');
    } catch (err) {
      console.error('Add note error', err);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'cases', label: `Cases (${cases.length})`, icon: Briefcase },
    { id: 'associates', label: `Associates (${associates.length})`, icon: Network },
    { id: 'organizations', label: `Organizations (${organizations.length})`, icon: Building2 },
    { id: 'vehicles', label: `Vehicles (${vehicles.length})`, icon: Car },
    { id: 'evidence', label: `Evidence (${evidence.length})`, icon: FileText },
    { id: 'locations', label: `Locations (${locations.length})`, icon: MapPin },
    { id: 'communications', label: `Communications (${communications.length})`, icon: MessageSquare },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'notes', label: `Notes (${notes.length})`, icon: Pin },
    { id: 'relationships', label: `Relationships (${relationships.length})`, icon: Link2 },
    { id: 'analytics', label: 'Network Analytics (AIML)', icon: Cpu },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1700px] mx-auto">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <button
            onClick={() => onNavigate && onNavigate('persons')}
            className="hover:text-intel-cyan flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Persons of Interest</span>
          </button>
          <span>/</span>
          <span className="font-mono text-cyan-300 font-bold">{person?.personId || personId}</span>
          <span>/</span>
          <span className="text-slate-300">Dossier Profile</span>
        </div>

        <button
          onClick={() => onNavigate && onNavigate('network')}
          className="px-3 py-1.5 rounded-xl bg-intel-cyan/15 hover:bg-intel-cyan/25 border border-intel-cyan/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Inspect Network Graph</span>
        </button>
      </div>

      {/* Person Header Card (Mandatory Spec 10) */}
      <div className="p-6 rounded-3xl bg-intel-card border border-intel-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-cyan-glow shrink-0 font-mono">
            {person?.fullName ? person.fullName.slice(0, 2).toUpperCase() : (person?.name ? person.name.slice(0, 2).toUpperCase() : 'ID')}
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
                {person?.fullName || person?.name || 'Arjun Rao'}
              </h1>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-intel-panel text-cyan-300 border border-cyan-500/40">
                {person?.personId || personId}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                {person?.status || 'SUSPECT'}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                {person?.riskLevel || 'HIGH'} RISK
              </span>
            </div>

            <div className="text-xs text-slate-400 font-mono flex flex-wrap items-center gap-3">
              <span>Alias: <strong className="text-cyan-300">{person?.alias || 'The Architect'}</strong></span>
              <span>•</span>
              <span>Occupation: <strong className="text-slate-200">{person?.occupation || 'Logistics Broker'}</strong></span>
              <span>•</span>
              <span>Age / Gender: <strong className="text-slate-200">{person?.age || 42} / {person?.gender || 'Male'}</strong></span>
              <span>•</span>
              <span>Last Updated: <strong className="text-slate-300">{person?.updatedAt || '2026-09-29 18:30'}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => onNavigate && onNavigate('case-workspace', 'CASE-2026-0001')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-intel-panel border border-intel-border hover:border-cyan-500/40 transition-colors flex items-center gap-1.5"
          >
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            <span>Associated Cases</span>
          </button>
          <button
            onClick={() => onNavigate && onNavigate('network')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-intel-cyan hover:bg-cyan-400 shadow-cyan-glow flex items-center gap-1.5 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Open Network</span>
          </button>
        </div>
      </div>

      <EthicsNoticeBanner />

      {/* Tabs Navigation (All 11 Tabs from Spec 10) */}
      <div className="flex border-b border-intel-border overflow-x-auto text-xs font-semibold gap-1 bg-intel-card/40 p-1 rounded-t-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap rounded-t-xl ${
                isActive
                  ? 'border-intel-cyan text-intel-cyan bg-intel-cyan/10 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-intel-panel/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              Biographical Attributes
            </h3>
            <div className="space-y-2 text-xs divide-y divide-intel-border/40">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Full Legal Name</span>
                <span className="text-slate-100 font-semibold">{person?.fullName || person?.name}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Known Alias</span>
                <span className="text-cyan-300 font-mono font-semibold">{person?.alias || 'The Architect'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Age / Gender</span>
                <span className="text-slate-200">{person?.age || 42} Years / {person?.gender || 'Male'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Primary Geo-Zone</span>
                <span className="text-slate-200">{person?.location || 'North Docklands Hub'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Investigation Status</span>
                <span className="text-rose-400 font-mono font-bold">{person?.status || 'SUSPECT'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Risk Assessment</span>
                <span className="text-amber-400 font-mono font-bold">{person?.riskLevel || 'HIGH'} (Database Flag)</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              Graph Centrality Metrics
            </h3>
            <div className="space-y-2 text-xs divide-y divide-intel-border/40">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Degree (Direct Connections)</span>
                <span className="text-cyan-400 font-mono font-bold">8 Verified Edges</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Betweenness Rank</span>
                <span className="text-amber-400 font-mono font-bold">Top 5% (Key Intermediary)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Network Topology Role</span>
                <span className="text-purple-400 font-mono font-bold">Logistics Hub Coordinator</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Verification Rate</span>
                <span className="text-emerald-400 font-mono font-bold">92% Supported by Records</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Investigator Narrative Summary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Subject identified as the primary coordinating broker for intermodal container dispatches. Maintains active associations with freight shell companies and verified communication links to transport vehicle drivers.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: CASES */}
      {activeTab === 'cases' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            Cases Linked to this Subject
          </h3>
          <div className="space-y-3">
            {cases.map((c) => (
              <div
                key={c.id}
                onClick={() => onNavigate && onNavigate('case-workspace', c.caseNumber || c.id)}
                className="p-4 rounded-xl bg-intel-panel/50 border border-intel-border hover:border-cyan-500/40 cursor-pointer transition-colors flex items-center justify-between text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-300">{c.caseNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-intel-panel text-slate-300 border border-intel-border font-mono text-[10px]">
                      {c.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                      {c.status}
                    </span>
                  </div>
                  <div className="font-bold text-slate-100 text-sm">{c.title}</div>
                  <p className="text-slate-400 text-[11px]">{c.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-cyan-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ASSOCIATES */}
      {activeTab === 'associates' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            Known & Verified Associates
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {associates.map((a, i) => (
              <div key={i} className="p-4 rounded-xl bg-intel-panel/50 border border-intel-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-cyan-300 font-bold">{a.id}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    {a.str}
                  </span>
                </div>
                <div className="font-bold text-slate-100">{a.name}</div>
                <div className="text-[11px] text-slate-400">Alias: <span className="text-cyan-300">{a.alias}</span></div>
                <div className="text-[10px] text-cyan-400 font-mono pt-1 border-t border-intel-border">{a.role}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ORGANIZATIONS */}
      {activeTab === 'organizations' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-400" />
            Corporate & Syndicate Affiliations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {organizations.map((org) => (
              <div key={org.id} className="p-4 rounded-xl bg-intel-panel/50 border border-intel-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-purple-300">{org.organizationId || org.id}</span>
                  <span className="text-[10px] font-mono text-slate-400">{org.type}</span>
                </div>
                <div className="font-bold text-slate-100">{org.name}</div>
                <p className="text-slate-400 text-[11px]">{org.description || 'Logistics forwarding company.'}</p>
                <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-intel-border">
                  Address: <span className="text-slate-200">{org.address}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: VEHICLES */}
      {activeTab === 'vehicles' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Car className="w-4 h-4 text-amber-400" />
            Registered & Associated Vehicles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vehicles.map((v) => (
              <div key={v.id} className="p-4 rounded-xl bg-intel-panel/50 border border-intel-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-300">{v.registrationNumber || v.licensePlate}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                    {v.status || 'ACTIVE'}
                  </span>
                </div>
                <div className="font-bold text-slate-100">{v.make} {v.model} ({v.year || 2024})</div>
                <div className="text-[11px] text-slate-400">Color: {v.color} • Type: {v.vehicleType}</div>
                <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-intel-border">
                  Location: <span className="text-slate-200">{v.lastKnownLocation || 'Terminal 4'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: EVIDENCE */}
      {activeTab === 'evidence' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Evidentiary Items Linked to Subject
          </h3>
          <div className="divide-y divide-intel-border/60 rounded-xl border border-intel-border overflow-hidden">
            {evidence.map((ev) => (
              <div key={ev.id} className="p-4 bg-intel-card hover:bg-intel-panel/40 transition-colors flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-300">{ev.evidenceNumber || ev.evidenceId}</span>
                    <span className="px-2 py-0.5 rounded bg-intel-panel text-slate-300 text-[10px] font-mono">
                      {ev.evidenceType}
                    </span>
                  </div>
                  <p className="text-slate-200 font-medium">{ev.description}</p>
                </div>
                <span className="font-mono text-slate-400 text-[11px]">{ev.storageLocation || 'Vault SEC-01'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: LOCATIONS */}
      {activeTab === 'locations' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-400" />
            Known Waypoints & Frequented Locations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {locations.map((loc) => (
              <div key={loc.id} className="p-4 rounded-xl bg-intel-panel/50 border border-intel-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-orange-400">{loc.locationCode || loc.id}</span>
                  <span className="text-[10px] font-mono text-slate-400">{loc.city}</span>
                </div>
                <div className="font-bold text-slate-100">{loc.name}</div>
                <p className="text-slate-400 text-[11px]">{loc.address}</p>
                <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-intel-border">
                  GPS: {loc.latitude}, {loc.longitude}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: COMMUNICATIONS */}
      {activeTab === 'communications' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-teal-400" />
            Communication Logs Involving this Subject (Fictional Demo Records)
          </h3>
          <div className="divide-y divide-intel-border/60 rounded-xl border border-intel-border overflow-hidden">
            {communications.map((comm) => (
              <div key={comm.id} className="p-4 bg-intel-card hover:bg-intel-panel/40 transition-colors flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-teal-400">{comm.communicationId || comm.id}</span>
                    <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px]">
                      {comm.communicationType || comm.type}
                    </span>
                    <span className="text-slate-400">Duration: {comm.duration || '3m 45s'}</span>
                  </div>
                  <div className="text-slate-200 mt-1 font-sans">
                    Target: <span className="text-cyan-300 font-mono">{comm.destinationPerson || 'DEMO-P008'}</span>
                  </div>
                </div>
                <div className="text-right text-slate-400 text-[11px]">
                  <div>{comm.date || '2026-01-14'}</div>
                  <div>{comm.time || '14:22:00'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Subject Activity Timeline
          </h3>
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-intel-border text-xs">
            {[
              { date: '14 Jan 2026, 02:15 AM', title: 'Observed at North Port Terminal 4', desc: 'RFID clone transponder log match detected during gate inspection.', tag: 'INCIDENT' },
              { date: '20 Jan 2026, 11:40 AM', title: 'Transshipment Invoice Signed', desc: 'EV-0004 freight manifest voucher authorized under broker name.', tag: 'DOCUMENT' },
              { date: '22 Jan 2026, 03:00 PM', title: 'Vehicle TN-00-DEMO-001 Logged', desc: 'Observed driving commercial transport van near cargo bay 9.', tag: 'VEHICLE' },
              { date: '24 Sep 2026, 08:30 PM', title: 'The Obsidian Social Club Attendance', desc: 'Scheduled meeting logged with corporate nominees.', tag: 'MEETING' },
            ].map((evt, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[27px] top-1 w-5 h-5 rounded-full bg-intel-panel border-2 border-cyan-400"></div>
                <div className="p-3.5 rounded-xl bg-intel-panel/50 border border-intel-border space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300">
                    <span>{evt.date}</span>
                    <span className="px-1.5 py-0.2 rounded bg-intel-card border border-intel-border text-slate-300">{evt.tag}</span>
                  </div>
                  <div className="font-bold text-slate-100">{evt.title}</div>
                  <p className="text-slate-400 text-[11px]">{evt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 10: NOTES */}
      {activeTab === 'notes' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <form onSubmit={handleAddNote} className="p-4 rounded-xl bg-intel-panel/50 border border-intel-border space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Pin className="w-3.5 h-3.5 text-cyan-400" />
              Add Investigator Note on Subject
            </h4>
            <textarea
              rows="3"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Record forensic observation, informant statement, or cross-reference..."
              className="w-full p-3 rounded-xl bg-intel-card border border-intel-border text-slate-200 outline-none focus:border-cyan-500"
            />
            <div className="flex justify-between items-center">
              <select
                value={newNotePriority}
                onChange={(e) => setNewNotePriority(e.target.value)}
                className="bg-intel-card border border-intel-border rounded-lg px-2.5 py-1 text-slate-200 font-mono text-xs"
              >
                <option value="LOW">LOW PRIORITY</option>
                <option value="MEDIUM">MEDIUM PRIORITY</option>
                <option value="HIGH">HIGH PRIORITY</option>
                <option value="CRITICAL">CRITICAL PRIORITY</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-intel-cyan hover:bg-cyan-400 text-slate-950 font-bold shadow-cyan-glow flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {notes.map((n) => (
              <div key={n.id} className="p-4 rounded-xl bg-intel-panel/30 border border-intel-border space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                  <span className="font-bold text-slate-200 font-sans">{n.title}</span>
                  <span>{n.createdAt || 'Recent'}</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">{n.content}</p>
                <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-intel-border/60">
                  Officer: <span className="text-cyan-400">{n.authorName || 'Lead Investigator'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 11: RELATIONSHIPS */}
      {activeTab === 'relationships' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-cyan-400" />
              Verified & Under-Review Entity Links
            </h3>
            <button
              onClick={() => onNavigate && onNavigate('network')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Manage in Network Studio</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-intel-border/60 rounded-xl border border-intel-border overflow-hidden">
            {relationships.map((r) => (
              <div key={r.id} className="p-4 bg-intel-card hover:bg-intel-panel/40 transition-colors flex items-center justify-between text-xs">
                <div className="space-y-1 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-300">{r.sourceEntity || r.sourcePersonId}</span>
                    <span className="text-slate-400">→</span>
                    <span className="px-2 py-0.5 rounded bg-intel-panel text-slate-200 text-[10px] border border-intel-border">
                      {r.relationshipType || r.type}
                    </span>
                    <span className="text-slate-400">→</span>
                    <span className="font-bold text-cyan-300">{r.targetEntity || r.targetPersonId}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] font-sans">{r.description || 'Observed logistical coordination.'}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                  {r.strengthLevel || (r.strength ? `${r.strength}%` : 'VERIFIED')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 12: NETWORK ANALYTICS / ML INSIGHTS (Spec 32) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Prominent Academic Ethics Disclaimer */}
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-start gap-3">
            <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100">Network Topology & Machine Learning Indicators</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  ANALYTICAL DATA
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                <strong>Important Legal / Academic Limitation:</strong> These scores represent mathematical graph metrics and unsupervised statistical models derived from synthetic activity logs. They do <strong>NOT</strong> constitute a criminal determination or evidence of guilt.
              </p>
            </div>
          </div>

          {/* Centrality Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-intel-card border border-intel-border">
              <span className="text-xs text-slate-400">Degree Centrality</span>
              <p className="text-2xl font-bold text-cyan-400 mt-1">{mlInsights?.degree_centrality ?? 0.14}</p>
              <span className="text-[11px] text-slate-400">Direct structural ties: {mlInsights?.direct_connections ?? associates.length}</span>
            </div>
            <div className="p-5 rounded-2xl bg-intel-card border border-intel-border">
              <span className="text-xs text-slate-400">Betweenness Centrality</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">{mlInsights?.betweenness_centrality ?? 0.05}</p>
              <span className="text-[11px] text-slate-400">Shortest-path intermediary score</span>
            </div>
            <div className="p-5 rounded-2xl bg-intel-card border border-intel-border">
              <span className="text-xs text-slate-400">Closeness Centrality</span>
              <p className="text-2xl font-bold text-slate-200 mt-1">{mlInsights?.closeness_centrality ?? 0.18}</p>
              <span className="text-[11px] text-slate-400">Average distance to all nodes</span>
            </div>
            <div className="p-5 rounded-2xl bg-intel-card border border-intel-border">
              <span className="text-xs text-slate-400">PageRank Importance</span>
              <p className="text-2xl font-bold text-purple-400 mt-1">{mlInsights?.pagerank ?? 0.035}</p>
              <span className="text-[11px] text-slate-400">Eigenvector prestige score</span>
            </div>
          </div>

          {/* Community & Outlier Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-intel-card border border-intel-border">
              <span className="text-xs text-slate-400 block mb-1">Community Cluster Membership</span>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-cyan-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{mlInsights?.community_name || 'Cluster 1: Logistics & Warehouse Sector'}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Assigned via Label Propagation Community Detection (NetworkX).</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-intel-card border border-intel-border">
              <span className="text-xs text-slate-400 block mb-1">Isolation Forest Anomaly Status</span>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {mlInsights?.anomaly_status || 'NORMAL ACTIVITY ENVELOPE'}
                </span>
                <p className="text-xs text-slate-400">
                  Interaction frequencies and new ties fall within normal baseline limits.
                </p>
              </div>
            </div>
          </div>

          {/* AI/ML Link Suggestions */}
          <div className="p-5 rounded-2xl bg-intel-card border border-intel-border">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Predicted Graph Leads for {person?.fullName || person?.name || personId}
            </h4>
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-intel-panel border border-intel-border/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">DEMO-P015 (Deepak Chopra)</span>
                  <span className="text-[11px] text-slate-400">• 3 mutual contacts • Shared organization: Orion Logistics</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-xs border border-cyan-800">
                  82% Likelihood
                </span>
              </div>
              <div className="p-3 rounded-xl bg-intel-panel border border-intel-border/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">DEMO-P045 (Rahul Bose)</span>
                  <span className="text-[11px] text-slate-400">• 2 mutual contacts • Shared location: Highway Corridor</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-xs border border-cyan-800">
                  74% Likelihood
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
