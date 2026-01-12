import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState("bg");
  const dropdownRef = useRef(null);

  // Initialize language
  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "bg";
    setLanguage(savedLang);
    i18n.changeLanguage(savedLang);
  }, [i18n]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 rounded-md border text-sm font-medium transition lang_toggle_button">
        🌐
        <span className="uppercase">{language}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-32 rounded-md shadow-lg border
                     bg-white dark:bg-blue-900
                     text-sm text-gray-800 dark:text-gray-200 z-50"
        >
          <button
            onClick={() => changeLanguage("bg")}
            className={`w-full px-4 py-2 text-left dark:hover:bg-blue-800 cursor-pointer
              ${language === "bg" ? "font-semibold" : ""}`}
          >
            🇧🇬 Български
          </button>
          <button
            onClick={() => changeLanguage("en")}
            className={`w-full px-4 py-2 text-left  dark:hover:bg-blue-800 cursor-pointer
              ${language === "en" ? "font-semibold" : ""}`}
          >
            🇬🇧 English
          </button>
        </div>
      )}
    </div>
  );
}
