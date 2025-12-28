import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState("bg");

  // Sync state with i18next
  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  }, [language, i18n]);

  // Initialize from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) setLanguage(savedLang);
  }, []);

  return (
    <button
      onClick={() => setLanguage(language === "bg" ? "en" : "bg")}
      className="button mb-4"
    >
      {language === "bg" ? "EN" : "BG"}
    </button>
  );
}