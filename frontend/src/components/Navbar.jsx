import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/useTheme";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { LogOut, Menu, X, Home, BookOpen, Shield, GraduationCap } from "lucide-react";

import LabBrandImage from "../../src/assets/logo_pr_dokt_2.png";
import PhDLogoBlack from "../../src/assets/SmartPhDLogo_Black.png";
import PhDLogoBlue from "../../src/assets/SmartPhDLogo_Blue.png";

export default function NavbarTailwind({ user, onLogout }) {
  const { t } = useTranslation();
  const isDark = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <div className="max-w-10xl mx-auto px-4 sm:px-2 lg:px-2">
        <div className="flex justify-between items-center h-16">
          {/* Left: Brand */}
          <a href="/" className="flex items-center gap-3 group">
            <img
              src={isDark ? PhDLogoBlue : PhDLogoBlack}
              alt="UTP Lab Logo"
              className="h-16 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <h1 className="text-sm font-semibold normal_text hidden sm:block">
              {t("navbar.brand")}
            </h1>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {/* Navigation Links */}
            <a
              href="/"
              className="px-3 py-2 rounded-lg text-sm font-medium normal_text hover:bg-gray-100 transition flex items-center gap-2"
            >
              <Home size={16} />
              {t("navbar.home")}
            </a>

            {user && user.is_student && !user.is_teacher && (
              <a
                href="/dashboard"
                className="px-3 py-2 rounded-lg text-sm font-medium normal_text hover:bg-gray-100 transition flex items-center gap-2"
              >
                <BookOpen size={16} />
                {t("navbar.my_courses")}
              </a>
            )}

            {user && user.is_teacher && (
              <a
                href="/teacher-dashboard"
                className="px-3 py-2 rounded-lg text-sm font-medium normal_text hover:bg-gray-100 transition flex items-center gap-2"
              >
                <GraduationCap size={16} />
                {t("navbar.teaching_panel")}
              </a>
            )}

            {user && user.is_lab_admin && (
              <a
                href="/admin-dashboard"
                className="px-3 py-2 rounded-lg text-sm font-medium normal_text hover:bg-gray-100 transition flex items-center gap-2"
              >
                <Shield size={16} />
                {t("navbar.admin_panel")}
              </a>
            )}

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />

            {/* Controls */}
            <LanguageToggle />
            <ThemeToggle />

            {user && (
              <>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />
                <button
                  onClick={onLogout}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-2"
                >
                  <LogOut size={16} />
                  {t("navbar.logout")}
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
          <div className="px-4 py-3 space-y-1">
            {/* Navigation Links */}
            <a
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium normal_text hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={() => setMenuOpen(false)}
            >
              <Home size={18} />
              {t("navbar.home")}
            </a>

            {user && user.is_student && !user.is_teacher && (
              <a
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium normal_text hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => setMenuOpen(false)}
              >
                <BookOpen size={18} />
                {t("navbar.my_courses")}
              </a>
            )}

            {user && user.is_teacher && (
              <a
                href="/teacher-dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium normal_text hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => setMenuOpen(false)}
              >
                <GraduationCap size={18} />
                {t("navbar.teaching_panel")}
              </a>
            )}

            {user && user.is_lab_admin && (
              <a
                href="/admin-dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium normal_text hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => setMenuOpen(false)}
              >
                <Shield size={18} />
                {t("navbar.admin_panel")}
              </a>
            )}

            {/* Divider */}
            <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />

            {/* Controls */}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium normal_text">Theme</span>
              <ThemeToggle />
            </div>

            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium normal_text">Language</span>
              <LanguageToggle />
            </div>


            {user && (
              <>
                <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />
                <button
                  onClick={() => {
                    onLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  <LogOut size={18} />
                  {t("navbar.logout")}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}