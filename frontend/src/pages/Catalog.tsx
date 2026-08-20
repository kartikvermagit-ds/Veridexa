import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Layers,
  Search,
  Filter,
  FileSpreadsheet,
  Download,
  Trash2,
  ExternalLink,
  Plus,
  RotateCw,
  FileText,
  Clock
} from 'lucide-react';
import { productsApi } from '../api/products';
import { dashboardApi } from '../api/dashboard';
import { ValidationBadge } from '../components/common/ValidationBadge';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { CompletenessBar } from '../components/common/CompletenessBar';
import { TableSkeleton } from '../components/common/SkeletonLoader';

export const Catalog: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');

  const { data: productsRes, isLoading, refetch } = useQuery({
    queryKey: ['products', { search, category, status }],
    queryFn: () =>
      productsApi.list({
        search: search || undefined,
        category: category || undefined,
        validation_status: status || undefined,
        page_size: 50
      })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    }
  });

  const products = productsRes?.data || [];

  const handleFilterChange = (newCat: string, newStat: string) => {
    setCategory(newCat);
    setStatus(newStat);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (newCat) params.set('category', newCat);
    if (newStat) params.set('status', newStat);
    setSearchParams(params);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider mb-1">
            <span>Verified Master Data</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Industrial Product Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {products.length} structured, evidence-grounded industrial records indexed
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2 rounded-lg bg-surface border border-surface-border text-slate-400 hover:text-white"
            title="Refresh list"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => dashboardApi.exportCatalog('json')}
            className="px-3 py-2 rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
          <button
            onClick={() => dashboardApi.exportCatalog('csv')}
            className="px-3 py-2 rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => navigate('/process')}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Process Product</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface rounded-xl border border-surface-border p-4 shadow-xl flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by SKU, Product Name, Material..."
            className="w-full bg-surface-elevated border border-surface-border rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
          />
        </div>

        {/* Category Select */}
        <select
          value={category}
          onChange={(e) => handleFilterChange(e.target.value, status)}
          className="bg-surface-elevated border border-surface-border rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-sans"
        >
          <option value="">All Categories</option>
          <option value="Industrial Fasteners">Industrial Fasteners</option>
          <option value="Process Valves">Process Valves</option>
          <option value="Fluid Handling">Fluid Handling</option>
          <option value="Sensors & Instrumentation">Sensors & Instrumentation</option>
        </select>

        {/* Status Select */}
        <select
          value={status}
          onChange={(e) => handleFilterChange(category, e.target.value)}
          className="bg-surface-elevated border border-surface-border rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-sans"
        >
          <option value="">All Statuses</option>
          <option value="VALIDATED">Validated (100% Passed)</option>
          <option value="CONFLICT">Conflicts Flagged</option>
          <option value="ANOMALY">Anomalies / Missing</option>
        </select>
      </div>

      {/* Enterprise Product Data Table */}
      <div className="bg-surface rounded-2xl border border-surface-border shadow-xl overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={6} cols={7} />
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-3">
            <Layers className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-white">No matching products found</p>
            <p className="text-xs max-w-sm mx-auto">
              Try adjusting your search keywords or filter selections.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-elevated border-b border-surface-border text-slate-400 uppercase font-mono text-[10px]">
                  <th className="py-3.5 px-4 font-semibold">SKU / Model</th>
                  <th className="py-3.5 px-4 font-semibold">Product Name</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Completeness</th>
                  <th className="py-3.5 px-4 font-semibold">Confidence</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Sources</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-surface-elevated/50 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/catalog/${p.id}`)}
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-indigo-300">
                      {p.sku}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {p.product_name}
                      {p.brand && <span className="text-[11px] text-slate-400 block font-normal">{p.brand}</span>}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{p.category}</td>
                    <td className="py-3.5 px-4 min-w-[130px]">
                      <CompletenessBar completeness={p.completeness} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <ConfidenceBadge confidence={p.overall_confidence} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <ValidationBadge status={p.validation_status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{p.source_count || 1} doc</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/catalog/${p.id}`)}
                          className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-indigo-300"
                          title="Open details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete product ${p.sku}?`)) {
                              deleteMutation.mutate(p.id);
                            }
                          }}
                          className="p-1.5 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
