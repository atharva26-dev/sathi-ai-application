import { calculateProjectCostStructure } from '../domain/finance/projectCostCalculator.js';
import { routeSchemeByProjectCost } from '../domain/finance/schemeRouter.js';
import { calculateRepaymentSchedule } from '../domain/finance/emiCalculator.js';
import { calculateBreakEven } from '../domain/finance/breakEvenCalculator.js';
import { calculateCashFlowProjections } from '../domain/finance/cashFlowEngine.js';
import { calculateWorkingCapitalRequirements } from '../domain/finance/workingCapitalCalculator.js';
import { runBusinessStressTest } from '../domain/finance/stressTestEngine.js';

export const financeService = {
  structureProject: (capital: number, marginPercent = 10, subsidyRate = 0.35) => {
    const structure = calculateProjectCostStructure(capital, marginPercent, subsidyRate);
    const schemeRoute = routeSchemeByProjectCost(structure.projectCost);

    return {
      structure,
      schemeRoute
    };
  },

  calculateEmi: (loanAmount: number, rate = 9.5, tenureMonths = 60, moratoriumMonths = 6) => {
    return calculateRepaymentSchedule(loanAmount, rate, tenureMonths, moratoriumMonths);
  },

  calculateBreakEven: (monthlyFixed: number, variableCost: number, sellingPrice: number) => {
    return calculateBreakEven(monthlyFixed, variableCost, sellingPrice);
  },

  calculateCashFlow: (
    dailyUnits: number,
    sellingPrice: number,
    rawMaterialCost: number,
    monthlyLabor: number,
    monthlyRentPower: number,
    monthlyTransport: number,
    monthlyOtherFixed: number,
    monthlyLoanEMI: number
  ) => {
    return calculateCashFlowProjections(
      dailyUnits,
      sellingPrice,
      rawMaterialCost,
      monthlyLabor,
      monthlyRentPower,
      monthlyTransport,
      monthlyOtherFixed,
      monthlyLoanEMI
    );
  },

  calculateWorkingCapital: (
    unitsPerDay: number,
    rawMaterialCost: number,
    monthlySalaries: number,
    monthlyUtilities: number,
    availableCapital?: number
  ) => {
    return calculateWorkingCapitalRequirements(
      unitsPerDay,
      rawMaterialCost,
      monthlySalaries,
      monthlyUtilities,
      availableCapital
    );
  },

  runStressTest: (
    dailyUnits: number,
    sellingPrice: number,
    rawMaterialCost: number,
    monthlyFixed: number,
    availableReserve?: number
  ) => {
    return runBusinessStressTest(
      dailyUnits,
      sellingPrice,
      rawMaterialCost,
      monthlyFixed,
      availableReserve
    );
  },

  getBudgetAllocation: (projectCost: number) => {
    return [
      {
        id: 'machinery',
        name: 'दूध प्रक्रिया व पनीर मशिनरी',
        amount: Math.round(projectCost * 0.45),
        percentage: 45,
        description: 'पनीर व्हॅट, हायड्रॉलिक प्रेस, बॉयलर, मिल्क चिलर व वजन काटा',
        isEssential: true
      },
      {
        id: 'working_capital',
        name: 'खेळते भांडवल राखीव निधी',
        amount: Math.round(projectCost * 0.20),
        percentage: 20,
        description: '१५ दिवसांचा कच्चा दूध खरेदी साठा, पॅकिंग व तात्पुरती रोख तरलता',
        isEssential: true
      },
      {
        id: 'infrastructure',
        name: 'शेड सुधारणा व वीज जोडणी',
        amount: Math.round(projectCost * 0.20),
        percentage: 20,
        description: 'टाईल्स, स्वच्छता व्यवस्था, ३-फेज वीज जोडणी व पाणी साठा',
        isEssential: true
      },
      {
        id: 'emergency',
        name: 'आपत्कालीन बफर व विमा',
        amount: Math.round(projectCost * 0.075),
        percentage: 7.5,
        description: 'उधारी वसुलीतील विलंब व अनपेक्षित खर्चासाठी सुरक्षा बफर',
        isEssential: true
      },
      {
        id: 'marketing',
        name: 'मार्केटिंग, सॅम्पलिंग व ब्रँडिंग',
        amount: Math.round(projectCost * 0.075),
        percentage: 7.5,
        description: 'ढाब्यांना मोफत सॅम्पल्स, व्हिजिटिंग कार्ड्स, साईनबोर्ड व पॅकिंग पिशव्या',
        isEssential: false
      }
    ];
  }
};
