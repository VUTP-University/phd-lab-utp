import { useTranslation } from "react-i18next";

export default function LoginSection() {
  const { t } = useTranslation();

  const title = t("login.title");
  const buttonText = t("login.button");

  return (
    <section className="bg-blue-100 py-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 bg-white rounded-2xl shadow-md p-6 text-center">
          <h3 className="font-bold text-blue-800 mb-2">{title}</h3>
          <button className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  );
}
