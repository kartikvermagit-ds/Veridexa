import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, FileText, Globe, Wrench, ShieldAlert } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ActiveConflictSpotlightProps {
  productId?: string;
  productName?: string;
  sku?: string;
  conflictsCount?: number;
  onOpenConflictModal?: () => void;
}

export const ActiveConflictSpotlight: React.FC<ActiveConflictSpotlightProps> = ({
  productId,
  productName = '2-Piece Stainless Steel Ball Valve',
  sku = 'VLV-BV2-SS316-PN40',
  conflictsCount = 1,
  onOpenConflictModal
}) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded-2xl border p-6 space-y-4 transition-all duration-200 ${
        isDark
          ? 'bg-gradient-to-br from-rose-950/20 via-surface to-surface border-rose-500/30 shadow-xl'
          : 'bg-gradient-to-br from-rose-50 via-white to-white border-rose-200 shadow-sm'
      }`}
    >
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${isDark ? 'border-surface-border' : 'border-slate-200'}`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-rose-100 border-rose-200 text-rose-600'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                Multi-Source Conflict Spotlight
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 font-mono font-bold">
                Needs Review
              </span>
            </div>
            <h4 className={`text-sm font-bold tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {productName} (SKU: {sku})
            </h4>
          </div>
        </div>

        <button
          onClick={() => navigate('/validation')}
          className="text-xs text-rose-600 dark:text-rose-300 hover:underline font-semibold flex items-center gap-1 shrink-0"
        >
          <span>All Conflicts ({conflictsCount})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
        Contradictory values detected across ingested technical sources for attribute <span className="font-mono font-bold text-rose-600 dark:text-rose-400">pressure_rating</span>. Veridexa explicitly flags discrepancies rather than making an arbitrary automated assumption.
      </p>

      {/* Side-by-side discrepancy preview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Source A */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          isDark ? 'bg-surface-elevated border-surface-border' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-300 flex items-center gap-1.5 truncate max-w-[220px]">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>Swagelok_60_Series_Datasheet.pdf</span>
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              Page 2
            </span>
          </div>
          <div className="mt-2.5">
            <span className={`text-[10px] uppercase font-mono block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manufacturer Datasheet:</span>
            <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">40 bar (PN40)</span>
          </div>
        </div>

        {/* Source B */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          isDark ? 'bg-surface-elevated border-surface-border' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-300 flex items-center gap-1.5 truncate max-w-[220px]">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>Distributor Catalog Spec (URL)</span>
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              Online Listing
            </span>
          </div>
          <div className="mt-2.5">
            <span className={`text-[10px] uppercase font-mono block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Distributor Listing:</span>
            <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">63 bar</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className={`text-[11px] font-mono flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          <span>Requires engineer sign-off before downstream ERP export</span>
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(productId ? `/catalog/${productId}` : '/validation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isDark
                ? 'bg-surface-elevated hover:bg-slate-700 text-slate-300 border-surface-border'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
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
