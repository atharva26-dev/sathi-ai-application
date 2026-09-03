import { PS91_CONFIG } from '../../config/constants.js';
import { round2, formatIndianRupees } from '../../utils/money.js';

export type SchemeRouteCategory = 'MICRO_FINANCE' | 'TERM_LOAN' | 'LARGE_ENTERPRISE_SPECIAL_APPRAISAL';

export interface SchemeRoutingResult {
  category: SchemeRouteCategory;
  schemeTitle: string;
  projectCost: number;
  maxAgencyFunding: number;
  recommendedFunding: number;
  ownContributionRequired: number;
  interestRate: number;
  tenureYears: number;
  tenureMonths: number;
  moratoriumMonths: number;
  ruleVersion: string;
  isEligibleUnderCap: boolean;
  notes: string;
  vernacularAdvice: {
    mr: string;
    hi: string;
    en: string;
  };
}

/**
 * Deterministic PS-91 Scheme Rule Router
 */
export const routeSchemeByProjectCost = (
  projectCost: number,
  ruleVersion = 'PS91_2026_v1'
): SchemeRoutingResult => {
  if (projectCost <= 0) {
    throw new Error('Project cost must be greater than zero.');
  }

  // 1. MICRO FINANCE ROUTE: Project cost <= ₹1.40 lakh
  if (projectCost <= PS91_CONFIG.MICRO_FINANCE_THRESHOLD) {
    const maxFunding = PS91_CONFIG.MICRO_FINANCE_MAX_FUNDING;
    const recommendedFunding = Math.min(projectCost * 0.90, maxFunding);
    const ownContribution = projectCost - recommendedFunding;

    return {
      category: 'MICRO_FINANCE',
      schemeTitle: 'PS-91 सूक्ष्म वित्त योजना (Micro Finance Scheme)',
      projectCost: round2(projectCost),
      maxAgencyFunding: maxFunding,
      recommendedFunding: round2(recommendedFunding),
      ownContributionRequired: round2(ownContribution),
      interestRate: PS91_CONFIG.MICRO_FINANCE_INTEREST_RATE,
      tenureYears: PS91_CONFIG.MICRO_FINANCE_TENURE_YEARS,
      tenureMonths: PS91_CONFIG.MICRO_FINANCE_TENURE_YEARS * 12,
      moratoriumMonths: PS91_CONFIG.MICRO_FINANCE_MORATORIUM_MONTHS,
      ruleVersion,
      isEligibleUnderCap: true,
      notes: `प्रकल्प खर्च ₹१.४० लाखांपर्यंत असल्याने ६.५% सवलतीच्या व्याजाची सूक्ष्म वित्त योजना लागू होते. कमाल संस्था निधी ₹१.२५ लाख.`,
      vernacularAdvice: {
        mr: `तुमचा प्रकल्प खर्च ${formatIndianRupees(projectCost)} असल्याने तुम्हाला ६.५% सवलतीच्या व्याजाने ३ वर्षांसाठी सूक्ष्म वित्त कर्ज मिळू शकते (३ महिने सवलत काळ).`,
        hi: `आपका प्रोजेक्ट खर्च ${formatIndianRupees(projectCost)} होने से आपको ६.५% रियायती ब्याज पर ३ साल के लिए माइक्रो फाइनेंस लोन मिल सकता है (३ महीने मोरेटोरियम)।`,
        en: `Your project cost of ${formatIndianRupees(projectCost)} qualifies for the Micro Finance route at 6.5% interest for 3 years with a 3-month moratorium.`
      }
    };
  }

  // 2. TERM LOAN ROUTE: Project cost > ₹1.40 lakh and <= ₹50 lakh
  if (projectCost <= PS91_CONFIG.TERM_LOAN_MAX_PROJECT_COST) {
    const maxFunding = PS91_CONFIG.TERM_LOAN_MAX_FUNDING;
    const recommendedFunding = Math.min(projectCost * 0.90, maxFunding);
    const ownContribution = projectCost - recommendedFunding;

    return {
      category: 'TERM_LOAN',
      schemeTitle: 'PS-91 मुदत कर्ज योजना (MSME Term Loan Scheme)',
      projectCost: round2(projectCost),
      maxAgencyFunding: maxFunding,
      recommendedFunding: round2(recommendedFunding),
      ownContributionRequired: round2(ownContribution),
      interestRate: PS91_CONFIG.TERM_LOAN_INTEREST_RATE,
      tenureYears: PS91_CONFIG.TERM_LOAN_TENURE_YEARS,
      tenureMonths: PS91_CONFIG.TERM_LOAN_TENURE_YEARS * 12,
      moratoriumMonths: PS91_CONFIG.TERM_LOAN_MORATORIUM_MONTHS,
      ruleVersion,
      isEligibleUnderCap: true,
      notes: `प्रकल्प खर्च ₹१.४० लाखांपेक्षा जास्त व ₹५० लाखांपर्यंत असल्याने ८.०% व्याजाची मुदत कर्ज योजना लागू होते. कमाल संस्था निधी ₹४५.०० लाख.`,
      vernacularAdvice: {
        mr: `तुमचा प्रकल्प खर्च ${formatIndianRupees(projectCost)} असल्याने तुम्हाला ८.०% व्याजाने ७ वर्षांसाठी मुदत कर्ज मिळू शकते (६ महिने सवलत काळ).`,
        hi: `आपका प्रोजेक्ट खर्च ${formatIndianRupees(projectCost)} होने से आपको ८.०% ब्याज पर ७ साल के लिए टर्म लोन मिल सकता है (६ महीने मोरेटोरियम)।`,
        en: `Your project cost of ${formatIndianRupees(projectCost)} qualifies for the MSME Term Loan route at 8.0% interest for 7 years with a 6-month moratorium.`
      }
    };
  }

  // 3. LARGE ENTERPRISE SPECIAL APPRAISAL: Project cost > ₹50 lakh
  const maxFunding = PS91_CONFIG.TERM_LOAN_MAX_FUNDING;
  return {
    category: 'LARGE_ENTERPRISE_SPECIAL_APPRAISAL',
    schemeTitle: 'विशेष औद्योगिक प्रक्रिया योजना (Special Industrial Route)',
    projectCost: round2(projectCost),
    maxAgencyFunding: maxFunding,
    recommendedFunding: maxFunding,
    ownContributionRequired: round2(projectCost - maxFunding),
    interestRate: 9.5,
    tenureYears: 10,
    tenureMonths: 120,
    moratoriumMonths: 12,
    ruleVersion,
    isEligibleUnderCap: false,
    notes: `प्रकल्प खर्च ₹५० लाखांपेक्षा जास्त असल्याने यासाठी स्वतंत्र बँक कन्सोर्टियम आणि विशेष तांत्रिक पडताळणी आवश्यक आहे.`,
    vernacularAdvice: {
      mr: `तुमचा प्रकल्प खर्च ₹५० लाखांहून अधिक असल्याने यास विशेष औद्योगिक पडताळणी व कन्सोर्टियम वित्तपुरवठा लागेल.`,
      hi: `आपका प्रोजेक्ट खर्च ₹५० लाख से अधिक होने के कारण इसके लिए विशेष औद्योगिक मूल्यांकन की आवश्यकता है।`,
      en: `Your project cost exceeds ₹50 Lakhs and requires special consortium appraisal under commercial lending guidelines.`
    }
  };
};
