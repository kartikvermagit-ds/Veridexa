import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Download,
  AlertTriangle,
  FileText,
  FileCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Calculator,
  ShieldCheck,
  Check,
  AlertCircle,
  HelpCircle,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { productsApi } from '../api/products';
import { validationApi } from '../api/validation';
import { dashboardApi } from '../api/dashboard';
import { AttributeCard } from '../components/product/AttributeCard';
import { EvidenceDrawer } from '../components/product/EvidenceDrawer';
import { ConfidenceModal } from '../components/product/ConfidenceModal';
import { ConflictModal } from '../components/product/ConflictModal';
import { ValidationBadge } from '../components/common/ValidationBadge';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { CompletenessBar } from '../components/common/CompletenessBar';
import { Skeleton } from '../components/common/SkeletonLoader';
import { Attribute, OriginType } from '../types';

export const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeFilter, setActiveFilter] = useState<'ALL' | OriginType>('ALL');
  const [selectedAttributeForEvidence, setSelectedAttributeForEvidence] = useState<Attribute | null>(null);
  const [selectedAttributeForConfidence, setSelectedAttributeForConfidence] = useState<Attribute | null>(null);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);

  const { data: detailRes, isLoading, refetch } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsApi.getDetail(productId!),
    enabled: !!productId
  });

  const revalidateMutation = useMutation({
    mutationFn: () => validationApi.revalidateProduct(productId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const enrichMutation = useMutation({
    mutationFn: () => validationApi.enrichProduct(productId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    }
  });

  const product = detailRes?.data;

  if (isLoading) {
    return (
      <div className="space-y-6 py-6 max-w-6xl mx-auto">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-44 w-full rounded-xl" />
          <Skeleton className="h-44 w-full rounded-xl" />
          <Skeleton className="h-44 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 bg-surface rounded-2xl border border-surface-border">
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <p className="text-xs text-slate-400 mt-2">The requested industrial product intelligence record does not exist.</p>
        <button
          onClick={() => navigate('/catalog')}
          className="mt-6 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  // Filter attributes
  const filteredAttributes = product.attributes.filter((attr) => {
    if (activeFilter === 'ALL') return true;
    return attr.origin_type === activeFilter;
  });

  const activeConflict = product.conflicts && product.conflicts.length > 0 ? product.conflicts[0] : null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* 1. Action & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/catalog')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => revalidateMutation.mutate()}
            disabled={revalidateMutation.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-surface-border hover:bg-surface-elevated text-slate-300 hover:text-white text-xs font-medium transition-all"
            title="Re-run deterministic and AI validation checks"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${revalidateMutation.isPending ? 'animate-spin' : ''}`} />
            <span>Re-Validate</span>
          </button>
          <button
            onClick={() => enrichMutation.mutate()}
            disabled={enrichMutation.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 text-purple-300 text-xs font-medium transition-all"
            title="Run AI domain application mapping"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{enrichMutation.isPending ? 'Enriching...' : 'AI Enrich Specs'}</span>
          </button>
          <button
            onClick={() => dashboardApi.exportCatalog('json')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Commerce Specs</span>
          </button>
        </div>
      </div>

      {/* 2. PRODUCT HEADER */}
      <div className="bg-surface rounded-2xl border border-surface-border p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-mono font-bold">
                SKU: {product.sku}
              </span>
              <span className="text-xs text-slate-400 font-medium font-sans">
                {product.category} {product.subcategory ? `• ${product.subcategory}` : ''}
              </span>
              {product.brand && (
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  Brand: {product.brand}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {product.product_name}
            </h1>

            {product.description && (
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed font-sans">
                {product.description}
              </p>
            )}
          </div>

          {/* Validation Status & Trust Score Column */}
          <div className="flex items-center gap-6 bg-surface-elevated/80 border border-surface-border p-4 rounded-xl shrink-0">
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Validation Status
              </span>
              <ValidationBadge status={product.validation_status} />
            </div>

            <div className="h-8 w-px bg-surface-border" />

            <div className="text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Trust Score
              </span>
              <ConfidenceBadge
                confidence={product.overall_confidence}
                size="lg"
                onClick={() => {
                  if (product.attributes.length > 0) {
                    setSelectedAttributeForConfidence(product.attributes[0]);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* 3. COMPLETENESS BAR */}
        <div className="pt-4 border-t border-surface-border/60">
          <CompletenessBar completeness={product.completeness} />
        </div>
      </div>

      {/* 4. CONFLICT ALERT BANNER (If discrepancy detected) */}
      {activeConflict && (
        <div className="bg-gradient-to-r from-rose-950/30 via-surface to-surface border-2 border-rose-500/40 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl shadow-rose-500/5">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>Multi-Source Conflict Detected</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                  Field: {activeConflict.field_name || 'Specification'}
                </span>
              </h4>
              <p className="text-xs text-rose-200 mt-1 leading-relaxed">
                {activeConflict.message || 'Contradictory values detected across ingested technical sources. Veridexa avoids guessing and flags for engineer sign-off.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsConflictModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 transition-all shadow-lg shadow-rose-600/30 hover:scale-105"
          >
            Review Discrepancy & Resolve
          </button>
        </div>
      )}

      {/* 5. STRUCTURED ATTRIBUTES GRID */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-surface-border">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Structured Specifications & Grounding</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Directly grounded in source text or domain models
            </p>
          </div>

          {/* Filter Pills (All / Extracted / Enriched / Inferred) */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-elevated border border-surface-border text-xs">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeFilter === 'ALL'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({product.attributes.length})
            </button>
            <button
              onClick={() => setActiveFilter('EXTRACTED')}
              className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                activeFilter === 'EXTRACTED'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3 h-3" />
              <span>✓ Extracted ({product.extracted_count})</span>
            </button>
            <button
              onClick={() => setActiveFilter('ENRICHED')}
              className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                activeFilter === 'ENRICHED'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>✦ AI Enriched ({product.enriched_count})</span>
            </button>
            <button
              onClick={() => setActiveFilter('INFERRED')}
              className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                activeFilter === 'INFERRED'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calculator className="w-3 h-3" />
              <span>⚠ Inferred ({product.inferred_count})</span>
            </button>
          </div>
        </div>

        {/* Attribute Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAttributes.map((attr) => (
            <AttributeCard
              key={attr.id}
              attribute={attr}
              onInspectEvidence={(a) => setSelectedAttributeForEvidence(a)}
              onInspectConfidence={(a) => setSelectedAttributeForConfidence(a)}
            />
          ))}
        </div>
      </div>

      {/* 6. AI ENRICHMENT & DOMAIN CONTEXT SECTION */}
      {product.enrichment_results && product.enrichment_results.length > 0 && (
        <div className="bg-surface rounded-2xl border border-surface-border p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  AI Domain Enrichments & Compatibility Notes
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Synthesized applications and standards derived with transparent engineering rationale
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {product.enrichment_results.map((en) => (
              <div
                key={en.id}
                className="p-4 rounded-xl bg-surface-elevated/70 border border-purple-500/20 hover:border-purple-500/40 transition-all text-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-purple-300 uppercase">
                    {en.field_name.replace(/_/g, ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] font-semibold">
                    ✦ {en.enrichment_type} ({Math.round(en.confidence * 100)}% Confidence)
                  </span>
                </div>
                <p className="text-sm font-semibold text-white mt-1 leading-snug">
                  {en.enriched_value}
                </p>
                {en.rationale && (
                  <p className="text-xs text-slate-400 mt-2 pl-3 border-l-2 border-purple-500/40 italic">
                    Engineering Rationale: {en.rationale}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. VALIDATION RESULTS AUDIT TRAIL */}
      {product.validation_results && product.validation_results.length > 0 && (
        <div className="bg-surface rounded-2xl border border-surface-border p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Deterministic & Semantic Validation Audit
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Automated rule checks against standard SI engineering units and physical boundaries
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {product.validation_results.map((vr) => {
              const isPass = vr.status === 'PASS';
              const isConflict = vr.status === 'CONFLICT';
              return (
                <div
                  key={vr.id}
                  className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                    isConflict
                      ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                      : isPass
                      ? 'bg-surface-elevated/50 border-emerald-500/20 text-slate-200'
                      : 'bg-surface-elevated/50 border-amber-500/20 text-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">
                      {isConflict ? (
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                      ) : isPass ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{vr.rule_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({vr.rule_type})</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">{vr.message}</p>
                    </div>
                  </div>

                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0 border ${
                      isConflict
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : isPass
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {vr.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 8. INGESTION SOURCES & ARTIFACTS */}
      {product.sources && product.sources.length > 0 && (
        <div className="bg-surface rounded-2xl border border-surface-border p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Ingested Technical Artifacts & Sources ({product.sources.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {product.sources.map((src) => (
              <div
                key={src.id}
                className="p-3.5 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2.5 truncate max-w-[340px]">
                  <FileCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-slate-200 font-medium truncate" title={src.file_name || src.source_url}>
                    {src.file_name || src.source_url}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700 uppercase">
                  {src.source_type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Drawer Slide-Over */}
      <EvidenceDrawer
        isOpen={!!selectedAttributeForEvidence}
        onClose={() => setSelectedAttributeForEvidence(null)}
        attribute={selectedAttributeForEvidence}
        sources={product.sources || []}
      />

      {/* Confidence Signal Breakdown Modal */}
      <ConfidenceModal
        isOpen={!!selectedAttributeForConfidence}
        onClose={() => setSelectedAttributeForConfidence(null)}
        attribute={selectedAttributeForConfidence}
      />

      {/* Conflict Resolution Modal */}
      <ConflictModal
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
        productId={product.id}
        conflict={activeConflict}
        onResolved={() => {
          refetch();
          queryClient.invalidateQueries({ queryKey: ['products'] });
        }}
      />
    </div>
  );
};
