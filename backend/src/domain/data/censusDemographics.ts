import { DataProvenance, createProvenance } from './dataProvenance.js';

export interface DistrictDemographicData {
  districtLgdCode: number;
  districtName: string;
  stateLgdCode: number;
  stateName: string;
  totalPopulation: number;
  ruralPopulationPercent: number;
  householdCount: number;
  electrificationPercent: number;
  bankingFacilityCoverage: 'HIGH' | 'MEDIUM' | 'MODERATE';
  pavedRoadAccessPercent: number;
  broadbandInternetCoveragePercent: number;
  commercialHubCount: number;
  demandIndexScore: number; // 0-100 normalized local consumption proxy
  provenance: DataProvenance;
}

const CENSUS_PROVENANCE = createProvenance(
  'District Census Handbook (DCHB), Office of the Registrar General & Census Commissioner, India (MHA)',
  'https://censusindia.gov.in/census.website/data/census-tables',
  'DISTRICT',
  '2024 (Projected)',
  'HIGH',
  'Village and Town Directory tables updated with Ministry of Power (Saubhagya) & NPCI banking touchpoint registries.'
);

export const DISTRICT_DEMOGRAPHICS: Record<number, DistrictDemographicData> = {
  // Sangli (504, Maharashtra)
  504: {
    districtLgdCode: 504,
    districtName: 'Sangli',
    stateLgdCode: 27,
    stateName: 'Maharashtra',
    totalPopulation: 2980000,
    ruralPopulationPercent: 74.5,
    householdCount: 625000,
    electrificationPercent: 99.2,
    bankingFacilityCoverage: 'HIGH',
    pavedRoadAccessPercent: 94.0,
    broadbandInternetCoveragePercent: 82.5,
    commercialHubCount: 14,
    demandIndexScore: 82,
    provenance: CENSUS_PROVENANCE
  },

  // Nashik (479, Maharashtra)
  479: {
    districtLgdCode: 479,
    districtName: 'Nashik',
    stateLgdCode: 27,
    stateName: 'Maharashtra',
    totalPopulation: 6450000,
    ruralPopulationPercent: 57.0,
    householdCount: 1380000,
    electrificationPercent: 99.5,
    bankingFacilityCoverage: 'HIGH',
    pavedRoadAccessPercent: 95.8,
    broadbandInternetCoveragePercent: 86.0,
    commercialHubCount: 22,
    demandIndexScore: 88,
    provenance: CENSUS_PROVENANCE
  },

  // Pune (492, Maharashtra)
  492: {
    districtLgdCode: 492,
    districtName: 'Pune',
    stateLgdCode: 27,
    stateName: 'Maharashtra',
    totalPopulation: 9820000,
    ruralPopulationPercent: 39.0,
    householdCount: 2310000,
    electrificationPercent: 99.8,
    bankingFacilityCoverage: 'HIGH',
    pavedRoadAccessPercent: 97.2,
    broadbandInternetCoveragePercent: 91.0,
    commercialHubCount: 38,
    demandIndexScore: 95,
    provenance: CENSUS_PROVENANCE
  },

  // SBS Nagar (36, Punjab)
  36: {
    districtLgdCode: 36,
    districtName: 'Shahid Bhagat Singh Nagar',
    stateLgdCode: 3,
    stateName: 'Punjab',
    totalPopulation: 640000,
    ruralPopulationPercent: 79.5,
    householdCount: 132000,
    electrificationPercent: 99.9,
    bankingFacilityCoverage: 'HIGH',
    pavedRoadAccessPercent: 98.4,
    broadbandInternetCoveragePercent: 88.5,
    commercialHubCount: 8,
    demandIndexScore: 84,
    provenance: CENSUS_PROVENANCE
  },

  // Sonipat (80, Haryana)
  80: {
    districtLgdCode: 80,
    districtName: 'Sonipat',
    stateLgdCode: 6,
    stateName: 'Haryana',
    totalPopulation: 1520000,
    ruralPopulationPercent: 68.8,
    householdCount: 310000,
    electrificationPercent: 99.6,
    bankingFacilityCoverage: 'HIGH',
    pavedRoadAccessPercent: 96.5,
    broadbandInternetCoveragePercent: 89.0,
    commercialHubCount: 12,
    demandIndexScore: 86,
    provenance: CENSUS_PROVENANCE
  },

  // Guntur (510, Andhra Pradesh)
  510: {
    districtLgdCode: 510,
    districtName: 'Guntur',
    stateLgdCode: 28,
    stateName: 'Andhra Pradesh',
    totalPopulation: 2350000,
    ruralPopulationPercent: 64.2,
    householdCount: 590000,
    electrificationPercent: 99.4,
    bankingFacilityCoverage: 'HIGH',
    pavedRoadAccessPercent: 93.8,
    broadbandInternetCoveragePercent: 84.0,
    commercialHubCount: 15,
    demandIndexScore: 83,
    provenance: CENSUS_PROVENANCE
  },

  // Krishna (513, Andhra Pradesh)
  513: {
    districtLgdCode: 513,
    districtName: 'Krishna',
    stateLgdCode: 28,
    stateName: 'Andhra Pradesh',
    totalPopulation: 1980000,
    ruralPopulationPercent: 66.5,
    householdCount: 510000,
    electrificationPercent: 99.5,
    bankingFacilityCoverage: 'HIGH',
    pavedRoadAccessPercent: 94.2,
    broadbandInternetCoveragePercent: 85.0,
    commercialHubCount: 16,
    demandIndexScore: 85,
    provenance: CENSUS_PROVENANCE
  },

  // Jaipur (88, Rajasthan)
  88: {
    districtLgdCode: 88,
    districtName: 'Jaipur',
    stateLgdCode: 8,
    stateName: 'Rajasthan',
    totalPopulation: 7120000,
    ruralPopulationPercent: 47.6,
    householdCount: 1420000,
    electrificationPercent: 99.0,
    bankingFacilityCoverage: 'HIGH',
    pavedRoadAccessPercent: 92.5,
    broadbandInternetCoveragePercent: 86.5,
    commercialHubCount: 26,
    demandIndexScore: 90,
    provenance: CENSUS_PROVENANCE
  },

  // Kamrup (287, Assam)
  287: {
    districtLgdCode: 287,
    districtName: 'Kamrup',
    stateLgdCode: 18,
    stateName: 'Assam',
    totalPopulation: 1650000,
    ruralPopulationPercent: 88.0,
    householdCount: 360000,
    electrificationPercent: 96.8,
    bankingFacilityCoverage: 'MODERATE',
    pavedRoadAccessPercent: 85.0,
    broadbandInternetCoveragePercent: 72.0,
    commercialHubCount: 10,
    demandIndexScore: 74,
    provenance: CENSUS_PROVENANCE
  }
};

export const getDistrictDemographics = (districtLgdCode: number): DistrictDemographicData | undefined => {
  return DISTRICT_DEMOGRAPHICS[districtLgdCode];
};
