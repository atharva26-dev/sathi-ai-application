import { round2, safeDiv } from '../../utils/money.js';

export interface CashFlowScenario {
  scenarioName: 'BASE_CASE' | 'OPTIMISTIC_CASE' | 'STRESS_CASE';
  unitsSoldPerDay: number;
  monthlyVolume: number;
  sellingPricePerUnit: number;
  monthlyRevenue: number;
  monthlyRawMaterialCost: number;
  monthlyOperatingOverhead: number;
  monthlyLoanEMI: number;
  totalMonthlyExpenses: number;
  netMonthlySurplus: number;
  operatingMarginPercent: number;
  debtServiceCoverageRatio: number; // DSCR = (Net Surplus + EMI) / EMI
  isCashPositive: boolean;
}

export interface CashFlowProjectionResult {
  baseCase: CashFlowScenario;
  optimisticCase: CashFlowScenario;
  stressCase: CashFlowScenario;
}

/**
 * Deterministic Multi-Scenario Cash-Flow Projection Engine
 */
export const calculateCashFlowProjections = (
  dailyUnits: number,
  sellingPricePerUnit: number,
  rawMaterialCostPerUnit: number,
  monthlyLabor: number,
  monthlyRentPower: number,
  monthlyTransport: number,
  monthlyOtherFixed: number,
  monthlyLoanEMI: number,
  operatingDays = 30
): CashFlowProjectionResult => {
  const fixedOverhead = round2(
    monthlyLabor + monthlyRentPower + monthlyTransport + monthlyOtherFixed
  );

  const buildScenario = (
    name: 'BASE_CASE' | 'OPTIMISTIC_CASE' | 'STRESS_CASE',
    volumeMultiplier: number,
    rawMaterialMultiplier: number,
    priceMultiplier = 1.0
  ): CashFlowScenario => {
    const unitsPerDay = Math.round(dailyUnits * volumeMultiplier);
    const monthlyVolume = unitsPerDay * operatingDays;
    const price = round2(sellingPricePerUnit * priceMultiplier);
    const rawCost = round2(rawMaterialCostPerUnit * rawMaterialMultiplier);

    const monthlyRevenue = round2(monthlyVolume * price);
    const monthlyRawMaterialCost = round2(monthlyVolume * rawCost);
    const totalMonthlyExpenses = round2(
      monthlyRawMaterialCost + fixedOverhead + monthlyLoanEMI
    );
    const netMonthlySurplus = round2(monthlyRevenue - totalMonthlyExpenses);

    const operatingMarginPercent = round2(
      safeDiv(netMonthlySurplus, monthlyRevenue) * 100
    );

    // DSCR = (Net Surplus + Loan EMI) / Loan EMI
    let debtServiceCoverageRatio = 0;
    if (monthlyLoanEMI > 0) {
      debtServiceCoverageRatio = round2(
        safeDiv(netMonthlySurplus + monthlyLoanEMI, monthlyLoanEMI)
      );
    } else {
      debtServiceCoverageRatio = 99.0; // debt free
    }

    return {
      scenarioName: name,
      unitsSoldPerDay: unitsPerDay,
      monthlyVolume,
      sellingPricePerUnit: price,
      monthlyRevenue,
      monthlyRawMaterialCost,
      monthlyOperatingOverhead: fixedOverhead,
      monthlyLoanEMI: round2(monthlyLoanEMI),
      totalMonthlyExpenses,
      netMonthlySurplus,
      operatingMarginPercent,
      debtServiceCoverageRatio,
      isCashPositive: netMonthlySurplus > 0
    };
  };

  return {
    baseCase: buildScenario('BASE_CASE', 1.0, 1.0, 1.0),
    optimisticCase: buildScenario('OPTIMISTIC_CASE', 1.25, 0.98, 1.02), // +25% volume, -2% raw cost, +2% price
    stressCase: buildScenario('STRESS_CASE', 0.70, 1.15, 0.98) // -30% volume, +15% raw cost, -2% price
  };
};
