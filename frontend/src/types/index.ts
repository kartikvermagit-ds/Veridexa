export type OriginType = 'EXTRACTED' | 'ENRICHED' | 'INFERRED';
export type AttributeStatus = 'VALIDATED' | 'UNVERIFIED' | 'CONFLICT' | 'UNKNOWN';
export type ValidationStatus = 'VALIDATED' | 'CONFLICT' | 'ANOMALY' | 'PENDING';
export type JobStatus = 'PENDING' | 'PROCESSING' | 'EXTRACTING' | 'VALIDATING' | 'ENRICHING' | 'COMPLETED' | 'FAILED';

export interface Evidence {
  id: string;
  attribute_id: string;
  source_id: string;
  page_number?: number;
  snippet: string;
  char_start?: number;
  char_end?: number;
  created_at: string;
}

export interface Attribute {
  id: string;
  product_id: string;
  name: string;
  value: string;
  raw_value?: string;
  unit?: string;
  data_type: string;
  origin_type: OriginType;
  confidence: number;
  status: AttributeStatus;
  evidence: Evidence[];
  created_at: string;
}

export interface Source {
  id: string;
  source_type: 'PDF' | 'CSV' | 'TEXT' | 'URL' | 'CATALOG';
  file_name?: string;
  source_url?: string;
  checksum?: string;
  created_at: string;
}

export interface ValidationResult {
  id: string;
  rule_name: string;
  rule_type: 'DETERMINISTIC' | 'AI_SEMANTIC';
  status: 'PASS' | 'FAIL' | 'CONFLICT' | 'WARNING';
  message: string;
  field_name?: string;
  conflicting_data?: Record<string, any>;
  created_at: string;
}

export interface EnrichmentResult {
  id: string;
  field_name: string;
  original_value?: string;
  enriched_value: string;
  enrichment_type: OriginType;
  rationale?: string;
  confidence: number;
  created_at: string;
}

export interface ProductListItem {
  id: string;
  sku: string;
  product_name: string;
  brand?: string;
  category: string;
  subcategory?: string;
  description?: string;
  completeness: number;
  overall_confidence: number;
  validation_status: ValidationStatus;
  attribute_count: number;
  source_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductDetail {
  id: string;
  sku: string;
  product_name: string;
  brand?: string;
  category: string;
  subcategory?: string;
  description?: string;
  completeness: number;
  overall_confidence: number;
  validation_status: ValidationStatus;
  raw_attributes: Record<string, any>;
  created_at: string;
  updated_at: string;
  attributes: Attribute[];
  sources: Source[];
  validation_results: ValidationResult[];
  enrichment_results: EnrichmentResult[];
  extracted_count: number;
  enriched_count: number;
  inferred_count: number;
  missing_attributes: string[];
  conflicts: Array<{
    rule_name: string;
    field_name?: string;
    message: string;
    conflicting_data?: Record<string, any>;
  }>;
}

export interface JobResponse {
  job_id: string;
  status: JobStatus;
  stage: string;
  progress: number;
  source_type: string;
  file_name?: string;
  product_id?: string;
  error_details?: string;
  created_at: string;
  completed_at?: string;
}

export interface DashboardStats {
  total_products: number;
  total_sources: number;
  average_completeness: number;
  average_confidence: number;
  validation_breakdown: {
    validated: number;
    with_conflicts: number;
    anomalies: number;
    pending: number;
  };
  category_distribution: Array<{ category: string; count: number }>;
  recent_jobs_count: number;
  active_conflicts_count: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: {
    total_count?: number;
    page?: number;
    page_size?: number;
    timestamp?: string;
  };
}
