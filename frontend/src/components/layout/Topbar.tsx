import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Activity, FileSpreadsheet, Download, Sparkles } from 'lucide-react';
import { dashboardApi } from '../../api/dashboard';

export const Topbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-surface/80 backdrop-blur border-b border-surface-border px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Conceptual Search Bar */}
      <form onSubmit={handleSearch} className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products, SKUs, materials, specifications..."
          className="w-full bg-surface-elevated border border-surface-border rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
        />
      </form>

      {/* Action Utilities & Telemetry */}
      <div className="flex items-center gap-3">
        {/* Telemetry pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Latency: 12ms</span>
        </div>

        {/* B2B Export Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => dashboardApi.exportCatalog('json')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border bg-surface-elevated text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-medium transition-all"
            title="Download full catalog in JSON format"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
          <button
            onClick={() => dashboardApi.exportCatalog('csv')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border bg-surface-elevated text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-medium transition-all"
            title="Download full catalog in CSV format"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </button>
        </div>

        {/* Hackathon Badge */}
        <div className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold">
          UniHack 2026
        </div>
      </div>
    </header>
  );
};
