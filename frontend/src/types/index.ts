export type LanguageCode = 'mr' | 'hi' | 'en';

export type TrustLevel = 'VERIFIED' | 'USER_INPUT' | 'CALCULATED' | 'AI_ESTIMATE';

export interface DataTrustInfo {
  level: TrustLevel;
  sourceText?: string;
  confidenceScore?: number; // 0 to 100
  assumptions?: string[];
  evidence?: string[];
  lastUpdated?: string;
}

export interface LiveAreaContext {
  occupation?: string;
  villageName?: string;
  competitorCount: number;
  localObstacles: string;
  dynamicAnswers: Array<{
    questionId: string;
    question: string;
    answer: string;
  }>;
  collectedAt: string;
}

export interface LocationDetails {
  country: string;
  state_id: number | string;
  state_name: string;
  district_id: number | string;
  district_name: string;
  subdistrict_id: number | string;
  subdistrict_name: string;
  subdistrict_label: string; // "Taluka", "Tehsil", "Mandal", "Taluk", "Block"
  village_id: number | string;
  village_name: string;
  lgd_code?: number;
  census_code?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  source?: string;
  source_date?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age?: number;
  mobile?: string;
  pin?: string;
  village: string;
  block: string;
  district: string;
  state: string;
  pincode?: string;
  locationDetails?: LocationDetails;
  ownCapital: number; // in INR
  desiredBusiness?: string;
  adviceNeeded?: string;
  experienceYears?: number;
  skills: string[];
  availableAssets: string[]; // Land, Shop, Borewell, Vehicle, Cattle shed, etc.
  existingBusiness?: string;
  businessGoals?: string;
  riskAppetite?: 'CONSERVATIVE' | 'MODERATE' | 'GROWTH';
  preferredLanguage: LanguageCode;
  isOnboarded: boolean;
  isDemo: boolean;
}

export interface BusinessOpportunity {
  id: string;
  title: string;
  titleNative: { [key in LanguageCode]?: string };
  category: string;
  opportunityScore: number; // 0 to 100
  capitalFit: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'HIGH_GAP';
  demandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  competitionLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  minCapital: number;
  typicalProjectCost: number;
  paybackMonths: number;
  estimatedMonthlySurplus: number;
  whyRecommended: { [key in LanguageCode]?: string };
  keyAssetsNeeded: string[];
  trustInfo: DataTrustInfo;
  dataGranularity?: 'Village' | 'Taluka' | 'District' | 'State';
  confidenceLevel?: 'HIGH' | 'MEDIUM' | 'LOW';
  evidencePackage?: Array<{
    datasetName: string;
    sourceUrl: string;
    dataYear: string | number;
    signalType: string;
    finding: string;
  }>;
  competitionAnalysis?: {
    registeredEnterprises: number;
    statement: string;
    competitionLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  scoreBreakdownDetails?: {
    demandScore: number;
    competitionSupplyGapScore: number;
    localResourcesScore: number;
    valueAdditionScore: number;
    userAffordabilityScore: number;
    skillCompatibilityScore: number;
    infrastructureAccessScore: number;
    financeSchemeScore: number;
    totalScore: number;
  };
  majorRisksList?: { [key in LanguageCode]?: string[] };
  first3ActionsList?: { [key in LanguageCode]?: string[] };
  recommendedStartingModelText?: { [key in LanguageCode]?: string };
  skillCompatibilityText?: { [key in LanguageCode]?: string };
  isOfflineCached?: boolean;
  cachedAt?: string;
}

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
  demand: number; // 25%
  competition: number; // 20% (Lower is better)
  capitalFit: number; // 15%
  accessibility: number; // 10%
  marginPotential: number; // 10%
  customerPain: number; // 10%
  supplyGap: number; // 5%
  riskPenalty: number; // 5%
  overallOpportunity: number; // 0 to 100
  ratingLabel: { [key in LanguageCode]?: string };
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'PRELIMINARY';
  explanationPoints?: { [key in LanguageCode]?: string[] };
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
  language: LanguageCode;
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
  nameNative: { [key in LanguageCode]?: string };
  icon: string;
  demandScore: number; // 0 to 100 (Y-axis)
  competitionScore: number; // 0 to 100 (X-axis)
  opportunityQuadrant: 'HIGH_OPPORTUNITY' | 'COMPETITIVE' | 'NICHE' | 'HIGH_RISK';
  dailyEstimatedDemand: string;
  avgSellingPrice: string;
  keyTargetCustomers: string[];
  unmetNeedReason: { [key in LanguageCode]?: string };
  validationChecklist: string[];
  risks: string[];
  suggestedPriceRange?: { min: number; max: number; unit: string };
  estimatedStartupRequirement?: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'PRELIMINARY';
  evidence: string[];
  firstValidationStep: string;
  trustInfo: DataTrustInfo;
}

