import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "../components/Footer";
import MarkdownRenderer from "../components/MarkdownRenderer";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorDisplay from "../components/ErrorDisplay";

export default function ProjectScope() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent();
  }, [i18n.language]);

  const fetchContent = () => {
    setLoading(true);
    setError(null);

    fetch(`/project-scope/${i18n.language}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Content not found");
        return res.text();
      })
      .then(setContent)
      .catch((err) => {
        console.error("Error loading content:", err);
        setError(t("project_scope.contentNotFound") || "Content not found");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="primary_object rounded-lg p-6 md:p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-6 md:mb-8 normal_text hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <ArrowLeft size={20} />
            {t("common.go_back")}
          </button>

          <div className="max-w-4xl mx-auto">
            {/* Page Title */}
            <h1 className="text-2xl md:text-4xl font-bold primary_text mb-6 md:mb-8">
              {t("project_scope.title")}
            </h1>

            {/* Content */}
            {loading ? (
              <LoadingSpinner message={t("common.loading")} />
            ) : error ? (
              <ErrorDisplay error={error} onRetry={fetchContent} />
            ) : (
              <article className="prose prose-sm md:prose-lg prose-slate max-w-none normal_text text-justify">
                <MarkdownRenderer>{content}</MarkdownRenderer>
              </article>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}