import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

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
  const iconColors = {
    brand: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    indigo: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
  }[accentColor];

  return (
    <div className="bg-surface rounded-xl border border-surface-border p-5 hover:border-slate-600 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-white">{value}</span>
            {badge}
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs mt-2 flex items-center gap-1 font-medium ${trendPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span>{trendPositive ? '↑' : '↓'}</span>
              <span>{trend}</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg border ${iconColors}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