export interface CompetitorItem {
  id: string;
  name: string;
  category: string;
  location: string;
  distanceKm: number;
  competitionLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedDailyVolume: string;
  pricePosition: string;
  knownGaps: string[];
  trustInfo: DataTrustInfo;
}

export interface MarketGapAnalysisResult {
  context: MarketContext;
  businessSummary: string;
  locationSummary: string;
  scoreBreakdown: ScoreBreakdown;
  opportunities: MarketGapItem[];
  competitors: CompetitorItem[];
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

export interface SWOTItem {
  text: string;
  simpleExplanation: string;
  audioVoiceText?: string;
}

export interface FeasibilityReport {
  overallScore: number; // e.g. 78/100
  marketDemandScore: number;
  capitalFitScore: number;
  competitionScore: number;
  complexityScore: number;
  riskScore: number;
  growthScore: number;
  swot: {
    strengths: SWOTItem[];
    weaknesses: SWOTItem[];
    opportunities: SWOTItem[];
    threats: SWOTItem[];
  };
  disclaimerText: string;
  trustInfo: DataTrustInfo;
}

export interface StressScenario {
  id: string;
  type: 'NORMAL' | 'GOOD' | 'DIFFICULT' | 'CRITICAL';
  title: { [key in LanguageCode]?: string };
  salesChangePercent: number; // e.g. -30
  costChangePercent: number; // e.g. +15
  estimatedMonthlySurplus: number;
  breakEvenDays: number;
  survivalRunwayMonths: number;
  description: { [key in LanguageCode]?: string };
  mitigationSteps: string[];
  riskAlert?: string;
}

export interface SimulatorInputs {
  unitsPerDay: number;
  sellingPricePerUnit: number;
  rawMaterialCostPerUnit: number;
  monthlyLaborCost: number;
  monthlyTransportCost: number;
  monthlyRentAndPower: number;
  otherFixedCost: number;
}

export interface SimulatorOutputs {
  monthlyRevenue: number;
  monthlyRawMaterialCost: number;
  monthlyOperatingExpenses: number;
  totalMonthlyCosts: number;
  netMonthlySurplus: number;
  breakEvenUnitsPerDay: number;
  breakEvenDaysPerMonth: number;
  suggestedWorkingCapital: number;
  marginPercent: number;
}

export interface FinancialPlan {
  ownCapital: number;
  projectCost: number;
  loanComponent: number;
  marginPercent: number;
  loanPercent: number;
  subsidyEstimate: number;
  isPS91Applicable: boolean;
  preliminaryNotice: string;
  trustInfo: DataTrustInfo;
}

export interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  description: string;
  isEssential: boolean;
}

export interface SchemeInfo {
  id: string;
  name: string;
  nameNative: { [key in LanguageCode]?: string };
  sponsoringAgency: string;
  maxProjectCost: number;
  subsidyPercent: number; // e.g. 35% for rural PMEGP
  interestRateRange: string;
  tenureYears: number;
  moratoriumMonths: number;
  suitability: 'SUITABLE' | 'NEEDS_VERIFICATION' | 'NOT_SUITABLE';
  whySuitable: string;
  eligibilityConditions: string[];
  requiredDocuments: string[];
  nodalContact: string;
  trustInfo: DataTrustInfo;
}

