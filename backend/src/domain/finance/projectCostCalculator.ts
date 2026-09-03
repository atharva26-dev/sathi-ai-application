import { toPaise, fromPaise, round2, formatIndianRupees } from '../../utils/money.js';
import { PS91_CONFIG } from '../../config/constants.js';

export interface ProjectCostStructuringResult {
  ownCapital: number;
  marginPercentage: number;
  projectCost: number;
  loanComponent: number;
  estimatedSubsidy: number;
  netLoanAfterSubsidy: number;
  isPS91Model: boolean;
  preliminaryNotice: string;
  vernacularSummary: {
    mr: string;
    hi: string;
    en: string;
  };
}

/**
 * PS-91 Stated Margin Structuring Model
 * Project Cost = Available Margin (M) / 0.10
 * Loan Component = Project Cost * 0.90
 */
export const calculateProjectCostStructure = (
  availableCapital: number,
  marginPercent = PS91_CONFIG.DEFAULT_MARGIN_PERCENT,
  subsidyRate = PS91_CONFIG.PMEGP_RURAL_SUBSIDY_RATE
): ProjectCostStructuringResult => {
  if (availableCapital <= 0) {
    throw new Error('Available capital must be greater than zero.');
  }

  const capitalPaise = toPaise(availableCapital);
  const marginRatio = marginPercent / 100;

  // Project Cost = Capital / Margin Ratio (e.g. ₹1,00,000 / 0.10 = ₹10,00,000)
  const projectCostPaise = Math.round(capitalPaise / marginRatio);
  const projectCost = fromPaise(projectCostPaise);

  // Loan Component = Project Cost - Own Capital (e.g. ₹9,00,000)
  const loanComponentPaise = projectCostPaise - capitalPaise;
  const loanComponent = fromPaise(loanComponentPaise);

  // Estimated Government Subsidy (e.g. 35% under PMEGP Rural)
  const subsidyPaise = Math.round(projectCostPaise * subsidyRate);
  const estimatedSubsidy = fromPaise(subsidyPaise);

  // Net Debt Post Subsidy
  const netLoanAfterSubsidy = fromPaise(loanComponentPaise - subsidyPaise);

  const ownCapFormatted = formatIndianRupees(availableCapital);
  const projCostFormatted = formatIndianRupees(projectCost);
  const loanFormatted = formatIndianRupees(loanComponent);
  const subsidyFormatted = formatIndianRupees(estimatedSubsidy);

  return {
    ownCapital: round2(availableCapital),
    marginPercentage: marginPercent,
    projectCost: round2(projectCost),
    loanComponent: round2(loanComponent),
    estimatedSubsidy: round2(estimatedSubsidy),
    netLoanAfterSubsidy: round2(netLoanAfterSubsidy),
    isPS91Model: true,
    preliminaryNotice:
      'ही केवळ १०% स्वतःचे भांडवल गृहीतकावर आधारित गणितीय रचना आहे. ही कर्ज मंजुरीची हमी नाही. प्रत्यक्ष कर्ज मंजुरी बँकेचे नियम आणि कागदपत्रांच्या पडताळणीवर अवलंबून असते.',
    vernacularSummary: {
      mr: `तुमच्या ${ownCapFormatted} (१०% स्वतःचे भांडवल) आधारे ${projCostFormatted} चा एकूण प्रकल्प आराखडा तयार होतो. यासाठी ${loanFormatted} (९०%) बँक कर्ज संभाव्य असून, PMEGP अंतर्गत अंदाजे ${subsidyFormatted} (३५%) शासकीय अनुदान मिळू शकते.`,
      hi: `आपकी ${ownCapFormatted} (१०% खुद की पूंजी) के आधार पर ${projCostFormatted} का कुल प्रोजेक्ट बन सकता है। इसमें ${loanFormatted} (९०%) बैंक लोन और लगभग ${subsidyFormatted} (३५%) सरकारी सब्सिडी अनुमानित है।`,
      en: `Based on your ${ownCapFormatted} (10% own equity), a project cost of ${projCostFormatted} can be structured with a potential ${loanFormatted} (90%) bank loan component and ${subsidyFormatted} (35%) estimated government subsidy.`
    }
  };
};
