import React from 'react';
import { FileSearch, Sparkles, Cpu, Calculator, AlertTriangle } from 'lucide-react';
import { Attribute } from '../../types';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { useTheme } from '../../context/ThemeContext';

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
  const { isDark } = useTheme();
  const isConflict = attribute.status === 'CONFLICT';
  const hasEvidence = attribute.evidence && attribute.evidence.length > 0;

  const originConfig = {
    EXTRACTED: {
      label: '✓ Extracted',
      icon: Cpu,
      style: isDark
        ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
        : 'bg-blue-50 text-blue-700 border-blue-200'
    },
    ENRICHED: {
      label: '✦ AI Enriched',
      icon: Sparkles,
      style: isDark
        ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
        : 'bg-purple-50 text-purple-700 border-purple-200'
    },
    INFERRED: {
      label: '⚠ Inferred',
      icon: Calculator,
      style: isDark
        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
        : 'bg-amber-50 text-amber-700 border-amber-200'
    }
  }[attribute.origin_type];

  const OriginIcon = originConfig.icon;

  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-200 ${
        isConflict
          ? isDark
            ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-500/5'
            : 'bg-rose-50/60 border-rose-300 shadow-xs'
          : isDark
          ? 'bg-surface hover:bg-surface-elevated/80 border-surface-border hover:border-slate-600'
          : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {attribute.name.replace(/_/g, ' ')}
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-base font-bold font-mono tracking-tight break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {attribute.value}
            </span>
            {attribute.unit && (
              <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>({attribute.unit})</span>
            )}
          </div>
        </div>

        {/* Origin Badge */}
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${originConfig.style}`}
        >
          <OriginIcon className="w-3 h-3" />
          <span>{originConfig.label}</span>
        </span>
      </div>

      {/* Footer Details: Confidence & Evidence Triggers */}
      <div className={`mt-4 pt-3 border-t flex items-center justify-between ${isDark ? 'border-surface-border/60' : 'border-slate-100'}`}>
        <ConfidenceBadge
          confidence={attribute.confidence}
          size="sm"
          onClick={onInspectConfidence ? () => onInspectConfidence(attribute) : undefined}
        />

        <div className="flex items-center gap-2">
          {hasEvidence ? (
            <button
              onClick={() => onInspectEvidence && onInspectEvidence(attribute)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                isDark
                  ? 'bg-surface-elevated hover:bg-slate-700 text-indigo-300 hover:text-white border-surface-border'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
              }`}
            >
              <FileSearch className="w-3.5 h-3.5 text-indigo-500" />
              <span>Evidence ({attribute.evidence.length})</span>
            </button>
          ) : isConflict ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 font-mono">
              <AlertTriangle className="w-3 h-3" />
              <span>Conflict</span>
            </span>
          ) : (
            <span className={`text-[11px] italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No direct citation</span>
          )}
        </div>
      </div>
    </div>
  );
};
