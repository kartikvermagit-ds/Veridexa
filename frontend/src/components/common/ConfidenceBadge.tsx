import React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

interface ConfidenceBadgeProps {
  confidence: number; // 0.0 - 1.0 or 0 - 100
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  onClick?: () => void;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  size = 'md',
  showIcon = true,
  onClick
}) => {
  const normalized = confidence > 1 ? confidence : Math.round(confidence * 100);

  let colorStyles = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
  let Icon = ShieldCheck;
  let label = 'High Confidence';

  if (normalized < 70) {
    colorStyles = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
    Icon = ShieldAlert;
    label = 'Low Confidence';
  } else if (normalized < 88) {
    colorStyles = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
    Icon = Shield;
    label = 'Medium Confidence';
  }

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-medium',
    lg: 'px-3.5 py-1.5 text-sm gap-2 font-semibold'
  }[size];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`inline-flex items-center rounded-full border transition-all ${colorStyles} ${sizeStyles} ${
        onClick ? 'hover:scale-105 cursor-pointer hover:border-opacity-80 shadow-sm' : 'cursor-default'
      }`}
      title={`${label} (${normalized}%) — Click to inspect signals`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span className="font-mono font-bold">{normalized}%</span>
      {size === 'lg' && <span className="text-xs opacity-80 font-sans">confidence</span>}
    </button>
  );
};
