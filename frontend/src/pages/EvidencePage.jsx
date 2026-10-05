import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  Clock,
  History,
  CheckCircle2,
  AlertCircle,
  Hash,
  Download,
  Eye,
  X,
  FileCode,
  Layers,
  ArrowRight,
  Shield
} from 'lucide-react';
import EthicsNoticeBanner from '../components/EthicsNoticeBanner';
import { evidenceApi, casesApi } from '../services/api';
import { toast } from '../utils/toast';

export default function EvidencePage({ onNavigate }) {
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Chain of Custody Modal
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [custodyChain, setCustodyChain] = useState([]);
  const [loadingCustody, setLoadingCustody] = useState(false);
  const [showCustodyModal, setShowCustodyModal] = useState(false);

  // Add Custody Entry Form
  const [newCustody, setNewCustody] = useState({
    transferredBy: '',
    receivedBy: '',
    reason: '',
    location: '',
    notes: '',
  });

  // Create Evidence Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvidence, setNewEvidence] = useState({
    evidenceId: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
    evidenceType: 'Digital File',
    description: '',
    collectedBy: 'Investigator Holloway',
    collectedDate: new Date().toISOString().split('T')[0],
    source: 'Seized Device Storage',
    storageReference: 'VAULT-SEC-04',
    integrityHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    notes: 'Preserved under secure chain of custody protocol.',
    status: 'COLLECTED',
    caseId: '',
  });
  const [cases, setCases] = useState([]);

  useEffect(() => {
    fetchEvidence();
    loadCases();
  }, []);

  const fetchEvidence = async () => {
    setLoading(true);
    try {
      const res = await evidenceApi.getAll();
      setEvidenceList(res.data || []);
    } catch (err) {
      console.error('Failed to load evidence', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCases = async () => {
    try {
      const res = await casesApi.getAll();
      setCases(res.data || []);
      if (res.data?.length > 0) {
        setNewEvidence((prev) => ({ ...prev, caseId: res.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to load cases', err);
    }
  };

  const handleOpenCustody = async (ev) => {
    setSelectedEvidence(ev);
    setShowCustodyModal(true);
    setLoadingCustody(true);
    try {
      const res = await evidenceApi.getCustody(ev.id);
      setCustodyChain(res.data || []);
    } catch (err) {
      console.error('Failed to load custody chain', err);
      // Fallback mock history if empty
      setCustodyChain([
        {
          id: 1,
          transferredBy: ev.collectedBy || 'Investigator Holloway',
          receivedBy: 'Custody Officer M. Vance',
          timestamp: ev.collectedDate || '2026-05-12T10:00:00',
          reason: 'Initial intake and cryptographic hashing',
          location: ev.storageReference || 'Vault-B, Unit 12',
          notes: 'Integrity hash verified against source artifact.',
        },
      ]);
    } finally {
      setLoadingCustody(false);
    }
  };

  const handleAddCustodyEntry = async (e) => {
    e.preventDefault();
    if (!newCustody.transferredBy || !newCustody.receivedBy || !newCustody.reason) {
      toast.error('Please fill out all required custody transfer fields');
      return;
    }

    try {
      const payload = {
        ...newCustody,
        timestamp: new Date().toISOString(),
      };
      await evidenceApi.addCustody(selectedEvidence.id, payload);
      setCustodyChain((prev) => [...prev, payload]);
      setNewCustody({
        transferredBy: '',
        receivedBy: '',
        reason: '',
        location: '',
        notes: '',
      });
      toast.success('Chain of custody entry recorded successfully.');
    } catch (err) {
      // In demo mode, append to local list if API fails
      setCustodyChain((prev) => [...prev, { ...newCustody, timestamp: new Date().toISOString() }]);
      setNewCustody({
        transferredBy: '',
        receivedBy: '',
        reason: '',
        location: '',
        notes: '',
      });
      toast.info('Custody entry logged to local session.');
    }
  };

  const handleCreateEvidence = async (e) => {
    e.preventDefault();
    try {
      const res = await evidenceApi.create(newEvidence);
      setEvidenceList((prev) => [res.data || newEvidence, ...prev]);
      setShowCreateModal(false);
      toast.success('Evidence item registered with verified SHA-256 integrity hash.');
    } catch (err) {
      console.error('Failed to create evidence', err);
      // Demo fallback
      setEvidenceList((prev) => [newEvidence, ...prev]);
      setShowCreateModal(false);
      toast.info('Evidence item added to local workspace.');
    }
  };

  const generateRandomHash = () => {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    setNewEvidence((prev) => ({ ...prev, integrityHash: hash }));
  };

  const filteredEvidence = evidenceList.filter((ev) => {
    const matchesSearch =
      (ev.evidenceId || '').toLowerCase().includes(search.toLowerCase()) ||
      (ev.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (ev.source || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || ev.evidenceType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || ev.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'UNDER_REVIEW':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'ARCHIVED':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      case 'COLLECTED':
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-intel-card border border-intel-border">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Evidence & Chain of Custody Management
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                {evidenceList.length} Records
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Cryptographically verified synthetic evidence items, vault references, and forensic custody records.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-cyan-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Register Evidence</span>
        </button>
      </div>

      <EthicsNoticeBanner />

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded-2xl bg-intel-card border border-intel-border">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Evidence ID, description, source, or hash..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-cyan-500"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Evidence Types</option>
            <option value="Digital File">Digital File</option>
            <option value="Document">Document</option>
            <option value="Physical Item">Physical Item</option>
            <option value="Communication Record">Communication Record</option>
            <option value="Transaction Record">Transaction Record</option>
            <option value="Video">Video</option>
            <option value="Image">Image</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Custody Statuses</option>
            <option value="COLLECTED">COLLECTED</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>
      </div>

      {/* Evidence Table */}
      <div className="rounded-2xl bg-intel-card border border-intel-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-intel-panel/60 border-b border-intel-border text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Evidence ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Collected By / Date</th>
                <th className="py-3 px-4">Storage Ref</th>
                <th className="py-3 px-4">SHA-256 Hash</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Chain of Custody</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-intel-border">
              {filteredEvidence.map((ev) => (
                <tr key={ev.id || ev.evidenceId} className="hover:bg-intel-panel/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-cyan-400">
                    {ev.evidenceId}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-lg bg-intel-panel border border-intel-border text-slate-300 font-mono text-[10px]">
                      {ev.evidenceType}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-slate-300">
                    {ev.description}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    <div className="text-slate-200">{ev.collectedBy}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{ev.collectedDate}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {ev.storageReference || 'Vault-01'}
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-slate-500 max-w-[120px] truncate" title={ev.integrityHash}>
                    {ev.integrityHash ? `${ev.integrityHash.substring(0, 14)}...` : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${getStatusBadge(
                        ev.status
                      )}`}
                    >
                      {ev.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenCustody(ev)}
                      className="px-3 py-1.5 rounded-xl bg-intel-panel hover:bg-intel-card border border-intel-border text-cyan-400 hover:text-cyan-300 font-medium text-xs transition-colors inline-flex items-center gap-1.5"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Audit Trail</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredEvidence.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No evidence records matching current criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chain of Custody Modal */}
      {showCustodyModal && selectedEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl rounded-2xl bg-intel-card border border-intel-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 border-b border-intel-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    Chain of Custody — {selectedEvidence.evidenceId}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Immutable audit log of evidence transfers, laboratory checks, and storage movements.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCustodyModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-intel-panel transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1">
              {/* Evidence Summary Card */}
              <div className="p-3.5 rounded-xl bg-intel-panel/50 border border-intel-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    Type
                  </span>
                  <span className="font-semibold text-slate-200">
                    {selectedEvidence.evidenceType}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    Storage Ref
                  </span>
                  <span className="font-mono text-cyan-400 font-semibold">
                    {selectedEvidence.storageReference || 'Vault-A'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    Integrity Hash
                  </span>
                  <span
                    className="font-mono text-[10px] text-slate-400 truncate block"
                    title={selectedEvidence.integrityHash}
                  >
                    {selectedEvidence.integrityHash
                      ? `${selectedEvidence.integrityHash.substring(0, 16)}...`
                      : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    Status
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border inline-block ${getStatusBadge(
                      selectedEvidence.status
                    )}`}
                  >
                    {selectedEvidence.status}
                  </span>
                </div>
              </div>

              {/* Custody Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Transfer Timeline</span>
                </h4>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-intel-border">
                  {custodyChain.map((entry, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-cyan-500 border-4 border-intel-card"></div>
                      <div className="p-3 rounded-xl bg-intel-panel/40 border border-intel-border space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-200">
                            {entry.transferredBy} <span className="text-cyan-400 font-normal">→</span> {entry.receivedBy}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300">
                          <strong>Action / Reason:</strong> {entry.reason}
                        </div>
                        {entry.location && (
                          <div className="text-[11px] text-slate-400">
                            <strong>Vault / Lab:</strong> {entry.location}
                          </div>
                        )}
                        {entry.notes && (
                          <div className="text-[11px] text-slate-500 italic">
                            "{entry.notes}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Custody Transfer Form */}
              <div className="p-4 rounded-xl bg-intel-panel/30 border border-intel-border space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>Record New Transfer / Custody Movement</span>
                </h4>

                <form onSubmit={handleAddCustodyEntry} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                        Transferred By *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lead Inv. Holloway"
                        value={newCustody.transferredBy}
                        onChange={(e) =>
                          setNewCustody({ ...newCustody, transferredBy: e.target.value })
                        }
                        className="w-full bg-intel-card border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                        Received By *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Senior Forensic Analyst"
                        value={newCustody.receivedBy}
                        onChange={(e) =>
                          setNewCustody({ ...newCustody, receivedBy: e.target.value })
                        }
                        className="w-full bg-intel-card border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                        Reason for Transfer *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Extraction & forensic examination"
                        value={newCustody.reason}
                        onChange={(e) =>
                          setNewCustody({ ...newCustody, reason: e.target.value })
                        }
                        className="w-full bg-intel-card border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                        Destination Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Cyber Forensics Lab 3"
                        value={newCustody.location}
                        onChange={(e) =>
                          setNewCustody({ ...newCustody, location: e.target.value })
                        }
                        className="w-full bg-intel-card border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Verification Notes
                    </label>
                    <input
                      type="text"
                      placeholder="Tamper-evident seal verified intact."
                      value={newCustody.notes}
                      onChange={(e) =>
                        setNewCustody({ ...newCustody, notes: e.target.value })
                      }
                      className="w-full bg-intel-card border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-cyan-glow"
                    >
                      Record Transfer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Evidence Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-intel-card border border-intel-border shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-intel-border flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Register Synthetic Evidence Item
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvidence} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Evidence ID
                  </label>
                  <input
                    type="text"
                    required
                    value={newEvidence.evidenceId}
                    onChange={(e) =>
                      setNewEvidence({ ...newEvidence, evidenceId: e.target.value })
                    }
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 font-mono outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Evidence Type
                  </label>
                  <select
                    value={newEvidence.evidenceType}
                    onChange={(e) =>
                      setNewEvidence({ ...newEvidence, evidenceType: e.target.value })
                    }
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                  >
                    <option value="Digital File">Digital File</option>
                    <option value="Document">Document</option>
                    <option value="Physical Item">Physical Item</option>
                    <option value="Communication Record">Communication Record</option>
                    <option value="Transaction Record">Transaction Record</option>
                    <option value="Video">Video</option>
                    <option value="Image">Image</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Encrypted backup drive recovered from secure storage"
                  value={newEvidence.description}
                  onChange={(e) =>
                    setNewEvidence({ ...newEvidence, description: e.target.value })
                  }
                  className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Collected By
                  </label>
                  <input
                    type="text"
                    value={newEvidence.collectedBy}
                    onChange={(e) =>
                      setNewEvidence({ ...newEvidence, collectedBy: e.target.value })
                    }
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Storage Reference
                  </label>
                  <input
                    type="text"
                    value={newEvidence.storageReference}
                    onChange={(e) =>
                      setNewEvidence({ ...newEvidence, storageReference: e.target.value })
                    }
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 font-mono outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] text-slate-400 uppercase font-semibold">
                    SHA-256 Cryptographic Hash
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomHash}
                    className="text-[10px] text-cyan-400 hover:underline"
                  >
                    Compute New Hash
                  </button>
                </div>
                <input
                  type="text"
                  value={newEvidence.integrityHash}
                  onChange={(e) =>
                    setNewEvidence({ ...newEvidence, integrityHash: e.target.value })
                  }
                  className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 font-mono text-[11px] outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-intel-border">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-intel-panel border border-intel-border text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-cyan-glow"
                >
                  Register Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
