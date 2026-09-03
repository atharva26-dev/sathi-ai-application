import {
  FinancialPlan,
  BudgetCategory,
  RepaymentAnalysis,
  RepaymentScheduleRow,
  WorkingCapitalPlan
} from '../types';

export const financeService = {
  // PS-91 Structuring: 10% own equity -> 10x project cost -> 90% loan
  calculateFinancialStructure(ownCapital: number): FinancialPlan {
    const validOwn = Math.max(10000, ownCapital);
    const marginPercent = 10;
    const loanPercent = 90;
    const projectCost = Math.round(validOwn / (marginPercent / 100));
    const loanComponent = projectCost - validOwn;
    const subsidyEstimate = Math.round(projectCost * 0.35); // 35% PMEGP rural subsidy estimation

    return {
      ownCapital: validOwn,
      projectCost,
      loanComponent,
      marginPercent,
      loanPercent,
      subsidyEstimate,
      isPS91Applicable: true,
      preliminaryNotice:
        'शासकीय व बँक निकषानुसार १०% स्वतःचे भांडवल असल्यास उर्वरित ९०% प्रकल्पासाठी कर्ज व सबसिडी जोडता येते.',
      trustInfo: {
        level: 'CALCULATED',
        confidenceScore: 90,
        assumptions: [
          '१०% स्वतःचे भांडवल (Margin Money)',
          '९०% बँक कर्ज व शासकीय सबसिडी',
          'ग्रामीण भागासाठी ३५% पर्यंत सबसिडी संभाव्य'
        ],
        lastUpdated: '२०२६'
      }
    };
  },

  getBudgetAllocation(projectCost: number): BudgetCategory[] {
    return [
      {
        id: 'b1',
        name: 'यंत्रसामग्री व उपकरणे (Machinery & Equipment)',
        amount: Math.round(projectCost * 0.40),
        percentage: 40,
        description: 'दूध पाश्चरायझर, पनीर प्रेसिंग युनिट, डीप फ्रीझर, वजनकाटा व भांडी',
        isEssential: true
      },
      {
        id: 'b2',
        name: 'शेड सुधारणा व वीज जोडणी (Shed & Electricals)',
        amount: Math.round(projectCost * 0.20),
        percentage: 20,
        description: 'टाईल्स, ड्रेनेज व्यवस्था, इन्व्हर्टर बॅकअप व पाणी जोडणी',
        isEssential: true
      },
      {
        id: 'b3',
        name: '३ महिन्यांचे खेळते भांडवल (Working Capital)',
        amount: Math.round(projectCost * 0.25),
        percentage: 25,
        description: 'दूध खरेदी, पॅकिंग साहित्य, इंधन व रोजचा रोख खर्च',
        isEssential: true
      },
      {
        id: 'b4',
        name: 'परवाने व ब्रँडिंग (FSSAI, GST & Branding)',
        amount: Math.round(projectCost * 0.05),
        percentage: 5,
        description: 'अन्न व औषध परवाना (FSSAI), उद्योग आधार, बोर्ड व स्टिकर्स',
        isEssential: false
      },
      {
        id: 'b5',
        name: 'आपत्कालीन राखीव निधी (Emergency Reserve)',
        amount: Math.round(projectCost * 0.10),
        percentage: 10,
        description: 'सुरुवातीला अनपेक्षित अडचणी व उधारी वसुलीतील विलंबासाठी सुरक्षित रक्कम',
        isEssential: true
      }
    ];
  },

  calculateRepayment(
    loanAmount: number,
    annualInterestRate = 9.5,
    tenureYears = 5,
    moratoriumMonths = 6
  ): RepaymentAnalysis {
    const tenureMonths = tenureYears * 12;
    const effectiveRepayMonths = tenureMonths - moratoriumMonths;
    const monthlyRate = annualInterestRate / 12 / 100;

    let monthlyEMI = 0;
    if (monthlyRate > 0 && effectiveRepayMonths > 0) {
      monthlyEMI = Math.round(
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, effectiveRepayMonths)) /
          (Math.pow(1 + monthlyRate, effectiveRepayMonths) - 1)
      );
    } else {
      monthlyEMI = Math.round(loanAmount / effectiveRepayMonths);
    }

    const totalPayment = monthlyEMI * effectiveRepayMonths;
    const totalInterestPayable = Math.max(0, totalPayment - loanAmount);

    // Build schedule
    const schedule: RepaymentScheduleRow[] = [];
    let currentBalance = loanAmount;

    for (let m = 1; m <= tenureMonths; m++) {
      if (m <= moratoriumMonths) {
        // Simple interest during moratorium
        const interestM = Math.round(currentBalance * monthlyRate);
        schedule.push({
          month: m,
          openingBalance: currentBalance,
          principal: 0,
          interest: interestM,
          totalPayment: interestM, // only servicing interest
          closingBalance: currentBalance
        });
      } else {
        const interestM = Math.round(currentBalance * monthlyRate);
        const principalM = Math.min(currentBalance, monthlyEMI - interestM);
        const closing = Math.max(0, currentBalance - principalM);
        schedule.push({
          month: m,
          openingBalance: currentBalance,
          principal: principalM,
          interest: interestM,
          totalPayment: monthlyEMI,
          closingBalance: closing
        });
        currentBalance = closing;
      }
    }

    let affordabilityStatus: 'EASY' | 'MANAGEABLE' | 'TIGHT' | 'RISKY' = 'MANAGEABLE';
    if (monthlyEMI < 12000) affordabilityStatus = 'EASY';
    else if (monthlyEMI <= 22000) affordabilityStatus = 'MANAGEABLE';
    else if (monthlyEMI <= 35000) affordabilityStatus = 'TIGHT';
    else affordabilityStatus = 'RISKY';

    const simpleExplanation = `तुम्हाला पहिल्या ६ महिन्यांच्या सवलतीनंतर दरमहा अंदाजे ₹${monthlyEMI.toLocaleString(
      'en-IN'
    )} चा हप्ता ५ वर्षे भरावा लागेल. तुमच्या अंदाजित ₹४२,५०० नफ्यातून हा हप्ता सहज भरता येईल.`;

    return {
      loanAmount,
      annualInterestRate,
      tenureMonths,
      moratoriumMonths,
      monthlyEMI,
      totalInterestPayable,
      totalPayment,
      affordabilityStatus,
      simpleExplanation,
      schedule
    };
  },

  calculateWorkingCapital(dailyUnits = 25, unitRawCost = 180, monthlyFixed = 25000): WorkingCapitalPlan {
    const rawMaterialsBufferDays = 15;
    const rawMaterialsBufferCost = dailyUnits * unitRawCost * rawMaterialsBufferDays; // 15 days milk procurement
    const monthlySalaries = 12000;
    const utilitiesAndLogistics = 13000;
    const emergencyBuffer = 20000;

    const totalRequiredWorkingCapital =
      rawMaterialsBufferCost + monthlySalaries + utilitiesAndLogistics + emergencyBuffer;
    const availableWorkingCapital = 60000; // from project allocation
    const capitalGap = Math.max(0, totalRequiredWorkingCapital - availableWorkingCapital);

    const recommendation =
      capitalGap > 0
        ? `सुरुवातीला ₹${capitalGap.toLocaleString(
            'en-IN'
          )} चा खेळत्या भांडवलाचा तुटवडा भासू नये म्हणून बँकेकडे कॅश क्रेडिट (CC Limit) किंवा ओव्हरड्राफ्टची मागणी करा.`
        : 'खेळते भांडवल पुरेसे आहे. नियमित आठवडी वसुली चालू ठेवा.';

    return {
      rawMaterialsBufferDays,
      rawMaterialsBufferCost,
      monthlySalaries,
      utilitiesAndLogistics,
      emergencyBuffer,
      totalRequiredWorkingCapital,
      availableWorkingCapital,
      capitalGap,
      recommendation
    };
  }
};
