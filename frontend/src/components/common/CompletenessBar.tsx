import React from 'react';

interface CompletenessBarProps {
  completeness: number; // 0.0 - 1.0 or 0 - 100
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const CompletenessBar: React.FC<CompletenessBarProps> = ({
  completeness,
  showLabel = true,
  size = 'md'
}) => {
  const percentage = completeness > 1 ? Math.round(completeness) : Math.round(completeness * 100);

  let barColor = 'bg-emerald-500';
  if (percentage < 60) {
    barColor = 'bg-rose-500';
  } else if (percentage < 85) {
    barColor = 'bg-amber-500';
  }

  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs mb-1.5 text-slate-600 dark:text-slate-400 font-medium">
          <span>Completeness</span>
          <span className="font-mono text-slate-900 dark:text-slate-100 font-bold">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${heightClass} rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  );
};
