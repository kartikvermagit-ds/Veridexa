import React from 'react';
import { FileSearch, Sparkles, Cpu, Calculator, AlertTriangle } from 'lucide-react';
import { Attribute } from '../../types';
import { ConfidenceBadge } from '../common/ConfidenceBadge';

interface AttributeCardProps {
  attribute: Attribute;
  onInspectEvidence?: (attribute: Attribute) => void;
  onInspectConfidence?: (attribute: Attribute) => void;
}

export const AttributeCard: React.FC<AttributeCardProps> = ({
  attribute,
  onInspectEvidence,
  onInspectConfidence
}) => {
  const isConflict = attribute.status === 'CONFLICT';
  const hasEvidence = attribute.evidence && attribute.evidence.length > 0;

  const originConfig = {
    EXTRACTED: {
      label: 'Extracted',
      icon: Cpu,
      style: 'bg-blue-500/10 text-blue-300 border-blue-500/30'
    },
    ENRICHED: {
      label: 'AI Enriched',
      icon: Sparkles,
      style: 'bg-purple-500/10 text-purple-300 border-purple-500/30'
    },
    INFERRED: {
      label: 'Inferred',
      icon: Calculator,
      style: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
    }
  }[attribute.origin_type];

  const OriginIcon = originConfig.icon;

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-200 ${
        isConflict
          ? 'bg-rose-950/10 border-rose-500/40 hover:border-rose-500/60 shadow-lg shadow-rose-500/5'
          : 'bg-surface hover:bg-surface-elevated/80 border-surface-border hover:border-slate-600'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            {attribute.name.replace(/_/g, ' ')}
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-base font-bold text-white font-mono tracking-tight break-words">
              {attribute.value}
            </span>
            {attribute.unit && (
              <span className="text-xs text-slate-400 font-mono">({attribute.unit})</span>
            )}
          </div>
        </div>

        {/* Origin Badge */}
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${originConfig.style}`}
        >
          <OriginIcon className="w-3 h-3" />
          <span>{originConfig.label}</span>
        </span>
      </div>

      {/* Footer Details: Confidence & Evidence Triggers */}
      <div className="mt-4 pt-3 border-t border-surface-border/60 flex items-center justify-between">
        <ConfidenceBadge
          confidence={attribute.confidence}
          size="sm"
          onClick={onInspectConfidence ? () => onInspectConfidence(attribute) : undefined}
        />

        <div className="flex items-center gap-2">
          {hasEvidence ? (
            <button
              onClick={() => onInspectEvidence && onInspectEvidence(attribute)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-surface-elevated hover:bg-slate-700 text-[11px] font-medium text-indigo-300 hover:text-white border border-surface-border transition-all"
            >
              <FileSearch className="w-3.5 h-3.5 text-indigo-400" />
              <span>Evidence ({attribute.evidence.length})</span>
            </button>
          ) : isConflict ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 font-mono">
              <AlertTriangle className="w-3 h-3" />
              <span>Conflict</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 italic">No direct citation</span>
          )}
        </div>
      </div>
    </div>
  );
};
