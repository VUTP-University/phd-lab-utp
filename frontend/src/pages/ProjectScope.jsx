import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import MarkdownRenderer from "../components/MarkdownRenderer";

export default function ProjectScope() {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Load the Markdown content based on the current language
    fetch(`/project-scope/${i18n.language}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.text();
      })
      .then(setContent)
      .catch(() => setContent(t("projectScope.contentNotFound")))
      .finally(() => setLoading(false));
  }, [i18n.language, t]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mt-10 mb-10 mx-auto px-4 sm:px-6 lg:px-8 py-8 primary_object">
        <div className="max-w-4xl mx-auto">

          {/* Page title */}
          <h1 className="text-3xl sm:text-4xl font-bold primary_text mb-8">
            {t("project_scope.title")}
          </h1>

          {/* Content */}
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