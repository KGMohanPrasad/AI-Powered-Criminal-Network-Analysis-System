import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  Network,
  FileText,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ChevronRight,
  Plus,
  Send,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Car,
  Building2,
  MapPin,
  PhoneCall,
  Pin,
  Calendar,
  Eye,
  Activity,
  Share2,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  Cpu,
  Sparkles
} from 'lucide-react';
import {
  casesApi,
  networkApi,
  evidenceApi,
  personsApi,
  incidentsApi,
  vehiclesApi,
  organizationsApi,
  locationsApi,
  communicationsApi,
  notesApi,
  caseActivitiesApi,
  aiApi
} from '../services/api';
import { toast } from '../utils/toast';
import NetworkGraph from '../components/NetworkGraph';
import EthicsNoticeBanner from '../components/EthicsNoticeBanner';

export default function CaseWorkspacePage({ caseNumber = 'CASE-2026-0001', onNavigate }) {
  const [caseDetails, setCaseDetails] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [evidenceList, setEvidenceList] = useState([]);
  const [linkedPersons, setLinkedPersons] = useState([]);
  const [linkedIncidents, setLinkedIncidents] = useState([]);
  const [linkedVehicles, setLinkedVehicles] = useState([]);
  const [linkedOrgs, setLinkedOrgs] = useState([]);
  const [linkedLocations, setLinkedLocations] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [caseMlInsights, setCaseMlInsights] = useState(null);
  const [runningAnalysis, setRunningAnalysis] = useState(false);

  // New Note Form
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [newNotePriority, setNewNotePriority] = useState('MEDIUM');
  const [noteSearch, setNoteSearch] = useState('');

  const loadCaseData = async () => {
    setLoading(true);
    try {
      const cRes = await casesApi.getByNumber(caseNumber);
      if (cRes && cRes.data) {
        const c = cRes.data;
        setCaseDetails(c);

        const [netRes, evRes, persRes, incRes, vehRes, orgRes, locRes, commRes, notesRes, actRes] = await Promise.all([
          networkApi.getByCase(c.id).catch(() => ({ data: { nodes: [], edges: [] } })),
          evidenceApi.getAll({ caseId: c.id }).catch(() => ({ data: [] })),
          personsApi.getAll().catch(() => ({ data: [] })),
          incidentsApi.getAll().catch(() => ({ data: [] })),
          vehiclesApi.getAll().catch(() => ({ data: [] })),
          organizationsApi.getAll().catch(() => ({ data: [] })),
          locationsApi.getAll().catch(() => ({ data: [] })),
          communicationsApi.getAll().catch(() => ({ data: [] })),
          notesApi.getAll({ caseId: c.id }).catch(() => ({ data: [] })),
          caseActivitiesApi.getByCaseId(c.id).catch(() => ({ data: [] }))
        ]);

        setGraphData(netRes.data || { nodes: [], edges: [] });
        setEvidenceList(evRes.data || []);
        
        // Match linked persons from network or mock association
        const allPersons = persRes.data || [];
        setLinkedPersons(allPersons.slice(0, 6));

        // Match linked incidents
        const allIncidents = incRes.data || [];
        const matchingInc = allIncidents.filter(i => i.relatedCaseNumber === c.caseNumber || i.relatedCaseId === c.id);
        setLinkedIncidents(matchingInc.length > 0 ? matchingInc : allIncidents.slice(0, 3));

        // Linked vehicles
        const allVehicles = vehRes.data || [];
        const matchingVeh = allVehicles.filter(v => v.associatedCaseNumber === c.caseNumber || v.associatedCaseId === c.id);
        setLinkedVehicles(matchingVeh.length > 0 ? matchingVeh : allVehicles.slice(0, 3));

        // Linked orgs
        const allOrgs = orgRes.data || [];
        setLinkedOrgs(allOrgs.slice(0, 3));

        // Linked locations
        const allLocs = locRes.data || [];
        setLinkedLocations(allLocs.slice(0, 4));

        // Communications
        const allComms = commRes.data || [];
        setCommunications(allComms.slice(0, 5));

        // Notes
        const initialNotes = notesRes.data || [];
        if (initialNotes.length > 0) {
          setNotes(initialNotes);
        } else {
          setNotes([
            { id: 1, title: 'RF Transponder Cloned at Terminal 4', content: 'Physical examination of the recovered terminal gate seal shows frequency interference matching records in INC-2026-0001.', priority: 'HIGH', pinned: true, authorName: c.leadInvestigator || 'Marcus Holloway', createdAt: '2026-09-28 14:30' },
            { id: 2, title: 'Corporate Shell Ledger Reconciled', content: 'Reconciliation of fake bills of lading confirms association with Orion Logistics shell account.', priority: 'MEDIUM', pinned: false, authorName: 'Sophia Sterling', createdAt: '2026-09-29 09:15' }
          ]);
        }

        // Timeline Activities
        const initialActs = actRes.data || [];
        if (initialActs.length > 0) {
          setActivities(initialActs);
        } else {
          setActivities([
            { id: 1, title: 'Case Dossier Initialized', description: 'Primary criminal investigation opened by Senior Lead Investigator.', date: '12 Jan 2026', time: '09:00 AM', userName: c.leadInvestigator || 'Marcus Holloway', activityType: 'CREATE_CASE' },
            { id: 2, title: 'Lead Investigator Assigned', description: 'Assigned primary case oversight to investigative team.', date: '12 Jan 2026', time: '10:30 AM', userName: 'Admin Unit', activityType: 'ASSIGN_INVESTIGATOR' },
            { id: 3, title: 'Suspect DEMO-P001 Associated', description: 'Direct involvement confirmed through terminal gate logs.', date: '14 Jan 2026', time: '02:45 PM', userName: c.leadInvestigator || 'Marcus Holloway', activityType: 'ADD_PERSON' },
            { id: 4, title: 'Evidence EV-0001 Vaulted', description: 'Recovered electronic manifest drive sealed in tamper-proof custody container.', date: '15 Jan 2026', time: '11:15 AM', userName: 'Forensics Specialist', activityType: 'ADD_EVIDENCE' },
            { id: 5, title: 'Vehicle TN-00-DEMO-001 Connected', description: 'Interception transport van registered under nominee address.', date: '18 Jan 2026', time: '04:20 PM', userName: 'Field Officer', activityType: 'CONNECT_VEHICLE' },
            { id: 6, title: 'Graph Relationship Created', description: 'Association link mapped between DEMO-P001 and Orion Logistics International.', date: '22 Jan 2026', time: '01:10 PM', userName: 'Intelligence Analyst', activityType: 'CREATE_RELATIONSHIP' },
            { id: 7, title: 'Case Status Escalated', description: 'Priority upgraded to HIGH following discovery of multiple cross-case syndicate links.', date: '25 Sep 2026', time: '05:00 PM', userName: c.leadInvestigator || 'Marcus Holloway', activityType: 'UPDATE_STATUS' },
          ]);
        }
      }

      // Fetch Case ML Insights (Spec 33)
      try {
        const mlRes = await aiApi.getCaseInsights(1);
        if (mlRes && mlRes.data) {
          setCaseMlInsights(mlRes.data?.data || mlRes.data);
        }
      } catch (e) {
        console.warn('Case ML insights fetch skipped', e);
      }
    } catch (err) {
      console.error('Case load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCaseData();
  }, [caseNumber]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const payload = {
      caseId: caseDetails?.id,
      caseNumber: caseDetails?.caseNumber || caseNumber,
      title: newNoteTitle.trim() || 'Investigation Log Entry',
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
            title: newNoteTitle || 'Investigator Note',
            content: newNoteText.trim(),
            priority: newNotePriority,
            pinned: false,
            authorName: 'Active Investigator',
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
          },
          ...notes
        ]);
      }
      setNewNoteTitle('');
      setNewNoteText('');
    } catch (err) {
      console.error('Failed to create note', err);
    }
  };

  const handleTogglePin = async (noteId) => {
    try {
      await notesApi.togglePin(noteId);
      setNotes(notes.map(n => n.id === noteId ? { ...n, pinned: !n.pinned } : n));
    } catch (err) {
      setNotes(notes.map(n => n.id === noteId ? { ...n, pinned: !n.pinned } : n));
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await notesApi.delete(noteId);
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (err) {
      setNotes(notes.filter(n => n.id !== noteId));
    }
  };

  // Case Progress Tracker Steps (Mandatory Spec 13)
  const getStepIndex = (status) => {
    switch (status) {
      case 'NEW': return 0;
      case 'ACTIVE': return 2;
      case 'UNDER_INVESTIGATION': return 4;
      case 'REVIEW': return 5;
      case 'CLOSED': return 6;
      case 'ARCHIVED': return 6;
      default: return 2;
    }
  };

  const steps = [
    { label: 'Case Created', desc: 'Dossier initialized' },
    { label: 'Investigator Assigned', desc: 'Lead officer assigned' },
    { label: 'Persons Identified', desc: 'Subjects & witnesses linked' },
    { label: 'Evidence Collected', desc: 'Chain of custody vaulted' },
    { label: 'Relationships Analyzed', desc: 'Graph links verified' },
    { label: 'Case Review', desc: 'Supervisory review' },
    { label: 'Case Closed', desc: 'Final disposition' }
  ];

  const currentStepIdx = getStepIndex(caseDetails?.status || 'ACTIVE');

  // Filtered Notes
  const filteredNotes = notes.filter(n => {
    const q = noteSearch.toLowerCase();
    return !q || (n.title || '').toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q);
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1700px] mx-auto">
      
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <button
            onClick={() => onNavigate && onNavigate('cases')}
            className="hover:text-intel-cyan flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cases Registry</span>
          </button>
          <span>/</span>
          <span className="font-mono text-cyan-300 font-bold">{caseNumber}</span>
          <span>/</span>
          <span className="text-slate-300">Investigation Workspace</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate && onNavigate('network')}
            className="px-3 py-1.5 rounded-xl bg-intel-panel border border-intel-border hover:border-cyan-500/40 text-cyan-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Network className="w-3.5 h-3.5" />
            <span>Open in Network Studio</span>
          </button>
        </div>
      </div>

      {/* Case Header Card (Mandatory Spec 12) */}
      <div className="p-6 rounded-3xl bg-intel-card border border-intel-border shadow-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-mono font-bold px-3 py-1 rounded-xl bg-intel-panel text-cyan-300 border border-cyan-500/40">
              {caseDetails?.caseNumber || caseNumber}
            </span>
            <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
              caseDetails?.priority === 'CRITICAL'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : caseDetails?.priority === 'HIGH'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
            }`}>
              {caseDetails?.priority || 'HIGH'} PRIORITY
            </span>
            <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
              STATUS: {caseDetails?.status || 'ACTIVE'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            {caseDetails?.title || 'Warehouse Cargo Theft Investigation'}
          </h1>
          <p className="text-xs text-slate-400 font-sans max-w-3xl leading-relaxed">
            {caseDetails?.description || 'Multi-jurisdictional cargo diversion inquiry involving altered RFID seals, electronic manifest falsification, and commercial vehicle relays.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 font-mono">
            <span>Lead Investigator: <strong className="text-slate-200">{caseDetails?.leadInvestigator || 'Demo Senior Investigator'}</strong></span>
            <span>Category: <strong className="text-slate-200">{caseDetails?.caseType || 'Grand Cargo Larceny'}</strong></span>
            <span>Incident Location: <strong className="text-slate-200">{caseDetails?.incidentLocation || 'North Port Terminal 4'}</strong></span>
          </div>
        </div>

        {/* Quick Statistics Grid (Mandatory Spec 12) */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 shrink-0 bg-intel-panel/60 p-3 rounded-2xl border border-intel-border">
          <div className="p-2.5 text-center">
            <div className="text-lg font-bold text-cyan-400 font-mono">{linkedPersons.length}</div>
            <div className="text-[10px] text-slate-400 font-medium">Persons</div>
          </div>
          <div className="p-2.5 text-center">
            <div className="text-lg font-bold text-emerald-400 font-mono">{evidenceList.length}</div>
            <div className="text-[10px] text-slate-400 font-medium">Evidence</div>
          </div>
          <div className="p-2.5 text-center">
            <div className="text-lg font-bold text-rose-400 font-mono">{linkedIncidents.length}</div>
            <div className="text-[10px] text-slate-400 font-medium">Incidents</div>
          </div>
          <div className="p-2.5 text-center">
            <div className="text-lg font-bold text-amber-400 font-mono">{linkedVehicles.length}</div>
            <div className="text-[10px] text-slate-400 font-medium">Vehicles</div>
          </div>
          <div className="p-2.5 text-center">
            <div className="text-lg font-bold text-sky-400 font-mono">{graphData.edges.length || 18}</div>
            <div className="text-[10px] text-slate-400 font-medium">Relationships</div>
          </div>
          <div className="p-2.5 text-center">
            <div className="text-lg font-bold text-purple-400 font-mono">{linkedOrgs.length}</div>
            <div className="text-[10px] text-slate-400 font-medium">Organizations</div>
          </div>
        </div>
      </div>

      {/* Case Progress Tracker (Mandatory Spec 13) */}
      <div className="p-4 rounded-2xl bg-intel-card border border-intel-border shadow-subtle overflow-x-auto">
        <div className="flex items-center justify-between text-xs min-w-[780px]">
          {steps.map((st, i) => {
            const isCompleted = i < currentStepIdx;
            const isCurrent = i === currentStepIdx;
            return (
              <React.Fragment key={i}>
                <div className="flex items-center gap-2.5 shrink-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-intel-cyan text-slate-950 shadow-cyan-glow ring-2 ring-cyan-400/50 scale-105'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-intel-panel text-slate-500 border border-intel-border'
                    }`}
                  >
                    {isCompleted ? '✓' : i + 1}
                  </div>
                  <div>
                    <div className={`font-semibold text-xs ${isCurrent ? 'text-cyan-300' : isCompleted ? 'text-slate-200' : 'text-slate-500'}`}>
                      {st.label}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono">{st.desc}</div>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-3 ${
                      i < currentStepIdx ? 'bg-emerald-500/50' : 'bg-intel-border'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Mandatory Ethics Compliance Banner */}
      <EthicsNoticeBanner />

      {/* Workspace Tabs Navigation (Mandatory Spec 12) */}
      <div className="flex border-b border-intel-border overflow-x-auto text-xs font-semibold gap-1 bg-intel-card/40 p-1 rounded-t-2xl">
        {[
          { id: 'overview', label: 'Overview', icon: Briefcase },
          { id: 'persons', label: `Persons (${linkedPersons.length})`, icon: Users },
          { id: 'network', label: 'Network Graph', icon: Network },
          { id: 'evidence', label: `Evidence (${evidenceList.length})`, icon: FileText },
          { id: 'timeline', label: `Timeline (${activities.length})`, icon: Clock },
          { id: 'incidents', label: `Incidents (${linkedIncidents.length})`, icon: AlertTriangle },
          { id: 'vehicles', label: `Vehicles (${linkedVehicles.length})`, icon: Car },
          { id: 'organizations', label: `Organizations (${linkedOrgs.length})`, icon: Building2 },
          { id: 'locations', label: `Locations (${linkedLocations.length})`, icon: MapPin },
          { id: 'communications', label: `Communications (${communications.length})`, icon: PhoneCall },
          { id: 'notes', label: `Notes (${notes.length})`, icon: Pin },
          { id: 'activity', label: 'Activity Log', icon: Activity },
          { id: 'ml-insights', label: 'ML Insights & Similarity', icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap rounded-t-xl ${
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

      {/* TAB CONTENTS */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-3">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                Case Scope & Operational Narrative
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {caseDetails?.description || 'Active inquiry tracking coordinated transit thefts. Intelligence indicates systematic insider coordination between dock personnel and intermediary logistics contractors.'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-intel-border text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Created Date</span>
                  <span className="font-mono text-slate-200">{caseDetails?.createdDate || '2026-01-12'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Incident Date</span>
                  <span className="font-mono text-slate-200">{caseDetails?.incidentDate || '2026-01-10'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Lead Investigator</span>
                  <span className="font-medium text-slate-200">{caseDetails?.leadInvestigator || 'Marcus Holloway'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Supervisory Agency</span>
                  <span className="font-medium text-cyan-300">State Special Operations Unit</span>
                </div>
              </div>
            </div>

            {/* Quick Overview Network Preview */}
            <div className="p-4 rounded-2xl bg-intel-card border border-intel-border space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  Case Entity Graph Preview
                </h3>
                <button
                  onClick={() => setActiveTab('network')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>Full View</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <NetworkGraph
                elements={graphData}
                height="380px"
                compact={true}
              />
            </div>
          </div>

          {/* Right Column: Case Rule Alerts & Highlights */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Rule-Based System Alerts for Dossier
              </h3>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Evidence Review Threshold</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Physical item EV-0001 has been vaulted for 7+ days without transfer receipt verification.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5" />
                    <span>Cross-Dossier Entity Overlap</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Vehicle TN-00-DEMO-001 is co-indexed in active dossier CASE-2026-0002.
                  </p>
                </div>
              </div>
            </div>

            {/* Pinned Notes Preview */}
            <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Pin className="w-4 h-4 text-cyan-400" />
                  Pinned Investigation Notes
                </h3>
                <button
                  onClick={() => setActiveTab('notes')}
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  View All
                </button>
              </div>
              <div className="space-y-2">
                {notes.filter(n => n.pinned).map(n => (
                  <div key={n.id} className="p-3 rounded-xl bg-intel-panel/60 border border-intel-border space-y-1 text-xs">
                    <div className="font-bold text-slate-200 flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">{n.priority}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERSONS */}
      {activeTab === 'persons' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Persons of Interest & Subjects Associated with {caseNumber}
            </h3>
            <button
              onClick={() => onNavigate && onNavigate('persons')}
              className="px-3 py-1.5 rounded-xl bg-intel-panel hover:bg-intel-card border border-intel-border text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>Manage Persons</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {linkedPersons.map(p => (
              <div key={p.id} className="p-4 rounded-xl bg-intel-panel/50 border border-intel-border flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 text-sm">{p.fullName || p.name}</span>
                    <span className="text-[10px] font-mono text-cyan-400">{p.personId || p.id}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Alias: <span className="text-cyan-300 font-medium">{p.alias || 'None'}</span></div>
                  <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                      {p.status || 'SUSPECT'}
                    </span>
                    <span className="text-slate-400">Age: {p.age || 38}</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate && onNavigate('person-profile', p.id)}
                  className="p-1.5 rounded-lg bg-intel-card hover:bg-intel-panel border border-intel-border text-cyan-400 hover:text-cyan-300 transition-colors"
                  title="View Profile"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: NETWORK GRAPH */}
      {activeTab === 'network' && (
        <div className="p-4 rounded-2xl bg-intel-card border border-intel-border space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-400" />
                Case Subgraph Visualizer
              </h3>
              <p className="text-xs text-slate-400">
                Direct connections and secondary link topologies localized to {caseNumber}.
              </p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('network')}
              className="px-3 py-1.5 rounded-xl bg-intel-cyan hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-cyan-glow transition-colors"
            >
              Open Full Studio
            </button>
          </div>
          <NetworkGraph
            elements={graphData}
            height="620px"
          />
        </div>
      )}

      {/* TAB 4: EVIDENCE VAULT */}
      {activeTab === 'evidence' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Vaulted Evidence & Chain of Custody Registry
            </h3>
            <button
              onClick={() => onNavigate && onNavigate('evidence')}
              className="px-3 py-1.5 rounded-xl bg-intel-panel hover:bg-intel-card border border-intel-border text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>Evidence Master Index</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-intel-border/60 rounded-xl border border-intel-border overflow-hidden">
            {evidenceList.map(ev => (
              <div key={ev.id} className="p-4 bg-intel-card hover:bg-intel-panel/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-300">{ev.evidenceNumber || ev.evidenceId}</span>
                    <span className="px-2 py-0.5 rounded bg-intel-panel text-[10px] text-slate-300 border border-intel-border font-mono">
                      {ev.evidenceType}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                      {ev.status || 'VAULTED'}
                    </span>
                  </div>
                  <p className="text-slate-200 font-medium">{ev.description}</p>
                  <div className="text-[11px] font-mono text-slate-400">
                    Storage: <strong className="text-slate-300">{ev.storageLocation || 'VAULT-SEC-01'}</strong> • Collected: {ev.collectedDate} by {ev.collectedBy}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <button
                    onClick={() => onNavigate && onNavigate('evidence')}
                    className="px-2.5 py-1 rounded-lg bg-intel-panel hover:bg-intel-card border border-intel-border text-cyan-400 hover:text-cyan-300 text-[11px] font-medium transition-colors"
                  >
                    View Custody Chain
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: VERTICAL TIMELINE (Mandatory Spec 14) */}
      {activeTab === 'timeline' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Visual Case Event Timeline (Chronological Log)
            </h3>
            <p className="text-xs text-slate-400">
              Auditable vertical trail of key investigative milestones, evidence collections, and status transitions.
            </p>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-intel-border">
            {activities.map((act) => (
              <div key={act.id} className="relative group">
                {/* Node icon dot */}
                <div className="absolute -left-[27px] sm:-left-[35px] top-1 w-6 h-6 rounded-full bg-intel-panel border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-cyan-glow">
                  <Activity className="w-3 h-3" />
                </div>

                <div className="p-4 rounded-2xl bg-intel-panel/60 border border-intel-border group-hover:border-cyan-500/40 transition-colors space-y-1.5 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                    <span className="font-bold text-slate-100 text-sm">{act.title}</span>
                    <span className="font-mono text-cyan-300 font-semibold">{act.date} {act.time ? `• ${act.time}` : ''}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs">{act.description}</p>
                  <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono pt-1">
                    <span>Officer: <strong className="text-slate-200">{act.userName || 'Lead Investigator'}</strong></span>
                    {act.activityType && <span>Action: <strong className="text-cyan-400">{act.activityType}</strong></span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: INCIDENTS */}
      {activeTab === 'incidents' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Incidents Correlated with {caseNumber}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {linkedIncidents.map(inc => (
              <div key={inc.id} className="p-4 rounded-xl bg-intel-panel/50 border border-intel-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-rose-400">{inc.incidentNumber || inc.id}</span>
                  <span className="font-mono text-slate-400 text-[10px]">{inc.incidentDate}</span>
                </div>
                <div className="font-bold text-slate-200">{inc.title || inc.incidentType}</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{inc.description}</p>
                <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-intel-border">
                  Location: <span className="text-slate-200">{inc.location || 'Terminal 4'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: VEHICLES */}
      {activeTab === 'vehicles' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Car className="w-4 h-4 text-amber-400" />
            Vehicles Linked to this Investigation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {linkedVehicles.map(veh => (
              <div key={veh.id} className="p-4 rounded-xl bg-intel-panel/50 border border-intel-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-300">{veh.registrationNumber || veh.licensePlate}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                    {veh.status || 'LINKED'}
                  </span>
                </div>
                <div className="font-bold text-slate-200">{veh.make} {veh.model} ({veh.year || 2024})</div>
                <div className="text-[11px] text-slate-400">Color: {veh.color} • Type: {veh.vehicleType}</div>
                <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-intel-border">
                  Registered Owner: <span className="text-slate-200">{veh.ownerName || 'Nominee Entity'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: ORGANIZATIONS */}
      {activeTab === 'organizations' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-400" />
            Corporate & Syndicate Entities Associated
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {linkedOrgs.map(org => (
              <div key={org.id} className="p-4 rounded-xl bg-intel-panel/50 border border-intel-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-purple-300">{org.organizationId || org.id}</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono">
                    {org.type || 'CORPORATION'}
                  </span>
                </div>
                <div className="font-bold text-slate-200">{org.name}</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{org.description || 'Shell freight forwarding entity identified in transshipment manifests.'}</p>
                <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-intel-border">
                  Address: <span className="text-slate-200">{org.address || 'Port Logistics Center'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: LOCATIONS */}
      {activeTab === 'locations' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-400" />
            Geographic Locations & Waypoints
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {linkedLocations.map(loc => (
              <div key={loc.id} className="p-4 rounded-xl bg-intel-panel/50 border border-intel-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-orange-400">{loc.locationCode || loc.id}</span>
                  <span className="text-[10px] font-mono text-slate-400">{loc.city}</span>
                </div>
                <div className="font-bold text-slate-200">{loc.name}</div>
                <p className="text-slate-400 text-[11px]">{loc.address}</p>
                <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-intel-border">
                  Coordinates: {loc.latitude}, {loc.longitude}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 10: COMMUNICATIONS */}
      {activeTab === 'communications' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-teal-400" />
            Corroborated Communication Transcripts & Logs (Fictional Demo Records)
          </h3>
          <div className="divide-y divide-intel-border/60 rounded-xl border border-intel-border overflow-hidden">
            {communications.map(comm => (
              <div key={comm.id} className="p-4 bg-intel-card hover:bg-intel-panel/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-teal-400">{comm.communicationId || comm.id}</span>
                    <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px]">
                      {comm.communicationType || comm.type}
                    </span>
                    <span className="text-slate-400">Duration: {comm.duration || '4m 12s'}</span>
                  </div>
                  <div className="text-slate-200 font-medium">
                    <span className="text-cyan-300 font-mono">{comm.sourcePerson || 'Subject A'}</span> ↔ <span className="text-cyan-300 font-mono">{comm.destinationPerson || 'Subject B'}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{comm.notes || 'Encrypted dispatch exchange coordinating drop-off vehicle change.'}</p>
                </div>
                <div className="text-right text-[11px] font-mono text-slate-400 shrink-0">
                  <div>Date: {comm.date || '2026-01-14'}</div>
                  <div>Time: {comm.time || '18:42:00'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 11: INVESTIGATION NOTES (Mandatory Spec 23) */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Pin className="w-3.5 h-3.5 text-cyan-400" />
              Add Investigator Log Entry
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Note Title / Subject..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-intel-panel border border-intel-border rounded-xl text-slate-200 text-xs outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <select
                  value={newNotePriority}
                  onChange={(e) => setNewNotePriority(e.target.value)}
                  className="w-full px-3 py-2 bg-intel-panel border border-intel-border rounded-xl text-slate-200 text-xs outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="LOW">LOW PRIORITY</option>
                  <option value="MEDIUM">MEDIUM PRIORITY</option>
                  <option value="HIGH">HIGH PRIORITY</option>
                  <option value="CRITICAL">CRITICAL PRIORITY</option>
                </select>
              </div>
            </div>

            <textarea
              rows="3"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Record investigative finding, surveillance log, or cross-reference..."
              className="w-full p-3 rounded-xl bg-intel-panel border border-intel-border text-slate-100 text-xs focus:outline-none focus:border-cyan-500 leading-relaxed"
            ></textarea>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-intel-cyan text-slate-950 shadow-cyan-glow flex items-center gap-1.5 hover:bg-cyan-400 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>
            </div>
          </form>

          {/* Search Notes */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search investigation notes..."
              value={noteSearch}
              onChange={(e) => setNoteSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-intel-panel border border-intel-border rounded-xl text-xs text-slate-200 placeholder-slate-400 outline-none focus:border-cyan-500"
            />
          </div>

          {/* Notes List */}
          <div className="space-y-3">
            {filteredNotes.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl bg-intel-card border transition-colors space-y-2 text-xs ${
                  n.pinned ? 'border-cyan-500/50 bg-cyan-500/5 shadow-subtle' : 'border-intel-border'
                }`}
              >
                <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm font-sans">{n.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                      n.priority === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : n.priority === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-intel-panel text-slate-300 border-intel-border'
                    }`}>
                      {n.priority || 'MEDIUM'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{n.createdAt || 'Recent'}</span>
                    <button
                      onClick={() => handleTogglePin(n.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        n.pinned
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-intel-panel text-slate-400 border-intel-border hover:text-slate-200'
                      }`}
                      title={n.pinned ? 'Unpin Note' : 'Pin Note to Top'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(n.id)}
                      className="p-1.5 rounded-lg bg-intel-panel text-slate-400 border border-intel-border hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">{n.content}</p>
                <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-intel-border/60">
                  Recorded by: <span className="text-cyan-400 font-medium">{n.authorName || 'Lead Investigator'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 12: ACTIVITY LOG (AUDIT TRAIL) */}
      {activeTab === 'activity' && (
        <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Case Activity & Chain-of-Investigation Log
          </h3>
          <div className="divide-y divide-intel-border/60 rounded-xl border border-intel-border overflow-hidden">
            {activities.map((act) => (
              <div key={act.id} className="p-3.5 bg-intel-card hover:bg-intel-panel/40 transition-colors flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <div>
                    <span className="font-bold text-slate-200 font-sans">{act.title}</span>
                    <div className="text-[11px] text-slate-400 font-sans">{act.description}</div>
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <div className="text-cyan-300">{act.date} {act.time}</div>
                  <div>by {act.userName || 'Investigator'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 13: CASE ML INSIGHTS (Spec 33) */}
      {activeTab === 'ml-insights' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                  Case Network Topology & Modus Operandi Similarity
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Multi-dimensional graph density, community partitioning, and Cosine vector cross-investigation alignment.
              </p>
            </div>
            <button
              onClick={async () => {
                setRunningAnalysis(true);
                try {
                  const res = await aiApi.runCaseSimilarity({ target_case_id: '1' });
                  setCaseMlInsights(prev => ({ ...prev, similarity_analysis: res.data?.data || res.data }));
                  toast.success('Case similarity recalculation completed.');
                } catch (e) {
                  console.error(e);
                  toast.error('Failed to run case similarity analysis');
                } finally {
                  setRunningAnalysis(false);
                }
              }}
              disabled={runningAnalysis}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-cyan-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shrink-0 shadow-sm"
            >
              <Sparkles className={`w-3.5 h-3.5 ${runningAnalysis ? 'animate-spin' : ''}`} />
              {runningAnalysis ? 'Analyzing...' : 'Run Analysis'}
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-intel-card border border-intel-border">
              <span className="text-[11px] text-slate-400">Case Network Size</span>
              <p className="text-xl font-bold text-slate-100 mt-1">{linkedPersons.length + linkedOrgs.length} Nodes</p>
              <span className="text-[10px] text-cyan-400">Directly associated entities</span>
            </div>
            <div className="p-4 rounded-xl bg-intel-card border border-intel-border">
              <span className="text-[11px] text-slate-400">Sub-Network Density</span>
              <p className="text-xl font-bold text-cyan-400 mt-1">{caseMlInsights?.network_density || 0.048}</p>
              <span className="text-[10px] text-slate-400">Inter-entity connectivity</span>
            </div>
            <div className="p-4 rounded-xl bg-intel-card border border-intel-border">
              <span className="text-[11px] text-slate-400">Detected Communities</span>
              <p className="text-xl font-bold text-purple-400 mt-1">{caseMlInsights?.detected_communities || 2}</p>
              <span className="text-[10px] text-slate-400">Modular sub-syndicates</span>
            </div>
            <div className="p-4 rounded-xl bg-intel-card border border-intel-border">
              <span className="text-[11px] text-slate-400">Flagged Outliers</span>
              <p className="text-xl font-bold text-rose-400 mt-1">{caseMlInsights?.anomalies_flagged || 1}</p>
              <span className="text-[10px] text-rose-400/80">Requires verification</span>
            </div>
          </div>

          {/* Bridge Nodes in Case */}
          <div className="p-5 rounded-2xl bg-intel-card border border-intel-border">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Critical Bridge Nodes in Investigation
            </h4>
            <div className="flex flex-wrap gap-2">
              {(caseMlInsights?.bridge_nodes || ['DEMO-P015 (Deepak Chopra)', 'DEMO-P045 (Rahul Bose)']).map((bn, idx) => (
                <div key={idx} className="bg-intel-panel border border-intel-border/80 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
                  <span className="text-amber-400 font-bold">Bridge #{idx + 1}:</span>
                  <span className="text-slate-200 font-semibold">{bn}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cosine Similarity Cross-Case Alignment */}
          <div className="p-5 rounded-2xl bg-intel-card border border-intel-border space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              High Modus Operandi Similarity with Other Investigations
            </h4>
            <div className="space-y-2.5">
              {(caseMlInsights?.similarity_analysis?.similar_cases || [
                { case_number: 'CASE-2026-0015', title: 'Vehicle Syndicate Investigation - Sector 15', similarity_score: 98.1, shared_features: ['Matching incident classification', 'Comparable entity volume'] },
                { case_number: 'CASE-2026-0008', title: 'Cargo Smuggling Investigation - Sector 8', similarity_score: 87.4, shared_features: ['Identical priority tier', 'Similar forensic profile'] }
              ]).map((simCase, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-intel-panel border border-intel-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{simCase.title}</span>
                      <span className="text-cyan-400 font-mono text-[11px]">({simCase.case_number})</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Shared vectors: {simCase.shared_features?.join(', ')}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-500 uppercase block">Cosine Match</span>
                    <span className="text-base font-bold text-cyan-300 font-mono">{simCase.similarity_score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
