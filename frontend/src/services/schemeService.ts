import { SchemeInfo } from '../types';

export const SCHEMES: SchemeInfo[] = [
  {
    id: 'scheme_pmegp',
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    nameNative: {
      mr: 'पंतप्रधान रोजगार निर्मिती कार्यक्रम (PMEGP)',
      hi: 'प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)',
      en: "Prime Minister's Employment Generation Programme (PMEGP)"
    },
    sponsoringAgency: 'KVIC / Khadi & Village Industries Commission',
    maxProjectCost: 5000000, // ₹50 Lakh for manufacturing
    subsidyPercent: 35, // 35% for Special Categories / Rural areas
    interestRateRange: '८.५% ते १०.५% प्रतिवर्ष',
    tenureYears: 7,
    moratoriumMonths: 6,
    suitability: 'SUITABLE',
    whySuitable: 'ग्रामीण भागात कृषी व दुग्ध प्रक्रिया उद्योगांसाठी ३५% पर्यंत थेट सरकारी अनुदान (सबसिडी) मिळते.',
    eligibilityConditions: [
      'वय १८ वर्षांपेक्षा जास्त असावे',
      'किमान ८ वी पास (१० लाखांवरील प्रकल्पासाठी)',
      'ग्रामीण भागात नवीन प्रकल्प उभारणी',
      'स्वतःचे १०% ते ५% भांडवल योगदान आवश्यक'
    ],
    requiredDocuments: [
      'आधार कार्ड व पॅन कार्ड',
      '८ वी / १० वी शाळा सोडल्याचा दाखला (TC/Marksheet)',
      'जातीचा दाखला (लागू असल्यास ३५% सबसिडीसाठी)',
      'प्रकल्प अहवाल (Detailed Project Report - DPR)',
      'जागेचा ७/१२ उतारा किंवा भाडेकरार'
    ],
    nodalContact: 'जिल्हा उद्योग केंद्र (DIC) / KVIC कार्यालय',
    trustInfo: {
      level: 'VERIFIED',
      confidenceScore: 95,
      sourceText: 'kviconline.gov.in अधिकृत मार्गदर्शक सूचना २०२५-२६',
      evidence: ['KVIC PMEGP पोर्टल निकष']
    }
  },
  {
    id: 'scheme_mudra_kishore',
    name: 'Pradhan Mantri MUDRA Yojana - Kishore',
    nameNative: {
      mr: 'मुद्रा योजना - किशोर (₹५०,००० ते ₹५ लाख)',
      hi: 'मुद्रा योजना - किशोर (₹५०,००० से ₹५ लाख)',
      en: 'PM MUDRA Yojana - Kishore'
    },
    sponsoringAgency: 'Ministry of Finance / All Scheduled Commercial Banks',
    maxProjectCost: 500000,
    subsidyPercent: 0, // No direct capital subsidy, but collateral-free
    interestRateRange: '९.०% ते ११.५% प्रतिवर्ष',
    tenureYears: 5,
    moratoriumMonths: 3,
    suitability: 'SUITABLE',
    whySuitable: 'कोणतीही मालमत्ता गहाण न ठेवता (Collateral Free) जलद गतीने मिळणारे बँक कर्ज.',
    eligibilityConditions: [
      'भारतीय नागरिक असावा',
      'कोणत्याही बँकेचा थकबाकीदार (Defaulter) नसावा',
      'व्यवसायाचा स्पष्ट प्रस्ताव व बँक खाते असणे आवश्यक'
    ],
    requiredDocuments: [
      'आधार, पॅन व फोटो',
      'गेल्या ६ महिन्यांचे बँक स्टेटमेंट',
      'उद्यम नोंदणी (Udyam Registration)',
      'यंत्रसामग्रीचे कोटेशन'
    ],
    nodalContact: 'जवळची कोणतीही राष्ट्रीयीकृत किंवा ग्रामीण बँक शाखा',
    trustInfo: {
      level: 'VERIFIED',
      confidenceScore: 98,
      sourceText: 'mudra.org.in'
    }
  },
  {
    id: 'scheme_deds_ahidf',
    name: 'Animal Husbandry & Dairy Infrastructure Fund (AHIDF)',
    nameNative: {
      mr: 'पशुसंवर्धन व दुग्ध प्रक्रिया पायाभूत निधी (AHIDF / DEDS)',
      hi: 'पशुपालन व डेयरी अवसंरचना विकास निधि (AHIDF)',
      en: 'Animal Husbandry & Dairy Infrastructure Fund'
    },
    sponsoringAgency: 'Department of Animal Husbandry and Dairying, GoI',
    maxProjectCost: 20000000,
    subsidyPercent: 25, // Interest subvention of 3% + capital support
    interestRateRange: '६.५% ते ८.०% (३% व्याज सवलतीसह)',
    tenureYears: 8,
    moratoriumMonths: 24,
    suitability: 'NEEDS_VERIFICATION',
    whySuitable: 'दुग्ध शीतकरण, पनीर व मूल्यवर्धित उत्पादनांच्या मोठ्या प्लांटसाठी अत्यंत कमी व्याजाचे कर्ज.',
    eligibilityConditions: [
      'डेअरी प्रक्रियेचा तांत्रिक अनुभव किंवा प्रशिक्षण प्रमाणपत्र',
      'किमान १०% स्वतःचे भांडवल',
      'FSSAI परवाना मिळवण्याची पूर्वतयारी'
    ],
    requiredDocuments: [
      'सविस्तर सीए प्रमाणित प्रकल्प अहवाल',
      'जागेची मालकी कागदपत्रे व प्रदूषण नियंत्रण NOC',
      'बँक मूल्यांकन'
    ],
    nodalContact: 'नाबार्ड (NABARD) व पशुसंवर्धन विभाग',
    trustInfo: {
      level: 'VERIFIED',
      confidenceScore: 90
    }
  },
  {
    id: 'scheme_cmegp_maha',
    name: 'Chief Minister Employment Generation Programme (CMEGP)',
    nameNative: {
      mr: 'मुख्यमंत्री रोजगार निर्मिती कार्यक्रम (CMEGP महाराष्ट्र)',
      hi: 'मुख्यमंत्री रोजगार सृजन कार्यक्रम (CMEGP)',
      en: 'Chief Minister Employment Generation Programme'
    },
    sponsoringAgency: 'Directorate of Industries, Maharashtra',
    maxProjectCost: 5000000,
    subsidyPercent: 35, // 35% for rural special category
    interestRateRange: '९.०% ते १०.५%',
    tenureYears: 7,
    moratoriumMonths: 6,
    suitability: 'SUITABLE',
    whySuitable: 'महाराष्ट्र राज्यातील ग्रामीण नवउद्योजकांसाठी १५% ते ३५% भांडवली अनुदान थेट बँक खात्यात जमा.',
    eligibilityConditions: [
      'महाराष्ट्र राज्याचे अधिवास प्रमाणपत्र (Domicile)',
      'वय १८ ते ४५ वर्षे',
      'किमान ७ वी पास'
    ],
    requiredDocuments: [
      'डोमिसाईल सर्टिफिकेट (रहिवासी दाखला)',
      'आधार व पॅन कार्ड',
      'प्रकल्प अहवाल'
    ],
    nodalContact: 'जिल्हा उद्योग केंद्र, पुणे',
    trustInfo: {
      level: 'VERIFIED',
      confidenceScore: 94
    }
  }
];

export const schemeService = {
  getSchemes(): SchemeInfo[] {
    return SCHEMES;
  },

  getSchemeById(id: string): SchemeInfo | undefined {
    return SCHEMES.find((s) => s.id === id);
  },

  filterBySuitability(status: 'SUITABLE' | 'NEEDS_VERIFICATION' | 'NOT_SUITABLE'): SchemeInfo[] {
    return SCHEMES.filter((s) => s.suitability === status);
  }
};
