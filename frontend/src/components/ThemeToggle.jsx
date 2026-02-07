import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

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
      className="relative inline-flex items-center h-9 w-16 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      style={{
        backgroundColor: dark ? '#1e293b' : '#3b82f6'
      }}
      aria-label="Toggle theme"
    >
      {/* Sliding circle */}
      <span
        className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          dark ? 'translate-x-8' : 'translate-x-1'
        }`}
      >
        {/* Icon inside circle */}
        <span className="flex items-center justify-center h-full w-full">
          {dark ? (
            <Moon size={16} className="text-slate-700" />
          ) : (
            <Sun size={16} className="text-amber-500" />
          )}
        </span>
      </span>
    </button>
  );
}