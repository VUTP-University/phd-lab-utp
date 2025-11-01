import { useTranslation } from "react-i18next";

export default function Requirements() {
  const { t } = useTranslation();

  // Вземаме масива с изискванията от преводния JSON
  const requirements = t("requirements.items", { returnObjects: true });
  const title = t("requirements.title");

  return (
    <section className="max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {requirements.map((req, i) => (
          <a
            key={i}
            href={req.link}
            className="bg-white rounded-xl shadow hover:shadow-lg p-5 text-center border border-gray-100 transition"
          >
            <h3 className="font-semibold text-blue-700">{req.title}</h3>
          </a>
        ))}
      </div>
    </section>
  );
}
