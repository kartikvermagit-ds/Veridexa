import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = 'h-4 w-full' }) => {
  return (
    <div className={`animate-pulse bg-slate-800/60 rounded ${className}`} />
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-4 gap-4 p-4 border-b border-surface-border bg-surface/50">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`th-${i}`} className="h-4 w-24" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={`tr-${r}`} className="grid grid-cols-4 gap-4 p-4 border-b border-surface-border/50">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={`td-${r}-${c}`} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
};
