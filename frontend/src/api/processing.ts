import { apiClient } from './client';
import { JobResponse, ApiResponse } from '../types';

export const processingApi = {
  async processUpload(file: File, categoryHint?: string): Promise<ApiResponse<JobResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    if (categoryHint) {
      formData.append('category_hint', categoryHint);
    }

    return await apiClient<JobResponse>('/products/process', {
      method: 'POST',
      body: formData
    });
  },

  async processText(text: string, categoryHint?: string, sourceName = 'Manual Input'): Promise<ApiResponse<JobResponse>> {
    return await apiClient<JobResponse>('/products/process-text', {
      method: 'POST',
      body: JSON.stringify({
        text,
        category_hint: categoryHint,
        source_name: sourceName
      })
    });
  },

  async getJobStatus(jobId: string): Promise<ApiResponse<JobResponse>> {
    return await apiClient<JobResponse>(`/processing/jobs/${jobId}`);
  },

  async listRecentJobs(limit = 10): Promise<ApiResponse<JobResponse[]>> {
    return await apiClient<JobResponse[]>(`/processing/jobs?limit=${limit}`);
  }
};
