import { SchemeSuitability, DataTrustLevel } from '../../config/constants.js';

export interface EvaluatedScheme {
  id: string;
  name: string;
  nameNative: { mr: string; hi: string; en: string };
  sponsoringAgency: string;
  maxProjectCost: number;
  subsidyPercent: number; // e.g. 35 for PMEGP
  interestRateRange: string;
  tenureYears: number;
  moratoriumMonths: number;
  suitability: SchemeSuitability;
  whySuitable: { mr: string; hi: string; en: string };
  eligibilityConditions: string[];
  requiredDocuments: string[];
  nodalContact: string;
  trustLevel: DataTrustLevel;
  officialSourceUrl: string;
}

export const evaluateGovernmentSchemes = (
  projectCost: number,
  isRural = true,
  category = 'Agro & Food Processing'
): EvaluatedScheme[] => {
  return [
    {
      id: 'scheme_pmegp',
      name: 'Prime Minister Employment Generation Programme (PMEGP)',
      nameNative: {
        mr: 'पंतप्रधान रोजगार निर्मिती कार्यक्रम (PMEGP)',
        hi: 'प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)',
        en: 'Prime Minister Employment Generation Programme (PMEGP)'
      },
      sponsoringAgency: 'KVIC / Ministry of MSME, Govt of India',
      maxProjectCost: 5000000, // ₹50 Lakhs
      subsidyPercent: isRural ? 35 : 25,
      interestRateRange: '८.०% ते ९.५% वार्षिक',
      tenureYears: 7,
      moratoriumMonths: 6,
      suitability: projectCost <= 5000000 ? 'potentially_eligible' : 'not_eligible',
      whySuitable: {
        mr: 'ग्रामीण भागात नवीन दुग्ध प्रक्रिया व उत्पादन प्रकल्पासाठी सर्वाधिक ३५% शासकीय अनुदान मिळते.',
        hi: 'ग्रामीण क्षेत्र में नई निर्माण इकाई के लिए ३५% तक अधिकतम सरकारी सब्सिडी उपलब्ध है।',
        en: 'Offers the highest 35% capital subsidy for new rural manufacturing and agro-processing units.'
      },
      eligibilityConditions: [
        'वय किमान १८ वर्षे पूर्ण असावे',
        'प्रकल्प खर्च ₹१० लाखांहून अधिक असल्यास ८ वी उत्तीर्ण आवश्यक',
        'स्वतःचे किमान १०% भांडवल (Margin Money) आवश्यक'
      ],
      requiredDocuments: [
        'आधार कार्ड व पॅन कार्ड',
        'ग्रामसेवक / तहसीलदार सहीचा ग्रामीण दाखला (Rural Certificate)',
        'प्रकल्प अहवाल (Detailed Project Report - DPR)',
        'मशिनरीचे जीएसटीसह अधिकृत कोटेशन',
        '८ वी किंवा १० वी उत्तीर्ण गुणपत्रिका',
        'पासपोर्ट फोटो व बँक पासबुक झेरॉक्स'
      ],
      nodalContact: 'जिल्हा उद्योग केंद्र (DIC) किंवा KVIC नोडल बँक शाखा',
      trustLevel: 'FACT',
      officialSourceUrl: 'https://www.kviconline.gov.in/pmegp/'
    },
    {
      id: 'scheme_mudra_kishore',
      name: 'Pradhan Mantri MUDRA Yojana (Kishore Loan)',
      nameNative: {
        mr: 'प्रधानमंत्री मुद्रा योजना (किशोर कर्ज)',
        hi: 'प्रधानमंत्री मुद्रा योजना (किशोर लोन)',
        en: 'Pradhan Mantri MUDRA Yojana (Kishore)'
      },
      sponsoringAgency: 'MUDRA Ltd / Department of Financial Services',
      maxProjectCost: 500000, // ₹5 Lakhs
      subsidyPercent: 0,
      interestRateRange: '८.५% ते ११.०% वार्षिक',
      tenureYears: 5,
      moratoriumMonths: 3,
      suitability: projectCost <= 500000 ? 'potentially_eligible' : 'needs_information',
      whySuitable: {
        mr: '₹५ लाखांपर्यंत विनातारण (Collateral Free) खेळते भांडवल व मशिनरीसाठी त्वरित कर्ज.',
        hi: '₹५ लाख तक बिना किसी गारंटी के तत्काल लोन सुविधा।',
        en: 'Collateral-free micro-enterprise funding for equipment purchase and initial working capital.'
      },
      eligibilityConditions: [
        'कोणत्याही बँकेचा थकबाकीदार (Defaulter) नसावा',
        'व्यवसायाचे प्राथमिक अंदाजपत्रक'
      ],
      requiredDocuments: [
        'आधार कार्ड व पॅन कार्ड',
        'उद्यम आधार (Udyam MSME Registration)',
        'स्थानिक बँक खात्याचे मागील ६ महिन्यांचे स्टेटमेंट'
      ],
      nodalContact: 'स्थानिक राष्ट्रीयीकृत किंवा सहकारी बँक शाखा',
      trustLevel: 'FACT',
      officialSourceUrl: 'https://www.mudra.org.in/'
    },
    {
      id: 'scheme_cmegp_mh',
      name: 'Chief Minister Employment Generation Programme (CMEGP)',
      nameNative: {
        mr: 'मुख्यमंत्री रोजगार निर्मिती कार्यक्रम (CMEGP महाराष्ट्र)',
        hi: 'मुख्यमंत्री रोजगार सृजन कार्यक्रम (CMEGP महाराष्ट्र)',
        en: 'Chief Minister Employment Generation Programme (CMEGP)'
      },
      sponsoringAgency: 'Directorate of Industries, Government of Maharashtra',
      maxProjectCost: 5000000,
      subsidyPercent: isRural ? 35 : 25,
      interestRateRange: '८.५% ते ९.५%',
      tenureYears: 7,
      moratoriumMonths: 6,
      suitability: 'potentially_eligible',
      whySuitable: {
        mr: 'महाराष्ट्रातील ग्रामीण तरुणांसाठी राज्य शासनाची २५% ते ३५% अनुदान देणारी गतिमान योजना.',
        hi: 'महाराष्ट्र के युवाओं के लिए २५% से ३५% सब्सिडी वाली राज्य सरकार की योजना।',
        en: 'State government initiative with 25-35% subsidy and fast-track bank linkages across Maharashtra.'
      },
      eligibilityConditions: [
        'महाराष्ट्राचा रहिवासी (डोमिसाईल प्रमाणपत्र)',
        'वय १८ ते ४५ वर्षे'
      ],
      requiredDocuments: [
        'डोमिसाईल सर्टिफिकेट (अधिवास प्रमाणपत्र)',
        'आधार कार्ड व पॅन कार्ड',
        'प्रकल्प अहवाल (DPR)'
      ],
      nodalContact: 'जिल्हा उद्योग केंद्र (DIC), पुणे',
      trustLevel: 'FACT',
      officialSourceUrl: 'https://cmegp.gov.in/'
    }
  ];
};
