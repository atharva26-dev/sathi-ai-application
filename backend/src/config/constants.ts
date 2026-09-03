// ==============================================================================
// SAATHI Backend Constants & Domain Enums
// ==============================================================================

export const SUPPORTED_LANGUAGES = [
  'as',
  'bn',
  'brx',
  'doi',
  'en',
  'gu',
  'hi',
  'kn',
  'ks',
  'kok',
  'mai',
  'ml',
  'mni',
  'mr',
  'ne',
  'or',
  'pa',
  'sa',
  'sat',
  'sd',
  'ta',
  'te',
  'ur'
] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DATA_TRUST_LEVELS = [
  'FACT',
  'USER_INPUT',
  'CALCULATED',
  'AI_ESTIMATE',
  'AI_HYPOTHESIS',
  'OFFICIAL_VERIFICATION',
  'UNKNOWN'
] as const;
export type DataTrustLevel = (typeof DATA_TRUST_LEVELS)[number];

export const BUSINESS_STAGES = [
  'IDEA',
  'PLANNING',
  'EARLY_STAGE',
  'OPERATING',
  'SCALING',
  'PAUSED'
] as const;
export type BusinessStage = (typeof BUSINESS_STAGES)[number];

export const SCHEME_SUITABILITY = [
  'potentially_eligible',
  'needs_information',
  'not_eligible',
  'requires_official_verification'
] as const;
export type SchemeSuitability = (typeof SCHEME_SUITABILITY)[number];

export const TASK_TIMEFRAMES = [
  'TODAY',
  'THIS_WEEK',
  'THIS_MONTH',
  'NEXT_90_DAYS'
] as const;
export type TaskTimeframe = (typeof TASK_TIMEFRAMES)[number];

export const TASK_STATUSES = [
  'pending',
  'in_progress',
  'completed',
  'skipped'
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

// PS-91 Stated Margin & Structuring Rule Defaults
export const PS91_CONFIG = {
  DEFAULT_MARGIN_PERCENT: 10.0, // 10% own equity
  MICRO_FINANCE_THRESHOLD: 140000.0, // ₹1.40 Lakh
  MICRO_FINANCE_MAX_FUNDING: 125000.0, // ₹1.25 Lakh
  MICRO_FINANCE_INTEREST_RATE: 6.5, // 6.5% p.a.
  MICRO_FINANCE_TENURE_YEARS: 3, // 3 Years
  MICRO_FINANCE_MORATORIUM_MONTHS: 3, // 3 Months

  TERM_LOAN_MAX_PROJECT_COST: 5000000.0, // ₹50.00 Lakh
  TERM_LOAN_MAX_FUNDING: 4500000.0, // ₹45.00 Lakh
  TERM_LOAN_INTEREST_RATE: 8.0, // 8.0% p.a.
  TERM_LOAN_TENURE_YEARS: 7, // 7 Years
  TERM_LOAN_MORATORIUM_MONTHS: 6, // 6 Months

  PMEGP_RURAL_SUBSIDY_RATE: 0.35 // 35% for rural special category
};

// Safe defaults for working capital buffer calculation
export const WORKING_CAPITAL_CONFIG = {
  RAW_MATERIAL_BUFFER_DAYS: 15,
  PAYROLL_BUFFER_DAYS: 30,
  EMERGENCY_RESERVE_PERCENT: 7.5 // % of project cost
};
