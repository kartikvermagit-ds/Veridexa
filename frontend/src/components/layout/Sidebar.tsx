import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  Layers,
  CheckSquare,
  Settings as SettingsIcon,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { VeridexaLogo } from '../brand/VeridexaLogo';
import { useTheme } from '../../context/ThemeContext';

const SIDEBAR_COLLAPSED_KEY = 'veridexa_sidebar_collapsed';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/process', label: 'Process', fullLabel: 'Process Product', icon: UploadCloud, badge: 'P0 Core' },
  { to: '/catalog', label: 'Catalog', fullLabel: 'Product Catalog', icon: Layers },
  { to: '/validation', label: 'Validation', fullLabel: 'Validation Center', icon: CheckSquare, badge: 'Audit' },
  { to: '/settings', label: 'Settings', fullLabel: 'Settings', icon: SettingsIcon },
];

export const Sidebar: React.FC = () => {
  const { isDark } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return saved === 'true';
  });

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isCollapsed));
  }, [isCollapsed]);

  return (
    <aside
      className={`hidden md:flex border-r flex-col shrink-0 h-screen sticky top-0 transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${
        isDark
          ? 'bg-surface border-surface-border'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      {/* Brand Header with Veridexa Logo & Collapse Toggle */}
      <div className={`p-4 border-b flex items-center justify-between relative ${isDark ? 'border-surface-border' : 'border-slate-200'}`}>
        <div className="flex items-center overflow-hidden">
          {isCollapsed ? (
            <div className="mx-auto" title="VERIDEXA — AI-Powered Product Intelligence">
              <VeridexaLogo variant="icon" size="sm" />
            </div>
          ) : (
            <VeridexaLogo variant="full" size="md" />
          )}
        </div>

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className={`p-1.5 rounded-lg border transition-all ${
            isDark
              ? 'bg-surface-elevated hover:bg-slate-700 text-slate-400 hover:text-white border-surface-border'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-200 shadow-xs'
          } ${isCollapsed ? 'hidden' : 'block'}`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse to icon rail'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse to icon rail'}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Collapsed expand trigger on top when collapsed */}
      {isCollapsed && (
        <div className="px-3 pt-3 flex justify-center">
          <button
            onClick={() => setIsCollapsed(false)}
            className={`p-2 rounded-xl border transition-all ${
              isDark
                ? 'bg-surface-elevated hover:bg-slate-700 text-slate-400 hover:text-white border-surface-border'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-200'
            }`}
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary Navigation */}
      <div className="p-3 space-y-1.5 flex-1 overflow-y-auto overflow-x-hidden">
        {!isCollapsed && (
          <div className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Core Pipeline
          </div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.to}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.to)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center rounded-xl text-xs font-semibold transition-all ${
                    isCollapsed
                      ? 'justify-center p-3'
                      : 'justify-between px-3 py-2.5'
                  } ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-surface-elevated'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <Icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span>{item.fullLabel}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isDark
                        ? 'bg-slate-800 text-slate-300 border border-slate-700'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>

              {/* Floating Tooltip in Collapsed Rail Mode */}
              {isCollapsed && hoveredItem === item.to && (
                <div
                  className={`fixed left-20 ml-2 z-50 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white shadow-black/60'
                      : 'bg-slate-900 text-white border-slate-800 shadow-slate-400/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{item.fullLabel}</span>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* System Status Footer */}
      <div className={`p-3 border-t ${isDark ? 'border-surface-border bg-surface/50' : 'border-slate-200 bg-slate-50'}`}>
        {isCollapsed ? (
          <div className="flex justify-center" title="Intelligence Engine: Extract • Validate • Enrich • Explain">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        ) : (
          <div className={`rounded-xl border p-3 ${isDark ? 'bg-surface-elevated border-surface-border' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                  Intelligence Engine
                </span>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <p className={`text-[11px] mt-1.5 leading-relaxed font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Extract • Validate • Enrich • Explain
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 left-0 max-w-xs w-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300 ${
          isDark ? 'bg-surface border-r border-surface-border text-slate-100' : 'bg-white border-r border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-surface-border' : 'border-slate-200'}`}>
          <VeridexaLogo variant="full" size="md" />
          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-all ${
              isDark ? 'bg-surface-elevated text-slate-400 hover:text-white border-surface-border' : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'
            }`}
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="p-4 space-y-2 flex-1 overflow-y-auto">
          <div className={`px-2 text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : isDark
                      ? 'text-slate-300 hover:bg-surface-elevated'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.fullLabel}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      isDark
                        ? 'bg-slate-800 text-slate-300 border border-slate-700'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${isDark ? 'border-surface-border bg-surface/50' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              Veridexa Engine Active
            </span>
          </div>
          <p className={`text-[11px] mt-1 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Dual Deterministic & Semantic Validation
          </p>
        </div>
      </div>
    </div>
  );
};

export const MobileBottomNav: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-lg px-2 py-1.5 transition-all duration-200 ${
        isDark
          ? 'bg-surface/90 border-surface-border text-slate-300'
          : 'bg-white/90 border-slate-200 text-slate-600 shadow-lg shadow-slate-900/10'
      }`}
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 gap-1 items-center justify-items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2 rounded-xl w-full text-center transition-all ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110 bg-indigo-500/10' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] tracking-tight font-medium mt-0.5 truncate max-w-[56px]">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
