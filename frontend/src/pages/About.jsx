import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import MarkdownRenderer from "../components/MarkdownRenderer";

export default function About() {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // Project members from i18n
  const members = t("about.members", { returnObjects: true });

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
      <img
        src="../src/assets/Lab_5-o.jpg"
        alt={t("navbar.brand")}
        className="mx-auto mt-6 mb-6 w-[1000] h-[561] object-cover"
      />
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
