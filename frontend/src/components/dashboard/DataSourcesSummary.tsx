import React from 'react';
import { Database, FileText, Globe, Layers, BookOpen } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const DataSourcesSummary: React.FC = () => {
  const { isDark } = useTheme();

  const sources = [
    { name: 'PDF Technical Datasheets', count: 42, icon: FileText, color: 'text-indigo-500' },
    { name: 'Manufacturer Engineering Docs', count: 18, icon: BookOpen, color: 'text-blue-500' },
    { name: 'Distributor Online Catalogs', count: 27, icon: Globe, color: 'text-purple-500' },
    { name: 'Standard Spec Sheets (ISO/DIN)', count: 63, icon: Layers, color: 'text-emerald-500' }
  ];

  const total = sources.reduce((acc, s) => acc + s.count, 0);

  return (
    <div
      className={`rounded-2xl border p-5 space-y-4 transition-all duration-200 ${
        isDark
          ? 'bg-surface border-surface-border shadow-xl'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-surface-border' : 'border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
              Ingestion Inventory
            </span>
          </div>
          <h2 className={`text-base font-bold tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Ingested Data Sources ({total})
          </h2>
        </div>
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
          <Database className="w-4 h-4" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {sources.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                isDark ? 'bg-surface-elevated/50 border-surface-border' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 truncate max-w-[190px]">
                <Icon className={`w-3.5 h-3.5 ${s.color} shrink-0`} />
                <span className={`truncate font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{s.name}</span>
              </div>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {s.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
