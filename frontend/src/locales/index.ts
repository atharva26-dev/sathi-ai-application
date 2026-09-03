import { LanguageCode } from '../types';
import { TranslationSchema, DeepPartial } from './types';
import { mr } from './mr';
import { hi } from './hi';
import { en } from './en';
import { ta } from './ta';
import { te } from './te';
import { bn } from './bn';
import { gu } from './gu';
import { kn } from './kn';
import { ml } from './ml';
import { pa } from './pa';
import { or } from './or';
import { ur } from './ur';
import { as } from './as';
import { MASTER_LANGUAGES, getLanguageDefinition } from '../config/languages';

// Raw dictionary collection
const RAW_TRANSLATIONS: Record<string, DeepPartial<TranslationSchema>> = {
  mr,
  hi,
  en,
  ta,
  te,
  bn,
  gu,
  kn,
  ml,
  pa,
  or,
  ur,
  as
};

/**
 * Creates a recursive fallback Proxy that guarantees no property returns undefined.
 * Target -> Sister / Regional Fallback -> English root
 */
function createFallbackProxy<T extends object>(
  target: any,
  fallback: T,
  languageCode: string,
  path = ''
): T {
  return new Proxy(target as T, {
    get(obj, prop: string | symbol) {
      if (typeof prop === 'symbol') {
        return (obj as any)[prop];
      }

      const val = (obj as any)[prop];
      const fallbackVal = (fallback as any)?.[prop];
      const currentPath = path ? `${path}.${prop}` : prop;

      if (val !== undefined && val !== null && val !== '') {
        if (typeof val === 'object' && !Array.isArray(val) && typeof fallbackVal === 'object') {
          return createFallbackProxy(val, fallbackVal, languageCode, currentPath);
        }
        return val;
      }

      if (fallbackVal !== undefined) {
        return fallbackVal;
      }

      return '';
    }
  });
}

// Assemble full runtime translations for all 23 languages
export const translations: Record<LanguageCode, TranslationSchema> = {} as any;

for (const langDef of MASTER_LANGUAGES) {
  const code = langDef.code;
  const rawDict = RAW_TRANSLATIONS[code] || {};
  const sisterFallbackCode = langDef.fallbackLanguage || 'en';
  const sisterRawDict = RAW_TRANSLATIONS[sisterFallbackCode] || RAW_TRANSLATIONS.hi || en;

  // First chain to sister language if available, then to root English
  const sisterProxy = createFallbackProxy<TranslationSchema>(
    sisterRawDict,
    en,
    sisterFallbackCode
  );

  translations[code] = createFallbackProxy<TranslationSchema>(
    rawDict,
    sisterProxy,
    code
  );
}

export const supportedLanguages = MASTER_LANGUAGES.map((l) => ({
  code: l.code,
  label: l.name,
  nativeLabel: l.nativeName,
  region: l.region,
  direction: l.direction,
  script: l.script
}));

export function getTranslation(lang: LanguageCode): TranslationSchema {
  return translations[lang] || translations.en;
}
