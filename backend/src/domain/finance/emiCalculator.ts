import { round2, formatIndianRupees, toPaise, fromPaise } from '../../utils/money.js';

export interface AmortizationRow {
  month: number;
  isMoratorium: boolean;
  openingBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  closingBalance: number;
}

export interface RepaymentAnalysisResult {
  loanAmount: number;
  annualInterestRate: number;
  tenureMonths: number;
  moratoriumMonths: number;
  activeRepaymentMonths: number;
  moratoriumMonthlyPayment: number;
  regularMonthlyEMI: number;
  totalInterestDuringMoratorium: number;
  totalInterestDuringRepayment: number;
  totalInterestPayable: number;
  totalRepaymentAmount: number;
  affordabilityStatus: 'EASY' | 'MANAGEABLE' | 'TIGHT' | 'RISKY';
  vernacularExplanation: {
    mr: string;
    hi: string;
    en: string;
  };
  schedule: AmortizationRow[];
}

/**
 * Deterministic Reducing Balance EMI & Amortization Calculator
 */
export const calculateRepaymentSchedule = (
  loanAmount: number,
  annualInterestRate: number,
  tenureMonths: number,
  moratoriumMonths = 0
): RepaymentAnalysisResult => {
  if (loanAmount <= 0) {
    throw new Error('Loan amount must be greater than zero.');
  }
  if (annualInterestRate < 0) {
    throw new Error('Interest rate cannot be negative.');
  }
  if (tenureMonths <= 0) {
    throw new Error('Tenure months must be greater than zero.');
  }
  if (moratoriumMonths >= tenureMonths) {
    throw new Error('Moratorium period cannot be equal to or greater than total tenure.');
  }

  const monthlyRate = annualInterestRate / 12 / 100;
  const activeRepaymentMonths = tenureMonths - moratoriumMonths;

  // Moratorium Monthly Payment (Interest-only payment)
  const moratoriumMonthlyPayment = round2(loanAmount * monthlyRate);
  const totalInterestDuringMoratorium = round2(moratoriumMonthlyPayment * moratoriumMonths);

  // Standard Reducing Balance EMI during active repayment months
  let regularMonthlyEMI = 0;
  if (monthlyRate === 0) {
    regularMonthlyEMI = round2(loanAmount / activeRepaymentMonths);
  } else {
    const compoundFactor = Math.pow(1 + monthlyRate, activeRepaymentMonths);
    regularMonthlyEMI = round2(
      loanAmount * monthlyRate * (compoundFactor / (compoundFactor - 1))
    );
  }

  // Build Month-by-Month Amortization Schedule
  const schedule: AmortizationRow[] = [];
  let currentBalancePaise = toPaise(loanAmount);
  let totalInterestRepaymentPaise = 0;

  for (let month = 1; month <= tenureMonths; month++) {
    const isMoratorium = month <= moratoriumMonths;
    const openingBalance = fromPaise(currentBalancePaise);

    if (isMoratorium) {
      const interestPaise = Math.round(currentBalancePaise * monthlyRate);
      const interest = fromPaise(interestPaise);
      const payment = interest; // only interest paid
      const principal = 0;
      const closingBalance = openingBalance;

      schedule.push({
        month,
        isMoratorium: true,
        openingBalance,
        principal,
        interest,
        totalPayment: payment,
        closingBalance
      });
    } else {
      const interestPaise = Math.round(currentBalancePaise * monthlyRate);
      totalInterestRepaymentPaise += interestPaise;

      let paymentPaise = toPaise(regularMonthlyEMI);
      let principalPaise = paymentPaise - interestPaise;

      // Handle final month balance rounding
      if (month === tenureMonths || currentBalancePaise - principalPaise < 0) {
        principalPaise = currentBalancePaise;
        paymentPaise = principalPaise + interestPaise;
        currentBalancePaise = 0;
      } else {
        currentBalancePaise -= principalPaise;
      }

      schedule.push({
        month,
        isMoratorium: false,
        openingBalance,
        principal: fromPaise(principalPaise),
        interest: fromPaise(interestPaise),
        totalPayment: fromPaise(paymentPaise),
        closingBalance: fromPaise(currentBalancePaise)
      });
    }
  }

  const totalInterestDuringRepayment = fromPaise(totalInterestRepaymentPaise);
  const totalInterestPayable = round2(totalInterestDuringMoratorium + totalInterestDuringRepayment);
  const totalRepaymentAmount = round2(loanAmount + totalInterestPayable);

  // Affordability benchmark (for rural micro-enterprises)
  let affordabilityStatus: 'EASY' | 'MANAGEABLE' | 'TIGHT' | 'RISKY' = 'EASY';
  if (regularMonthlyEMI > 35000) {
    affordabilityStatus = 'RISKY';
  } else if (regularMonthlyEMI > 22000) {
    affordabilityStatus = 'TIGHT';
  } else if (regularMonthlyEMI > 12000) {
    affordabilityStatus = 'MANAGEABLE';
  }

  const loanFmt = formatIndianRupees(loanAmount);
  const emiFmt = formatIndianRupees(regularMonthlyEMI);
  const moratEmiFmt = formatIndianRupees(moratoriumMonthlyPayment);

  return {
    loanAmount: round2(loanAmount),
    annualInterestRate,
    tenureMonths,
    moratoriumMonths,
    activeRepaymentMonths,
    moratoriumMonthlyPayment,
    regularMonthlyEMI,
    totalInterestDuringMoratorium,
    totalInterestDuringRepayment,
    totalInterestPayable,
    totalRepaymentAmount,
    affordabilityStatus,
    vernacularExplanation: {
      mr: `${loanFmt} च्या कर्जासाठी पहिल्या ${moratoriumMonths} महिन्यांत सवलत काळात केवळ ₹${moratEmiFmt} व्याज भरावे लागेल. त्यानंतर पुढील ${activeRepaymentMonths} महिने दरमहा नियमित ${emiFmt} हप्ता (EMI) असेल.`,
      hi: `${loanFmt} के लोन के लिए पहले ${moratoriumMonths} महीने सहुलियत अवधि में केवल ₹${moratEmiFmt} ब्याज देना होगा। इसके बाद नियमित मासिक किश्त ${emiFmt} होगी।`,
      en: `For a ${loanFmt} loan, the first ${moratoriumMonths} months require only interest payment of ${moratEmiFmt}/month. Subsequent regular monthly EMI is ${emiFmt} for ${activeRepaymentMonths} months.`
    },
    schedule
  };
};
