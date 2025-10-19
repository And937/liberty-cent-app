
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Import translation files
import en from '../locales/en.json';
import ru from '../locales/ru.json';
import zh from '../locales/zh.json';

export type Locale = 'en' | 'ru' | 'zh';

const translations: Record<Locale, any> = { en, ru, zh };

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This effect runs only on the client
    const savedLocale = localStorage.getItem('locale') as Locale | null;
    if (savedLocale && ['en', 'ru', 'zh'].includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
    setIsMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };
  
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let result = translations[locale];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if key not found in current locale
        let fallbackResult = translations['en'];
        for (const fk of keys) {
          fallbackResult = fallbackResult?.[fk];
          if (fallbackResult === undefined) {
            return key; // Return key if not found in English either
          }
        }
        result = fallbackResult;
        break;
      }
    }

    if (typeof result === 'string' && params) {
        return result.replace(/{(\w+)}/g, (placeholder, placeholderKey) => {
            return params[placeholderKey] !== undefined ? String(params[placeholderKey]) : placeholder;
        });
    }

    return typeof result === 'string' ? result : key;
  };

  if (!isMounted) {
    // On the server or during initial client render, we can render children with default (en) translations.
    // This avoids layout shifts and renders the initial content faster.
     return (
      <LanguageContext.Provider value={{ locale: 'en', setLocale: () => {}, t: (key, params) => {
         const keys = key.split('.');
          let result = translations['en'];
          for (const k of keys) {
            result = result?.[k];
            if (result === undefined) {
              return key;
            }
          }
           if (typeof result === 'string' && params) {
              return result.replace(/{(\w+)}/g, (placeholder, placeholderKey) => {
                  return params[placeholderKey] !== undefined ? String(params[placeholderKey]) : placeholder;
              });
          }
          return typeof result === 'string' ? result : key;
      } }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};