export interface RepaymentScheduleRow {
  month: number;
  openingBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  closingBalance: number;
}

export interface RepaymentAnalysis {
  loanAmount: number;
  annualInterestRate: number;
  tenureMonths: number;
  moratoriumMonths: number;
  monthlyEMI: number;
  totalInterestPayable: number;
  totalPayment: number;
  affordabilityStatus: 'EASY' | 'MANAGEABLE' | 'TIGHT' | 'RISKY';
  simpleExplanation: string;
  schedule: RepaymentScheduleRow[];
}

export interface WorkingCapitalPlan {
  rawMaterialsBufferDays: number;
  rawMaterialsBufferCost: number;
  monthlySalaries: number;
  utilitiesAndLogistics: number;
  emergencyBuffer: number;
  totalRequiredWorkingCapital: number;
  availableWorkingCapital: number;
  capitalGap: number;
  recommendation: string;
}

export interface MarketingChannelItem {
  id: string;
  title: string;
  iconName: string;
  suitability: 'BEST' | 'GOOD' | 'NOT_RECOMMENDED';
  whyRecommended: string;
  practicalSteps: string[];
  targetAudience: string;
  costEstimate: string;
}

export interface PricingAnalysis {
  costPerUnit: number;
  competitorPriceRange: { min: number; max: number };
  suggestedPriceFloor: number;
  suggestedPriceCeiling: number;
  recommendedPrice: number;
  marginAtRecommended: number;
  affordabilityLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  simpleTip: string;
}

export interface ExpansionPhase {
  id: string;
  timeframe: 'NOW' | '3_MONTHS' | '6_MONTHS' | '1_YEAR' | '3_YEARS';
  timeframeLabel: string;
  revenueMilestone: string;
  keyTarget: string;
  reinvestmentPlan: string;
  capacityAddition: string;
  mustNotExpandUntil: string[];
}

export interface MentorTask {
  id: string;
  timeframe: 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'NEXT_90_DAYS';
  title: string;
  description: string;
  category: 'MARKET' | 'SUPPLIER' | 'FINANCE' | 'DOCUMENT' | 'OPERATION';
  isCompleted: boolean;
  completedAt?: string;
  userNotes?: string;
  voiceActionPrompt?: string;
}

export interface StructuredCardPayload {
  type: string;
  title: string;
  subtitle?: string;
  data?: any;
  actionText?: string;
  actionRoute?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'saathi' | 'system';
  text: string;
  voiceSpokenText?: string;
  timestamp: number;
  audioAvailable?: boolean;
  cards?: StructuredCardPayload[];
  isVoiceInput?: boolean;
}

// ============================================================================
// SAATHI LOCAL MARKET INTELLIGENCE TYPES
// ============================================================================

export type DemandLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
export type CompetitionLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
export type OpportunityStatus = 'HIGH_OPPORTUNITY' | 'GOOD_OPPORTUNITY' | 'NEEDS_CHECKING' | 'HIGH_RISK';
export type VisualSignal = '🔥' | '🟢' | '🟡' | '🔴' | '📈' | '➡️' | '📉' | '❓';

export interface WhatSellsItem {
  id: string;
  name: string;
  nameNative: { mr: string; hi: string; en: string };
  category: string;
  visualSignal: VisualSignal;
  demandLevel: DemandLevel;
  competitionLevel: CompetitionLevel;
  observedOrEstimatedPrice: string;
  opportunityStatus: OpportunityStatus;
  opportunityScore: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  rankingReasonTag: string;
  rankingReasonText: { mr: string; hi: string; en: string };
  whyItMatters: { mr: string; hi: string; en: string };
  capitalRequiredEstimate: number;
}

