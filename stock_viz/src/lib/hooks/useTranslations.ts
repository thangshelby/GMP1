import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { I18nContext } from '@/app/i18n-provider';
import { TOptions } from 'i18next';

export function useTranslations() {
  const { t, i18n } = useTranslation();
  const { language, changeLanguage } = useContext(I18nContext);

  return {
    t,
    language,
    changeLanguage,
    isRTL: i18n.dir() === 'rtl',
    // Add namespace-specific translation functions if needed
    tCommon: (key: string, options?: TOptions) => t(key, { ...options, ns: 'common' }),
    tHome: (key: string, options?: TOptions) => t(key, { ...options, ns: 'home' }),
    tStockChart: (key: string, options?: TOptions) => t(key, { ...options, ns: 'stockchart' }),
    tScreener: (key: string, options?: TOptions) => t(key, { ...options, ns: 'screener' }),
  };
} 