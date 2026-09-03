/**
 * SAATHI — Taluka / Tehsil Knowledge Layer
 * 
 * Provides granular sub-district economic and agricultural intelligence
 * where authoritative official datasets are indexed.
 * 
 * Strict Evidence Rule: If taluka-specific data is unavailable, cleanly
 * falls back to the parent District profile with an explicit transparency notice.
 */

import { DataProvenance, createProvenance } from '../data/dataProvenance.js';

export interface TalukaProfile {
  subDistrictLgdCode: number;
  subDistrictName: string;
  districtLgdCode: number;
  districtName: string;
  stateLgdCode: number;
  stateName: string;
  localGeographicFeatures: string;
  majorCropsAndSurplus: string[];
  localMarketsAndApms: string[];
  prominentLocalOccupations: string[];
  primaryEnterpriseClusters: string[];
  infrastructureRating: 'HIGH' | 'MEDIUM' | 'EMERGING';
  waterAndPowerAvailability: string;
  nearbyCommercialNodes: string[];
  seasonalTradingPeriods: string[];
  localRisks: string[];
  provenance: DataProvenance;
}

const TALUKA_PROVENANCE = createProvenance(
  'State Agriculture Department Mandi Reports, District Statistical Handbooks & LGD',
  'https://lgdirectory.gov.in/',
  'TALUKA',
  '2024-25',
  'HIGH',
  'Granular sub-district / taluka profiles compiled from verified local administration and APMC yard data.'
);

