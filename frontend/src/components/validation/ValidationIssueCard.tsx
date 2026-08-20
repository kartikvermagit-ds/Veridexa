import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, ExternalLink, Wrench } from 'lucide-react';
import { ValidationResult } from '../../types';

interface ValidationIssueCardProps {
  issue: ValidationResult;
  productName?: string;
  sku?: string;
  productId?: string;
  onResolve?: () => void;
  onViewProduct?: () => void;
}

export const ValidationIssueCard: React.FC<ValidationIssueCardProps> = ({
  issue,
  productName,
  sku,
  productId,
  onResolve,
  onViewProduct
}) => {
  const isConflict = issue.status === 'CONFLICT';
  const isFail = issue.status === 'FAIL';

  return (
    <div
      className={`rounded-xl border p-5 transition-all ${
        isConflict
          ? 'bg-surface border-rose-500/30 hover:border-rose-500/60 shadow-lg shadow-rose-500/5'
          : isFail
          ? 'bg-surface border-amber-500/30 hover:border-amber-500/60'
          : 'bg-surface border-surface-border'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-lg ${
              isConflict
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            {isConflict ? <AlertTriangle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded border ${
                  isConflict
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                }`}
              >
                {issue.status}
              </span>
              <span className="text-xs font-semibold text-slate-300 font-mono">{issue.rule_name}</span>
            </div>
            {(productName || sku) && (
              <p className="text-xs text-slate-400 mt-1">
                Product: <span className="text-white font-medium">{productName || 'Industrial Product'}</span>{' '}
                {sku && <span className="font-mono text-indigo-400">({sku})</span>}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onViewProduct && (
            <button
              onClick={onViewProduct}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-surface-border transition-all"
            >
              <span>View Product</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
          {isConflict && onResolve && (
            <button
              onClick={onResolve}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Resolve</span>
            </button>
          )}
        </div>
      </div>

      {/* Message and Conflict Snippets */}
      <div className="mt-4 p-3 bg-industrial-950/60 rounded-lg border border-surface-border/60 text-xs text-slate-200 leading-relaxed font-sans">
        {issue.message}
      </div>

      {issue.conflicting_data && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          {issue.conflicting_data.source_a && (
            <div className="p-2.5 rounded bg-surface-elevated/40 border border-surface-border">
              <span className="text-[10px] text-indigo-300 font-semibold block mb-0.5">
                {issue.conflicting_data.source_a.name}
              </span>
              <span className="text-emerald-400 font-bold">
                Value: {issue.conflicting_data.source_a.value}
              </span>
            </div>
          )}
          {issue.conflicting_data.source_b && (
            <div className="p-2.5 rounded bg-surface-elevated/40 border border-surface-border">
              <span className="text-[10px] text-indigo-300 font-semibold block mb-0.5">
                {issue.conflicting_data.source_b.name}
              </span>
              <span className="text-amber-400 font-bold">
                Value: {issue.conflicting_data.source_b.value}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
