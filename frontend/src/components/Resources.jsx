import { useTranslation } from "react-i18next";

export default function Resources() {
  const { t } = useTranslation();

  const resources = t("resources.items", { returnObjects: true });
  const title = t("resources.title");
  const moreText = t("resources.more");

  return (
    <section className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">{title}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {resources.map((res, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-2">{res.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{res.desc}</p>
              <a
                href={res.link}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                {moreText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
