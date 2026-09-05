import { describe, it, expect } from '@jest/globals';
import { routeSchemeByProjectCost } from '../src/domain/finance/schemeRouter';

describe('PS-91 Configurable Scheme Router & Boundary Conditions', () => {
  it('should route project cost ₹1,00,000 to MICRO_FINANCE at 6.5% interest and 3 years tenure', () => {
    const res = routeSchemeByProjectCost(100000);
    expect(res.category).toBe('MICRO_FINANCE');
    expect(res.interestRate).toBe(6.5);
    expect(res.tenureYears).toBe(3);
    expect(res.moratoriumMonths).toBe(3);
    expect(res.maxAgencyFunding).toBe(125000);
    expect(res.isEligibleUnderCap).toBe(true);
  });

  it('should route exact boundary ₹1,40,000 (₹1.40 Lakh) to MICRO_FINANCE', () => {
    const res = routeSchemeByProjectCost(140000);
    expect(res.category).toBe('MICRO_FINANCE');
    expect(res.interestRate).toBe(6.5);
    expect(res.maxAgencyFunding).toBe(125000);
    expect(res.recommendedFunding).toBe(125000); // 90% of 140k = 126k, capped at 125k
  });

  it('should route boundary ₹1,40,001 (₹1.40 Lakh + ₹1) to TERM_LOAN at 8.0% interest and 7 years tenure', () => {
    const res = routeSchemeByProjectCost(140001);
    expect(res.category).toBe('TERM_LOAN');
    expect(res.interestRate).toBe(8.0);
    expect(res.tenureYears).toBe(7);
    expect(res.moratoriumMonths).toBe(6);
    expect(res.maxAgencyFunding).toBe(4500000);
  });

  it('should route project cost ₹10,00,000 to TERM_LOAN', () => {
    const res = routeSchemeByProjectCost(1000000);
    expect(res.category).toBe('TERM_LOAN');
    expect(res.interestRate).toBe(8.0);
    expect(res.recommendedFunding).toBe(900000);
    expect(res.ownContributionRequired).toBe(100000);
  });

  it('should route exact boundary ₹50,00,000 (₹50 Lakh) to TERM_LOAN', () => {
    const res = routeSchemeByProjectCost(5000000);
    expect(res.category).toBe('TERM_LOAN');
    expect(res.maxAgencyFunding).toBe(4500000);
    expect(res.recommendedFunding).toBe(4500000);
    expect(res.ownContributionRequired).toBe(500000);
  });

  it('should route boundary ₹50,00,001 (₹50 Lakh + ₹1) to LARGE_ENTERPRISE_SPECIAL_APPRAISAL', () => {
    const res = routeSchemeByProjectCost(5000001);
    expect(res.category).toBe('LARGE_ENTERPRISE_SPECIAL_APPRAISAL');
    expect(res.isEligibleUnderCap).toBe(false);
    expect(res.notes).toContain('कन्सोर्टियम');
  });

  it('should throw error for non-positive project costs', () => {
    expect(() => routeSchemeByProjectCost(0)).toThrow('Project cost must be greater than zero.');
    expect(() => routeSchemeByProjectCost(-100)).toThrow('Project cost must be greater than zero.');
  });
});
