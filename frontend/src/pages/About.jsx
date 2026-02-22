import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import MarkdownRenderer from "../components/MarkdownRenderer";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorDisplay from "../components/ErrorDisplay";
import { useTheme } from "../hooks/useTheme";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Logos
import UTPLogo from "../assets/Logo-UTP.png";
import UTPLogoDark from "../assets/Logo-UTP-dark.png";  
import TULogo from "../assets/Logo-TU.png";
import MGULogo from "../assets/Logo-MGU.png";
import EULogo from "../assets/EU-Logo.png";
import PrgLogo from "../assets/Logo-Progr.jpeg";

export default function About() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isDark = useTheme();

  // Project members from i18n
  const members = t("about.members", { returnObjects: true });

  useEffect(() => {
    fetchContent();
  }, [i18n.language]);

  const fetchContent = () => {
    setLoading(true);
    setError(null);

    fetch(`/about/${i18n.language}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Content not found");
        return res.text();
      })
      .then(setContent)
      .catch((err) => {
        console.error("Error loading content:", err);
        setError(t("about.contentNotFound"));
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Banner */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="primary_object rounded-lg p-6 md:p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-6 md:mb-8 normal_text hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <ArrowLeft size={20} />
            {t("common.go_back")}
          </button>

          <div className="max-w-6xl mx-auto">
            {/* Top 3 Logos */}
            <div className="flex items-center justify-center gap-6 md:gap-8 mb-6 md:mb-8 flex-wrap">
              <img 
                src={MGULogo} 
                alt="MGU Logo" 
                className="h-10 md:h-15 object-contain" 
              />
              <img 
                src={isDark ? UTPLogoDark : UTPLogo} 
                alt="UTP Logo" 
                className="h-10 md:h-15 object-contain" 
              />
              <img 
                src={TULogo} 
                alt="TU Logo" 
                className="h-10 md:h-15 object-contain" 
              />
            </div>

            {/* Center Text */}
            <div className="text-center mb-6 md:mb-8">
              <h1 className="primary_text text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                {t("navbar.brand")}
              </h1>
              <p className="normal_text text-lg md:text-2xl">
                {t("about.project_info")}
              </p>
            </div>

            {/* Bottom 2 Logos */}
            <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
              <img
                src={EULogo}
                alt="EU Logo"
                className="h-20 md:h-24 object-contain"
              />
              <img
                src={PrgLogo}
                alt="Program Logo"
                className="h-20 md:h-24 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="primary_object rounded-lg p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold primary_text mb-6 md:mb-8">
              {t("about.about_title")}
            </h2>

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

      {/* Members Section */}
      {members && members.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <div className="primary_object rounded-lg p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 secondary_text">
                {t("about.members_title")}
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-1">
                {members.map((member, index) => (
                  <li key={index} className="normal_text flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <div>
                      <span className="normal_text_3 normal_text_3--medium">{member.name}</span>
                      <span className="normal_text_3 normal_text_3--small"> – {member.position}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}