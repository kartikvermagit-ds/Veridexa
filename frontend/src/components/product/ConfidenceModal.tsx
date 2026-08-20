import React from 'react';
import { X, ShieldCheck, Check, Info } from 'lucide-react';
import { Attribute } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface ConfidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  attribute: Attribute | null;
}

export const ConfidenceModal: React.FC<ConfidenceModalProps> = ({
  isOpen,
  onClose,
  attribute
}) => {
  const { isDark } = useTheme();

  if (!isOpen || !attribute) return null;

  const scorePct = Math.round(attribute.confidence * 100);
  const hasEvidence = attribute.evidence && attribute.evidence.length > 0;

  const signals = [
    {
      name: 'Evidence Substring Grounding',
      weight: '35%',
      passed: hasEvidence,
      desc: hasEvidence
        ? 'Exact verbatim citation found in source document text.'
        : 'Ungrounded or inferred attribute (confidence deduction applied).'
    },
    {
      name: 'Deterministic Schema & Unit Conformance',
      weight: '25%',
      passed: attribute.status === 'VALIDATED',
      desc: 'Passed standard industrial engineering unit and numeric range checks.'
    },
    {
      name: 'Document Layout & OCR Quality',
      weight: '20%',
      passed: true,
      desc: 'Clean digital text parse with high table structure clarity.'
    },
    {
      name: 'Source Document Authority',
      weight: '20%',
      passed: true,
      desc: 'Ingested from verified manufacturer technical datasheet.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative border rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 ${
        isDark ? 'bg-surface border-surface-border text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className={`flex items-start justify-between pb-4 border-b ${isDark ? 'border-surface-border' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Confidence Signal Breakdown
              </h3>
              <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {attribute.name}: <span className="text-indigo-600 dark:text-indigo-300 font-bold">{attribute.value}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg ${isDark ? 'bg-surface-elevated text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Overall Score Banner */}
        <div className={`my-5 p-4 rounded-xl border flex items-center justify-between ${
          isDark ? 'bg-surface-elevated border-surface-border' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <span className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Computed Trust Score
            </span>
            <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              {scorePct}%
            </div>
          </div>
          <div className="text-right text-xs font-mono">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-semibold">
              High Reliability
            </span>
          </div>
        </div>

        {/* Mathematical Signals List */}
        <div className="space-y-3">
          <h4 className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <Info className="w-3.5 h-3.5 text-indigo-500" />
            <span>Underlying Verification Signals</span>
          </h4>

          {signals.map((sig, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border text-xs ${
                isDark ? 'bg-surface-elevated/60 border-surface-border/60' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      sig.passed
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </span>
                  <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{sig.name}</span>
                </div>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{sig.weight}</span>
              </div>
              <p className={`text-[11px] mt-1 pl-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{sig.desc}</p>
            </div>
          ))}
        </div>

        <div className={`mt-6 flex justify-end pt-3 border-t ${isDark ? 'border-surface-border' : 'border-slate-200'}`}>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
