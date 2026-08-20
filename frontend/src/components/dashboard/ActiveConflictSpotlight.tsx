import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, FileText, Globe, Wrench, ShieldAlert } from 'lucide-react';

interface ActiveConflictSpotlightProps {
  onOpenConflictModal?: () => void;
}

export const ActiveConflictSpotlight: React.FC<ActiveConflictSpotlightProps> = ({
  onOpenConflictModal
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-rose-950/20 via-surface to-surface rounded-2xl border border-rose-500/30 p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                Multi-Source Conflict Spotlight
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold animate-pulse">
                Needs Review
              </span>
            </div>
            <h4 className="text-sm font-bold text-white tracking-tight mt-0.5">
              2-Piece Stainless Steel Ball Valve (SKU: VLV-BV2-SS316-PN40)
            </h4>
          </div>
        </div>

        <button
          onClick={() => navigate('/validation')}
          className="text-xs text-rose-300 hover:text-rose-200 font-semibold flex items-center gap-1 shrink-0"
        >
          <span>All Conflicts (3)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed font-sans">
        Contradictory values detected across ingested technical sources for attribute <span className="font-mono font-bold text-rose-400">pressure_rating</span>. Veridexa explicitly flags discrepancies rather than making an arbitrary automated assumption.
      </p>

      {/* Side-by-side discrepancy preview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Source A */}
        <div className="p-3.5 rounded-xl bg-surface-elevated border border-surface-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-semibold text-indigo-300 flex items-center gap-1.5 truncate max-w-[220px]">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Swagelok_60_Series_Datasheet.pdf</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              Page 2
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Manufacturer Datasheet:</span>
            <span className="text-base font-bold font-mono text-emerald-400">40 bar (PN40)</span>
          </div>
        </div>

        {/* Source B */}
        <div className="p-3.5 rounded-xl bg-surface-elevated border border-surface-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-semibold text-indigo-300 flex items-center gap-1.5 truncate max-w-[220px]">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Distributor Catalog Spec (URL)</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              Online Listing
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Distributor Listing:</span>
            <span className="text-base font-bold font-mono text-amber-400">63 bar</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>Requires engineer sign-off before downstream ERP export</span>
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/catalog/mock-2')}
            className="px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-slate-700 text-slate-300 text-xs font-medium border border-surface-border"
          >
            Inspect Product
          </button>
          <button
            onClick={() => {
              if (onOpenConflictModal) {
                onOpenConflictModal();
              } else {
                navigate('/validation');
              }
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Reconcile Conflict</span>
          </button>
        </div>
      </div>
    </div>
  );
};
