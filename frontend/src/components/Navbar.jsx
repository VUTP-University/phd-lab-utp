import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";


export default function NavbarTailwind() {
    
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);


  return (
    <nav className="sticky top-0 z-50 shadow bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Left: Brand */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img
                src="../src/assets/logo_pr_dokt_2.png"
                alt="UTP Lab Logo"
                className="h-16 w-auto object-contain"
              />

              <h1 className="text-sm normal_text">{t("navbar.brand")}</h1>
            </a>
          </div>

          {/* Right: Toggles */}
          <div className="mt-4 flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>

        </div>
      </div>
    </nav>
  );
}
