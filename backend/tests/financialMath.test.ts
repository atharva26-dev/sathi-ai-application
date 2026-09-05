import { describe, it, expect } from '@jest/globals';
import { calculateProjectCostStructure } from '../src/domain/finance/projectCostCalculator';
import { calculateRepaymentSchedule } from '../src/domain/finance/emiCalculator';
import { calculateBreakEven } from '../src/domain/finance/breakEvenCalculator';
import { calculateCashFlowProjections } from '../src/domain/finance/cashFlowEngine';
import { calculateWorkingCapitalRequirements } from '../src/domain/finance/workingCapitalCalculator';
import { runBusinessStressTest } from '../src/domain/finance/stressTestEngine';

describe('Deterministic Financial Mathematics Engine (Zero-LLM Math)', () => {
  describe('PS-91 Project Cost Waterfall Calculator', () => {
    it('should correctly structure ₹1,00,000 capital into ₹10,00,000 project and ₹9,00,000 loan', () => {
      const res = calculateProjectCostStructure(100000, 10, 0.35);
      expect(res.ownCapital).toBe(100000);
      expect(res.projectCost).toBe(1000000);
      expect(res.loanComponent).toBe(900000);
      expect(res.estimatedSubsidy).toBe(350000);
      expect(res.netLoanAfterSubsidy).toBe(550000);
      expect(res.isPS91Model).toBe(true);
      expect(res.vernacularSummary.mr).toContain('₹10,00,000');
    });

    it('should correctly structure small ₹10,000 micro-capital into ₹1,00,000 project', () => {
      const res = calculateProjectCostStructure(10000, 10, 0.35);
      expect(res.ownCapital).toBe(10000);
      expect(res.projectCost).toBe(100000);
      expect(res.loanComponent).toBe(90000);
      expect(res.estimatedSubsidy).toBe(35000);
    });

    it('should throw error for zero or negative capital', () => {
      expect(() => calculateProjectCostStructure(0)).toThrow('Available capital must be greater than zero.');
      expect(() => calculateProjectCostStructure(-5000)).toThrow('Available capital must be greater than zero.');
    });
  });

  describe('Reducing Balance EMI & Amortization Engine', () => {
    it('should compute exact reducing balance EMI for ₹9,00,000 at 9.5% for 60 months with 6 months moratorium', () => {
      const res = calculateRepaymentSchedule(900000, 9.5, 60, 6);
      expect(res.loanAmount).toBe(900000);
      expect(res.tenureMonths).toBe(60);
      expect(res.moratoriumMonths).toBe(6);
      expect(res.activeRepaymentMonths).toBe(54);
      expect(res.moratoriumMonthlyPayment).toBe(7125); // 900000 * (9.5/12/100) = 7125
      expect(res.regularMonthlyEMI).toBeGreaterThan(20000);
      expect(res.schedule.length).toBe(60);

      // Verify the first 6 months are interest-only moratorium payments
      for (let i = 0; i < 6; i++) {
        expect(res.schedule[i].isMoratorium).toBe(true);
        expect(res.schedule[i].principal).toBe(0);
        expect(res.schedule[i].interest).toBe(7125);
        expect(res.schedule[i].closingBalance).toBe(900000);
      }

      // Verify final month balance reaches zero
      expect(res.schedule[59].closingBalance).toBe(0);

      // Verify sum of principal payments equals exact original loan amount
      const totalPrincipalRepaid = res.schedule.reduce((sum, row) => sum + row.principal, 0);
      expect(Math.round(totalPrincipalRepaid)).toBe(900000);
    });

    it('should throw error for invalid tenure or moratorium equal to tenure', () => {
      expect(() => calculateRepaymentSchedule(50000, 10, 0)).toThrow();
      expect(() => calculateRepaymentSchedule(50000, 10, 12, 12)).toThrow();
    });
  });

  describe('Break-Even Engine', () => {
    it('should calculate break-even units and revenue correctly', () => {
      // Selling price ₹320/kg, variable cost ₹245/kg -> contribution ₹75/kg. Fixed costs ₹30,000/month
      const res = calculateBreakEven(30000, 245, 320, 30);
      expect(res.isViable).toBe(true);
      expect(res.contributionMarginPerUnit).toBe(75);
      expect(res.breakEvenUnitsPerMonth).toBe(400); // 30000 / 75 = 400
      expect(res.breakEvenUnitsPerDay).toBe(14); // 400 / 30 = 13.33 -> 14
      expect(res.breakEvenRevenuePerMonth).toBe(128000); // 400 * 320
    });

    it('should handle zero or negative contribution margin safely without crashing', () => {
      // Selling price ₹200/kg, variable cost ₹250/kg -> negative margin
      const res = calculateBreakEven(30000, 250, 200);
      expect(res.isViable).toBe(false);
      expect(res.contributionMarginPerUnit).toBe(-50);
      expect(res.breakEvenUnitsPerMonth).toBe(0);
      expect(res.notes).toContain('तोट्यात');
    });
  });

  describe('Working Capital Buffer Engine', () => {
    it('should calculate 15-day raw material reserve and liquidity gap', () => {
      // 25 kg/day * ₹180 raw milk * 15 days = ₹67,500 raw buffer
      const res = calculateWorkingCapitalRequirements(25, 180, 15000, 10000, 100000, 15);
      expect(res.rawMaterialBufferCost).toBe(67500);
      expect(res.monthlyOperatingCosts).toBe(25000);
      expect(res.totalRequiredWorkingCapital).toBeGreaterThan(100000);
      expect(res.hasLiquidityGap).toBe(true);
    });
  });

  describe('Cash Flow & Stress Test Engines', () => {
    it('should calculate 3-scenario cash flow with DSCR', () => {
      const res = calculateCashFlowProjections(25, 320, 245, 15000, 8000, 6000, 3000, 19000);
      expect(res.baseCase.isCashPositive).toBe(true);
      expect(res.baseCase.debtServiceCoverageRatio).toBeGreaterThan(1.0);
      expect(res.optimisticCase.monthlyRevenue).toBeGreaterThan(res.baseCase.monthlyRevenue);
    });

    it('should evaluate 4 stress scenarios and compute survival runway', () => {
      const res = runBusinessStressTest(25, 320, 245, 32000, 75000);
      expect(res.scenarios.length).toBe(4);
      expect(res.overallResilienceScore).toBeGreaterThanOrEqual(60);
      expect(res.resilienceRating).toBeDefined();
    });
  });
});
