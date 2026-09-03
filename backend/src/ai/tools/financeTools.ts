import { calculateProjectCostStructure } from '../../domain/finance/projectCostCalculator.js';
import { calculateRepaymentSchedule } from '../../domain/finance/emiCalculator.js';
import { calculateBreakEven } from '../../domain/finance/breakEvenCalculator.js';
import { calculateCashFlowProjections } from '../../domain/finance/cashFlowEngine.js';
import { runBusinessStressTest } from '../../domain/finance/stressTestEngine.js';
import { calculateWorkingCapitalRequirements } from '../../domain/finance/workingCapitalCalculator.js';

export const financeTools = {
  calculate_project_cost: (args: { capital: number; marginPercent?: number }) => {
    return calculateProjectCostStructure(args.capital, args.marginPercent);
  },

  calculate_emi: (args: {
    loanAmount: number;
    interestRate: number;
    tenureMonths: number;
    moratoriumMonths?: number;
  }) => {
    return calculateRepaymentSchedule(
      args.loanAmount,
      args.interestRate,
      args.tenureMonths,
      args.moratoriumMonths || 0
    );
  },

  calculate_break_even: (args: {
    fixedCosts: number;
    variableCostPerUnit: number;
    sellingPrice: number;
  }) => {
    return calculateBreakEven(args.fixedCosts, args.variableCostPerUnit, args.sellingPrice);
  },

  calculate_cash_flow: (args: {
    dailyUnits: number;
    sellingPrice: number;
    rawMaterialCost: number;
    monthlyLabor: number;
    monthlyRentPower: number;
    monthlyTransport: number;
    monthlyOtherFixed: number;
    monthlyLoanEMI: number;
  }) => {
    return calculateCashFlowProjections(
      args.dailyUnits,
      args.sellingPrice,
      args.rawMaterialCost,
      args.monthlyLabor,
      args.monthlyRentPower,
      args.monthlyTransport,
      args.monthlyOtherFixed,
      args.monthlyLoanEMI
    );
  },

  run_stress_test: (args: {
    dailyUnits: number;
    sellingPrice: number;
    rawMaterialCost: number;
    monthlyFixedCosts: number;
  }) => {
    return runBusinessStressTest(
      args.dailyUnits,
      args.sellingPrice,
      args.rawMaterialCost,
      args.monthlyFixedCosts
    );
  },

  calculate_working_capital: (args: {
    unitsPerDay: number;
    rawMaterialCostPerUnit: number;
    monthlySalaries: number;
    monthlyUtilitiesAndTransport: number;
    availableCapital?: number;
  }) => {
    return calculateWorkingCapitalRequirements(
      args.unitsPerDay,
      args.rawMaterialCostPerUnit,
      args.monthlySalaries,
      args.monthlyUtilitiesAndTransport,
      args.availableCapital || 100000
    );
  }
};
