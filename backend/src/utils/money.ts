// ==============================================================================
// SAATHI Financial Mathematics & Decimal-Safe Currency Utilities
// ==============================================================================

/**
 * Converts a rupee amount to integer paise to eliminate floating-point imprecision.
 * Example: ₹100.50 -> 10050 paise
 */
export const toPaise = (rupees: number): number => {
  if (isNaN(rupees) || !isFinite(rupees)) return 0;
  return Math.round(rupees * 100);
};

/**
 * Converts integer paise back to rupee float with exact 2 decimal precision.
 * Example: 10050 paise -> 100.50
 */
export const fromPaise = (paise: number): number => {
  if (isNaN(paise) || !isFinite(paise)) return 0;
  return Math.round(paise) / 100;
};

/**
 * Deterministically rounds a financial number to 2 decimal places.
 */
export const round2 = (val: number): number => {
  if (isNaN(val) || !isFinite(val)) return 0;
  return Math.round((val + Number.EPSILON) * 100) / 100;
};

/**
 * Deterministically rounds a financial percentage to 4 decimal places (for interest rates).
 */
export const round4 = (val: number): number => {
  if (isNaN(val) || !isFinite(val)) return 0;
  return Math.round((val + Number.EPSILON) * 10000) / 10000;
};

/**
 * Safe division preventing division-by-zero crashes.
 */
export const safeDiv = (numerator: number, denominator: number, fallback = 0): number => {
  if (denominator === 0 || isNaN(denominator) || isNaN(numerator) || !isFinite(denominator)) {
    return fallback;
  }
  return numerator / denominator;
};

/**
 * Calculates a percentage of an amount in integer paise.
 */
export const calculatePercentageOf = (amountRupees: number, percentage: number): number => {
  const amountPaise = toPaise(amountRupees);
  const resultPaise = Math.round((amountPaise * percentage) / 100);
  return fromPaise(resultPaise);
};

/**
 * Formats a numeric rupee amount to Indian numbering system (e.g. ₹10,00,000).
 */
export const formatIndianRupees = (amount: number): string => {
  const rounded = Math.round(amount);
  return `₹${rounded.toLocaleString('en-IN')}`;
};
