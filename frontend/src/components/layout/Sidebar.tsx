import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  Layers,
  CheckSquare,
  Settings as SettingsIcon,
  ShieldCheck
} from 'lucide-react';
import { VeridexaLogo } from '../brand/VeridexaLogo';
import { useTheme } from '../../context/ThemeContext';

export const Sidebar: React.FC = () => {
  const { isDark } = useTheme();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/process', label: 'Process Product', icon: UploadCloud, badge: 'P0 Core' },
    { to: '/catalog', label: 'Product Catalog', icon: Layers },
    { to: '/validation', label: 'Validation Center', icon: CheckSquare, badge: 'Audit' },
    { to: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside
      className={`w-64 border-r flex flex-col shrink-0 h-screen sticky top-0 transition-colors duration-200 ${
        isDark
          ? 'bg-surface border-surface-border'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      {/* Brand Header with Veridexa Logo */}
      <div className={`p-5 border-b ${isDark ? 'border-surface-border' : 'border-slate-200'}`}>
        <VeridexaLogo variant="full" size="md" />
      </div>

      {/* Primary Navigation */}
      <div className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Core Pipeline
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-surface-elevated'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
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
          );
        })}
      </div>

      {/* System Status Footer */}
      <div className={`p-4 border-t ${isDark ? 'border-surface-border bg-surface/50' : 'border-slate-200 bg-slate-50'}`}>
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
      </div>
    </aside>
  );
};
