import React from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left section */}
        <div className="text-center md:text-left">
          <dl className="text-sm normal_text space-y-1 max-w-md">
            <div>
              <dt className="font-medium">{t("navbar.contact")}:</dt>
            </div>

            <div>
              <dt className="font-medium">Адрес</dt>
              <dd className="text-sm">
                гр. София
                <br />
                ул. „Акад. Стефан Младенов“ 1
              </dd>
            </div>

            <div>
              <dt className="font-medium">Учебен отдел</dt>
              <dd className="text-sm">(02) 8062180</dd>
              <dd className="text-sm"> +359 882 431 872</dd>
              <dd className="text-sm cursor-pointer" href="mailto:admission@utp.bg">admission@utp.bg</dd>
            </div>
          </dl>
        </div>

        {/* Right section */}
        <div className="text-center md:text-right flex flex-col justify-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} PhD-Lab
          </p>
          <p className="text-xs text-gray-400 mt-1">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
