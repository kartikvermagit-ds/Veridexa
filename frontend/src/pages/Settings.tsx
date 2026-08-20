import React, { useState } from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Settings: React.FC = () => {
  const { isDark } = useTheme();
  const [llmProvider, setLlmProvider] = useState<'mock' | 'openai' | 'anthropic'>('mock');
  const [evidenceWeight, setEvidenceWeight] = useState(35);
  const [validationWeight, setValidationWeight] = useState(25);
  const [qualityWeight, setQualityWeight] = useState(20);
  const [sourceWeight] = useState(20);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-wider mb-1">
          <span>System Configuration</span>
        </div>
        <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Engine Settings & Weights
        </h1>
        <p className={`text-xs mt-1 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Configure AI extraction providers, deterministic validation rule thresholds, and confidence formulas.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* AI Provider Section */}
        <div className={`rounded-2xl border p-6 space-y-4 ${
          isDark ? 'bg-surface border-surface-border shadow-xl' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span>AI Extraction & Enrichment Provider</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                llmProvider === 'mock'
                  ? isDark
                    ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                    : 'bg-indigo-50/80 border-indigo-500 text-slate-900 shadow-sm'
                  : isDark
                  ? 'bg-surface-elevated border-surface-border text-slate-400 hover:text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <input
                type="radio"
                name="provider"
                checked={llmProvider === 'mock'}
                onChange={() => setLlmProvider('mock')}
                className="hidden"
              />
              <div className="font-bold text-xs">Deterministic Mock (Offline)</div>
              <p className={`text-[11px] mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Zero API latency, deterministic industrial benchmarks for presentations.
              </p>
            </label>

            <label
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                llmProvider === 'openai'
                  ? isDark
                    ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                    : 'bg-indigo-50/80 border-indigo-500 text-slate-900 shadow-sm'
                  : isDark
                  ? 'bg-surface-elevated border-surface-border text-slate-400 hover:text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <input
                type="radio"
                name="provider"
                checked={llmProvider === 'openai'}
                onChange={() => setLlmProvider('openai')}
                className="hidden"
              />
              <div className="font-bold text-xs">OpenAI (GPT-4o Mini)</div>
              <p className={`text-[11px] mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Live structured JSON schema extraction with OpenAI API.
              </p>
            </label>

            <label
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                llmProvider === 'anthropic'
                  ? isDark
                    ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                    : 'bg-indigo-50/80 border-indigo-500 text-slate-900 shadow-sm'
                  : isDark
                  ? 'bg-surface-elevated border-surface-border text-slate-400 hover:text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <input
                type="radio"
                name="provider"
                checked={llmProvider === 'anthropic'}
                onChange={() => setLlmProvider('anthropic')}
                className="hidden"
              />
              <div className="font-bold text-xs">Anthropic (Claude 3.5)</div>
              <p className={`text-[11px] mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Extended context reasoning for dense multi-page catalog datasheets.
              </p>
            </label>
          </div>
        </div>

        {/* Confidence Weighting Formula */}
        <div className={`rounded-2xl border p-6 space-y-4 ${
          isDark ? 'bg-surface border-surface-border shadow-xl' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-surface-border' : 'border-slate-200'}`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Confidence Weighting Formula</span>
            </h3>
            <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold">
              Total Weight: {evidenceWeight + validationWeight + qualityWeight + sourceWeight}%
            </span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className={`flex justify-between mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span>Evidence Grounding Weight ($w_e$)</span>
                <span className="font-bold">{evidenceWeight}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                value={evidenceWeight}
                onChange={(e) => setEvidenceWeight(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className={`flex justify-between mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span>Deterministic Validation Weight ($w_v$)</span>
                <span className="font-bold">{validationWeight}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                value={validationWeight}
                onChange={(e) => setValidationWeight(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className={`flex justify-between mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span>OCR & Layout Clarity Weight ($w_q$)</span>
                <span className="font-bold">{qualityWeight}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                value={qualityWeight}
                onChange={(e) => setQualityWeight(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20"
          >
            {saved ? 'Saved Successfully!' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
};
