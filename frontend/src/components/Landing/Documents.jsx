import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Documents() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="primary_object py-6">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center primary_text mb-10">
          {t("documents.title")}
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          className="custom_button w-full sm:w-auto px-6 py-3 transition"
          onClick={() => navigate("/law-documents")}
        >
          {t("documents.law_docs")}
        </button>

        <button
          className="custom_button w-full sm:w-auto px-6 py-3 transition"
          onClick={() => navigate("/scientific-activity")}
        >
          {t("documents.science_docs")}
        </button>

        <button 
          className="custom_button w-full sm:w-auto px-6 py-3 transition"
          onClick={() => window.open("https://library.utp.bg/absw/abs.htm", "_blank")}
        >
          {t("documents.utplibrary")}
        </button>

        <button 
          className="custom_button w-full sm:w-auto px-6 py-3 transition"
          onClick={() => navigate("/scientific-databases")}
        >
          {t("documents.science_dbs")}
        </button>
      </div>
    </section>
  );
}
