import React from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Contacts section */}
          <div>
            <h4 className="secondary_text text-lg font-bold mb-6 flex items-center gap-2">
              <Phone size={20} className="text-blue-600 dark:text-blue-400" />
              {t("navbar.contact")}
            </h4>
            <div className="space-y-5">
              <div className="flex gap-3">
                <MapPin size={18} className="flex-shrink-0 mt-1 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="normal_text_2 font-semibold mb-1">{t("contact.address_title")}</p>
                  <p className="normal_text_2">
                    {t("contact.address")}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone size={18} className="flex-shrink-0 mt-1 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="normal_text_2 font-semibold mb-1">{t("contact.study_department")}</p>
                  <p className="normal_text_2">
                    +359 2 806 2180
                  </p>
                  <p className="normal_text_2">
                    +359 882 431 872
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail size={18} className="flex-shrink-0 mt-1 text-blue-600 dark:text-blue-400" />
                <div>
                  <a
                    href="mailto:admission@utp.bg"
                    className="normal_text_2 hover:underline transition-colors"
                  >
                    admission@utp.bg
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Links section */}
          <div>
            <h4 className="secondary_text text-lg font-bold mb-6">
              {t("footer.resources")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="normal_text_2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <span>{t("footer.about")}</span>
                  <ExternalLink size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href="/project-scope"
                  className="normal_text_2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <span>{t("footer.scope")}</span>
                  <ExternalLink size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href="/contacts"
                  className="normal_text_2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <span>{t("footer.contact")}</span>
                  <ExternalLink size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href="/apply"
                  className="normal_text_2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <span>{t("footer.apply")}</span>
                  <ExternalLink size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href="/taxes"
                  className="normal_text_2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <span>{t("footer.taxes")}</span>
                  <ExternalLink size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href="/news"
                  className="normal_text_2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <span>{t("footer.news")}</span>
                  <ExternalLink size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </li>
            </ul>
          </div>

          {/* Branding section */}
          <div className="flex flex-col items-center md:items-end justify-start gap-6">
            <a
              href="https://www.utp.bg/smart-phd-lab-5-0/"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <img
                src="../src/assets/banner-eu.jpg"
                alt="PhD-Lab EU Banner"
                className="h-32 w-auto rounded-lg shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
              />
            </a>
            <p className="normal_text_3 normal_text_3--small text-gray-600 dark:text-gray-400 text-center md:text-right italic">
              Финансиран от Европейския съюз
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <p className="normal_text_2 text-center">
            © {new Date().getFullYear()} {t("navbar.brand")} - {t("footer.utp")}
          </p>
        </div>
      </div>
    </footer>
  );
}