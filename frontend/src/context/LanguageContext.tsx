import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';
import { TranslationSchema } from '../locales/types';
import { getTranslation, supportedLanguages } from '../locales';
import { storageService } from '../services/storageService';
import { profileService } from '../services/profileService';
import { getLanguageDefinition, LanguageDefinition } from '../config/languages';

interface LanguageContextType {
  language: LanguageCode;
  languageDef: LanguageDefinition;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationSchema;
  supportedLanguages: typeof supportedLanguages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_STORAGE_KEY = 'preferred_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return storageService.get<LanguageCode>(LANG_STORAGE_KEY, 'mr');
  });

  const languageDef = getLanguageDefinition(language);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    storageService.set(LANG_STORAGE_KEY, lang);
    profileService.saveProfile({ preferredLanguage: lang });

    const def = getLanguageDefinition(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = def.direction;
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = languageDef.direction;
  }, [language, languageDef.direction]);

  const t = getTranslation(language);

  return (
    <LanguageContext.Provider value={{ language, languageDef, setLanguage, t, supportedLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
