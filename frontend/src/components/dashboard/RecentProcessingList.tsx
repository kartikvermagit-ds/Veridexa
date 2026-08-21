import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock, ArrowRight, FileCheck, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { ValidationBadge } from '../common/ValidationBadge';
import { productsApi } from '../../api/products';

export const RecentProcessingList: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const { data: productsRes } = useQuery({
    queryKey: ['recent-processing-products'],
    queryFn: () => productsApi.list({ page_size: 5 })
  });

  const products = productsRes?.data || [];

  const displayItems = products.length > 0
    ? products.slice(0, 3).map((p) => ({
        id: p.id,
        name: p.product_name,
        sku: p.sku,
        time: 'Recently Indexed',
        confidence: p.overall_confidence,
        status: p.validation_status,
        conflictNote: p.validation_status === 'CONFLICT' ? 'Discrepancy flagged' : null
      }))
    : [
        {
          id: 'mock-2',
          name: '2-Piece Stainless Steel Ball Valve',
          sku: 'VLV-BV2-SS316-PN40',
          time: '2 min ago',
          confidence: 0.89,
          status: 'CONFLICT' as const,
          conflictNote: '1 pressure discrepancy flagged'
        },
        {
          id: 'mock-1',
          name: 'High-Tensile SS316 Hex Bolt',
          sku: 'HEX-SS316-M10-50',
          time: '8 min ago',
          confidence: 0.98,
          status: 'VALIDATED' as const,
          conflictNote: null
        },
        {
          id: 'mock-3',
          name: 'Centrifugal Slurry Pump 100/75',
          sku: 'PMP-CP-50HP-ANSI',
          time: '14 min ago',
          confidence: 0.95,
          status: 'VALIDATED' as const,
          conflictNote: null
        }
      ];

  return (
    <div
      className={`rounded-2xl border p-5 space-y-4 transition-all duration-200 ${
        isDark
          ? 'bg-surface border-surface-border shadow-xl'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-surface-border' : 'border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
              Real-Time Feed
            </span>
          </div>
          <h3 className={`text-base font-bold tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Recent Processing Activity
          </h3>
        </div>
        <button
          onClick={() => navigate('/catalog')}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
        >
          <span>All Records</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2.5">
        {displayItems.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/catalog/${item.id}`)}
            className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all ${
              isDark
                ? 'bg-surface-elevated/60 border-surface-border hover:border-slate-600 hover:bg-surface-elevated'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100 shadow-xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                  item.status === 'CONFLICT'
                    ? isDark ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-rose-100 text-rose-600'
                    : isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-100 text-emerald-600'
                }`}
              >
                {item.status === 'CONFLICT' ? <AlertTriangle className="w-4 h-4" /> : <FileCheck className="w-4 h-4" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.name}</span>
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-300 font-semibold">{item.sku}</span>
                </div>
                <div className={`flex items-center gap-2 mt-1 text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.time}</span>
                  </span>
                  {item.conflictNote && (
                    <span className="text-rose-600 dark:text-rose-400 font-medium">• {item.conflictNote}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <ValidationBadge status={item.status} size="sm" />
              <ConfidenceBadge confidence={item.confidence} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
