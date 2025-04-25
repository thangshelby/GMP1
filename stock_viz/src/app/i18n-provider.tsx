'use client';

import { ReactNode, createContext, useCallback, useEffect, useState } from 'react';
import i18n from '../i18n/i18n';

export interface I18nContextType {
  language: string;
  changeLanguage: (lang: string) => void;
}

export const I18nContext = createContext<I18nContextType>({
  language: 'en',
  changeLanguage: () => {},
});

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Initialize i18n on the client side
    const savedLang = localStorage.getItem('language') || 'en';
    i18n.changeLanguage(savedLang);
    setLanguage(savedLang);
  }, []);

  const changeLanguage = useCallback((lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    setLanguage(lang);
  }, []);

  return (
    <I18nContext.Provider value={{ language, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
} 