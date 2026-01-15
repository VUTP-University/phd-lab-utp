import React from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contacts section */}
        <div className="text-center md:text-left">
          <h4 className="text-sm font-semibold normal_text_footer underline mb-2">
            {t("navbar.contact")}
          </h4>
          <dl className="text-sm space-y-2">
            <div className="normal_text">
              <dt className="font-medium">Адрес</dt>
              <dd>
                гр. София<br />
                ул. „Акад. Стефан Младенов“ 1
              </dd>
            </div>

            <div className="normal_text">
              <dt className="font-medium">Учебен отдел</dt>
              <dd>+359 2 806 2180</dd>
              <dd>+359 882 431 872</dd>
              <dd>
                <a
                  href="mailto:admission@utp.bg"
                  className="hover:underline transition-colors"
                >
                  admission@utp.bg
                </a>
              </dd>
            </div>
          </dl>
        </div>

        {/* Links / Info section */}
        <div className="text-center md:text-left">
          <h4 className="text-sm font-semibold normal_text_footer underline mb-2">
            {t("footer.resources") || "Resources"}
          </h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="/about" className="normal_text">
                {t("footer.about")}
              </a>
            </li>
            <li>
              <a href="/research" className="normal_text">
                {t("footer.scope")}
              </a>
            </li>
            <li>
              <a href="/contacts" className="normal_text">
                {t("footer.contact") || "Contact"}
              </a>
            </li>
          </ul>
        </div>

        {/* Branding section */}
        <div className="flex flex-col items-center md:items-end justify-center gap-4">
          <div className="flex items-center gap-4">
            <a href="https://www.utp.bg/smart-phd-lab-5-0/" target="_blank" rel="noopener noreferrer" className="flex items-center">
            <img
              src="../src/assets/banner-eu.jpg"
              alt="PhD-Lab Logo"
              className="h-32 w-auto"
            />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 py-4">
        <p className="text-xs normal_text text-center">
          © {new Date().getFullYear()} {t("navbar.brand")} - {t("footer.utp")}
        </p>
      </div>
    </footer>
  );
}
