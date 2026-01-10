import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ThemeToggle from "../../components/ThemeToggle";
import LanguageToggle from "../../components/LanguageToggle";
import Footer from "../../components/Footer";

import { specialties } from "../../data/specialties";

export default function SpecialtyPage() {
  const { page } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const specialty = specialties.find((s) => s.page === page);

  useEffect(() => {
    if (!specialty) return;

    setLoading(true);

    fetch(`/specialties/${i18n.language}/${page}.txt`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.text();
      })
      .then(setContent)
      .catch(() => setContent(t("specialties.contentNotFound")))
      .finally(() => setLoading(false));
  }, [page, i18n.language, specialty, t]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center space-x-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 primary_object">
        {!specialty ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">404</h2>
            <p className="mb-6">{t("specialties.notFound")}</p>
            <button className="custom_button" onClick={() => navigate("/")}>
              {t("common.back")}
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl font-bold primary_text mb-4">
              {t(`specialties.programs.${specialty.program}`)}
            </h1>

            <p className="secondary_text mb-6">
              {t("specialties.field")}: {specialty.code} –{" "}
              {t(`specialties.fields.${specialty.field}`)}
            </p>

            {loading ? (
              <p className="italic opacity-70">{t("common.loading")}</p>
            ) : (
              <div className="leading-relaxed w-full normal_text">
                {content}
              </div>
            )}

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                className="custom_button w-full sm:w-auto px-6 py-3 transition text-center"
                onClick={() => navigate("/apply")}
              >
                {t("specialties.application")}
              </button>

              {specialty.pdf && (
                <a
                  href={specialty.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="custom_button w-full sm:w-auto px-6 py-3 transition flex justify-center items-center"
                >
                  <span className="px-2 py-1 bg-red-500 text-white rounded text-xs font-bold mr-2">
                    PDF
                  </span>
                  {t("specialties.download")}
                </a>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
