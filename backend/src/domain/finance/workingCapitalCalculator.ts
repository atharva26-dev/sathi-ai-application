import { round2, formatIndianRupees } from '../../utils/money.js';
import { WORKING_CAPITAL_CONFIG } from '../../config/constants.js';

export interface WorkingCapitalRequirement {
  unitsPerDay: number;
  rawMaterialCostPerUnit: number;
  monthlySalaries: number;
  monthlyUtilitiesAndTransport: number;
  rawMaterialBufferDays: number;
  rawMaterialBufferCost: number;
  monthlyOperatingCosts: number;
  emergencyBuffer: number;
  totalRequiredWorkingCapital: number;
  availableCapital: number;
  workingCapitalGap: number;
  hasLiquidityGap: boolean;
  recommendation: {
    mr: string;
    hi: string;
    en: string;
  };
}

/**
 * Deterministic Working Capital Engine
 */
export const calculateWorkingCapitalRequirements = (
  unitsPerDay: number,
  rawMaterialCostPerUnit: number,
  monthlySalaries: number,
  monthlyUtilitiesAndTransport: number,
  availableCapital = 100000,
  bufferDays = WORKING_CAPITAL_CONFIG.RAW_MATERIAL_BUFFER_DAYS
): WorkingCapitalRequirement => {
  if (unitsPerDay <= 0 || rawMaterialCostPerUnit <= 0) {
    throw new Error('Production units and raw material cost per unit must be greater than zero.');
  }

  // Raw Material Buffer for N days
  const dailyRawMaterialCost = unitsPerDay * rawMaterialCostPerUnit;
  const rawMaterialBufferCost = round2(dailyRawMaterialCost * bufferDays);

  const monthlyOperatingCosts = round2(monthlySalaries + monthlyUtilitiesAndTransport);

  // Emergency Buffer (15 days operating expenses)
  const emergencyBuffer = round2((monthlyOperatingCosts / 30) * 15);

  // Total required liquidity
  const totalRequiredWorkingCapital = round2(
    rawMaterialBufferCost + monthlyOperatingCosts + emergencyBuffer
  );

  const workingCapitalGap = round2(Math.max(0, totalRequiredWorkingCapital - availableCapital));
  const hasLiquidityGap = workingCapitalGap > 0;

  const reqFmt = formatIndianRupees(totalRequiredWorkingCapital);
  const gapFmt = formatIndianRupees(workingCapitalGap);
  const bufferFmt = formatIndianRupees(rawMaterialBufferCost);

  let recMr = `तुमच्या व्यवसायासाठी किमान ${reqFmt} खेळते भांडवल आवश्यक आहे (१५ दिवसांचा दूध खरेदी साठा ${bufferFmt} सह).`;
  let recHi = `आपके व्यवसाय के लिए कम से कम ${reqFmt} कार्यशील पूंजी आवश्यक है।`;
  let recEn = `A working capital liquidity buffer of ${reqFmt} is recommended (including ${bufferFmt} for ${bufferDays}-day raw material buffer).`;

  if (hasLiquidityGap) {
    recMr += ` सध्या ${gapFmt} ची तूट दिसत असल्याने स्थानिक डेअरी किंवा बँकेकडून कॅश क्रेडिट (CC) किंवा मुदती कर्ज मर्यादेत खेळते भांडवल समाविष्ट करा.`;
    recHi += ` वर्तमान में ${gapFmt} की कमी है, जिसे कैश क्रेडिट (CC) से पूरा किया जाना चाहिए।`;
    recEn += ` A gap of ${gapFmt} exists. Ensure working capital component is included in bank loan limit.`;
  } else {
    recMr += ` तुमचे उपलब्ध भांडवल खेळत्या भांडवलासाठी पुरेसे व सुरक्षित आहे.`;
    recHi += ` आपकी उपलब्ध पूंजी कार्यशील पूंजी के लिए पर्याप्त है।`;
    recEn += ` Your available liquid capital is adequate to maintain cash runway.`;
  }

  return {
    unitsPerDay,
    rawMaterialCostPerUnit,
    monthlySalaries: round2(monthlySalaries),
    monthlyUtilitiesAndTransport: round2(monthlyUtilitiesAndTransport),
    rawMaterialBufferDays: bufferDays,
    rawMaterialBufferCost,
    monthlyOperatingCosts,
    emergencyBuffer,
    totalRequiredWorkingCapital,
    availableCapital: round2(availableCapital),
    workingCapitalGap,
    hasLiquidityGap,
    recommendation: {
      mr: recMr,
      hi: recHi,
      en: recEn
    }
  };
};
