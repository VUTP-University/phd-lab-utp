import React from "react";
import { useTranslation } from "react-i18next";


export default function NewsEvents() {
  const { t } = useTranslation();

  return (
    <section className="pb-10 pt-20 mt-10 primary_object">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center primary_text mb-10">
          {t("news.title")}
        </h2>
      </div>
    </section>
  );
}