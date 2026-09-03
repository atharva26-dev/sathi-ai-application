export interface DataProvenance {
  source_name: string;
  source_url: string;
  retrieved_at: string;
  coverage_level: 'VILLAGE' | 'TALUKA' | 'DISTRICT' | 'STATE' | 'NATIONAL';
  data_year: number | string;
  last_updated: string;
  confidence_level: 'HIGH' | 'MEDIUM' | 'LOW';
  limitations?: string;
}

export const createProvenance = (
  sourceName: string,
  sourceUrl: string,
  coverageLevel: 'VILLAGE' | 'TALUKA' | 'DISTRICT' | 'STATE' | 'NATIONAL',
  dataYear: number | string,
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW',
  limitations?: string
): DataProvenance => ({
  source_name: sourceName,
  source_url: sourceUrl,
  retrieved_at: '2026-09-02T00:00:00Z',
  coverage_level: coverageLevel,
  data_year: dataYear,
  last_updated: '2026-09-01T00:00:00Z',
  confidence_level: confidenceLevel,
  limitations
});
