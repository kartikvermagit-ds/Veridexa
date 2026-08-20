import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Boxes,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  UploadCloud,
  Layers,
  ArrowRight,
  Check
} from 'lucide-react';
import { dashboardApi } from '../api/dashboard';
import { productsApi } from '../api/products';
import { StatCard } from '../components/common/StatCard';
import { ValidationBadge } from '../components/common/ValidationBadge';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { Skeleton } from '../components/common/SkeletonLoader';
import { CorePipelineBanner } from '../components/dashboard/CorePipelineBanner';
import { TrustExplainabilitySection } from '../components/dashboard/TrustExplainabilitySection';
import { ActiveConflictSpotlight } from '../components/dashboard/ActiveConflictSpotlight';
import { ConflictModal } from '../components/product/ConflictModal';
import { useTheme } from '../context/ThemeContext';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);

  const { data: statsRes, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats(),
  });

  const { data: productsRes, isLoading: productsLoading, refetch } = useQuery({
    queryKey: ['recent-products'],
    queryFn: () => productsApi.list({ page_size: 5 }),
  });

  const stats = statsRes?.data;
  const recentProducts = productsRes?.data || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. Hero Section */}
      <div
        className={`rounded-2xl border p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden transition-all duration-200 ${
          isDark
            ? 'bg-gradient-to-r from-indigo-950/70 via-surface to-surface border-indigo-500/30 shadow-2xl'
            : 'bg-gradient-to-r from-indigo-50 via-white to-white border-indigo-200/80 shadow-sm'
        }`}
      >
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>VERIDEXA • AI-Powered Product Intelligence</span>
          </div>
          <h1 className={`text-2xl md:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Transform Industrial Product Data into Trusted Intelligence
          </h1>
          <p className={`text-sm mt-2.5 leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Transform scattered technical datasheets, PDFs, and unstructured catalog specs into structured, validated, enriched, and explainable commerce-ready data.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <Check className="w-4 h-4" />
              <span>Zero Hallucination Policy</span>
            </span>
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-300 font-medium">
              <Check className="w-4 h-4" />
              <span>Exact Quote Offsets</span>
            </span>
            <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-300 font-medium">
              <Check className="w-4 h-4" />
              <span>Dual Validation Engine</span>
            </span>
          </div>
        </div>

        {/* Primary & Secondary CTAs */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/process')}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 hover:scale-105"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Process Product</span>
          </button>
          <button
            onClick={() => navigate('/catalog')}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold border transition-all ${
              isDark
                ? 'bg-surface-elevated hover:bg-slate-700 text-slate-200 border-surface-border'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>View Catalog</span>
          </button>
        </div>
      </div>

      {/* 2. Core 6-Stage Pipeline Banner */}
      <CorePipelineBanner />

      {/* 3. Primary Meaningful KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Catalog Master Records"
          value={statsLoading ? '—' : stats?.total_products || 0}
          subtitle="Total industrial specs structured"
          icon={Boxes}
          accentColor="brand"
          trend="+12% throughput this week"
          trendPositive={true}
        />
        <StatCard
          title="Fully Validated"
          value={statsLoading ? '—' : stats?.validation_breakdown.validated || 0}
          subtitle="Conforms to engineering standards"
          icon={CheckCircle2}
          accentColor="emerald"
        />
        <StatCard
          title="Active Conflicts"
          value={statsLoading ? '—' : stats?.active_conflicts_count || 0}
          subtitle="Cross-document discrepancies flagged"
          icon={AlertTriangle}
          accentColor="rose"
        />
        <StatCard
          title="Average Confidence"
          value={statsLoading ? '—' : `${Math.round((stats?.average_confidence || 0) * 100)}%`}
          subtitle="Multi-signal mathematical trust index"
          icon={ShieldCheck}
          accentColor="indigo"
        />
      </div>

      {/* 4. Trust & Explainability Hub */}
      <TrustExplainabilitySection
        confidence={stats?.average_confidence}
        completeness={stats?.average_completeness}
      />

      {/* 5. Active Conflict Spotlight Card */}
      <ActiveConflictSpotlight
        onOpenConflictModal={() => setIsConflictModalOpen(true)}
      />

      {/* 6. Recent Ingested Products Table */}
      <div
        className={`rounded-2xl border p-6 space-y-4 transition-all duration-200 ${
          isDark
            ? 'bg-surface border-surface-border shadow-xl'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-surface-border' : 'border-slate-200'}`}>
          <div>
            <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Recent Industrial Products
            </h3>
            <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Latest AI extractions with verification status
            </p>
          </div>
          <button
            onClick={() => navigate('/catalog')}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {productsLoading ? (
          <div className="space-y-2 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : recentProducts.length === 0 ? (
          <div className={`text-center py-8 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            No products found. Process your first datasheet to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b uppercase font-mono text-[10px] ${isDark ? 'border-surface-border text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <th className="pb-3 font-semibold">SKU / Model</th>
                  <th className="pb-3 font-semibold">Product Name</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Confidence</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-surface-border/50' : 'divide-slate-100'}`}>
                {recentProducts.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => navigate(`/catalog/${product.id}`)}
                    className={`transition-colors cursor-pointer group ${
                      isDark ? 'hover:bg-surface-elevated/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5 font-mono text-indigo-600 dark:text-indigo-300 font-semibold">{product.sku}</td>
                    <td className={`py-3.5 font-semibold transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {product.product_name}
                    </td>
                    <td className={`py-3.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{product.category}</td>
                    <td className="py-3.5">
                      <ValidationBadge status={product.validation_status} size="sm" />
                    </td>
                    <td className="py-3.5">
                      <ConfidenceBadge confidence={product.overall_confidence} size="sm" />
                    </td>
                    <td className="py-3.5 text-right">
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-xs inline-flex items-center gap-1">
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reusable Conflict Modal */}
      {isConflictModalOpen && (
        <ConflictModal
          isOpen={isConflictModalOpen}
          onClose={() => setIsConflictModalOpen(false)}
          productId="mock-2"
          conflict={{
            rule_name: 'CROSS_DOCUMENT_CONFLICT_CHECK',
            field_name: 'pressure_rating',
            message: 'Discrepancy detected: Manufacturer Datasheet specifies 40 bar (PN40) while Distributor catalog states 63 bar.',
            conflicting_data: {
              source_a: { name: 'Swagelok_60_Series_Datasheet.pdf', value: '40 bar (PN40)', page: 2 },
              source_b: { name: 'Distributor Online Catalog (URL)', value: '63 bar' }
            }
          }}
          onResolved={() => {
            refetch();
          }}
        />
      )}
    </div>
  );
};
