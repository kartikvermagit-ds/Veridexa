import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, FileCheck, CheckCircle2, Award, Info, X } from 'lucide-react';

interface TrustExplainabilitySectionProps {
  confidence?: number;
  completeness?: number;
}

export const TrustExplainabilitySection: React.FC<TrustExplainabilitySectionProps> = ({
  confidence = 0.96,
  completeness = 0.94
}) => {
  const [showExplainerModal, setShowExplainerModal] = useState(false);

  const trustMetrics = [
    {
      title: 'Average Confidence',
      value: `${Math.round(confidence * 100)}%`,
      subtitle: 'Multi-signal mathematical trust index',
      status: 'High Trust',
      icon: ShieldCheck,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20'
    },
    {
      title: 'Evidence Coverage',
      value: '98.2%',
      subtitle: 'Attributes backed by exact document quotes',
      status: 'Verifiable',
      icon: FileCheck,
      color: 'text-blue-400 border-blue-500/30 bg-blue-950/20'
    },
    {
      title: 'Validation Pass Rate',
      value: '96.8%',
      subtitle: 'Conforming to SI units & physical ranges',
      status: 'Enforced',
      icon: CheckCircle2,
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/20'
    },
    {
      title: 'Source Grounding',
      value: '98.4%',
      subtitle: 'Zero ungrounded hallucinations allowed',
      status: 'Deterministic',
      icon: Award,
      color: 'text-purple-400 border-purple-500/30 bg-purple-950/20'
    }
  ];

  return (
    <div className="bg-surface rounded-2xl border border-surface-border p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Verification & Explainability
            </span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
            Trust & Evidence Grounding Engine
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Every product attribute is traceable to source coordinates, page numbers, and validation logs
          </p>
        </div>

        <button
          onClick={() => setShowExplainerModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-slate-700 text-slate-300 hover:text-white border border-surface-border text-xs font-medium transition-all shrink-0"
        >
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>How is confidence calculated?</span>
        </button>
      </div>

      {/* Trust Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trustMetrics.map((tm, i) => {
          const Icon = tm.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${tm.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    {tm.title}
                  </span>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-2xl font-extrabold font-mono text-white mt-1">
                  {tm.value}
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  {tm.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-surface-border/30">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900/80 text-emerald-300 border border-emerald-500/20">
                  {tm.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mathematical Confidence Formula Explainer Modal */}
      {showExplainerModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowExplainerModal(false)} />

          <div className="relative bg-surface border border-surface-border rounded-2xl max-w-xl w-full p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Veridexa Confidence Formula</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Deterministic multi-signal weighting model (0.00 – 1.00)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExplainerModal(false)}
                className="p-1.5 rounded-lg bg-surface-elevated text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formula Block */}
            <div className="p-4 rounded-xl bg-industrial-950 border border-surface-border font-mono text-xs text-indigo-300 space-y-1.5">
              <div className="text-slate-400 text-[11px] uppercase font-bold">Mathematical Formulation:</div>
              <div className="text-sm font-bold text-white bg-slate-900 p-2.5 rounded border border-slate-800">
                Confidence = (0.35 × S_evidence) + (0.25 × S_validation) + (0.20 × S_quality) + (0.20 × S_source) − P_inferred
              </div>
            </div>

            {/* Signal Weights Explanation */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-surface-elevated border border-surface-border flex items-start gap-3">
                <span className="font-mono font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                  35%
                </span>
                <div>
                  <span className="font-bold text-white">Evidence Substring Grounding (S_evidence)</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    1.0 if verbatim quote verified with exact character offset in source text; 0.4 if ungrounded.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-elevated border border-surface-border flex items-start gap-3">
                <span className="font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                  25%
                </span>
                <div>
                  <span className="font-bold text-white">Deterministic Rule Conformance (S_validation)</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    1.0 if unit conforms to SI standards (bar, PSI, mm, °C, V) and satisfies physical range constraints.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-elevated border border-surface-border flex items-start gap-3">
                <span className="font-mono font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 shrink-0">
                  20%
                </span>
                <div>
                  <span className="font-bold text-white">Document Layout & Table Clarity (S_quality)</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Evaluates PDF table parsing confidence and structural OCR sharpness.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-elevated border border-surface-border flex items-start gap-3">
                <span className="font-mono font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 shrink-0">
                  20%
                </span>
                <div>
                  <span className="font-bold text-white">Source Document Authority (S_source)</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    1.0 for original manufacturer engineering datasheet; 0.8 for distributor catalog.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-elevated border border-surface-border flex items-start gap-3">
                <span className="font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 shrink-0">
                  -15%
                </span>
                <div>
                  <span className="font-bold text-white">Inference Penalty (P_inferred)</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Applied if an attribute is synthesized or derived from domain models rather than directly extracted.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-surface-border">
              <button
                onClick={() => setShowExplainerModal(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
