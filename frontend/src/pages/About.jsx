import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import MarkdownRenderer from "../components/MarkdownRenderer";

export default function About() {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`/about/${i18n.language}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.text();
      })
      .then(setContent)
      .catch(() => setContent(t("about.contentNotFound")))
      .finally(() => setLoading(false));
  }, [i18n.language, t]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mt-10 mx-auto primary_object px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold primary_text mb-8">
            {t("hero.info_button")}
          </h1>

          {loading ? (
            <p className="italic opacity-70">{t("common.loading")}</p>
          ) : (
            <article className="prose prose-lg prose-slate max-w-none normal_text text-justify">
              <MarkdownRenderer>{content}</MarkdownRenderer>
            </article>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}