import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Archive,
  ExternalLink,
  Eye,
  RefreshCw,
  Search,
  AlertTriangle,
  Info,
  Calendar,
  MapPin,
  Check,
  X
} from 'lucide-react';
import { externalReviewApi } from '../services/api';
import toast from '../utils/toast';

export default function ExternalReviewPage({ onNavigate }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const data = await externalReviewApi.getPending();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching review records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await externalReviewApi.approve(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      if (selectedRecord?.id === id) setSelectedRecord(null);
      toast.success('Record approved and ingested into intelligence database.');
    } catch (err) {
      toast.error('Failed to approve record');
    }
  };

  const handleReject = async (id) => {
    try {
      await externalReviewApi.reject(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      if (selectedRecord?.id === id) setSelectedRecord(null);
      toast.info('Record rejected and archived.');
    } catch (err) {
      toast.error('Failed to reject record');
    }
  };

  const filtered = records.filter(
    (r) =>
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sourceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.state?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-intel-card border border-intel-border shadow-intel-card backdrop-blur-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                External Information Review
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  HUMAN-IN-THE-LOOP
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-sans">
                Review and approve public incoming feeds before promotion to verified intelligence datasets
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchPending}
          className="p-2 self-start md:self-auto rounded-xl text-slate-400 hover:text-slate-200 bg-intel-panel border border-intel-border hover:border-intel-border/80 transition-all"
          title="Refresh Review Queue"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Mandatory Ethics Callout (Section 23, 25) */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex gap-3 text-xs leading-relaxed">
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
        <div>
          <strong className="text-white block font-sans text-sm mb-0.5">
            Ethical Guardrail & Civil Liberties Protection:
          </strong>
          Records involving real individuals must <strong>NOT</strong> automatically become suspects, criminals, or persons of interest. Web scraping only feeds macro crime trends, location statistics, and safety alerts. Synthetic network identities remain separate for AIML demonstration.
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-intel-card border border-intel-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search review queue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-intel-panel border border-intel-border text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
        <div className="text-xs font-mono text-slate-400">
          Pending Verification: <span className="text-amber-400 font-bold">{records.length}</span>
        </div>
      </div>

      {/* Table of Records */}
      <div className="rounded-xl bg-intel-card border border-intel-border overflow-hidden shadow-intel-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-intel-panel border-b border-intel-border text-slate-400 font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4">Record & Headline</th>
                <th className="py-3 px-3">Source & Attribution</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Human Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-intel-border/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500 font-mono text-xs">
                    {loading ? 'Scanning review queue...' : 'No records currently requiring human review.'}
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-intel-panel/30 transition-colors group">
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-200 group-hover:text-amber-300 transition-colors truncate">
                        {r.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                        ID: {r.externalId}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="text-slate-300 font-medium">{r.sourceName}</div>
                      <span className="text-[9px] font-mono text-slate-500">{r.reliabilityLevel}</span>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-400 text-[10px]">
                      {r.eventDate || 'Recent'}
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                        {r.category}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-300 text-[11px]">
                      {r.state || 'National'} {r.district ? `(${r.district})` : ''}
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        REQUIRES_REVIEW
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedRecord(r)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-intel-panel transition-all"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {r.sourceUrl && (
                          <a
                            href={r.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-intel-panel transition-all"
                            title="View Original Source"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          onClick={() => handleApprove(r.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center gap-1"
                          title="Approve for Dataset"
                        >
                          <Check className="w-3 h-3" />
                          Approve
                        </button>

                        <button
                          onClick={() => handleReject(r.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all flex items-center gap-1"
                          title="Reject and Archive"
                        >
                          <Archive className="w-3 h-3" />
                          Archive
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record View Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-intel-card border border-intel-border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-intel-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Review Record Payload</h3>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-white">
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-mono text-[10px] uppercase">Title</span>
                <p className="text-slate-100 font-semibold text-sm mt-0.5">{selectedRecord.title}</p>
              </div>

              <div>
                <span className="text-slate-400 font-mono text-[10px] uppercase">Description</span>
                <p className="text-slate-300 leading-relaxed mt-0.5 font-sans bg-intel-panel p-2.5 rounded-lg border border-intel-border">
                  {selectedRecord.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-2 rounded-lg bg-intel-panel border border-intel-border">
                  <div className="text-[10px] text-slate-500">Source</div>
                  <div className="text-slate-200 text-[11px] mt-0.5">{selectedRecord.sourceName}</div>
                </div>
                <div className="p-2 rounded-lg bg-intel-panel border border-intel-border">
                  <div className="text-[10px] text-slate-500">Reliability</div>
                  <div className="text-amber-400 text-[11px] mt-0.5">{selectedRecord.reliabilityLevel}</div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-intel-panel border border-intel-border font-mono">
                <div className="text-[10px] text-slate-500">Source URL</div>
                <a
                  href={selectedRecord.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline break-all text-[11px] block mt-0.5"
                >
                  {selectedRecord.sourceUrl}
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-intel-border flex justify-end gap-2">
              <button
                onClick={() => handleReject(selectedRecord.id)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30"
              >
                Reject & Archive
              </button>
              <button
                onClick={() => handleApprove(selectedRecord.id)}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md"
              >
                Approve for Public Dataset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
