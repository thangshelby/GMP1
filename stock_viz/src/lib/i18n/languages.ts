export interface Language {
  code: string;
  name: string;
  flag: string;
  isRTL?: boolean;
}

export const supportedLanguages: Language[] = [
  {
    code: 'en',
    name: 'English',
    flag: '/images/en.png',
  },
  {
    code: 'vi',
    name: 'Tiếng Việt',
    flag: '/images/vn.png',
  },
  // Add more languages here in the future
];

export const getLanguageByCode = (code: string): Language => {
  return supportedLanguages.find(lang => lang.code === code) || supportedLanguages[0];
};

export const getNextLanguage = (currentCode: string): Language => {
  const currentIndex = supportedLanguages.findIndex(lang => lang.code === currentCode);
  const nextIndex = (currentIndex + 1) % supportedLanguages.length;
  return supportedLanguages[nextIndex];
}; 