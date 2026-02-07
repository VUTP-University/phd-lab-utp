import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState("bg");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "bg";
    setLanguage(savedLang);
    i18n.changeLanguage(savedLang);
  }, [i18n]);

  const toggleLanguage = () => {
    const newLang = language === "bg" ? "en" : "bg";
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative inline-flex items-center h-9 w-16 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gray-200 dark:bg-gray-700"
      aria-label="Toggle language"
    >
      {/* Sliding circle with flag */}
      <span
        className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out flex items-center justify-center overflow-hidden ${
          language === "en" ? 'translate-x-8' : 'translate-x-1'
        }`}
      >
        <span className="text-lg">
          {language === "bg" ? "🇧🇬" : "🇬🇧"}
        </span>
      </span>
    </button>
  );
}