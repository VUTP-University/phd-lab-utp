import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { LogOut } from "lucide-react";

export default function NavbarTailwind({ user, onLogout }) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gray-100 border-b border-gray-200 shadow">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <img
                src="../src/assets/logo_pr_dokt_2.png"
                alt="UTP Lab Logo"
                className="h-16 w-auto object-contain"
              />
              <h1 className="text-sm normal_text">{t("navbar.brand")}</h1>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <a href="/" className="px-2 py-2">
              {t("navbar.home")}
            </a>

            {user && (
              <a href="/dashboard" className="px-4 py-2">
                {t("navbar.my_courses")}
              </a>
            )}

            {user && user.is_lab_admin && (
              <a href="/admin-dashboard" className="px-4 py-2">
                {t("navbar.admin_panel")}
              </a>
            )}
            <LanguageToggle />
            <ThemeToggle />

            {user && (
              <button
                onClick={onLogout}
                className="px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50 rounded transition"
              >
                <LogOut size={16} />
                {t("navbar.logout")}
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-gray-100 border-t border-gray-200">
          <a href="/" className="custom_button block w-full text-center">
            Home
          </a>

          {user && (
            <a
              href="/dashboard"
              className="custom_button block w-full text-center"
            >
              My Courses
            </a>
          )}

          {user && user.is_lab_admin && (
            <a
              href="/create-news"
              className="custom_button block w-full text-center"
            >
              Създай новина
            </a>
          )}

          {user && user.is_lab_admin && (
            <a
              href="/admin-dashboard"
              className="custom_button block w-full text-center"
            >
              {t("navbar.admin_panel")}
            </a>
          )}

          {user && (
            <button
              onClick={onLogout}
              className="custom_button block w-full text-center"
            >
              Logout
            </button>
          )}

          <LanguageToggle />
          <ThemeToggle />
        </div>
      )}
    </nav>
  );
}
