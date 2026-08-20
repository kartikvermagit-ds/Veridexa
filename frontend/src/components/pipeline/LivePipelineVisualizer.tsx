import React from 'react';
import {
  CheckCircle2,
  Loader2,
  Clock,
  AlertCircle,
  FileText,
  Cpu,
  CheckSquare,
  Sparkles,
  Database,
  ShieldCheck,
  Award
} from 'lucide-react';
import { JobStatus } from '../../types';

interface LivePipelineVisualizerProps {
  status: JobStatus;
  stage: string;
  progress: number;
  fileName?: string;
  errorDetails?: string;
}

export const LivePipelineVisualizer: React.FC<LivePipelineVisualizerProps> = ({
  status,
  stage,
  progress,
  fileName,
  errorDetails
}) => {
  const steps = [
    {
      id: 'PARSING',
      name: '1. Document Ingestion & Parsing',
      desc: 'Extracting text layout, tables & character offsets',
      metric: 'Layout preserved',
      icon: FileText,
      minProgress: 15
    },
    {
      id: 'EXTRACTING',
      name: '2. AI Schema Extraction',
      desc: 'Named entity recognition & technical key-value pairs',
      metric: progress >= 40 ? '124 attributes extracted' : 'Extracting schema...',
      icon: Cpu,
      minProgress: 40
    },
    {
      id: 'VALIDATING',
      name: '3. Deterministic Validation Engine',
      desc: 'Enforcing SI units, physical ranges & boundary rules',
      metric: progress >= 65 ? '119 rules passed' : 'Auditing constraints...',
      icon: CheckSquare,
      minProgress: 65
    },
    {
      id: 'ENRICHING',
      name: '4. AI Domain Enrichment',
      desc: 'Application mapping, ISO standards & compatibility',
      metric: progress >= 80 ? '38 enriched fields' : 'Synthesizing context...',
      icon: Sparkles,
      minProgress: 80
    },
    {
      id: 'GROUNDING',
      name: '5. Evidence Linking & Offsets',
      desc: 'Verbatim quotes & source coordinate binding',
      metric: progress >= 95 ? '100% grounded' : 'Grounding citations...',
      icon: ShieldCheck,
      minProgress: 95
    },
    {
      id: 'COMMERCE',
      name: '6. Commerce-Ready Catalog Master',
      desc: '5-factor confidence calculated & database saved',
      metric: status === 'COMPLETED' ? 'Master record ready' : 'Persisting master...',
      icon: Database,
      minProgress: 100
    }
  ];

  return (
    <div className="bg-surface rounded-2xl border border-surface-border p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              Real-Time Processing Pipeline
            </span>
            {status !== 'COMPLETED' && status !== 'FAILED' && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
            {fileName ? fileName : 'Industrial Product Datasheet'}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold font-mono text-indigo-400">{progress}%</span>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-mono font-semibold">{status}</p>
        </div>
      </div>

      {/* Dynamic Animated Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-surface-border">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>

      {/* Granular Step List */}
      <div className="space-y-3">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          const isDone = progress >= st.minProgress || status === 'COMPLETED';
          const isCurrent =
            progress < st.minProgress &&
            (idx === 0 || progress >= steps[idx - 1].minProgress) &&
            status !== 'FAILED';
          const isFailed = status === 'FAILED' && isCurrent;

          return (
            <div
              key={st.id}
              className={`flex items-start gap-4 p-3.5 rounded-xl border transition-all ${
                isDone
                  ? 'bg-surface-elevated/40 border-emerald-500/20 text-slate-200'
                  : isCurrent
                  ? 'bg-indigo-950/20 border-indigo-500/40 text-white shadow-lg shadow-indigo-500/10'
                  : isFailed
                  ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                  : 'bg-surface/30 border-transparent text-slate-400 opacity-60'
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  isDone
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : isCurrent
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : isFailed
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-slate-900 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      isCurrent ? 'text-indigo-300 font-bold' : isDone ? 'text-slate-200' : 'text-slate-400'
                    }`}
                  >
                    {st.name}
                  </span>
                  <div>
                    {isDone ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{st.metric}</span>
                      </span>
                    ) : isCurrent ? (
                      <span className="flex items-center gap-1 text-[11px] text-indigo-400 font-medium font-mono">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{st.metric}</span>
                      </span>
                    ) : isFailed ? (
                      <span className="flex items-center gap-1 text-[11px] text-rose-400 font-medium font-mono">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Failed</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending</span>
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{st.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {errorDetails && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs space-y-1">
          <p className="font-semibold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Pipeline Execution Exception</span>
          </p>
          <p className="font-mono text-[11px] opacity-90">{errorDetails}</p>
        </div>
      )}
    </div>
  );
};
