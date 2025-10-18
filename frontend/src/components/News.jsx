import { useTranslation } from "react-i18next";

export default function News() {
  const { t } = useTranslation();

  const news = t("news.items", { returnObjects: true });
  const title = t("news.title");
  const readMore = t("news.readMore");

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">{title}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {news.map((item, i) => (
            <div
              key={i}
              className="border rounded-2xl shadow-sm hover:shadow-lg p-6 transition"
            >
              <p className="text-sm text-gray-400">{item.date}</p>
              <h3 className="font-semibold text-lg text-blue-700 mt-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{item.desc}</p>
              <button className="mt-4 text-blue-600 text-sm font-medium hover:underline">
                {readMore}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
