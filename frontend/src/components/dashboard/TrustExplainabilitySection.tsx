import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, FileCheck, CheckCircle2, Award, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface TrustExplainabilitySectionProps {
  confidence?: number;
  completeness?: number;
}

export const TrustExplainabilitySection: React.FC<TrustExplainabilitySectionProps> = ({
  confidence = 0.96
}) => {
  const { isDark } = useTheme();
  const [showExplainerModal, setShowExplainerModal] = useState(false);

  const trustMetrics = [
    {
      title: 'Average Confidence',
      value: `${Math.round(confidence * 100)}%`,
      subtitle: 'Multi-signal mathematical trust index',
      status: 'High Trust',
      icon: ShieldCheck,
      colorDark: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
      colorLight: 'text-emerald-700 border-emerald-200 bg-emerald-50/60'
    },
    {
      title: 'Evidence Coverage',
      value: '98.2%',
      subtitle: 'Attributes backed by exact document quotes',
      status: 'Verifiable',
      icon: FileCheck,
      colorDark: 'text-blue-400 border-blue-500/30 bg-blue-950/20',
      colorLight: 'text-blue-700 border-blue-200 bg-blue-50/60'
    },
    {
      title: 'Validation Pass Rate',
      value: '96.8%',
      subtitle: 'Conforming to SI units & physical ranges',
      status: 'Enforced',
      icon: CheckCircle2,
      colorDark: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/20',
      colorLight: 'text-indigo-700 border-indigo-200 bg-indigo-50/60'
    },
    {
      title: 'Source Grounding',
      value: '98.4%',
      subtitle: 'Zero ungrounded hallucinations allowed',
      status: 'Deterministic',
      icon: Award,
      colorDark: 'text-purple-400 border-purple-500/30 bg-purple-950/20',
      colorLight: 'text-purple-700 border-purple-200 bg-purple-50/60'
    }
  ];

  return (
    <div
      className={`rounded-2xl border p-6 transition-all duration-200 ${
        isDark
          ? 'bg-surface border-surface-border shadow-xl'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${isDark ? 'border-surface-border' : 'border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Verification & Explainability
            </span>
          </div>
          <h2 className={`text-base font-bold tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Zero-Hallucination & Mathematical Trust Framework
          </h2>
          <p className={`text-xs mt-0.5 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Every product attribute is traceable to source coordinates, page numbers, and validation logs
          </p>
        </div>

        <button
          onClick={() => setShowExplainerModal(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shrink-0 ${
            isDark
              ? 'bg-surface-elevated hover:bg-slate-700 text-slate-300 hover:text-white border-surface-border'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200 shadow-xs'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-indigo-500" />
          <span>How is confidence calculated?</span>
        </button>
      </div>

      {/* Trust Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {trustMetrics.map((tm, i) => {
          const Icon = tm.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                isDark ? tm.colorDark : tm.colorLight
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {tm.title}
                  </span>
                  <Icon className="w-4 h-4" />
                </div>
                <div className={`text-2xl font-extrabold font-mono mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {tm.value}
                </div>
                <p className={`text-[11px] mt-1 leading-snug ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {tm.subtitle}
                </p>
              </div>

              <div className={`mt-3 pt-2 border-t ${isDark ? 'border-surface-border/30' : 'border-slate-200/60'}`}>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  isDark
                    ? 'bg-slate-900/80 text-emerald-300 border-emerald-500/20'
                    : 'bg-white text-emerald-700 border-emerald-300 shadow-xs'
                }`}>
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
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowExplainerModal(false)} />

          <div className={`relative rounded-2xl border max-w-xl w-full p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-5 ${
            isDark ? 'bg-surface border-surface-border text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex items-start justify-between pb-3 border-b ${isDark ? 'border-surface-border' : 'border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Veridexa Confidence Formula
                  </h3>
                  <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Deterministic multi-signal weighting model (0.00 – 1.00)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExplainerModal(false)}
                className={`p-1.5 rounded-lg ${isDark ? 'bg-surface-elevated text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formula Block */}
            <div className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 ${
              isDark ? 'bg-industrial-950 border-surface-border text-indigo-300' : 'bg-slate-900 border-slate-800 text-indigo-300'
            }`}>
              <div className="text-slate-400 text-[11px] uppercase font-bold">Mathematical Formulation:</div>
              <div className="text-sm font-bold text-white bg-slate-950/80 p-2.5 rounded border border-slate-800 leading-relaxed">
                Confidence = (0.35 × S_evidence) + (0.25 × S_validation) + (0.20 × S_quality) + (0.20 × S_source) − P_inferred
              </div>
            </div>

            {/* Signal Weights Explanation */}
            <div className="space-y-2.5 text-xs">
              <div className={`p-3 rounded-xl border flex items-start gap-3 ${isDark ? 'bg-surface-elevated border-surface-border' : 'bg-slate-50 border-slate-200'}`}>
                <span className="font-mono font-bold text-indigo-500 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                  35%
                </span>
                <div>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Evidence Substring Grounding (S_evidence)</span>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    1.0 if verbatim quote verified with exact character offset in source text; 0.4 if ungrounded.
                  </p>
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex items-start gap-3 ${isDark ? 'bg-surface-elevated border-surface-border' : 'bg-slate-50 border-slate-200'}`}>
                <span className="font-mono font-bold text-emerald-500 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                  25%
                </span>
                <div>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Deterministic Rule Conformance (S_validation)</span>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    1.0 if unit conforms to SI standards (bar, PSI, mm, °C, V) and satisfies physical range constraints.
                  </p>
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex items-start gap-3 ${isDark ? 'bg-surface-elevated border-surface-border' : 'bg-slate-50 border-slate-200'}`}>
                <span className="font-mono font-bold text-blue-500 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 shrink-0">
                  20%
                </span>
                <div>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Document Layout & Table Clarity (S_quality)</span>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Evaluates PDF table parsing confidence and structural OCR sharpness.
                  </p>
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex items-start gap-3 ${isDark ? 'bg-surface-elevated border-surface-border' : 'bg-slate-50 border-slate-200'}`}>
                <span className="font-mono font-bold text-purple-500 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 shrink-0">
                  20%
                </span>
                <div>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Source Document Authority (S_source)</span>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    1.0 for original manufacturer engineering datasheet; 0.8 for distributor catalog.
                  </p>
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex items-start gap-3 ${isDark ? 'bg-surface-elevated border-surface-border' : 'bg-slate-50 border-slate-200'}`}>
                <span className="font-mono font-bold text-amber-500 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 shrink-0">
                  -15%
                </span>
                <div>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Inference Penalty (P_inferred)</span>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Applied if an attribute is synthesized or derived from domain models rather than directly extracted.
                  </p>
                </div>
              </div>
            </div>

            <div className={`flex justify-end pt-3 border-t ${isDark ? 'border-surface-border' : 'border-slate-200'}`}>
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
