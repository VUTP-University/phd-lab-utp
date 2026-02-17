import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, ExternalLink } from "lucide-react";
import Footer from "../components/Footer";
import MarkdownRenderer from "../components/MarkdownRenderer";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorDisplay from "../components/ErrorDisplay";

export default function LawDocuments() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent();
  }, [i18n.language]);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/documents/law-docs-${i18n.language}.md`);
      if (!response.ok) throw new Error("Content not found");
      const text = await response.text();
      setContent(text);
    } catch (err) {
      console.error("Error loading law documents:", err);
      setError(t("documents.content_not_found"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 normal_text hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          <ArrowLeft size={20} />
          {t("common.go_back")}
        </button>

        <div className="primary_object rounded-lg p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <FileText className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
            <h1 className="primary_text text-3xl font-bold">
              {t("documents.law_docs")}
            </h1>
          </div>

          {/* Content */}
          {loading ? (
            <LoadingSpinner message={t("common.loading")} />
          ) : error ? (
            <ErrorDisplay error={error} onRetry={fetchContent} />
          ) : (
            <article className="prose prose-lg max-w-none normal_text documents-content">
              <MarkdownRenderer>{content}</MarkdownRenderer>
            </article>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}