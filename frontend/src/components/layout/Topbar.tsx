import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileSpreadsheet, Download, ChevronDown, Check, X, Menu } from 'lucide-react';
import { dashboardApi } from '../../api/dashboard';
import { ThemeToggle } from './ThemeToggle';
import { SoundToggle } from './SoundToggle';
import { VeridexaLogo } from '../brand/VeridexaLogo';
import { useTheme } from '../../context/ThemeContext';

interface TopbarProps {
  onOpenMobileMenu?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showDemoDropdown, setShowDemoDropdown] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState('Standard Catalog (3 Products)');
  const searchRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const recentSearches = ['SS316', 'M10', 'Ball Valve', 'Pressure Rating', 'DIN 933'];

  const quickCategories = [
    { label: 'Fasteners', query: 'category=Industrial Fasteners' },
    { label: 'Valves', query: 'category=Process Valves' },
    { label: 'Pumps', query: 'category=Fluid Handling' },
    { label: 'Sensors', query: 'category=Sensors & Instrumentation' }
  ];

  const demoDatasets = [
    { id: '1', name: 'Standard Catalog (3 Products)', desc: 'Fastener, Valve (with conflict), Slurry Pump' },
    { id: '2', name: 'High-Tensile Fasteners Suite', desc: 'DIN 933 / ISO 4017 stainless bolt catalog' },
    { id: '3', name: 'Process Valves & Actuators', desc: 'Quarter-turn valves with multi-source conflicts' }
  ];

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (demoRef.current && !demoRef.current.contains(e.target as Node)) {
        setShowDemoDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      setIsMobileSearchOpen(false);
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectRecent = (term: string) => {
    setSearchQuery(term);
    setShowSearchDropdown(false);
    setIsMobileSearchOpen(false);
    navigate(`/catalog?search=${encodeURIComponent(term)}`);
  };

  return (
    <header
      className={`h-16 backdrop-blur border-b px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200 ${
        isDark
          ? 'bg-surface/80 border-surface-border'
          : 'bg-white/80 border-slate-200 shadow-xs'
      }`}
    >
      {/* Left: Mobile Hamburger & Logo on mobile */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={onOpenMobileMenu}
          className={`p-2 rounded-xl border transition-all ${
            isDark ? 'bg-surface-elevated text-slate-300 hover:text-white border-surface-border' : 'bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200'
          }`}
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="sm:hidden">
          <VeridexaLogo variant="icon" size="sm" />
        </div>
      </div>

      {/* Global Auto-suggesting Search Bar (Desktop + Mobile overlay) */}
      <div className={`relative w-full max-w-md ${isMobileSearchOpen ? 'flex' : 'hidden md:block'}`} ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setShowSearchDropdown(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKUs, specs, materials..."
            className={`w-full rounded-xl pl-10 pr-8 py-2 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans border ${
              isDark
                ? 'bg-surface-elevated border-surface-border text-slate-100'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Live Search Suggestions Dropdown */}
        {showSearchDropdown && (
          <div
            className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
              isDark ? 'bg-surface border-surface-border text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-lg'
            }`}
          >
            {/* Recent Searches */}
            <div className="mb-3">
              <span className={`text-[10px] uppercase tracking-wider font-mono font-bold block mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Recent Searches
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectRecent(term)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-all ${
                      isDark
                        ? 'bg-surface-elevated hover:bg-slate-700 border-surface-border text-slate-300'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Filter Categories */}
            <div className="pt-2 border-t border-surface-border/40">
              <span className={`text-[10px] uppercase tracking-wider font-mono font-bold block mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Search By Category
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {quickCategories.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setShowSearchDropdown(false);
                      navigate(`/catalog?${c.query}`);
                    }}
                    className={`text-left p-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                      isDark
                        ? 'hover:bg-surface-elevated text-slate-300'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{c.label}</span>
                    <span className="text-[10px] text-indigo-500">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

        {/* Action Utilities, Demo Mode Picker & Theme Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setIsMobileSearchOpen((prev) => !prev)}
          className={`p-2 rounded-xl border md:hidden transition-all ${
            isDark ? 'bg-surface-elevated text-slate-300 border-surface-border' : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}
          aria-label="Toggle search bar"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Demo Mode Trigger */}
        <div className="relative" ref={demoRef}>
          <button
            onClick={() => setShowDemoDropdown((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all ${
              isDark
                ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/40'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
            }`}
            title="Switch demo dataset preset"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">DEMO DATASET</span>
            <span className="sm:hidden text-[10px]">DEMO</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showDemoDropdown && (
            <div
              className={`absolute right-0 top-full mt-2 w-72 rounded-2xl border p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
                isDark ? 'bg-surface border-surface-border text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
              }`}
            >
              <div className={`px-2 py-1 text-[10px] font-bold font-mono uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Active Demo Environment
              </div>
              <div className="space-y-1 mt-1">
                {demoDatasets.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setSelectedDemo(d.name);
                      setShowDemoDropdown(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start justify-between ${
                      selectedDemo === d.name
                        ? isDark ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30' : 'bg-indigo-50 text-indigo-800 font-bold border border-indigo-200'
                        : isDark ? 'hover:bg-surface-elevated text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{d.name}</div>
                      <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{d.desc}</div>
                    </div>
                    {selectedDemo === d.name && <Check className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* B2B Export Buttons (hidden on narrow phone screens to avoid crowding) */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => dashboardApi.exportCatalog('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isDark
                ? 'border-surface-border bg-surface-elevated text-slate-300 hover:text-white hover:bg-slate-700'
                : 'border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-xs'
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
                : 'border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-xs'
            }`}
            title="Download full catalog in CSV format"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>CSV</span>
          </button>
        </div>

        {/* Sound Effects Toggle */}
        <SoundToggle />

        {/* Theme Switcher Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
};
