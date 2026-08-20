import { apiClient } from './client';
import { ProductListItem, ProductDetail, ApiResponse } from '../types';
import { MOCK_PRODUCTS, MOCK_PRODUCT_DETAIL } from './mockData';

export interface ProductFilterParams {
  category?: string;
  validation_status?: string;
  min_confidence?: number;
  search?: string;
  page?: number;
  page_size?: number;
}

export const productsApi = {
  async list(params: ProductFilterParams = {}): Promise<ApiResponse<ProductListItem[]>> {
    try {
      const query = new URLSearchParams();
      if (params.category) query.set('category', params.category);
      if (params.validation_status) query.set('validation_status', params.validation_status);
      if (params.min_confidence !== undefined) query.set('min_confidence', String(params.min_confidence));
      if (params.search) query.set('search', params.search);
      if (params.page) query.set('page', String(params.page));
      if (params.page_size) query.set('page_size', String(params.page_size));

      const qs = query.toString();
      return await apiClient<ProductListItem[]>(`/products${qs ? `?${qs}` : ''}`);
    } catch (e) {
      console.warn('Backend unavailable, returning fallback mock products');
      return {
        success: true,
        data: MOCK_PRODUCTS,
        meta: { total_count: MOCK_PRODUCTS.length, page: 1, page_size: 20 }
      };
    }
  },

  async getDetail(productId: string): Promise<ApiResponse<ProductDetail>> {
    try {
      return await apiClient<ProductDetail>(`/products/${productId}`);
    } catch (e) {
      console.warn('Backend unavailable, returning fallback mock product detail');
      return {
        success: true,
        data: { ...MOCK_PRODUCT_DETAIL, id: productId }
      };
    }
  },

  async delete(productId: string): Promise<ApiResponse<{ deleted_id: string }>> {
    return await apiClient<{ deleted_id: string }>(`/products/${productId}`, {
      method: 'DELETE'
    });
  }
};
