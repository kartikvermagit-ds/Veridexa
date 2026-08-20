import { apiClient } from './client';
import { DashboardStats, ApiResponse } from '../types';
import { MOCK_DASHBOARD_STATS } from './mockData';

export const dashboardApi = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      return await apiClient<DashboardStats>('/dashboard/stats');
    } catch (e) {
      console.warn('Backend unavailable, returning fallback dashboard stats');
      return {
        success: true,
        data: MOCK_DASHBOARD_STATS
      };
    }
  },

  async exportCatalog(format: 'json' | 'csv'): Promise<void> {
    const base = import.meta.env.VITE_API_URL || '/api/v1';
    const url = `${base}/catalog/export?format=${format}`;
    window.open(url, '_blank');
  }
};
