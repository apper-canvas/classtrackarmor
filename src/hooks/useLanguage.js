import { useState, useEffect } from "react";

const LANGUAGES = {
  ar: { code: "ar", name: "العربية", dir: "rtl", flag: "🇲🇦" },
  fr: { code: "fr", name: "Français", dir: "ltr", flag: "🇫🇷" },
  en: { code: "en", name: "English", dir: "ltr", flag: "🇺🇸" }
};

const DEFAULT_LANGUAGE = "en";

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem("language") || DEFAULT_LANGUAGE;
  });

  const changeLanguage = (languageCode) => {
    if (LANGUAGES[languageCode]) {
      setCurrentLanguage(languageCode);
      localStorage.setItem("language", languageCode);
      
      // Update HTML attributes
      document.documentElement.lang = languageCode;
      document.documentElement.dir = LANGUAGES[languageCode].dir;
      
      // Update body font class for Arabic
      document.body.classList.toggle("font-arabic", languageCode === "ar");
    }
  };

  useEffect(() => {
    // Set initial HTML attributes
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = LANGUAGES[currentLanguage].dir;
    document.body.classList.toggle("font-arabic", currentLanguage === "ar");
  }, [currentLanguage]);

  return {
    currentLanguage,
    currentLanguageData: LANGUAGES[currentLanguage],
    changeLanguage,
    languages: LANGUAGES,
    isRTL: LANGUAGES[currentLanguage].dir === "rtl"
  };
};