import { SupportedLanguage, DataTrustLevel } from '../config/constants.js';

export interface LocationHierarchy {
  state: string;
  stateLgdCode?: number;
  district: string;
  districtLgdCode?: number;
  subDistrict: string; // Taluka / Tehsil
  subDistrictLgdCode?: number;
  block?: string;
  blockLgdCode?: number;
  village: string;
  villageLgdCode?: number;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

export interface ScoreBreakdown {
  demand: number; // 25% (0 to 100)
  competition: number; // 20% (0 to 100, where higher means more competition)
  capitalFit: number; // 15% (0 to 100)
  accessibility: number; // 10% (0 to 100)
  marginPotential: number; // 10% (0 to 100)
  customerPain: number; // 10% (0 to 100)
  supplyGap: number; // 5% (0 to 100)
  riskPenalty: number; // 5% (0 to 100)
  overallOpportunity: number; // 0 to 100
  ratingLabel: { mr: string; hi: string; en: string };
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'PRELIMINARY';
  explanationPoints: { mr: string[]; hi: string[]; en: string[] };
}

export interface DataSourceProvenance {
  source: string;
  datasetName: string;
  retrievedAt: string;
  publishedAt?: string;
  isLive: boolean;
  reliabilityScore: number;
}

export interface MarketContext {
  userId: string;
  language: SupportedLanguage;
  businessName: string;
  businessCategory: string;
  businessDescription?: string;
  location: LocationHierarchy;
  availableCapital: number;
  analysisRadiusKm: number;
  userObservations?: {
    competitorCountRange?: '0' | '1-3' | '4-10' | '10+';
    perceivedDemand?: 'HIGH' | 'MEDIUM' | 'LOW';
  };
}

export interface MarketGapItem {
  id: string;
  name: string;
  nameNative: { mr: string; hi: string; en: string };
  icon: string;
  demandScore: number; // Y-axis (0-100)
  competitionScore: number; // X-axis (0-100)
  opportunityQuadrant: 'HIGH_OPPORTUNITY' | 'COMPETITIVE' | 'NICHE' | 'HIGH_RISK';
  dailyEstimatedDemand: string;
  avgSellingPrice: string;
  keyTargetCustomers: string[];
  unmetNeedReason: { mr: string; hi: string; en: string };
  validationChecklist: string[];
  risks: string[];
  suggestedPriceRange?: { min: number; max: number; unit: string };
  estimatedStartupRequirement?: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'PRELIMINARY';
  evidence: string[];
  firstValidationStep: string;
  trustLevel: DataTrustLevel;
  confidenceScore: number;
}

export interface CompetitorListing {
  id: string;
  name: string;
  category: string;
  location: string;
  distanceKm: number;
  competitionLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedDailyVolume: string;
  pricePosition: string;
  priceRange?: { min: number; max: number };
  knownGaps: string[];
  verified: boolean;
  confidence: number;
  trustLevel: DataTrustLevel;
}

export interface MarketGapAnalysisResult {
  context: MarketContext;
  businessSummary: string;
  locationSummary: string;
  scoreBreakdown: ScoreBreakdown;
  opportunities: MarketGapItem[];
  competitors: CompetitorListing[];
  marketSignals: {
    estimatedReachableCustomers: string;
    unmetDemandSignal: string;
    competitorDensity: string;
    priceEnvironment: string;
  };
  risks: string[];
  firstActionItem: string;
  dataSources: DataSourceProvenance[];
  isPreliminary: boolean;
  generatedAt: number;
}
