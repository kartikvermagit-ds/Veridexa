import { DashboardStats, ProductListItem, ProductDetail } from '../types';

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  total_products: 124,
  total_sources: 142,
  average_completeness: 0.94,
  average_confidence: 0.96,
  validation_breakdown: {
    validated: 112,
    with_conflicts: 3,
    anomalies: 5,
    pending: 4
  },
  category_distribution: [
    { category: 'Industrial Fasteners', count: 48 },
    { category: 'Process Valves', count: 34 },
    { category: 'Fluid Handling', count: 24 },
    { category: 'Sensors & Instrumentation', count: 18 }
  ],
  recent_jobs_count: 14,
  active_conflicts_count: 3
};

export const MOCK_PRODUCTS: ProductListItem[] = [
  {
    id: 'mock-1',
    sku: 'HEX-SS316-M10-50',
    product_name: 'High-Tensile SS316 Hex Bolt',
    brand: 'Unbrako',
    category: 'Industrial Fasteners',
    subcategory: 'Hex Head Cap Screws',
    completeness: 1.0,
    overall_confidence: 0.98,
    validation_status: 'VALIDATED',
    attribute_count: 6,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'mock-2',
    sku: 'VLV-BV2-SS316-PN40',
    product_name: '2-Piece Stainless Steel Ball Valve',
    brand: 'Swagelok',
    category: 'Process Valves',
    subcategory: 'Quarter-Turn Valves',
    completeness: 0.88,
    overall_confidence: 0.82,
    validation_status: 'CONFLICT',
    attribute_count: 5,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'mock-3',
    sku: 'PMP-CP-50HP-ANSI',
    product_name: 'Heavy-Duty Centrifugal Slurry Pump',
    brand: 'Grundfos',
    category: 'Fluid Handling',
    subcategory: 'Process Slurry Pumps',
    completeness: 0.92,
    overall_confidence: 0.94,
    validation_status: 'VALIDATED',
    attribute_count: 5,
    created_at: new Date(Date.now() - 14400000).toISOString(),
    updated_at: new Date(Date.now() - 14400000).toISOString(),
  }
];

export const MOCK_PRODUCT_DETAIL: ProductDetail = {
  id: 'mock-1',
  sku: 'HEX-SS316-M10-50',
  product_name: 'High-Tensile SS316 Hex Bolt',
  brand: 'Unbrako',
  category: 'Industrial Fasteners',
  subcategory: 'Hex Head Cap Screws',
  description: 'High-strength marine-grade stainless steel hex head bolt engineered for corrosive chemical and offshore structural applications.',
  completeness: 1.0,
  overall_confidence: 0.98,
  validation_status: 'VALIDATED',
  raw_attributes: {
    material: 'SS316',
    thread_size: 'M10',
    length: '50 mm',
    standard: 'DIN 933 / ISO 4017'
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  extracted_count: 4,
  enriched_count: 1,
  inferred_count: 1,
  missing_attributes: [],
  conflicts: [],
  sources: [
    {
      id: 'src-1',
      source_type: 'PDF',
      file_name: 'Unbrako_SS316_Hex_Fasteners_Datasheet.pdf',
      created_at: new Date().toISOString()
    }
  ],
  attributes: [
    {
      id: 'attr-1',
      product_id: 'mock-1',
      name: 'material',
      value: 'SS316',
      unit: undefined,
      data_type: 'string',
      origin_type: 'EXTRACTED',
      confidence: 0.98,
      status: 'VALIDATED',
      created_at: new Date().toISOString(),
      evidence: [
        {
          id: 'ev-1',
          attribute_id: 'attr-1',
          source_id: 'src-1',
          page_number: 1,
          snippet: 'Manufactured using premium SS316 stainless steel per DIN 933 specifications.',
          created_at: new Date().toISOString()
        }
      ]
    },
    {
      id: 'attr-2',
      product_id: 'mock-1',
      name: 'thread_size',
      value: 'M10',
      unit: 'metric',
      data_type: 'string',
      origin_type: 'EXTRACTED',
      confidence: 0.96,
      status: 'VALIDATED',
      created_at: new Date().toISOString(),
      evidence: [
        {
          id: 'ev-2',
          attribute_id: 'attr-2',
          source_id: 'src-1',
          page_number: 1,
          snippet: 'Hex Head Cap Screw M10 x 50mm, coarse thread pitch 1.5mm.',
          created_at: new Date().toISOString()
        }
      ]
    },
    {
      id: 'attr-3',
      product_id: 'mock-1',
      name: 'length',
      value: '50 mm',
      unit: 'mm',
      data_type: 'string',
      origin_type: 'EXTRACTED',
      confidence: 0.97,
      status: 'VALIDATED',
      created_at: new Date().toISOString(),
      evidence: [
        {
          id: 'ev-3',
          attribute_id: 'attr-3',
          source_id: 'src-1',
          page_number: 1,
          snippet: 'Nominal length: 50 mm from underhead bearing surface to bolt end.',
          created_at: new Date().toISOString()
        }
      ]
    },
    {
      id: 'attr-4',
      product_id: 'mock-1',
      name: 'compliance_standard',
      value: 'DIN 933 / ISO 4017',
      unit: undefined,
      data_type: 'string',
      origin_type: 'EXTRACTED',
      confidence: 0.99,
      status: 'VALIDATED',
      created_at: new Date().toISOString(),
      evidence: [
        {
          id: 'ev-4',
          attribute_id: 'attr-4',
          source_id: 'src-1',
          page_number: 2,
          snippet: 'Standard dimensions conform to DIN 933 and ISO 4017 full-thread specifications.',
          created_at: new Date().toISOString()
        }
      ]
    },
    {
      id: 'attr-5',
      product_id: 'mock-1',
      name: 'applications',
      value: 'Marine structural framing, chemical plants, offshore platforms',
      unit: undefined,
      data_type: 'string',
      origin_type: 'ENRICHED',
      confidence: 0.92,
      status: 'VALIDATED',
      created_at: new Date().toISOString(),
      evidence: []
    },
    {
      id: 'attr-6',
      product_id: 'mock-1',
      name: 'recommended_torque',
      value: '49 Nm (dry)',
      unit: 'Nm',
      data_type: 'string',
      origin_type: 'INFERRED',
      confidence: 0.88,
      status: 'VALIDATED',
      created_at: new Date().toISOString(),
      evidence: []
    }
  ],
  validation_results: [
    {
      id: 'vr-1',
      rule_name: 'DETERMINISTIC_UNIT_CONFORMANCE',
      rule_type: 'DETERMINISTIC',
      status: 'PASS',
      field_name: 'length',
      message: 'Dimensions conform to SI standard millimeters (mm).',
      created_at: new Date().toISOString()
    }
  ],
  enrichment_results: [
    {
      id: 'er-1',
      field_name: 'applications',
      enriched_value: 'Marine structural framing, chemical processing plants, food & beverage machinery',
      enrichment_type: 'ENRICHED',
      rationale: 'SS316 molybdenum alloy prevents pitting corrosion in chlorine and marine environments.',
      confidence: 0.92,
      created_at: new Date().toISOString()
    }
  ]
};
