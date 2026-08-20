import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Activity, FileSpreadsheet, Download } from 'lucide-react';
import { dashboardApi } from '../../api/dashboard';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../../context/ThemeContext';

export const Topbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      className={`h-16 backdrop-blur border-b px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200 ${
        isDark
          ? 'bg-surface/80 border-surface-border'
          : 'bg-white/80 border-slate-200 shadow-sm'
      }`}
    >
      {/* Conceptual Search Bar */}
      <form onSubmit={handleSearch} className="relative w-full max-w-md">
        <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products, SKUs, materials, specifications..."
          className={`w-full rounded-xl pl-10 pr-4 py-2 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans border ${
            isDark
              ? 'bg-surface-elevated border-surface-border text-slate-100'
              : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
          }`}
        />
      </form>

      {/* Action Utilities, Theme Switcher & Telemetry */}
      <div className="flex items-center gap-3">
        {/* Telemetry pill */}
        <div
          className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-mono ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-300'
              : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span>Latency: 12ms</span>
        </div>

        {/* B2B Export Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => dashboardApi.exportCatalog('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isDark
                ? 'border-surface-border bg-surface-elevated text-slate-300 hover:text-white hover:bg-slate-700'
                : 'border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-sm'
            }`}
            title="Download full catalog in JSON format"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
          <button
            onClick={() => dashboardApi.exportCatalog('csv')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isDark
                ? 'border-surface-border bg-surface-elevated text-slate-300 hover:text-white hover:bg-slate-700'
                : 'border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-sm'
            }`}
            title="Download full catalog in CSV format"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>CSV</span>
          </button>
        </div>

        {/* Theme Switcher Toggle */}
        <ThemeToggle />

        {/* Hackathon Badge */}
        <div className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-300 text-xs font-mono font-semibold">
          UniHack 2026
        </div>
      </div>
    </header>
  );
};
