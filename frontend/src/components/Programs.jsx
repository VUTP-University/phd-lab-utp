import { useTranslation } from "react-i18next";

export default function Programs() {
  const { t } = useTranslation();

  const programs = t("programs.items", { returnObjects: true });

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">
        {t("programs.title")}
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {programs.map((prog, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
          >
            <h3 className="font-semibold text-lg text-blue-700 mb-2">
              {prog.field}
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {prog.specs.map((spec, j) => (
                <li key={j}>{spec}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
