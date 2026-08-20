import React from 'react';
import { Activity, ShieldCheck, Cpu, CheckCircle2, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const SystemStatusBar: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded-xl border px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono transition-colors duration-200 ${
        isDark
          ? 'bg-surface/80 border-surface-border text-slate-300'
          : 'bg-white border-slate-200 text-slate-700 shadow-xs'
      }`}
    >
      {/* Engine Status Indicator */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className={`font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          ENGINE STATUS:
        </span>
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
          Online & Grounded
        </span>
      </div>

      {/* Telemetry Metrics */}
      <div className="flex flex-wrap items-center gap-4 text-[11px]">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-indigo-500" />
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>API Latency:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">12ms</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-blue-500" />
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Pipeline:</span>
          <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Operational (v1.0)</span>
        </div>

        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Validation:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">96.8% Passed</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Last Sync:</span>
          <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>2 min ago</span>
        </div>
      </div>
    </div>
  );
};
