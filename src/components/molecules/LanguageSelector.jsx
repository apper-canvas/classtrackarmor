import React, { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const LanguageSelector = ({ className }) => {
  const { currentLanguage, languages, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200"
      >
        <span className="text-lg">{languages[currentLanguage].flag}</span>
        <span className="hidden md:inline-block font-medium">
          {languages[currentLanguage].name}
        </span>
        <ApperIcon 
          name="ChevronDown" 
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )} 
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
            {Object.values(languages).map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors duration-200",
                  currentLanguage === language.code && "bg-primary-50 text-primary-700",
                  language.code === "ar" && "text-right flex-row-reverse space-x-reverse"
                )}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
                {currentLanguage === language.code && (
                  <ApperIcon name="Check" className="h-4 w-4 text-primary-600 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;