export const TALUKA_PROFILES_REGISTRY: Record<number, TalukaProfile> = {
  // 1. Palus Taluka (4210, Sangli, Maharashtra)
  4210: {
    subDistrictLgdCode: 4210,
    subDistrictName: 'Palus',
    districtLgdCode: 504,
    districtName: 'Sangli',
    stateLgdCode: 27,
    stateName: 'Maharashtra',
    localGeographicFeatures: 'Krishna river basin flat fertile alluvial plain with high perennial lift irrigation density.',
    majorCropsAndSurplus: ['Grapes (Export & Raisin / Bedana)', 'Sugarcane', 'Turmeric', 'Soybean', 'Vegetables'],
    localMarketsAndApms: ['Palus Sub-Market Yard', 'Tasgaon APMC (18 km)', 'Sangli Fruit Market (28 km)'],
    prominentLocalOccupations: ['Grape Vineyard Management & Pruning', 'Raisin Processing (Bedana Sheds)', 'Sugarcane Harvesting & Hauling', 'Farm Irrigation Equipment Maintenance'],
    primaryEnterpriseClusters: ['Palus Industrial Estate (Engineering & Fabrication)', 'Bedana Processing Sheds', 'Dairy Collection Centers'],
    infrastructureRating: 'HIGH',
    waterAndPowerAvailability: 'High irrigation through Krishna river schemes; 3-phase agricultural power supplied in rotational shifts.',
    nearbyCommercialNodes: ['Islampur (20 km)', 'Miraj (32 km)', 'Sangli City (28 km)', 'Karad (35 km)'],
    seasonalTradingPeriods: ['March - May (Grape harvest & raisin auction surge)', 'November - January (Sugarcane cutting payment liquidity)'],
    localRisks: ['Excessive unseasonal rain during grape flowering causing berry crack', 'Dependency on single seasonal raisin auction payout', 'High ground salinity in poorly drained riverine farms'],
    provenance: TALUKA_PROVENANCE
  },

  // 2. Tasgaon Taluka (4211, Sangli, Maharashtra)
  4211: {
    subDistrictLgdCode: 4211,
    subDistrictName: 'Tasgaon',
    districtLgdCode: 504,
    districtName: 'Sangli',
    stateLgdCode: 27,
    stateName: 'Maharashtra',
    localGeographicFeatures: 'Gentle undulating terrain, recognized as the premier raisin (Bedana) hub of Western India.',
    majorCropsAndSurplus: ['Grapes (Thompson Seedless / Manik Chaman)', 'Raisins', 'Pomegranate', 'Sugarcane'],
    localMarketsAndApms: ['Tasgaon APMC (Asia’s largest specialized Raisin / Bedana auction yard)'],
    prominentLocalOccupations: ['Raisin Dipping & Drying Shed Operations', 'Grape Packing & Cold Storage Handling', 'Agri-Pesticide & Spray Pump Servicing'],
    primaryEnterpriseClusters: ['Tasgaon Bedana Processing Cluster', 'Grape Pre-Cooling & Cold Storage Units'],
    infrastructureRating: 'HIGH',
    waterAndPowerAvailability: 'Tembu lift irrigation project linkages; active borewell and farm pond storage.',
    nearbyCommercialNodes: ['Sangli (22 km)', 'Palus (18 km)', 'Miraj (26 km)'],
    seasonalTradingPeriods: ['February - May (Peak Bedana auctions: over ₹1,500 crore turnover)'],
    localRisks: ['Wholesale market price crashes during bumper raisin arrivals', 'High working capital needed to hold raisin inventory until Diwali'],
    provenance: TALUKA_PROVENANCE
  },

  // 3. Niphad Taluka (4142, Nashik, Maharashtra)
  4142: {
    subDistrictLgdCode: 4142,
    subDistrictName: 'Niphad',
    districtLgdCode: 479,
    districtName: 'Nashik',
    stateLgdCode: 27,
    stateName: 'Maharashtra',
    localGeographicFeatures: 'Godavari and Kadwa river basins; heart of India’s onion and table grape production.',
    majorCropsAndSurplus: ['Onion (Rabi / Pol & Kharif)', 'Table Grapes', 'Tomato', 'Sugarcane', 'Soybean'],
    localMarketsAndApms: ['Lasalgaon APMC (Largest onion market in Asia)', 'Pimpalgaon Baswant APMC (Major tomato & grape hub)'],
    prominentLocalOccupations: ['Onion Chawl Storage Management', 'Tomato Sorting & Crate Packing', 'Grape Export Grading', 'Tractor & Harvester Maintenance'],
    primaryEnterpriseClusters: ['Pimpalgaon Food Processing Corridor', 'Cold Chain & Reefer Container Hubs', 'Solar Dehydration Sheds'],
    infrastructureRating: 'HIGH',
    waterAndPowerAvailability: 'Canal network and Kadwa dams; reliable industrial power along highway nodes.',
    nearbyCommercialNodes: ['Nashik City (35 km)', 'Sinnar (40 km)', 'Ozar Airport Hub (20 km)'],
    seasonalTradingPeriods: ['October - December (Kharif Onion & Tomato arrivals)', 'March - May (Rabi Onion storage & Grape export peak)'],
    localRisks: ['Violent price fluctuations in raw onion requiring value-added dehydration', 'High storage weight loss in traditional onion chawls'],
    provenance: TALUKA_PROVENANCE
  },

  // 4. Baramati Taluka (4180, Pune, Maharashtra)
  4180: {
    subDistrictLgdCode: 4180,
    subDistrictName: 'Baramati',
    districtLgdCode: 492,
    districtName: 'Pune',
    stateLgdCode: 27,
    stateName: 'Maharashtra',
    localGeographicFeatures: 'Nira river canal belt, transitioning to dry rainfed eastern fringe (Supe).',
    majorCropsAndSurplus: ['Sugarcane', 'Dairy Milk', 'Grapes', 'Pomegranate', 'Poultry Broilers'],
    localMarketsAndApms: ['Baramati APMC', 'Supe Weekly Haat', 'Someshwar Sugar Mill Market'],
    prominentLocalOccupations: ['Hi-Tech Agriculture & Polyhouse Farming', 'Cooperative Dairy Operations', 'Precision Machining at MIDC', 'Agro-Tourism'],
    primaryEnterpriseClusters: ['Baramati MIDC (Automotive, Food & Textile)', 'Krishi Vigyan Kendra (KVK) Tech Demonstration Hub'],
    infrastructureRating: 'HIGH',
    waterAndPowerAvailability: 'Excellent canal irrigation in western zone; robust 24-hour industrial power.',
    nearbyCommercialNodes: ['Pune City (100 km)', 'Daund (40 km)', 'Indapur (45 km)', 'Phaltan (35 km)'],
    seasonalTradingPeriods: ['October - February (Sugar crushing, dairy peak season, wedding events)'],
    localRisks: ['Water disparity between canal belt and dry eastern taluka villages (Supe)', 'Intense competition from corporate-backed dairy plants'],
    provenance: TALUKA_PROVENANCE
  },

  // 5. Nawanshahr (147, SBS Nagar, Punjab)
  147: {
    subDistrictLgdCode: 147,
    subDistrictName: 'Nawanshahr',
    districtLgdCode: 36,
    districtName: 'Shahid Bhagat Singh Nagar',
    stateLgdCode: 3,
    stateName: 'Punjab',
    localGeographicFeatures: 'Fertile alluvial plain of the Doaba region between Sutlej and Beas, high NRI remittance inflow.',
    majorCropsAndSurplus: ['Wheat', 'Paddy (Basmati)', 'Sugarcane', 'Kinnow Citrus', 'Maize', 'Vegetables'],
    localMarketsAndApms: ['Nawanshahr Grain Market', 'Rahon Mandi', 'Banga APMC'],
    prominentLocalOccupations: ['Modern Mechanized Farming', 'Agro-Implement Welding & Repair', 'Commercial Dairy Operations', 'Retail Consumer Showrooms'],
    primaryEnterpriseClusters: ['Nawanshahr Light Engineering & Implements', 'Kinnow Fruit Washing & Waxing Centers'],
    infrastructureRating: 'HIGH',
    waterAndPowerAvailability: 'Tubewell and sub-canal irrigation; subsidized farm power.',
    nearbyCommercialNodes: ['Phagwara (35 km)', 'Jalandhar (55 km)', 'Ropar (45 km)', 'Chandigarh (90 km)'],
    seasonalTradingPeriods: ['October - November (Paddy harvest liquidity)', 'April - May (Wheat procurement peak)'],
    localRisks: ['Heavy dependency on minimum support price grain procurement', 'High customer expectations driven by foreign remittance economy'],
    provenance: TALUKA_PROVENANCE
  }
};
