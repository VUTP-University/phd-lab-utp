import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";
import { specialties } from "../../data/specialties";
import MarkdownRenderer from "../../components/MarkdownRenderer";
import { ArrowLeft } from "lucide-react";

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

    fetch(`/specialties/${i18n.language}/${page}.md`)
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
      {/* Main */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 mb-6 sm:mb-10">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-6 md:mb-8 normal_text hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <ArrowLeft size={20} />
            {t("common.go_back")}
          </button>


        {!specialty ? (
          <div className="primary_object rounded-lg text-center py-20 px-6">
            <h2 className="text-2xl font-bold mb-4">404</h2>
            <p className="mb-6">{t("specialties.notFound")}</p>
            <button className="custom_button" onClick={() => navigate("/")}>
              {t("common.back")}
            </button>
          </div>
        ) : (
          <div className="primary_object rounded-lg p-6 sm:p-8 md:p-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold primary_text mb-3 leading-tight">
              {t(`specialties.programs.${specialty.program}`)}
            </h1>

            <p className="secondary_text mb-6 text-sm sm:text-base">
              {t("specialties.field")}: {specialty.code} –{" "}
              {t(`specialties.fields.${specialty.field}`)}
            </p>

            {loading ? (
              <p className="italic opacity-70">{t("common.loading")}</p>
            ) : (
              <article className="leading-relaxed w-full text-left sm:text-justify normal_text">
                <MarkdownRenderer>{content}</MarkdownRenderer>
              </article>
            )}

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
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
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
