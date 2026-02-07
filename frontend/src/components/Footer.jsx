import React from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white dark:bg-gray-200 border-t border-gray-200 dark:border-gray-800">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Contacts section */}
          <div>
            <h4 className="text-base font-bold normal_text mb-4 flex items-center gap-2">
              <Phone size={18} />
              {t("navbar.contact")}
            </h4>
            <div className="space-y-4 text-sm normal_text">
              <div className="flex gap-3">
                <MapPin size={16} className="flex-shrink-0 mt-1 text-gray-600" />
                <div>
                  <p className="font-medium">Адрес</p>
                  <p className="text-gray-600">
                    гр. София<br />
                    ул. „Акад. Стефан Младенов" 1
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone size={16} className="flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium">Учебен отдел</p>
                  <p className="text-gray-600 dark:text-gray-600">+359 2 806 2180</p>
                  <p className="text-gray-600 dark:text-gray-600">+359 882 431 872</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail size={16} className="flex-shrink-0 mt-1 text-gray-500" />
                <a
                  href="mailto:admission@utp.bg"
                  className="text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                >
                  admission@utp.bg
                </a>
              </div>
            </div>
          </div>

          {/* Links section */}
          <div>
            <h4 className="text-base font-bold normal_text mb-4">
              {t("footer.resources") || "Resources"}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/about"
                  className="normal_text hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2"
                >
                  {t("footer.about")}
                  <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a
                  href="/project-scope"
                  className="normal_text hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2"
                >
                  {t("footer.scope")}
                  <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a
                  href="/contacts"
                  className="normal_text hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2"
                >
                  {t("footer.contact") || "Contact"}
                  <ExternalLink size={14} />
                </a>
              </li>
            </ul>
          </div>

          {/* Branding section */}
          <div className="flex flex-col items-center md:items-end justify-start gap-4">
            <a
              href="https://www.utp.bg/smart-phd-lab-5-0/"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <img
                src="../src/assets/banner-eu.jpg"
                alt="PhD-Lab Logo"
                className="h-32 w-auto transition-transform group-hover:scale-105"
              />
            </a>
            <p className="text-xs text-gray-800 dark:text-gray-400 text-center md:text-right">
              Финансиран от Европейския съюз
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 dark:border-gray-800 bg-gray-200 dark:bg-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs normal_text text-center">
            © {new Date().getFullYear()} {t("navbar.brand")} - {t("footer.utp")}
          </p>
        </div>
      </div>
    </footer>
  );
}