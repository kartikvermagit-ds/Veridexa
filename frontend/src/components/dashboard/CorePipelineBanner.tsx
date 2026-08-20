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
import { useTheme } from '../../context/ThemeContext';

interface PipelineStage {
  step: string;
  name: string;
  desc: string;
  metric: string;
  icon: any;
  colorDark: string;
  colorLight: string;
}

export const CorePipelineBanner: React.FC = () => {
  const { isDark } = useTheme();

  const stages: PipelineStage[] = [
    {
      step: '01',
      name: 'INPUT',
      desc: 'Raw PDFs, datasheets & unstructured spec text',
      metric: 'Multi-format PDF/TXT',
      icon: FileText,
      colorDark: 'text-slate-400 border-slate-700 bg-slate-900/60',
      colorLight: 'text-slate-700 border-slate-200 bg-slate-50'
    },
    {
      step: '02',
      name: 'EXTRACT',
      desc: 'Structured schema & coordinate offset mapping',
      metric: '1,284 attributes',
      icon: Cpu,
      colorDark: 'text-blue-400 border-blue-500/30 bg-blue-950/20',
      colorLight: 'text-blue-700 border-blue-200 bg-blue-50/60'
    },
    {
      step: '03',
      name: 'VALIDATE',
      desc: 'Deterministic units + semantic contradiction checks',
      metric: '96.8% passed',
      icon: CheckSquare,
      colorDark: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
      colorLight: 'text-emerald-700 border-emerald-200 bg-emerald-50/60'
    },
    {
      step: '04',
      name: 'ENRICH',
      desc: 'Industrial application & standard mapping',
      metric: '312 enriched',
      icon: Sparkles,
      colorDark: 'text-purple-400 border-purple-500/30 bg-purple-950/20',
      colorLight: 'text-purple-700 border-purple-200 bg-purple-50/60'
    },
    {
      step: '05',
      name: 'EXPLAIN',
      desc: 'Verbatim quotes, page citations & 5-factor confidence',
      metric: '100% evidence-linked',
      icon: ShieldCheck,
      colorDark: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
      colorLight: 'text-amber-700 border-amber-200 bg-amber-50/60'
    },
    {
      step: '06',
      name: 'COMMERCE',
      desc: 'Standardized B2B export ready in JSON & CSV',
      metric: 'Commerce-ready',
      icon: Database,
      colorDark: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/20',
      colorLight: 'text-indigo-700 border-indigo-200 bg-indigo-50/60'
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
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b ${isDark ? 'border-surface-border' : 'border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
              Core Intelligence Architecture
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 font-mono font-semibold">
              Live Pipeline Active
            </span>
          </div>
          <h3 className={`text-base font-bold tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Extract → Validate → Enrich → Explain
          </h3>
        </div>
        <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Deterministic validation + multi-signal evidence grounding
        </p>
      </div>

      {/* 6-Stage Flow Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mt-4">
        {stages.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={st.step}
              className={`p-3.5 rounded-xl border relative flex flex-col justify-between transition-all hover:scale-[1.02] ${
                isDark ? st.colorDark : st.colorLight
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold opacity-60">STAGE {st.step}</span>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className={`text-xs font-extrabold tracking-wider uppercase font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {st.name}
                </h4>
                <p className={`text-[11px] mt-1 leading-snug line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {st.desc}
                </p>
              </div>

              <div className={`mt-3 pt-2 border-t flex items-center justify-between ${isDark ? 'border-surface-border/40' : 'border-slate-200'}`}>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  isDark
                    ? 'bg-slate-900/80 text-white border-slate-700'
                    : 'bg-white text-slate-800 border-slate-300 shadow-xs'
                }`}>
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
