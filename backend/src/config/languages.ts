// ==============================================================================
// SAATHI Backend Master Indian Language Catalog
// 22 Scheduled Languages + English
// ==============================================================================

import { SupportedLanguage } from './constants.js';

export interface BackendLanguageDefinition {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  script: string;
  scriptUnicodeRanges: Array<[number, number]>;
  direction: 'ltr' | 'rtl';
  speechLocale: string;
  region: string;
}

export const BACKEND_LANGUAGES: BackendLanguageDefinition[] = [
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    scriptUnicodeRanges: [[0x0900, 0x097F]],
    direction: 'ltr',
    speechLocale: 'mr-IN',
    region: 'Maharashtra'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    scriptUnicodeRanges: [[0x0900, 0x097F]],
    direction: 'ltr',
    speechLocale: 'hi-IN',
    region: 'North & Central India'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    scriptUnicodeRanges: [[0x0041, 0x007A]],
    direction: 'ltr',
    speechLocale: 'en-IN',
    region: 'Pan-India & Universal'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    scriptUnicodeRanges: [[0x0980, 0x09FF]],
    direction: 'ltr',
    speechLocale: 'bn-IN',
    region: 'West Bengal & Tripura'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    scriptUnicodeRanges: [[0x0B80, 0x0BFF]],
    direction: 'ltr',
    speechLocale: 'ta-IN',
    region: 'Tamil Nadu'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    scriptUnicodeRanges: [[0x0C00, 0x0C7F]],
    direction: 'ltr',
    speechLocale: 'te-IN',
    region: 'Andhra Pradesh & Telangana'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    scriptUnicodeRanges: [[0x0A80, 0x0AFF]],
    direction: 'ltr',
    speechLocale: 'gu-IN',
    region: 'Gujarat'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    scriptUnicodeRanges: [[0x0C80, 0x0CFF]],
    direction: 'ltr',
    speechLocale: 'kn-IN',
    region: 'Karnataka'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    scriptUnicodeRanges: [[0x0D00, 0x0D7F]],
    direction: 'ltr',
    speechLocale: 'ml-IN',
    region: 'Kerala'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    scriptUnicodeRanges: [[0x0A00, 0x0A7F]],
    direction: 'ltr',
    speechLocale: 'pa-IN',
    region: 'Punjab'
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    scriptUnicodeRanges: [[0x0B00, 0x0B7F]],
    direction: 'ltr',
    speechLocale: 'or-IN',
    region: 'Odisha'
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'Bengali-Assamese',
    scriptUnicodeRanges: [[0x0980, 0x09FF]],
    direction: 'ltr',
    speechLocale: 'as-IN',
    region: 'Assam'
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    script: 'Perso-Arabic',
    scriptUnicodeRanges: [[0x0600, 0x06FF]],
    direction: 'rtl',
    speechLocale: 'ur-IN',
    region: 'Pan-India'
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    script: 'Devanagari',
    scriptUnicodeRanges: [[0x0900, 0x097F]],
    direction: 'ltr',
    speechLocale: 'sa-IN',
    region: 'Universal'
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    script: 'Devanagari',
    scriptUnicodeRanges: [[0x0900, 0x097F]],
    direction: 'ltr',
    speechLocale: 'ne-NP',
    region: 'Sikkim & West Bengal'
  },
  {
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी',
    script: 'Devanagari',
    scriptUnicodeRanges: [[0x0900, 0x097F]],
    direction: 'ltr',
    speechLocale: 'kok-IN',
    region: 'Goa & Konkan'
  },
  {
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    script: 'Devanagari',
    scriptUnicodeRanges: [[0x0900, 0x097F]],
    direction: 'ltr',
    speechLocale: 'mai-IN',
    region: 'Bihar & Jharkhand'
  },
  {
    code: 'doi',
    name: 'Dogri',
    nativeName: 'डोगरी',
    script: 'Devanagari',
    scriptUnicodeRanges: [[0x0900, 0x097F]],
    direction: 'ltr',
    speechLocale: 'doi-IN',
    region: 'Jammu & Kashmir'
  },
  {
    code: 'ks',
    name: 'Kashmiri',
    nativeName: 'کٲشُر',
    script: 'Perso-Arabic',
    scriptUnicodeRanges: [[0x0600, 0x06FF], [0x0900, 0x097F]],
    direction: 'rtl',
    speechLocale: 'ks-IN',
    region: 'Jammu & Kashmir'
  },
  {
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बोडो',
    script: 'Devanagari',
    scriptUnicodeRanges: [[0x0900, 0x097F]],
    direction: 'ltr',
    speechLocale: 'brx-IN',
    region: 'Assam'
  },
  {
    code: 'sat',
    name: 'Santali',
    nativeName: 'संथाली / ᱥᱟᱱᱛᱟᱲᱤ',
    script: 'Ol Chiki & Devanagari',
    scriptUnicodeRanges: [[0x1C50, 0x1C7F], [0x0900, 0x097F]],
    direction: 'ltr',
    speechLocale: 'sat-IN',
    region: 'Jharkhand & Odisha'
  },
  {
    code: 'mni',
    name: 'Manipuri',
    nativeName: 'মৈতৈলোন্ / মণিপুরী',
    script: 'Meitei Mayek & Bengali',
    scriptUnicodeRanges: [[0xABC0, 0xABFF], [0x0980, 0x09FF]],
    direction: 'ltr',
    speechLocale: 'mni-IN',
    region: 'Manipur'
  },
  {
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'سنڌي / सिन्धी',
    script: 'Perso-Arabic & Devanagari',
    scriptUnicodeRanges: [[0x0600, 0x06FF], [0x0900, 0x097F]],
    direction: 'rtl',
    speechLocale: 'sd-IN',
    region: 'Pan-India'
  }
];

export const BACKEND_LANGUAGE_MAP = new Map<SupportedLanguage, BackendLanguageDefinition>(
  BACKEND_LANGUAGES.map((l) => [l.code, l])
);

export function getBackendLanguage(code: string): BackendLanguageDefinition {
  return BACKEND_LANGUAGE_MAP.get(code as SupportedLanguage) || BACKEND_LANGUAGES[0];
}
