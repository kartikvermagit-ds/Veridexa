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
  Check
} from 'lucide-react';
import { dashboardApi } from '../api/dashboard';
import { productsApi } from '../api/products';
import { StatCard } from '../components/common/StatCard';
import { SystemStatusBar } from '../components/dashboard/SystemStatusBar';
import { CorePipelineBanner } from '../components/dashboard/CorePipelineBanner';
import { TrustExplainabilitySection } from '../components/dashboard/TrustExplainabilitySection';
import { ActiveConflictSpotlight } from '../components/dashboard/ActiveConflictSpotlight';
import { RecentProcessingList } from '../components/dashboard/RecentProcessingList';
import { DataSourcesSummary } from '../components/dashboard/DataSourcesSummary';
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

  const { data: productsRes, refetch } = useQuery({
    queryKey: ['recent-products'],
    queryFn: () => productsApi.list({ page_size: 5 }),
  });

  const stats = statsRes?.data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. Compact High-Impact Hero Section */}
      <div
        className={`rounded-2xl border p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden transition-all duration-200 ${
          isDark
            ? 'bg-gradient-to-r from-indigo-950/70 via-surface to-surface border-indigo-500/30 shadow-2xl'
            : 'bg-gradient-to-r from-indigo-50 via-white to-white border-indigo-200/80 shadow-sm'
        }`}
      >
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-semibold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span>VERIDEXA • AI-Powered Product Intelligence</span>
          </div>
          <h1 className={`text-xl md:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Transform Industrial Product Data into Trusted Intelligence
          </h1>
          <p className={`text-xs mt-1.5 leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Transform technical datasheets, PDFs and unstructured catalog specifications into structured, validated, enriched and explainable commerce-ready data.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
              <Check className="w-3.5 h-3.5" />
              <span>Zero Hallucination Policy</span>
            </span>
            <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-300 font-medium text-[11px]">
              <Check className="w-3.5 h-3.5" />
              <span>Exact Quote Offsets</span>
            </span>
            <span className="flex items-center gap-1 text-purple-600 dark:text-purple-300 font-medium text-[11px]">
              <Check className="w-3.5 h-3.5" />
              <span>Dual Validation Engine</span>
            </span>
          </div>
        </div>

        {/* Primary & Secondary CTAs */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate('/process')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 hover:scale-105"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Process Product</span>
          </button>
          <button
            onClick={() => navigate('/catalog')}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              isDark
                ? 'bg-surface-elevated hover:bg-slate-700 text-slate-200 border-surface-border'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>View Catalog</span>
          </button>
        </div>
      </div>

      {/* 2. System Status Telemetry Bar */}
      <SystemStatusBar />

      {/* 3. Interactive Core 6-Stage Pipeline Banner */}
      <CorePipelineBanner />

      {/* 4. Primary Meaningful KPI Cards */}
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

      {/* 5. Trust & Explainability Section */}
      <TrustExplainabilitySection
        confidence={stats?.average_confidence}
        completeness={stats?.average_completeness}
      />

      {/* 6. Active Conflict Spotlight Card */}
      {(() => {
        const conflictProduct = productsRes?.data?.find((p) => p.validation_status === 'CONFLICT') || productsRes?.data?.[0];
        const conflictId = conflictProduct?.id || 'mock-2';
        return (
          <>
            <ActiveConflictSpotlight
              productId={conflictId}
              productName={conflictProduct?.product_name}
              sku={conflictProduct?.sku}
              conflictsCount={stats?.active_conflicts_count || 1}
              onOpenConflictModal={() => setIsConflictModalOpen(true)}
            />

            {/* 7. Bottom Grid: Data Sources Inventory & Recent Processing Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DataSourcesSummary />
              <RecentProcessingList />
            </div>

            {/* Reusable Conflict Modal */}
            {isConflictModalOpen && (
              <ConflictModal
                isOpen={isConflictModalOpen}
                onClose={() => setIsConflictModalOpen(false)}
                productId={conflictId}
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
          </>
        );
      })()}
    </div>
  );
};
