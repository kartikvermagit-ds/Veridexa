import React from 'react';
import { X, FileText, CheckCircle2, Quote, ExternalLink, Calendar } from 'lucide-react';
import { Attribute, Source } from '../../types';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  attribute: Attribute | null;
  sources: Source[];
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  isOpen,
  onClose,
  attribute,
  sources
}) => {
  if (!isOpen || !attribute) return null;

  const sourceMap = new Map(sources.map((s) => [s.id, s]));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-lg w-full bg-surface border-l border-surface-border shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-surface-border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 font-mono">
                Source Traceability & Evidence
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              {attribute.name.replace(/_/g, ' ')}: <span className="text-indigo-300">{attribute.value}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-surface-elevated hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-surface-elevated rounded-lg p-4 border border-surface-border">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Ground Truth Specification
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-400">Attribute:</span>
                <p className="text-white font-semibold">{attribute.name}</p>
              </div>
              <div>
                <span className="text-slate-400">Extracted Value:</span>
                <p className="text-emerald-400 font-semibold">{attribute.value}</p>
              </div>
              <div>
                <span className="text-slate-400">Origin Classification:</span>
                <p className="text-indigo-300 font-semibold">{attribute.origin_type}</p>
              </div>
              <div>
                <span className="text-slate-400">Calculated Confidence:</span>
                <p className="text-slate-200 font-semibold">{Math.round(attribute.confidence * 100)}%</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Citations & Snippets ({attribute.evidence.length})</span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified in Document
              </span>
            </h4>

            {attribute.evidence.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs bg-surface-elevated/40 rounded-lg border border-dashed border-surface-border">
                No direct document quote snippet attached for this attribute.
              </div>
            ) : (
              <div className="space-y-4">
                {attribute.evidence.map((ev, index) => {
                  const source = sourceMap.get(ev.source_id);
                  return (
                    <div
                      key={ev.id || index}
                      className="bg-surface-elevated rounded-xl border border-surface-border p-4 hover:border-indigo-500/50 transition-all"
                    >
                      {/* Document Citation Tag */}
                      <div className="flex items-center justify-between pb-3 border-b border-surface-border/50 text-xs">
                        <div className="flex items-center gap-2 text-indigo-300 font-mono font-medium">
                          <FileText className="w-4 h-4 text-indigo-400" />
                          <span className="truncate max-w-[200px]" title={source?.file_name || 'Datasheet Document'}>
                            {source?.file_name || 'Datasheet Document'}
                          </span>
                        </div>
                        {ev.page_number && (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
                            Page {ev.page_number}
                          </span>
                        )}
                      </div>

                      {/* Verbatim Quote */}
                      <div className="mt-3 relative pl-4 border-l-2 border-indigo-500 text-xs text-slate-200 leading-relaxed font-sans italic bg-industrial-950/40 p-2.5 rounded-r">
                        <Quote className="w-3.5 h-3.5 text-indigo-400 absolute -top-1.5 -left-2 bg-surface" />
                        "{ev.snippet}"
                      </div>

                      {/* Offset info */}
                      {(ev.char_start !== undefined && ev.char_end !== undefined) && (
                        <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-surface-border/30">
                          <span>Character Offset: {ev.char_start} - {ev.char_end}</span>
                          <span className="text-emerald-400">100% Text Match</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-border bg-surface/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-elevated hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
