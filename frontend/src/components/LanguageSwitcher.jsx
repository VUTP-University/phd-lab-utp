import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setOpen(false);
  };

  const currentLang = i18n.language;

  return (
    <div className="absolute top-4 right-4">

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-1 rounded-lg shadow-sm hover:shadow transition"
      >
        <span className="text-lg">
          {currentLang === "bg" ? "🇧🇬" : "🇬🇧"}
        </span>
        <span className="font-semibold text-gray-700 uppercase text-sm">
          {currentLang}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transform transition ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => changeLanguage("bg")}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-left"
          >
            <span className="text-lg">🇧🇬</span>
            <span className="text-sm font-medium">Български</span>
          </button>
          <button
            onClick={() => changeLanguage("en")}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-left"
          >
            <span className="text-lg">🇬🇧</span>
            <span className="text-sm font-medium">English</span>
          </button>
        </div>
      )}
    </div>
  );
}
