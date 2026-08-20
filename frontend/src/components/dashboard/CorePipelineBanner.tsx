import React from 'react';
import {
  FileText,
  Cpu,
  CheckSquare,
  Sparkles,
  ShieldCheck,
  Database,
  ArrowRight
} from 'lucide-react';

interface PipelineStage {
  step: string;
  name: string;
  desc: string;
  metric: string;
  status: 'active' | 'complete';
  icon: any;
  color: string;
}

export const CorePipelineBanner: React.FC = () => {
  const stages: PipelineStage[] = [
    {
      step: '01',
      name: 'INPUT',
      desc: 'Raw PDFs, datasheets & unstructured text',
      metric: 'Multi-format PDF/TXT',
      status: 'complete',
      icon: FileText,
      color: 'text-slate-400 border-slate-700 bg-slate-900/60'
    },
    {
      step: '02',
      name: 'EXTRACT',
      desc: 'Structured schema & coordinate offset mapping',
      metric: '1,284 attributes',
      status: 'complete',
      icon: Cpu,
      color: 'text-blue-400 border-blue-500/30 bg-blue-950/20'
    },
    {
      step: '03',
      name: 'VALIDATE',
      desc: 'Deterministic units + semantic contradiction checks',
      metric: '96.8% passed',
      status: 'complete',
      icon: CheckSquare,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20'
    },
    {
      step: '04',
      name: 'ENRICH',
      desc: 'Industrial application & standard mapping',
      metric: '312 enriched',
      status: 'complete',
      icon: Sparkles,
      color: 'text-purple-400 border-purple-500/30 bg-purple-950/20'
    },
    {
      step: '05',
      name: 'EXPLAIN',
      desc: 'Verbatim quotes, page citations & 5-factor confidence',
      metric: '100% evidence-linked',
      status: 'complete',
      icon: ShieldCheck,
      color: 'text-amber-400 border-amber-500/30 bg-amber-950/20'
    },
    {
      step: '06',
      name: 'COMMERCE',
      desc: 'Standardized B2B export ready in JSON & CSV',
      metric: 'Commerce-ready',
      status: 'complete',
      icon: Database,
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/20'
    }
  ];

  return (
    <div className="bg-surface rounded-2xl border border-surface-border p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              Core Intelligence Architecture
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono font-semibold">
              Live Pipeline Active
            </span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
            Extract → Validate → Enrich → Explain
          </h3>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Deterministic validation + multi-signal evidence grounding
        </p>
      </div>

      {/* 6-Stage Flow Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {stages.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={st.step}
              className={`p-3.5 rounded-xl border relative flex flex-col justify-between transition-all hover:scale-[1.02] ${st.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold opacity-60">STAGE {st.step}</span>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-extrabold tracking-wider uppercase font-mono text-white">
                  {st.name}
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug line-clamp-2">
                  {st.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-surface-border/40 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                  {st.metric}
                </span>
                {i < stages.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-400 hidden lg:block" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
