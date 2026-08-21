import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, FileText, Globe } from 'lucide-react';
import { validationApi } from '../../api/validation';
import { useTheme } from '../../context/ThemeContext';
import { sound } from '../../utils/sound';

interface ConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  conflict: {
    rule_name: string;
    field_name?: string;
    message: string;
    conflicting_data?: Record<string, any>;
  } | null;
  onResolved: () => void;
}

export const ConflictModal: React.FC<ConflictModalProps> = ({
  isOpen,
  onClose,
  productId,
  conflict,
  onResolved
}) => {
  const { isDark } = useTheme();
  const [selectedOption, setSelectedOption] = useState<'source_a' | 'source_b' | 'custom'>('source_a');
  const [customValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !conflict) return null;

  const data = conflict.conflicting_data || {};
  const sourceA = data.source_a || { name: 'Manufacturer Datasheet (PDF)', value: '40 bar', page: 2 };
  const sourceB = data.source_b || { name: 'Distributor Online Catalog (URL)', value: '63 bar', url: 'https://distributor.example.com' };
  const fieldName = conflict.field_name || 'pressure_rating';

  const handleResolve = async () => {
    setIsSubmitting(true);
    let chosenVal = sourceA.value;
    let chosenSource = sourceA.name;

    if (selectedOption === 'source_b') {
      chosenVal = sourceB.value;
      chosenSource = sourceB.name;
    } else if (selectedOption === 'custom') {
      chosenVal = customValue;
      chosenSource = 'Manual Engineer Override';
    }

    try {
      await validationApi.resolveConflict(productId, {
        attribute_name: fieldName,
        selected_value: chosenVal,
        selected_source: chosenSource,
        resolution_notes: `Manual resolution by domain engineer: selected ${chosenVal}`
      });
      sound.playResolved();
      onResolved();
      onClose();
    } catch (e: any) {
      alert(`Conflict resolution error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative border rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 ${
        isDark ? 'bg-surface border-surface-border text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className={`flex items-start justify-between pb-4 border-b ${isDark ? 'border-surface-border' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Specification Discrepancy
              </h3>
              <p className="text-xs text-rose-600 dark:text-rose-300 font-mono">
                Field in conflict: <span className="font-bold underline">{fieldName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg ${isDark ? 'bg-surface-elevated text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className={`text-xs my-4 leading-relaxed p-3.5 rounded-xl border ${
          isDark
            ? 'bg-rose-950/20 border-rose-500/20 text-slate-300'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          {conflict.message || 'Contradictory values detected across ingested technical sources. Veridexa avoids guessing and requests authoritative confirmation.'}
        </p>

        {/* Side-by-Side Comparison Choices */}
        <div className="space-y-3">
          {/* Source A */}
          <label
            className={`block p-4 rounded-xl border cursor-pointer transition-all ${
              selectedOption === 'source_a'
                ? isDark
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-indigo-50/70 border-indigo-500 shadow-sm'
                : isDark
                ? 'bg-surface-elevated border-surface-border hover:border-slate-600'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="conflict-choice"
                checked={selectedOption === 'source_a'}
                onChange={() => setSelectedOption('source_a')}
                className="mt-1 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold flex items-center gap-1.5 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{sourceA.name}</span>
                  </span>
                  {sourceA.page && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                      Page {sourceA.page}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  Value: {sourceA.value}
                </div>
              </div>
            </div>
          </label>

          {/* Source B */}
          <label
            className={`block p-4 rounded-xl border cursor-pointer transition-all ${
              selectedOption === 'source_b'
                ? isDark
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-indigo-50/70 border-indigo-500 shadow-sm'
                : isDark
                ? 'bg-surface-elevated border-surface-border hover:border-slate-600'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="conflict-choice"
                checked={selectedOption === 'source_b'}
                onChange={() => setSelectedOption('source_b')}
                className="mt-1 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold flex items-center gap-1.5 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Globe className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{sourceB.name}</span>
                  </span>
                </div>
                <div className="mt-2 text-base font-bold font-mono text-amber-600 dark:text-amber-400">
                  Value: {sourceB.value}
                </div>
              </div>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className={`mt-6 flex justify-end gap-3 pt-4 border-t ${isDark ? 'border-surface-border' : 'border-slate-200'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${
              isDark ? 'bg-surface-elevated text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleResolve}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isSubmitting ? 'Resolving...' : 'Confirm Authoritative Value'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
