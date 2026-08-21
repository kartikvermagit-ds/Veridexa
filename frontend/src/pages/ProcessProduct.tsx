import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { processingApi } from '../api/processing';
import { LivePipelineVisualizer } from '../components/pipeline/LivePipelineVisualizer';
import { JobResponse } from '../types';
import { useTheme } from '../context/ThemeContext';

export const ProcessProduct: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'presets'>('presets');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState('');
  const [categoryHint, setCategoryHint] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Job state
  const [currentJob, setCurrentJob] = useState<JobResponse | null>(null);

  // Industrial Benchmark Presets for live judge demo
  const presets = [
    {
      id: 'fastener',
      title: 'High-Tensile SS316 Hex Bolt',
      category: 'Industrial Fasteners',
      badge: 'Full Spec Pass',
      desc: 'Marine-grade stainless fastener with DIN 933 / ISO 4017 standard thread specs.',
      text: `Unbrako Industrial Fasteners Technical Specification Sheet
Product: High-Tensile Hexagon Head Cap Screw
SKU: HEX-SS316-M10-50
Material: Manufactured using premium SS316 stainless steel per DIN 933 specifications.
Tensile Strength: >= 800 MPa minimum.
Thread Size: M10 (Metric coarse pitch 1.5mm)
Nominal Length: 50 mm from underhead bearing surface to bolt end.
Compliance Standard: DIN 933 / ISO 4017 full-thread specifications.
Operating Temperature: -196°C to +400°C.`
    },
    {
      id: 'valve',
      title: 'Swagelok 2-Piece Stainless Ball Valve',
      category: 'Process Valves',
      badge: 'Conflict Demo',
      desc: 'Quarter-turn stainless ball valve featuring deliberate cross-document spec conflict.',
      text: `Swagelok 60 Series Ball Valve Technical Datasheet
Product Name: 2-Piece Stainless Steel Ball Valve
Part Number: VLV-BV2-SS316-PN40
Body Material: ASTM A351 Grade CF8M (SS316)
Seat Material: Reinforced PTFE
Working Pressure: 40 bar at ambient temperature (20°C).
Operating Temperature: -20°C to 180°C.
Mounting: ISO 5211 direct mounting pad.`
    },
    {
      id: 'pump',
      title: 'Heavy-Duty Centrifugal Slurry Pump',
      category: 'Fluid Handling',
      badge: 'High Power',
      desc: 'Heavy mineral slurry pump with high chrome white iron impeller specifications.',
      text: `Grundfos Industrial Slurry Pumps
Model Series: Centrifugal Slurry Pump 100/75
SKU: PMP-CP-50HP-ANSI
Casing Material: 27% High Chrome White Iron with 650 HB hardness.
Maximum Flow Rate: 450 m3/h at 1450 RPM.
Discharge Pressure: 16 bar.
Motor Power: 50 HP (37 kW) 460 V 3-Phase 60Hz.`
    }
  ];

  // Poll current job if running
  useEffect(() => {
    if (!currentJob || currentJob.status === 'COMPLETED' || currentJob.status === 'FAILED') {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await processingApi.getJobStatus(currentJob.job_id);
        if (res.data) {
          setCurrentJob(res.data);
          if (res.data.status === 'COMPLETED' && res.data.product_id) {
            clearInterval(interval);
            setTimeout(() => {
              navigate(`/catalog/${res.data.product_id}`);
            }, 1200);
          }
        }
      } catch (e) {
        console.error('Job polling error:', e);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentJob, navigate]);

  const handleStartPipeline = async (textOverride?: string, catOverride?: string) => {
    setIsSubmitting(true);
    try {
      if (activeTab === 'upload' && selectedFile) {
        const res = await processingApi.processUpload(selectedFile, categoryHint);
        setCurrentJob(res.data);
      } else {
        const textToProcess = textOverride || rawText;
        const cat = catOverride || categoryHint;
        if (!textToProcess.trim()) {
          alert('Please enter product specifications or choose a preset.');
          return;
        }
        const res = await processingApi.processText(textToProcess, cat, 'Datasheet Ingestion');
        setCurrentJob(res.data);
      }
    } catch (e: any) {
      alert(`Ingestion error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectPreset = (p: typeof presets[0]) => {
    setRawText(p.text);
    setCategoryHint(p.category);
    handleStartPipeline(p.text, p.category);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-wider mb-1">
          <span>Ingestion & Extraction Studio</span>
        </div>
        <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Process Industrial Datasheet
        </h1>
        <p className={`text-sm mt-1.5 leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Feed raw PDFs, messy catalog tables, or technical snippets to extract structured specs with exact source quote citations.
        </p>
      </div>

      {/* Live Visualizer if Job is Active */}
      {currentJob ? (
        <div className="space-y-4 animate-in fade-in duration-300">
          <LivePipelineVisualizer
            status={currentJob.status}
            stage={currentJob.stage}
            progress={currentJob.progress}
            fileName={currentJob.file_name}
            errorDetails={currentJob.error_details}
          />
          {currentJob.status === 'COMPLETED' && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Product successfully processed! Redirecting to intelligence view...</span>
              </span>
              <button
                onClick={() => navigate(`/catalog/${currentJob.product_id}`)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                View Now
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={`rounded-2xl border p-6 space-y-6 ${
          isDark ? 'bg-surface border-surface-border shadow-xl' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          {/* Ingestion Mode Tabs */}
          <div className={`flex flex-col sm:flex-row items-stretch gap-1.5 p-1.5 rounded-xl border ${
            isDark ? 'bg-surface-elevated border-surface-border' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'presets'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Benchmark Presets</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'upload'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload PDF</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'text'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Text</span>
            </button>
          </div>

          {/* Tab 1: Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Select a benchmark industrial dataset to watch Veridexa run the complete extraction, dual validation, and evidence linking pipeline in seconds:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {presets.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between group ${
                      isDark
                        ? 'bg-surface-elevated/60 border-surface-border hover:border-indigo-500/60 hover:bg-surface-elevated'
                        : 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 font-bold">
                          {p.badge}
                        </span>
                        <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{p.category}</span>
                      </div>
                      <h4 className={`text-sm font-bold transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {p.title}
                      </h4>
                      <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{p.desc}</p>
                    </div>
                    <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold ${isDark ? 'border-surface-border/50' : 'border-slate-200'}`}>
                      <span>Run Pipeline</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <label className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDark
                  ? 'border-surface-border hover:border-indigo-500 bg-surface-elevated/30 hover:bg-surface-elevated/60'
                  : 'border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-slate-100'
              }`}>
                <UploadCloud className="w-10 h-10 text-indigo-500 mb-3" />
                <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedFile ? selectedFile.name : 'Click to browse or drag & drop industrial PDF'}
                </span>
                <span className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Supported formats: PDF, TXT (Maximum file size: 15MB)
                </span>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </label>

              <button
                onClick={() => handleStartPipeline()}
                disabled={!selectedFile || isSubmitting}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/20"
              >
                {isSubmitting ? 'Uploading & Queuing...' : 'Start Ingestion Pipeline'}
              </button>
            </div>
          )}

          {/* Tab 3: Text */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste unstructured industrial product specifications, catalog notes, or datasheet text here..."
                rows={8}
                className={`w-full rounded-2xl p-4 text-xs font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border ${
                  isDark
                    ? 'bg-surface-elevated border-surface-border text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />

              <button
                onClick={() => handleStartPipeline()}
                disabled={!rawText.trim() || isSubmitting}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/20"
              >
                {isSubmitting ? 'Processing Text...' : 'Extract & Validate Specifications'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
