import { apiClient } from './client';
import { ApiResponse } from '../types';

export interface ConflictResolutionPayload {
  attribute_name: string;
  selected_value: string;
  selected_source?: string;
  resolution_notes?: string;
}

export const validationApi = {
  async revalidateProduct(productId: string): Promise<ApiResponse<any>> {
    return await apiClient(`/products/${productId}/validate`, {
      method: 'POST'
    });
  },

  async resolveConflict(productId: string, payload: ConflictResolutionPayload): Promise<ApiResponse<any>> {
    return await apiClient(`/products/${productId}/resolve-conflict`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async enrichProduct(productId: string): Promise<ApiResponse<any>> {
    return await apiClient(`/products/${productId}/enrich`, {
      method: 'POST'
    });
  },

  async getEvidence(productId: string): Promise<ApiResponse<any[]>> {
    return await apiClient(`/products/${productId}/evidence`);
  }
};
