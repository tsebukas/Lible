import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { en } from './translations/en';
import { et } from './translations/et';

export type Language = 'en' | 'et';
export type TranslationKey = keyof typeof en;

const translations = {
  en,
  et
} as const;

// Default language and fallback
let currentLanguage: Language = 'et';
const fallbackLanguage: Language = 'en';

// Get browser language
const getBrowserLanguage = (): Language => {
  const lang = navigator.language.split('-')[0];
  return lang === 'et' ? 'et' : 'en';
};

// Initialize language
export const initializeLanguage = (): Language => {
  // Try to get language from localStorage
  const savedLang = localStorage.getItem('language') as Language;
  if (savedLang && (savedLang === 'et' || savedLang === 'en')) {
    currentLanguage = savedLang;
  } else {
    // Use browser language or fallback
    currentLanguage = getBrowserLanguage();
    localStorage.setItem('language', currentLanguage);
  }
  return currentLanguage;
};

// Get current language
export const getCurrentLanguage = (): Language => currentLanguage;

// Set language
export const setLanguage = (lang: Language): void => {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  // Trigger page reload or state update
  window.location.reload();
};

// Translation function
export interface TranslationParams {
  [key: string]: string | number;
}

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => {
    if (acc === undefined) return undefined;
    return acc[part];
  }, obj);
};

export const translate = (key: string, params?: TranslationParams): string => {
  // Get translation from current language
  let translation = getNestedValue(translations[currentLanguage], key);
  
  // Fallback to English if translation not found
  if (translation === undefined) {
    translation = getNestedValue(translations[fallbackLanguage], key);
  }
  
  // Return key if translation not found in fallback
  if (translation === undefined) {
    console.warn(`Translation missing for key: ${key}`);
    return key;
  }
  
  // Handle function translations (e.g., for plurals or interpolation)
  if (typeof translation === 'function') {
    return translation(params);
  }
  
  // Replace parameters in translation
  if (params) {
    return Object.entries(params).reduce((str, [key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      return str.replace(regex, String(value));
    }, translation as string);
  }
  
  return translation as string;
};

// Language context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: TranslationParams) => string;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Provider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLang] = useState<Language>(initializeLanguage());

  const value: LanguageContextType = {
    language,
    setLanguage: (lang: Language) => {
      setLang(lang);
      setLanguage(lang);
    },
    t: translate
  };

  return React.createElement(LanguageContext.Provider, { value }, children);
};

// Hook for using translations
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
