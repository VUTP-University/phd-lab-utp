import { useTranslation } from "react-i18next";

export default function Documents() {
  const { t } = useTranslation();

  const documents = t("documents.items", { returnObjects: true });
  const title = t("documents.title");

  return (
    <section className="max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">{title}</h2>
      <div className="flex flex-wrap gap-4 justify-center">
        {documents.map((doc, i) => (
          <a
            key={i}
            href={doc.link}
            className="bg-white rounded-lg shadow-md px-6 py-4 text-blue-700 hover:bg-blue-50 transition"
          >
            {doc.category}
          </a>
        ))}
      </div>
    </section>
  );
}
