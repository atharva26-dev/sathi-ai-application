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
  }
];

export const BACKEND_LANGUAGE_MAP = new Map<SupportedLanguage, BackendLanguageDefinition>(
  BACKEND_LANGUAGES.map((l) => [l.code, l])
);

export function getBackendLanguage(code: string): BackendLanguageDefinition {
  return BACKEND_LANGUAGE_MAP.get(code as SupportedLanguage) || BACKEND_LANGUAGES[0];
}
