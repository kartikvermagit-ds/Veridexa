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
  ChevronRight
} from 'lucide-react';
import { VeridexaLogo } from '../brand/VeridexaLogo';
import { useTheme } from '../../context/ThemeContext';

const SIDEBAR_COLLAPSED_KEY = 'veridexa_sidebar_collapsed';

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

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/process', label: 'Process Product', icon: UploadCloud, badge: 'P0 Core' },
    { to: '/catalog', label: 'Product Catalog', icon: Layers },
    { to: '/validation', label: 'Validation Center', icon: CheckSquare, badge: 'Audit' },
    { to: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside
      className={`border-r flex flex-col shrink-0 h-screen sticky top-0 transition-all duration-300 z-40 ${
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
                  {!isCollapsed && <span>{item.label}</span>}
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
                    <span>{item.label}</span>
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
