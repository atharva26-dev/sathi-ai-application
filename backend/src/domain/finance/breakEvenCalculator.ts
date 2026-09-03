import { round2, safeDiv, formatIndianRupees } from '../../utils/money.js';

export interface BreakEvenAnalysisResult {
  monthlyFixedCosts: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
  contributionMarginPerUnit: number;
  contributionMarginRatio: number; // percentage
  breakEvenUnitsPerMonth: number;
  breakEvenUnitsPerDay: number; // assuming 30 operating days/month
  breakEvenRevenuePerMonth: number;
  isViable: boolean;
  notes: string;
  vernacularSummary: {
    mr: string;
    hi: string;
    en: string;
  };
}

/**
 * Deterministic Break-Even Analysis Engine (Zero-division safe)
 */
export const calculateBreakEven = (
  monthlyFixedCosts: number,
  variableCostPerUnit: number,
  sellingPricePerUnit: number,
  operatingDaysPerMonth = 30
): BreakEvenAnalysisResult => {
  if (monthlyFixedCosts < 0 || variableCostPerUnit < 0 || sellingPricePerUnit < 0) {
    throw new Error('Costs and prices must be non-negative.');
  }

  const contributionMarginPerUnit = round2(sellingPricePerUnit - variableCostPerUnit);
  const contributionMarginRatio = round2(
    safeDiv(contributionMarginPerUnit, sellingPricePerUnit) * 100
  );

  // Negative or Zero Contribution Margin Handling
  if (contributionMarginPerUnit <= 0) {
    return {
      monthlyFixedCosts: round2(monthlyFixedCosts),
      variableCostPerUnit: round2(variableCostPerUnit),
      sellingPricePerUnit: round2(sellingPricePerUnit),
      contributionMarginPerUnit,
      contributionMarginRatio,
      breakEvenUnitsPerMonth: 0,
      breakEvenUnitsPerDay: 0,
      breakEvenRevenuePerMonth: 0,
      isViable: false,
      notes: 'विक्री दर हा थेट उत्पादन खर्चापेक्षा कमी किंवा समान आहे. त्यामुळे व्यवसाय तोट्यात जाईल.',
      vernacularSummary: {
        mr: 'सध्याचा विक्री दर थेट कच्च्या मालाचा खर्च भरून काढत नाही. विक्री दर वाढवणे किंवा कच्च्या मालाचा दर कमी करणे आवश्यक आहे.',
        hi: 'वर्तमान बिक्री मूल्य प्रत्यक्ष लागत को पूरा नहीं कर रहा है। बिक्री मूल्य बढ़ाना आवश्यक है।',
        en: 'The selling price does not cover the unit variable cost. Break-even cannot be reached until prices or unit costs are adjusted.'
      }
    };
  }

  // Break-even Units = Fixed Costs / Contribution per unit
  const breakEvenUnitsPerMonth = Math.ceil(
    safeDiv(monthlyFixedCosts, contributionMarginPerUnit)
  );

  const breakEvenUnitsPerDay = Math.ceil(
    safeDiv(breakEvenUnitsPerMonth, operatingDaysPerMonth)
  );

  const breakEvenRevenuePerMonth = round2(breakEvenUnitsPerMonth * sellingPricePerUnit);

  const beUnitsFmt = `${breakEvenUnitsPerDay} नग / किलो`;
  const beRevFmt = formatIndianRupees(breakEvenRevenuePerMonth);

  return {
    monthlyFixedCosts: round2(monthlyFixedCosts),
    variableCostPerUnit: round2(variableCostPerUnit),
    sellingPricePerUnit: round2(sellingPricePerUnit),
    contributionMarginPerUnit,
    contributionMarginRatio,
    breakEvenUnitsPerMonth,
    breakEvenUnitsPerDay,
    breakEvenRevenuePerMonth,
    isViable: true,
    notes: `सर्व स्थिर खर्च भरून काढण्यासाठी दरमहा किमान ${breakEvenUnitsPerMonth} युनिट्स (${beRevFmt}) विक्री आवश्यक आहे.`,
    vernacularSummary: {
      mr: `व्यवसायाचा रोजचा वीज, मजुरी व बँकेचा हप्ता भरून ना नफा ना तोटा स्थिती गाठण्यासाठी दररोज किमान ${beUnitsFmt} उत्पादन विकणे आवश्यक आहे.`,
      hi: `व्यापार का बिजली, मजदूरी और लोन किश्त निकालने के लिए रोज कम से कम ${beUnitsFmt} बिक्री आवश्यक है।`,
      en: `To cover monthly fixed overheads and debt service, a minimum sales volume of ${beUnitsFmt} per day (${beRevFmt}/month) is required.`
    }
  };
};
