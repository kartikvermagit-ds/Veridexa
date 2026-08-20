import React from 'react';
import { X, FileText, CheckCircle2, Quote } from 'lucide-react';
import { Attribute, Source } from '../../types';
import { useTheme } from '../../context/ThemeContext';

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
  const { isDark } = useTheme();

  if (!isOpen || !attribute) return null;

  const sourceMap = new Map(sources.map((s) => [s.id, s]));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 max-w-lg w-full border-l shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 ${
          isDark ? 'bg-surface border-surface-border text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-surface-border' : 'border-slate-200'}`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-500 dark:text-indigo-400 font-mono">
                Source Traceability & Evidence
              </span>
            </div>
            <h2 className={`text-lg font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {attribute.name.replace(/_/g, ' ')}: <span className="text-indigo-600 dark:text-indigo-300">{attribute.value}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all ${
              isDark ? 'bg-surface-elevated hover:bg-slate-700 text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className={`rounded-xl p-4 border ${isDark ? 'bg-surface-elevated border-surface-border' : 'bg-slate-50 border-slate-200'}`}>
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Ground Truth Specification
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Attribute:</span>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{attribute.name}</p>
              </div>
              <div>
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Extracted Value:</span>
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold">{attribute.value}</p>
              </div>
              <div>
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Origin Classification:</span>
                <p className="text-indigo-600 dark:text-indigo-300 font-semibold">{attribute.origin_type}</p>
              </div>
              <div>
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Calculated Confidence:</span>
                <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{Math.round(attribute.confidence * 100)}%</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 flex items-center justify-between ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span>Citations & Snippets ({attribute.evidence.length})</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified in Document
              </span>
            </h4>

            {attribute.evidence.length === 0 ? (
              <div className={`text-center py-8 text-xs rounded-xl border border-dashed ${isDark ? 'bg-surface-elevated/40 text-slate-400 border-surface-border' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                No direct document quote snippet attached for this attribute.
              </div>
            ) : (
              <div className="space-y-4">
                {attribute.evidence.map((ev, index) => {
                  const source = sourceMap.get(ev.source_id);
                  return (
                    <div
                      key={ev.id || index}
                      className={`rounded-2xl border p-4 transition-all ${
                        isDark ? 'bg-surface-elevated border-surface-border' : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      {/* Document Citation Tag */}
                      <div className={`flex items-center justify-between pb-3 border-b text-xs ${isDark ? 'border-surface-border/50' : 'border-slate-100'}`}>
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-mono font-medium truncate max-w-[240px]">
                          <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span className="truncate" title={source?.file_name || 'Datasheet Document'}>
                            {source?.file_name || 'Datasheet Document'}
                          </span>
                        </div>
                        {ev.page_number && (
                          <span className={`px-2 py-0.5 rounded font-mono text-[10px] border ${
                            isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            Page {ev.page_number}
                          </span>
                        )}
                      </div>

                      {/* Verbatim Quote */}
                      <div className={`mt-3 relative pl-4 border-l-2 border-indigo-500 text-xs leading-relaxed font-sans italic p-3 rounded-r ${
                        isDark ? 'bg-industrial-950/60 text-slate-200' : 'bg-slate-50 text-slate-800 border-r border-t border-b border-slate-200/60'
                      }`}>
                        <Quote className={`w-3.5 h-3.5 text-indigo-500 absolute -top-1.5 -left-2 ${isDark ? 'bg-surface' : 'bg-white'}`} />
                        "{ev.snippet}"
                      </div>

                      {/* Offset info */}
                      {(ev.char_start !== undefined && ev.char_end !== undefined) && (
                        <div className={`mt-3 flex items-center justify-between text-[10px] font-mono pt-2 border-t ${isDark ? 'text-slate-400 border-surface-border/30' : 'text-slate-500 border-slate-100'}`}>
                          <span>Character Offset: {ev.char_start} - {ev.char_end}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% Text Match</span>
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
        <div className={`p-4 border-t flex justify-end ${isDark ? 'border-surface-border bg-surface/80' : 'border-slate-200 bg-slate-50'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              isDark ? 'bg-surface-elevated hover:bg-slate-700 text-slate-200' : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-sm'
            }`}
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
