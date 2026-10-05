import React from 'react';
import { ShieldCheck, Scale, AlertCircle } from 'lucide-react';

export default function EthicsNoticeBanner({ compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-intel-card/90 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 shadow-sm backdrop-blur-md">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
        <span className="font-medium tracking-wide">
          AI-generated analytical indicators are decision-support information only. They are not proof of criminal activity and require human verification.
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3.5 p-4 bg-gradient-to-r from-intel-card/95 via-intel-panel/60 to-intel-card/95 border-l-4 border-l-cyan-400 border-y border-r border-intel-border/80 rounded-2xl text-xs text-slate-200 shadow-glass-panel mb-5 backdrop-blur-xl">
      <div className="p-2 bg-cyan-500/15 rounded-xl border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5 shadow-sm">
        <Scale className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 font-display font-bold text-cyan-300 uppercase tracking-wider text-[11px] mb-1">
          <span>Decision Support Framework Notice</span>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-[9px] font-mono lowercase text-cyan-200 border border-cyan-500/30">
            synthetic-data only
          </span>
        </div>
        <p className="text-slate-300 leading-relaxed font-sans text-xs">
          "AI-generated analytical indicators are decision-support information only. They are not proof of criminal activity and require human verification."
        </p>
      </div>
    </div>
  );
}
