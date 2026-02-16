import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { useTheme } from "../hooks/useTheme";

import UTPLogo from "../assets/Logo-UTP.png";
import UTPLogoDark from "../assets/Logo-UTP-dark.png";  
import TULogo from "../assets/Logo-TU.png";
import MGULogo from "../assets/Logo-MGU.png";
import EULogo from "../assets/EU-logo.png";
import PrgLogo from "../assets/Logo-Progr.jpeg";

export default function About() {
  const { t, i18n } = useTranslation();
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
      {/* <img
        src={LabImage}
        alt={t("navbar.brand")}
        className="mx-auto mt-6 mb-6 w-[1000] h-[561] object-cover"
      /> */}

      {/* Header Banner - Recreating the image */}
      <section className="flex-1 container mt-10 mx-auto primary_object px-4 sm:px-6 lg:px-8 py-8 items-center">
        <div className="max-w-6xl mx-auto px-4">
          {/* Top 3 Logos */}
          <div className="flex items-center justify-center gap-8 mb-8 flex-wrap">
            <img src={MGULogo} alt="MGU Logo" className="h-20 object-contain" />
            <img src={isDark ? UTPLogoDark : UTPLogo} alt="UTP Logo" className="h-20 object-contain" />
            <img src={TULogo} alt="TU Logo" className="h-20 object-contain" />
          </div>

          {/* Center Text */}
          <div className="text-center mb-8">
            <h1 className="primary_text text-3xl md:text-4xl font-bold mb-4">
              {t("navbar.brand")}
            </h1>
            <p className="normal_text text-xl md:text-2xl mb-2">
              {t("about.project_info")}
            </p>
          </div>

          {/* Bottom 2 Logos */}
          <div className="flex items-center justify-center gap-12 flex-wrap">
            <img
              src={EULogo}
              alt="EU Logo"
              className="h-24 object-contain"
            />
            <img
              src={PrgLogo}
              alt="Program Logo"
              className="h-24 object-contain"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 container mt-10 mx-auto primary_object px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold primary_text mb-8">
            {t("about.about_title")}
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

      {/* Members Section */}
      <div className="flex-1 container mt-10 mb-10 mx-auto primary_object px-4 sm:px-6 lg:px-8 py-8">
        {members && members.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 secondary_text">
              {t("about.members_title")}
            </h2>
            <ul className="list-disc ml-6 space-y-1 normal_text">
              {members.map((member, index) => (
                <li key={index}>
                  <span className="font-semibold">{member.name}</span> –{" "}
                  {member.position}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
