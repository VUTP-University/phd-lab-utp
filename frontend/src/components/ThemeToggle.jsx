import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ThemeToggle() {
  const { t } = useTranslation();
  const [dark, setDark] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDark(savedTheme === "dark");
      if (savedTheme === "dark") document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md border
                  text-xs font-semibold tracking-wide
                  bg-white dark:bg-gray-900
                  text-gray-700 dark:text-gray-200
                  border-gray-300 dark:border-gray-700
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  transition shadow-sm`}
    >
      {dark ? (
        <span>☀️ {t("navbar.theme.light")}</span>
      ) : (
        <span>🌙 {t("navbar.theme.dark")}</span>
      )}
      {/* <span>{dark ? "Light" : "Dark"}</span> */}
    </button>
  );
}