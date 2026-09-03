// ==============================================================================
// SAATHI Master Indian Language Catalog
// Based on 2011 Census Reference: 22 Scheduled Languages of India + English
// Note: India has vast linguistic diversity; this system is architected to allow
// additional regional languages and dialects without redesigning the application.
// ==============================================================================

import { LanguageCode } from '../types';

export interface LanguageDefinition {
  id: string;
  code: LanguageCode;
  name: string;
  nativeName: string;
  script: string;
  direction: 'ltr' | 'rtl';
  enabled: boolean;
  uiSupported: boolean;
  voiceInputSupported: boolean;
  voiceOutputSupported: boolean;
  aiResponseSupported: boolean;
  fallbackLanguage: LanguageCode;
  speechRecognitionLocale: string;
  speechSynthesisLocales: string[];
  region: string;
  pronunciationSample: string;
}

export const MASTER_LANGUAGES: LanguageDefinition[] = [
  // 1. Marathi (Western India)
  {
    id: 'lang_mr',
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'en',
    speechRecognitionLocale: 'mr-IN',
    speechSynthesisLocales: ['mr-IN', 'mr_IN'],
    region: 'Maharashtra & Goa',
    pronunciationSample: 'मराठी भाषा निवडली आहे.'
  },
  // 2. Hindi (North & Central India)
  {
    id: 'lang_hi',
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'en',
    speechRecognitionLocale: 'hi-IN',
    speechSynthesisLocales: ['hi-IN', 'hi_IN'],
    region: 'North & Central India',
    pronunciationSample: 'हिंदी भाषा चुनी गई है।'
  },
  // 3. English (Universal / Pan-India)
  {
    id: 'lang_en',
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'en',
    speechRecognitionLocale: 'en-IN',
    speechSynthesisLocales: ['en-IN', 'en_IN', 'en-GB', 'en-US'],
    region: 'Pan-India & Universal',
    pronunciationSample: 'English language selected.'
  },
  // 4. Bengali (Eastern India)
  {
    id: 'lang_bn',
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'en',
    speechRecognitionLocale: 'bn-IN',
    speechSynthesisLocales: ['bn-IN', 'bn_IN', 'bn-BD'],
    region: 'West Bengal & Tripura',
    pronunciationSample: 'বাংলা ভাষা নির্বাচন করা হয়েছে।'
  },
  // 5. Tamil (Southern India)
  {
    id: 'lang_ta',
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'en',
    speechRecognitionLocale: 'ta-IN',
    speechSynthesisLocales: ['ta-IN', 'ta_IN', 'ta-LK'],
    region: 'Tamil Nadu & Puducherry',
    pronunciationSample: 'தமிழ் தேர்ந்தெடுக்கப்பட்டது.'
  },
  // 6. Telugu (Southern India)
  {
    id: 'lang_te',
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'en',
    speechRecognitionLocale: 'te-IN',
    speechSynthesisLocales: ['te-IN', 'te_IN'],
    region: 'Andhra Pradesh & Telangana',
    pronunciationSample: 'తెలుగు ఎంచుకోబడింది.'
  },
  // 7. Gujarati (Western India)
  {
    id: 'lang_gu',
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'en',
    speechRecognitionLocale: 'gu-IN',
    speechSynthesisLocales: ['gu-IN', 'gu_IN'],
    region: 'Gujarat & Daman and Diu',
    pronunciationSample: 'ગુજરાતી પસંદ કરવામાં આવી છે.'
  },
  // 8. Kannada (Southern India)
  {
    id: 'lang_kn',
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'en',
    speechRecognitionLocale: 'kn-IN',
    speechSynthesisLocales: ['kn-IN', 'kn_IN'],
    region: 'Karnataka',
    pronunciationSample: 'ಕನ್ನಡ ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ.'
  },
  // 9. Malayalam (Southern India)
  {
    id: 'lang_ml',
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'en',
    speechRecognitionLocale: 'ml-IN',
    speechSynthesisLocales: ['ml-IN', 'ml_IN'],
    region: 'Kerala & Lakshadweep',
    pronunciationSample: 'മലയാളം തിരഞ്ഞെടുത്തു.'
  },
  // 10. Odia (Eastern India)
  {
    id: 'lang_or',
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'en',
    speechRecognitionLocale: 'or-IN',
    speechSynthesisLocales: ['or-IN', 'or_IN'],
    region: 'Odisha',
    pronunciationSample: 'ଓଡ଼ିଆ ଭାଷା ଚୟନ କରାଯାଇଛି।'
  },
  // 11. Punjabi (Northern India)
  {
    id: 'lang_pa',
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'en',
    speechRecognitionLocale: 'pa-IN',
    speechSynthesisLocales: ['pa-IN', 'pa_IN'],
    region: 'Punjab & Chandigarh',
    pronunciationSample: 'ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਚੁਣੀ ਗਈ ਹੈ।'
  },
  // 12. Assamese (North-Eastern India)
  {
    id: 'lang_as',
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'Bengali-Assamese',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'en',
    speechRecognitionLocale: 'as-IN',
    speechSynthesisLocales: ['as-IN', 'as_IN', 'bn-IN'],
    region: 'Assam',
    pronunciationSample: 'অসমীয়া ভাষা নিৰ্বাচিত কৰা হৈছে।'
  },
  // 13. Urdu (Pan-India)
  {
    id: 'lang_ur',
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    script: 'Perso-Arabic (Nastaliq)',
    direction: 'rtl',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'en',
    speechRecognitionLocale: 'ur-IN',
    speechSynthesisLocales: ['ur-IN', 'ur_IN', 'ur-PK'],
    region: 'Pan-India, Telangana, UP, Bihar, J&K',
    pronunciationSample: 'اردو زبان منتخب کی گئی ہے۔'
  },
  // 14. Nepali (Sikkim & North Bengal)
  {
    id: 'lang_ne',
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    script: 'Devanagari',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'hi',
    speechRecognitionLocale: 'ne-NP',
    speechSynthesisLocales: ['ne-NP', 'ne-IN', 'hi-IN'],
    region: 'Sikkim & West Bengal (Darjeeling)',
    pronunciationSample: 'नेपाली भाषा चयन गरिएको छ।'
  },
  // 15. Konkani (Goa & Coastal Maharashtra/Karnataka)
  {
    id: 'lang_kok',
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी',
    script: 'Devanagari',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'mr',
    speechRecognitionLocale: 'kok-IN',
    speechSynthesisLocales: ['kok-IN', 'mr-IN'],
    region: 'Goa, Maharashtra & Karnataka (Konkan)',
    pronunciationSample: 'कोंकणी भास निवडली आसा।'
  },
  // 16. Maithili (Bihar & Jharkhand)
  {
    id: 'lang_mai',
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    script: 'Devanagari',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'hi',
    speechRecognitionLocale: 'mai-IN',
    speechSynthesisLocales: ['mai-IN', 'hi-IN'],
    region: 'Bihar & Jharkhand (Mithila)',
    pronunciationSample: 'मैथिली भाषा चुनल गेल अछि।'
  },
  // 17. Dogri (Jammu & Kashmir)
  {
    id: 'lang_doi',
    code: 'doi',
    name: 'Dogri',
    nativeName: 'डोगरी',
    script: 'Devanagari',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'hi',
    speechRecognitionLocale: 'doi-IN',
    speechSynthesisLocales: ['doi-IN', 'hi-IN'],
    region: 'Jammu & Kashmir & Himachal Pradesh',
    pronunciationSample: 'डोगरी भाशा चुनी गेई ऐ।'
  },
  // 18. Kashmiri (Jammu & Kashmir)
  {
    id: 'lang_ks',
    code: 'ks',
    name: 'Kashmiri',
    nativeName: 'کٲشُر',
    script: 'Perso-Arabic',
    direction: 'rtl',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'ur',
    speechRecognitionLocale: 'ks-IN',
    speechSynthesisLocales: ['ks-IN', 'ur-IN'],
    region: 'Jammu & Kashmir',
    pronunciationSample: 'کٲشُر زبان چُھ منتخب کرنہٕ آمُت۔'
  },
  // 19. Bodo (Assam)
  {
    id: 'lang_brx',
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बोडो',
    script: 'Devanagari',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'as',
    speechRecognitionLocale: 'brx-IN',
    speechSynthesisLocales: ['brx-IN', 'hi-IN', 'as-IN'],
    region: 'Bodoland (Assam)',
    pronunciationSample: 'बोडो राव सायखनाय जाबाय।'
  },
  // 20. Santali (Jharkhand, Odisha, West Bengal)
  {
    id: 'lang_sat',
    code: 'sat',
    name: 'Santali',
    nativeName: 'संथाली / ᱥᱟᱱᱛᱟᱲᱤ',
    script: 'Ol Chiki & Devanagari',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'hi',
    speechRecognitionLocale: 'sat-IN',
    speechSynthesisLocales: ['sat-IN', 'hi-IN'],
    region: 'Jharkhand, Odisha & West Bengal',
    pronunciationSample: 'ᱥᱟᱱᱛᱟᱲᱤ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱮᱱᱟ।'
  },
  // 21. Manipuri / Meitei (Manipur)
  {
    id: 'lang_mni',
    code: 'mni',
    name: 'Manipuri',
    nativeName: 'মৈতৈলোন্ / মণিপুরী',
    script: 'Meitei Mayek & Bengali',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'bn',
    speechRecognitionLocale: 'mni-IN',
    speechSynthesisLocales: ['mni-IN', 'bn-IN'],
    region: 'Manipur',
    pronunciationSample: 'মৈতৈলোন্ খনখ্রে।'
  },
  // 22. Sanskrit (Pan-India Classical)
  {
    id: 'lang_sa',
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    script: 'Devanagari',
    direction: 'ltr',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'hi',
    speechRecognitionLocale: 'sa-IN',
    speechSynthesisLocales: ['sa-IN', 'hi-IN'],
    region: 'Universal / Classical',
    pronunciationSample: 'संस्कृतभाषा चयनिता अस्ति।'
  },
  // 23. Sindhi (Pan-India)
  {
    id: 'lang_sd',
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'سنڌي / सिन्धी',
    script: 'Perso-Arabic & Devanagari',
    direction: 'rtl',
    enabled: true,
    uiSupported: true,
    voiceInputSupported: true,
    voiceOutputSupported: true,
    aiResponseSupported: true,
    fallbackLanguage: 'hi',
    speechRecognitionLocale: 'sd-IN',
    speechSynthesisLocales: ['sd-IN', 'hi-IN', 'ur-IN'],
    region: 'Pan-India (Gujarat, Maharashtra, Rajasthan)',
    pronunciationSample: 'سنڌي ٻولي چونڊجي وئي آهي।'
  }
];

export const LANGUAGE_MAP = new Map<LanguageCode, LanguageDefinition>(
  MASTER_LANGUAGES.map((l) => [l.code, l])
);

export function getLanguageDefinition(code: LanguageCode): LanguageDefinition {
  return LANGUAGE_MAP.get(code) || MASTER_LANGUAGES[0]; // defaults to Marathi if code unknown
}
