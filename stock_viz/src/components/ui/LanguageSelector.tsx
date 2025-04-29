"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { getLanguageByCode, getNextLanguage, supportedLanguages } from "@/lib/i18n/languages";
import Image from "next/image";
import { useState } from "react";

interface LanguageSelectorProps {
  variant?: "icon" | "dropdown" | "button";
  className?: string;
}

export function LanguageSelector({ 
  variant = "icon",
  className = "",
}: LanguageSelectorProps) {
  const { language, changeLanguage, tCommon } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  const toggleNextLanguage = () => {
    const nextLang = getNextLanguage(language);
    changeLanguage(nextLang.code);
  };

  // Simple icon toggle
  if (variant === "icon") {
    return (
      <div className={`flex flex-row items-center gap-1 ${className}`}>
        <div
          onClick={toggleNextLanguage}
          className="bg-button relative h-5 w-14 rounded-full hover:cursor-pointer"
        >
          <div className="absolute top-0 left-0 flex h-full w-full items-center justify-start overflow-hidden rounded-full">
            <Image
              src={getLanguageByCode(language).flag}
              alt={language}
              width={32}
              height={32}
              className={`transform transition-transform duration-300 ease-in-out ${
                language === "en" ? "-translate-x-2" : "translate-x-8"
              }`}
            />
          </div>
        </div>
        <p className="text-sm font-semibold text-white">
          {tCommon('general.language')}
        </p>
      </div>
    );
  }

  // Dropdown selector
  if (variant === "dropdown") {
    return (
      <div className={`relative ${className}`}>
        <button
          className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Image
            src={getLanguageByCode(language).flag}
            alt={language}
            width={20}
            height={20}
            className="rounded-sm"
          />
          <span>{getLanguageByCode(language).name}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-md border border-gray-200 bg-white shadow-lg">
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                  lang.code === language ? "bg-gray-50" : ""
                }`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <Image
                  src={lang.flag}
                  alt={lang.code}
                  width={20}
                  height={20}
                  className="rounded-sm"
                />
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Button selector
  return (
    <div className={`flex gap-1 ${className}`}>
      {supportedLanguages.map((lang) => (
        <button
          key={lang.code}
          className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm ${
            lang.code === language
              ? "bg-primary text-white"
              : "border border-gray-300 hover:bg-gray-100"
          }`}
          onClick={() => handleLanguageChange(lang.code)}
        >
          <Image
            src={lang.flag}
            alt={lang.code}
            width={16}
            height={16}
            className="rounded-sm"
          />
          <span>{lang.name}</span>
        </button>
      ))}
    </div>
  );
} 