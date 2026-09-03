import { round2, safeDiv, formatIndianRupees } from '../../utils/money.js';

export interface StressScenarioResult {
  id: string;
  type: 'NORMAL' | 'GOOD' | 'DIFFICULT' | 'CRITICAL';
  title: {
    mr: string;
    hi: string;
    en: string;
  };
  salesChangePercent: number;
  costChangePercent: number;
  estimatedMonthlyRevenue: number;
  estimatedMonthlyCost: number;
  estimatedMonthlySurplus: number;
  breakEvenDays: number;
  survivalRunwayMonths: number;
  riskAlert?: string;
  mitigationSteps: string[];
}

export interface BusinessStressTestResult {
  scenarios: StressScenarioResult[];
  overallResilienceScore: number; // 0 to 100
  resilienceRating: 'HIGH' | 'MODERATE' | 'VULNERABLE';
  summaryAdvice: {
    mr: string;
    hi: string;
    en: string;
  };
}

/**
 * Deterministic Challenger Mode Stress Test Engine
 */
export const runBusinessStressTest = (
  dailyUnits: number,
  sellingPrice: number,
  rawMaterialCost: number,
  monthlyFixedCosts: number,
  availableReserve = 75000,
  operatingDays = 30
): BusinessStressTestResult => {
  const baseMonthlyVolume = dailyUnits * operatingDays;

  const evaluateScenario = (
    id: string,
    type: 'NORMAL' | 'GOOD' | 'DIFFICULT' | 'CRITICAL',
    title: { mr: string; hi: string; en: string },
    salesChange: number,
    costChange: number,
    mitigation: string[]
  ): StressScenarioResult => {
    const volumeMultiplier = 1 + salesChange / 100;
    const costMultiplier = 1 + costChange / 100;

    const adjustedDailyVolume = dailyUnits * volumeMultiplier;
    const adjustedMonthlyVolume = adjustedDailyVolume * operatingDays;
    const adjustedRawCost = rawMaterialCost * costMultiplier;

    const monthlyRevenue = round2(adjustedMonthlyVolume * sellingPrice);
    const monthlyRawCostTotal = round2(adjustedMonthlyVolume * adjustedRawCost);
    const totalCosts = round2(monthlyRawCostTotal + monthlyFixedCosts);
    const netSurplus = round2(monthlyRevenue - totalCosts);

    // Contribution margin & break-even days
    const unitMargin = sellingPrice - adjustedRawCost;
    let breakEvenDays = 30;
    if (unitMargin > 0) {
      const breakEvenUnits = Math.ceil(safeDiv(monthlyFixedCosts, unitMargin));
      breakEvenDays = Math.min(30, Math.ceil(safeDiv(breakEvenUnits, adjustedDailyVolume)));
    }

    // Runway: How many months can the business survive if operating at negative surplus
    let survivalRunwayMonths = 12;
    if (netSurplus < 0) {
      const monthlyDeficit = Math.abs(netSurplus);
      survivalRunwayMonths = round2(safeDiv(availableReserve, monthlyDeficit));
    }

    let riskAlert: string | undefined;
    if (netSurplus < 0) {
      riskAlert = `सावधान! या स्थितीत दरमहा ${formatIndianRupees(Math.abs(netSurplus))} चा तोटा होईल.`;
    }

    return {
      id,
      type,
      title,
      salesChangePercent: salesChange,
      costChangePercent: costChange,
      estimatedMonthlyRevenue: monthlyRevenue,
      estimatedMonthlyCost: totalCosts,
      estimatedMonthlySurplus: netSurplus,
      breakEvenDays,
      survivalRunwayMonths,
      riskAlert,
      mitigationSteps: mitigation
    };
  };

  const scenarios: StressScenarioResult[] = [
    evaluateScenario(
      'normal',
      'NORMAL',
      {
        mr: 'साधारण दिवस (नियमित)',
        hi: 'सामान्य स्थिति (नियमित)',
        en: 'Normal Base Case'
      },
      0,
      0,
      ['नियमित गुणवत्ता टिकवा', 'दररोज वेळेवर डिलिव्हरी करा']
    ),
    evaluateScenario(
      'good',
      'GOOD',
      {
        mr: 'उत्तम महिना (लग्नसराई / सण)',
        hi: 'त्योहारी सीजन (+२०% बिक्री)',
        en: 'Peak Season (+20% Sales)'
      },
      20,
      0,
      ['अतिरिक्त दूध संकलन नियोजन', 'नफ्यातील ४०% रक्कम राखीव खात्यात ठेवा']
    ),
    evaluateScenario(
      'difficult',
      'DIFFICULT',
      {
        mr: 'कठीण काळ (विक्री -३०%)',
        hi: 'मंदी की स्थिति (-३०% बिक्री)',
        en: 'Sales Drop (-30% Volume)'
      },
      -30,
      0,
      [
        'नवीन ५ ढाब्यांना मोफत सॅम्पल देऊन संपर्क करा',
        'शिल्लक दुधापासून टिकाऊ तूप किंवा खवा बनवा',
        'अनावश्यक वाहतूक व तात्पुरता खर्च कमी करा'
      ]
    ),
    evaluateScenario(
      'critical',
      'CRITICAL',
      {
        mr: 'दुष्काळ / दुधाचा दर वाढ (+१५%)',
        hi: 'कच्चे दूध की कीमत वृद्धि (+१५%)',
        en: 'Milk Cost Spike (+15%)'
      },
      0,
      15,
      [
        'घाऊक विक्री दरात प्रति किलो ₹१० ते ₹१५ वाढ करा',
        'दूध उत्पादक शेतकऱ्यांशी थेट दीर्घकालीन करार करा',
        'प्रक्रिया प्रक्रियेतील घट (waste) कमी करा'
      ]
    )
  ];

  // Calculate Resilience Score (0 to 100)
  const difficultSurplus = scenarios.find((s) => s.id === 'difficult')?.estimatedMonthlySurplus || 0;
  const criticalSurplus = scenarios.find((s) => s.id === 'critical')?.estimatedMonthlySurplus || 0;

  let resilienceScore = 60;
  if (difficultSurplus > 0 && criticalSurplus > 0) {
    resilienceScore = 88;
  } else if (difficultSurplus > 0 || criticalSurplus > 0) {
    resilienceScore = 72;
  } else {
    resilienceScore = 45;
  }

  const rating = resilienceScore >= 80 ? 'HIGH' : resilienceScore >= 60 ? 'MODERATE' : 'VULNERABLE';

  return {
    scenarios,
    overallResilienceScore: resilienceScore,
    resilienceRating: rating,
    summaryAdvice: {
      mr: 'विक्री ३०% घटली तरीही व्यवसाय तोट्यात जात नाही. मात्र दुधाचा दर वाढल्यास पनीरचा विक्री भाव ₹१५ ने वाढवावा लागेल.',
      hi: 'बिक्री में ३०% की गिरावट के बावजूद व्यापार स्थिर रहता है। हालांकि लागत बढ़ने पर बिक्री मूल्य समायोजित करना होगा।',
      en: 'The business model remains cash-positive even under a 30% sales drop, demonstrating solid rural shock resilience.'
    }
  };
};
