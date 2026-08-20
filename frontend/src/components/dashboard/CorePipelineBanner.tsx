import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Cpu,
  CheckSquare,
  Sparkles,
  ShieldCheck,
  Database,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface PipelineStage {
  step: string;
  name: string;
  desc: string;
  metric: string;
  actionText: string;
  to: string;
  icon: any;
  colorDark: string;
  colorLight: string;
}

export const CorePipelineBanner: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const stages: PipelineStage[] = [
    {
      step: '01',
      name: 'INPUT',
      desc: 'Raw PDFs, datasheets & unstructured text',
      metric: 'Multi-format PDF/TXT',
      actionText: 'Process Source',
      to: '/process',
      icon: FileText,
      colorDark: 'text-slate-300 border-slate-700 bg-slate-900/60 hover:border-slate-500',
      colorLight: 'text-slate-800 border-slate-200 bg-slate-50 hover:border-slate-400'
    },
    {
      step: '02',
      name: 'EXTRACT',
      desc: 'Structured schema & coordinate offset mapping',
      metric: '1,284 attributes',
      actionText: 'View Extracted',
      to: '/catalog',
      icon: Cpu,
      colorDark: 'text-blue-400 border-blue-500/30 bg-blue-950/20 hover:border-blue-500/60',
      colorLight: 'text-blue-700 border-blue-200 bg-blue-50/60 hover:border-blue-300'
    },
    {
      step: '03',
      name: 'VALIDATE',
      desc: 'Deterministic units + semantic contradiction checks',
      metric: '96.8% passed',
      actionText: 'View Validation',
      to: '/validation',
      icon: CheckSquare,
      colorDark: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-500/60',
      colorLight: 'text-emerald-700 border-emerald-200 bg-emerald-50/60 hover:border-emerald-300'
    },
    {
      step: '04',
      name: 'ENRICH',
      desc: 'Industrial application & standard mapping',
      metric: '312 enriched',
      actionText: 'View Enrichment',
      to: '/catalog',
      icon: Sparkles,
      colorDark: 'text-purple-400 border-purple-500/30 bg-purple-950/20 hover:border-purple-500/60',
      colorLight: 'text-purple-700 border-purple-200 bg-purple-50/60 hover:border-purple-300'
    },
    {
      step: '05',
      name: 'EXPLAIN',
      desc: 'Verbatim quotes, page citations & 5-factor confidence',
      metric: '100% evidence-linked',
      actionText: 'View Evidence',
      to: '/catalog/mock-1',
      icon: ShieldCheck,
      colorDark: 'text-amber-400 border-amber-500/30 bg-amber-950/20 hover:border-amber-500/60',
      colorLight: 'text-amber-700 border-amber-200 bg-amber-50/60 hover:border-amber-300'
    },
    {
      step: '06',
      name: 'COMMERCE',
      desc: 'Standardized B2B export ready in JSON & CSV',
      metric: 'Commerce-ready',
      actionText: 'View Catalog',
      to: '/catalog',
      icon: Database,
      colorDark: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/20 hover:border-indigo-500/60',
      colorLight: 'text-indigo-700 border-indigo-200 bg-indigo-50/60 hover:border-indigo-300'
    }
  ];

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-200 ${
        isDark
          ? 'bg-surface border-surface-border shadow-xl'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b ${isDark ? 'border-surface-border' : 'border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
              Core Intelligence Architecture
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 font-mono font-semibold">
              Live Interactive Pipeline
            </span>
          </div>
          <h3 className={`text-base font-bold tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Extract → Validate → Enrich → Explain → Commerce
          </h3>
        </div>
        <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Click any stage to inspect real-time artifacts
        </p>
      </div>

      {/* 6-Stage Interactive Clickable Flow Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mt-3.5">
        {stages.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={st.step}
              onClick={() => navigate(st.to)}
              className={`p-3 rounded-xl border relative flex flex-col justify-between transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.99] group ${
                isDark ? st.colorDark : st.colorLight
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold opacity-60">STAGE {st.step}</span>
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
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
                <span className="text-[10px] font-semibold text-indigo-500 dark:text-indigo-300 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
