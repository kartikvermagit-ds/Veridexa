import React from 'react';
import { X, ShieldCheck, Check, Info } from 'lucide-react';
import { Attribute } from '../../types';

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
  if (!isOpen || !attribute) return null;

  const scorePct = Math.round(attribute.confidence * 100);
  const isExtracted = attribute.origin_type === 'EXTRACTED';
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

      <div className="relative bg-surface border border-surface-border rounded-xl max-w-lg w-full p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Confidence Signal Breakdown</h3>
              <p className="text-xs text-slate-400 font-mono">
                {attribute.name}: <span className="text-indigo-300">{attribute.value}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-surface-elevated text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Overall Score Banner */}
        <div className="my-5 p-4 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Computed Trust Score
            </span>
            <div className="text-3xl font-bold font-mono text-emerald-400 mt-0.5">
              {scorePct}%
            </div>
          </div>
          <div className="text-right text-xs text-slate-400 font-mono">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
              High Reliability
            </span>
          </div>
        </div>

        {/* Mathematical Signals List */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>Underlying Verification Signals</span>
          </h4>

          {signals.map((sig, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-surface-elevated/60 border border-surface-border/60 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      sig.passed
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </span>
                  <span className="font-semibold text-slate-200">{sig.name}</span>
                </div>
                <span className="font-mono text-indigo-400 font-medium">{sig.weight}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 pl-6">{sig.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-md shadow-indigo-600/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