export interface PriceWatchItem {
  commodityOrService: string;
  marketOrApmcName: string;
  minPrice: string;
  modalPrice: string;
  maxPrice: string;
  unit: string;
  priceTrend: 'RISING' | 'STABLE' | 'SEASONAL_LOW';
  trendSignal: '📈' | '➡️' | '📉';
  recordDate: string;
  source: string;
  geographicLevel: 'VILLAGE' | 'TALUKA' | 'DISTRICT' | 'STATE';
}

export interface CompetitionOverview {
  formalRegisteredCount: number;
  sectorName: string;
  informalEstimatedCount: number;
  statement: string;
  intensityRating: CompetitionLevel;
  adviceOnDifferentiation: { mr: string; hi: string; en: string };
}

export interface LocalResourcesOverview {
  odopSpecialization?: {
    productName: string;
    rationale: string;
    isGiTagged: boolean;
  };
  dominantCrops: Array<{ crop: string; annualProductionTonnes: number; season: string }>;
  industrialClusters: string[];
  traditionalCrafts: string[];
}

export interface CustomerSegmentItem {
  segment: string;
  segmentNative: { mr: string; hi: string; en: string };
  purchasingHabit: string;
  paymentMode: 'CASH' | 'UDHAARI_RISK' | 'DIGITAL_UPI' | 'CONTRACT';
  keyNeed: string;
}

export interface SeasonalOpportunityItem {
  period: string;
  opportunity: string;
  reason: string;
  preparationLeadTime: string;
}

export interface BusinessOpportunityItem {
  id: string;
  title: string;
  titleNative: { mr: string; hi: string; en: string };
  score: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  capitalRequired: string;
  paybackPeriod: string;
  marketGapType: string;
  actionPlanStep1: string;
}

export interface DeepMarketAnalysis {
  whatIsSelling: string;
  whyIsItSelling: string;
  whoIsBuying: string;
  whereAreTheyBuying: string;
  whoIsCurrentlyServingThem: string;
  whatAreTheyPaying: string;
  whatIsMissing: string;
  whatCanBeProducedLocally: string;
  whatCanBeProcessedLocally: string;
  whatCanBeSoldToNearbyTowns: string;
  whatBusinessCouldServeThisGap: string;
  whatCapitalIsRequired: string;
  whatCouldGoWrong: string;
}

export interface LocalMarketIntelligence {
  location: {
    village: string;
    taluka: string;
    district: string;
    state: string;
    pincode?: string;
    resolvedGranularity: 'Village' | 'Taluka' | 'District' | 'State';
    granularityNotice: { mr: string; hi: string; en: string };
  };
  userBusinessCategory: string;
  availableCapital: number;
  dataFreshness: {
    lastUpdatedDate: string;
    sources: string[];
    isLive: boolean;
  };
  whatSellsMore: WhatSellsItem[];
  marketGaps: Array<{
    title: string;
    gapType: string;
    description: string;
    unmetNeedScore: number;
  }>;
  priceWatch: PriceWatchItem[];
  competition: CompetitionOverview;
  localResources: LocalResourcesOverview;
  customerSegments: CustomerSegmentItem[];
  seasonalOpportunities: SeasonalOpportunityItem[];
  businessOpportunities: BusinessOpportunityItem[];
  risks: Array<{
    risk: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    mitigation: string;
  }>;
  validationChecklist: Array<{
    stepNumber: number;
    action: string;
    whatToLookFor: string;
  }>;
  deepAnalysis: DeepMarketAnalysis;
  overallOpportunityScore: number;
  overallConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface LocalValidationLog {
  id: string;
  businessCategory: string;
  location: string;
  date: string;
  foundLocally: boolean;
  observedPrice: string;
  competitorsSeenCount: number;
  customerInterest: 'HIGH' | 'MEDIUM' | 'NONE';
  madeTrialSale: boolean;
  notes?: string;
}
