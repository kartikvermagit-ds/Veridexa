import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { ValidationStatus } from '../../types';

interface ValidationBadgeProps {
  status: ValidationStatus;
  size?: 'sm' | 'md';
}

export const ValidationBadge: React.FC<ValidationBadgeProps> = ({ status, size = 'md' }) => {
  const config = {
    VALIDATED: {
      label: 'Validated',
      icon: CheckCircle2,
      style: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
    },
    CONFLICT: {
      label: 'Conflict Detected',
      icon: AlertTriangle,
      style: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30 font-semibold'
    },
    ANOMALY: {
      label: 'Issue / Anomaly',
      icon: AlertCircle,
      style: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
    },
    PENDING: {
      label: 'Pending Audit',
      icon: Clock,
      style: 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30'
    }
  }[status] || {
    label: status,
    icon: Clock,
    style: 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30'
  };

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium ${sizeClasses} ${config.style}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};
