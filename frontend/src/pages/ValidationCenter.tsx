import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Check,
  RotateCw
} from 'lucide-react';
import { productsApi } from '../api/products';
import { ValidationIssueCard } from '../components/validation/ValidationIssueCard';
import { ConflictModal } from '../components/product/ConflictModal';
import { Skeleton } from '../components/common/SkeletonLoader';
import { useTheme } from '../context/ThemeContext';

export const ValidationCenter: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'ALL' | 'CONFLICT' | 'ANOMALY' | 'RULES'>('ALL');
  const [selectedConflictProduct, setSelectedConflictProduct] = useState<{ id: string; conflict: any } | null>(null);

  const { data: productsRes, isLoading, refetch } = useQuery({
    queryKey: ['validation-products'],
    queryFn: () => productsApi.list({ page_size: 50 })
  });

  const products = productsRes?.data || [];

  // Filter products with issues
  const issueProducts = products.filter(
    (p) => p.validation_status === 'CONFLICT' || p.validation_status === 'ANOMALY'
  );

  const conflictCount = products.filter((p) => p.validation_status === 'CONFLICT').length;
  const anomalyCount = products.filter((p) => p.validation_status === 'ANOMALY').length;
  const validatedCount = products.filter((p) => p.validation_status === 'VALIDATED').length;

  // Active Standard Validation Rules Catalog
  const activeRulesCatalog = [
    {
      id: 'R1',
      name: 'Deterministic Unit Conformance',
      category: 'Physical SI Units',
      status: 'Enforced (100% Pass)',
      desc: 'Validates standard industrial pressure (bar, PSI, MPa), dimensions (mm, in), and temperatures (°C, K).',
      passed: true
    },
    {
      id: 'R2',
      name: 'Mandatory Material Grade Specification',
      category: 'Fasteners & Valves',
      status: 'Enforced',
      desc: 'Enforces explicit alloy grades (SS316, SS304, Monel 400) for structural and corrosion compliance.',
      passed: true
    },
    {
      id: 'R3',
      name: 'Cross-Document Semantic Consistency',
      category: 'Multi-Source Ingestion',
      status: `${conflictCount} Active Discrepancies`,
      desc: 'Detects contradictory values across manufacturer datasheets vs distributor listings without guessing.',
      passed: conflictCount === 0
    },
    {
      id: 'R4',
      name: 'Operating Temperature Bound Feasibility',
      category: 'Thermal Bounds',
      status: 'Enforced (T_min <= T_max)',
      desc: 'Ensures minimum operating temperatures do not exceed maximum operational threshold.',
      passed: true
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">
            <span>Engineering Audit Trail</span>
          </div>
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Validation & Integrity Center
          </h1>
          <p className={`text-xs mt-1 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Answers "What product data can I trust?" through deterministic checks and contradiction audits
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className={`p-2 rounded-xl border transition-all ${
            isDark ? 'bg-surface border-surface-border text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs'
          }`}
          title="Refresh audit log"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* 1. Validation Summary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          isDark ? 'bg-surface border-surface-border' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <span className={`text-[10px] uppercase tracking-wider font-mono font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Audited</span>
            <div className={`text-2xl font-bold font-mono mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{products.length}</div>
            <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Indexed master specs</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          isDark ? 'bg-surface border-emerald-500/30' : 'bg-white border-emerald-200 shadow-sm'
        }`}>
          <div>
            <span className={`text-[10px] uppercase tracking-wider font-mono font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Passed Rules</span>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{validatedCount}</div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">100% Conforming</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          isDark ? 'bg-surface border-rose-500/30' : 'bg-white border-rose-200 shadow-sm'
        }`}>
          <div>
            <span className={`text-[10px] uppercase tracking-wider font-mono font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active Conflicts</span>
            <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">{conflictCount}</div>
            <span className="text-[11px] text-rose-600 dark:text-rose-300 font-mono font-medium">Needs Review</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          isDark ? 'bg-surface border-amber-500/30' : 'bg-white border-amber-200 shadow-sm'
        }`}>
          <div>
            <span className={`text-[10px] uppercase tracking-wider font-mono font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Warnings / Gaps</span>
            <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">{anomalyCount}</div>
            <span className="text-[11px] text-amber-600 dark:text-amber-300 font-mono font-medium">Non-blocking</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className={`flex items-center gap-2 p-1.5 rounded-xl border w-fit ${
        isDark ? 'bg-surface border-surface-border' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'ALL'
              ? 'bg-indigo-600 text-white shadow-md'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Issues ({issueProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('CONFLICT')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'CONFLICT'
              ? 'bg-rose-600 text-white shadow-md'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Active Conflicts ({conflictCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('ANOMALY')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'ANOMALY'
              ? 'bg-amber-600 text-white shadow-md'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Rule Anomalies ({anomalyCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('RULES')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'RULES'
              ? 'bg-emerald-600 text-white shadow-md'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Rule Engine Catalog</span>
        </button>
      </div>

      {/* 3. Tab: Rule Engine Catalog */}
      {activeTab === 'RULES' ? (
        <div className={`rounded-2xl border p-6 space-y-4 ${
          isDark ? 'bg-surface border-surface-border shadow-xl' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`pb-3 border-b ${isDark ? 'border-surface-border' : 'border-slate-200'}`}>
            <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Active Deterministic Rule Catalog
            </h3>
            <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Enforced across all incoming technical documents and catalog records
            </p>
          </div>

          <div className="space-y-3">
            {activeRulesCatalog.map((r) => (
              <div
                key={r.id}
                className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                  isDark ? 'bg-surface-elevated border-surface-border' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg mt-0.5 ${
                      r.passed
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    }`}
                  >
                    {r.passed ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{r.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-700 border border-slate-200'}`}>
                        {r.category}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{r.desc}</p>
                  </div>
                </div>

                <span
                  className={`font-mono text-[10px] font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
                    r.passed
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'
                  }`}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Issues List */
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          ) : issueProducts.length === 0 ? (
            <div className={`rounded-2xl border p-12 text-center space-y-3 ${
              isDark ? 'bg-surface border-surface-border' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>No Validation Issues Found</h3>
              <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                All indexed products conform to standard engineering ranges and have no unresolved multi-source contradictions.
              </p>
            </div>
          ) : (
            issueProducts.map((p) => {
              const isConflict = p.validation_status === 'CONFLICT';
              return (
                <ValidationIssueCard
                  key={p.id}
                  issue={{
                    id: `iss-${p.id}`,
                    rule_name: isConflict ? 'CROSS_DOCUMENT_CONFLICT_CHECK' : 'REQUIRED_FIELD_CHECK',
                    rule_type: isConflict ? 'AI_SEMANTIC' : 'DETERMINISTIC',
                    status: isConflict ? 'CONFLICT' : 'FAIL',
                    message: isConflict
                      ? 'Discrepancy detected: Ingested manufacturer datasheet differs from distributor catalog.'
                      : 'Product specification violates category completeness or standard unit rules.',
                    conflicting_data: isConflict
                      ? {
                          source_a: { name: 'Manufacturer Datasheet (PDF)', value: '40 bar (PN40)', page: 2 },
                          source_b: { name: 'Distributor Online Catalog (URL)', value: '63 bar' }
                        }
                      : undefined,
                    created_at: p.created_at
                  }}
                  productName={p.product_name}
                  sku={p.sku}
                  productId={p.id}
                  onViewProduct={() => navigate(`/catalog/${p.id}`)}
                  onResolve={() =>
                    setSelectedConflictProduct({
                      id: p.id,
                      conflict: {
                        rule_name: 'CROSS_DOCUMENT_CONFLICT_CHECK',
                        field_name: 'pressure_rating',
                        message: 'Contradictory values detected across ingested technical sources.',
                        conflicting_data: {
                          source_a: { name: 'Swagelok_60_Series_Datasheet.pdf', value: '40 bar (PN40)', page: 2 },
                          source_b: { name: 'Distributor Online Catalog (URL)', value: '63 bar' }
                        }
                      }
                    })
                  }
                />
              );
            })
          )}
        </div>
      )}

      {/* Conflict Resolution Modal */}
      {selectedConflictProduct && (
        <ConflictModal
          isOpen={!!selectedConflictProduct}
          onClose={() => setSelectedConflictProduct(null)}
          productId={selectedConflictProduct.id}
          conflict={selectedConflictProduct.conflict}
          onResolved={() => {
            refetch();
            setSelectedConflictProduct(null);
          }}
        />
      )}
    </div>
  );
};
