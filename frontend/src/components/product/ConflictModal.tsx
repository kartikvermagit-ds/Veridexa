import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, FileText, Globe } from 'lucide-react';
import { validationApi } from '../../api/validation';

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
  const [selectedOption, setSelectedOption] = useState<'source_a' | 'source_b' | 'custom'>('source_a');
  const [customValue, setCustomValue] = useState('');
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
      onResolved();
      onClose();
    } catch (e: any) {
      alert(`Conflict resolution error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-surface border border-surface-border rounded-xl max-w-xl w-full p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Specification Discrepancy</h3>
              <p className="text-xs text-rose-300 font-mono">
                Field in conflict: <span className="font-bold underline">{fieldName}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-surface-elevated text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 my-4 leading-relaxed bg-rose-950/20 border border-rose-500/20 p-3 rounded-lg">
          {conflict.message || 'Contradictory values detected across ingested technical sources. Veridexa avoids guessing and requests authoritative confirmation.'}
        </p>

        {/* Side-by-Side Comparison Choices */}
        <div className="space-y-3">
          {/* Source A */}
          <label
            className={`block p-4 rounded-xl border cursor-pointer transition-all ${
              selectedOption === 'source_a'
                ? 'bg-indigo-950/30 border-indigo-500 shadow-md shadow-indigo-500/10'
                : 'bg-surface-elevated border-surface-border hover:border-slate-600'
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
                  <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{sourceA.name}</span>
                  </span>
                  {sourceA.page && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      Page {sourceA.page}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-base font-bold font-mono text-emerald-400">
                  Value: {sourceA.value}
                </div>
              </div>
            </div>
          </label>

          {/* Source B */}
          <label
            className={`block p-4 rounded-xl border cursor-pointer transition-all ${
              selectedOption === 'source_b'
                ? 'bg-indigo-950/30 border-indigo-500 shadow-md shadow-indigo-500/10'
                : 'bg-surface-elevated border-surface-border hover:border-slate-600'
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
                  <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{sourceB.name}</span>
                  </span>
                </div>
                <div className="mt-2 text-base font-bold font-mono text-amber-400">
                  Value: {sourceB.value}
                </div>
              </div>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-surface-border">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-elevated text-slate-300 hover:bg-slate-700 text-xs font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleResolve}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isSubmitting ? 'Resolving...' : 'Confirm Authoritative Value'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
