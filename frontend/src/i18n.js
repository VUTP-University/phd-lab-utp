import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import bg from "./i18n/bg.json";
import en from "./i18n/en.json";

const savedLang = localStorage.getItem("lang") || "bg";

i18n.use(initReactI18next).init({
  resources: {
    bg: { translation: bg },
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: "bg",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
