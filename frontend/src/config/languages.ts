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
  }
];

export const LANGUAGE_MAP = new Map<LanguageCode, LanguageDefinition>(
  MASTER_LANGUAGES.map((l) => [l.code, l])
);

export function getLanguageDefinition(code: LanguageCode): LanguageDefinition {
  return LANGUAGE_MAP.get(code) || MASTER_LANGUAGES[0]; // defaults to Marathi if code unknown
}
