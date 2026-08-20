import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  badge?: ReactNode;
  accentColor?: 'brand' | 'emerald' | 'amber' | 'rose' | 'indigo';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  badge,
  accentColor = 'brand'
}) => {
  const { isDark } = useTheme();

  const iconColors = {
    brand: isDark
      ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
      : 'text-indigo-600 bg-indigo-50 border-indigo-200',
    emerald: isDark
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      : 'text-emerald-600 bg-emerald-50 border-emerald-200',
    amber: isDark
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      : 'text-amber-600 bg-amber-50 border-amber-200',
    rose: isDark
      ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
      : 'text-rose-600 bg-rose-50 border-rose-200',
    indigo: isDark
      ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      : 'text-blue-600 bg-blue-50 border-blue-200'
  }[accentColor];

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-200 ${
        isDark
          ? 'bg-surface border-surface-border hover:border-slate-600'
          : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs uppercase tracking-wider font-semibold font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-mono tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {value}
            </span>
            {badge}
          </div>
          {subtitle && (
            <p className={`text-xs mt-1 font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {subtitle}
            </p>
          )}
          {trend && (
            <p className={`text-xs mt-2 flex items-center gap-1 font-medium ${trendPositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
              <span>{trendPositive ? '↑' : '↓'}</span>
              <span>{trend}</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl border ${iconColors}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
