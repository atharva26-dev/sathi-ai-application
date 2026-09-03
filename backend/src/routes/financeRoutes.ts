import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { financeService } from '../services/financeService.js';
import { sendSuccess } from '../utils/response.js';

export const financeRoutes = Router();

// 1. Structure Project (PS-91 Model)
const structureSchema = z.object({
  availableCapital: z.number().positive('Available capital must be greater than zero.'),
  marginPercent: z.number().min(5).max(50).default(10),
  subsidyRate: z.number().min(0).max(1).default(0.35)
});

financeRoutes.post(
  '/finance/structure-project',
  validate({ body: structureSchema }),
  (req: Request, res: Response) => {
    const { availableCapital, marginPercent, subsidyRate } = req.body;
    const result = financeService.structureProject(availableCapital, marginPercent, subsidyRate);
    sendSuccess(res, result, 200, req.id);
  }
);

// 2. EMI & Amortization Schedule
const emiSchema = z.object({
  loanAmount: z.number().positive('Loan amount must be positive.'),
  annualInterestRate: z.number().nonnegative().default(9.5),
  tenureMonths: z.number().int().positive().default(60),
  moratoriumMonths: z.number().int().nonnegative().default(6)
});

financeRoutes.post(
  '/finance/emi',
  validate({ body: emiSchema }),
  (req: Request, res: Response) => {
    const { loanAmount, annualInterestRate, tenureMonths, moratoriumMonths } = req.body;
    const result = financeService.calculateEmi(
      loanAmount,
      annualInterestRate,
      tenureMonths,
      moratoriumMonths
    );
    sendSuccess(res, result, 200, req.id);
  }
);

// 3. Break-Even Analysis
const breakEvenSchema = z.object({
  monthlyFixedCosts: z.number().nonnegative(),
  variableCostPerUnit: z.number().nonnegative(),
  sellingPricePerUnit: z.number().nonnegative()
});

financeRoutes.post(
  '/finance/break-even',
  validate({ body: breakEvenSchema }),
  (req: Request, res: Response) => {
    const { monthlyFixedCosts, variableCostPerUnit, sellingPricePerUnit } = req.body;
    const result = financeService.calculateBreakEven(
      monthlyFixedCosts,
      variableCostPerUnit,
      sellingPricePerUnit
    );
    sendSuccess(res, result, 200, req.id);
  }
);

// 4. Cash Flow Projections
const cashFlowSchema = z.object({
  dailyUnits: z.number().positive(),
  sellingPrice: z.number().positive(),
  rawMaterialCost: z.number().positive(),
  monthlyLabor: z.number().nonnegative().default(15000),
  monthlyRentPower: z.number().nonnegative().default(8000),
  monthlyTransport: z.number().nonnegative().default(6000),
  monthlyOtherFixed: z.number().nonnegative().default(3000),
  monthlyLoanEMI: z.number().nonnegative().default(19000)
});

financeRoutes.post(
  '/finance/cash-flow',
  validate({ body: cashFlowSchema }),
  (req: Request, res: Response) => {
    const {
      dailyUnits,
      sellingPrice,
      rawMaterialCost,
      monthlyLabor,
      monthlyRentPower,
      monthlyTransport,
      monthlyOtherFixed,
      monthlyLoanEMI
    } = req.body;

    const result = financeService.calculateCashFlow(
      dailyUnits,
      sellingPrice,
      rawMaterialCost,
      monthlyLabor,
      monthlyRentPower,
      monthlyTransport,
      monthlyOtherFixed,
      monthlyLoanEMI
    );
    sendSuccess(res, result, 200, req.id);
  }
);

// 5. Working Capital
const workingCapitalSchema = z.object({
  unitsPerDay: z.number().positive(),
  rawMaterialCostPerUnit: z.number().positive(),
  monthlySalaries: z.number().nonnegative().default(15000),
  monthlyUtilities: z.number().nonnegative().default(10000),
  availableCapital: z.number().nonnegative().optional()
});

financeRoutes.post(
  '/finance/working-capital',
  validate({ body: workingCapitalSchema }),
  (req: Request, res: Response) => {
    const {
      unitsPerDay,
      rawMaterialCostPerUnit,
      monthlySalaries,
      monthlyUtilities,
      availableCapital
    } = req.body;

    const result = financeService.calculateWorkingCapital(
      unitsPerDay,
      rawMaterialCostPerUnit,
      monthlySalaries,
      monthlyUtilities,
      availableCapital
    );
    sendSuccess(res, result, 200, req.id);
  }
);

// 6. Stress Test
const stressTestSchema = z.object({
  dailyUnits: z.number().positive(),
  sellingPrice: z.number().positive(),
  rawMaterialCost: z.number().positive(),
  monthlyFixed: z.number().nonnegative(),
  availableReserve: z.number().nonnegative().optional()
});

financeRoutes.post(
  '/finance/stress-test',
  validate({ body: stressTestSchema }),
  (req: Request, res: Response) => {
    const { dailyUnits, sellingPrice, rawMaterialCost, monthlyFixed, availableReserve } = req.body;
    const result = financeService.runStressTest(
      dailyUnits,
      sellingPrice,
      rawMaterialCost,
      monthlyFixed,
      availableReserve
    );
    sendSuccess(res, result, 200, req.id);
  }
);

// 7. Budget Allocation
financeRoutes.get('/finance/budget-allocation', (req: Request, res: Response) => {
  const projectCost = parseFloat((req.query.projectCost as string) || '1000000');
  const result = financeService.getBudgetAllocation(projectCost);
  sendSuccess(res, result, 200, req.id);
});
