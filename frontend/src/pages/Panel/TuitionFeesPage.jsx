import Header from "../../components/Header";
import { useTranslation } from "react-i18next";

export default function TuitionFeesPage() {
  const { t } = useTranslation();

  return (
    <>
      <Header />

      <section className="max-w-4xl mx-auto px-4 py-12">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-8">
          {t("tuition.title")}
        </h1>

        {/* Bank Information */}
        <div className="bg-white p-6 rounded-2xl shadow mb-10">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            {t("tuition.bank.title")}
          </h2>

          <p className="text-gray-700 leading-relaxed">
            {t("tuition.bank.description")}
          </p>

          <ul className="mt-4 text-gray-800 space-y-1">
            <li><strong>BIC:</strong> {t("tuition.bank.bic")}</li>
            <li><strong>IBAN:</strong> {t("tuition.bank.iban")}</li>
            <li><strong>{t("tuition.bank.receiverLabel")}:</strong> {t("tuition.bank.receiver")}</li>
          </ul>

          <p className="mt-4 text-gray-700">
            {t("tuition.bank.paymentNote")}
          </p>

          <p className="mt-2 text-gray-700">
            {t("tuition.bank.cashPayment")}
          </p>
        </div>

        {/* Winter Deadlines */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-xl shadow mb-10">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">
            {t("tuition.winter.title")}
          </h3>

          <ul className="space-y-2 text-gray-900">
            <li>{t("tuition.winter.bachelor")}</li>
            <li>{t("tuition.winter.profBachelor")}</li>
            <li>{t("tuition.winter.master")}</li>
          </ul>

          <p className="mt-2 text-gray-700">
            {t("tuition.winter.dorm")}
          </p>

          <h4 className="font-semibold text-blue-700 mt-4">
            {t("tuition.winter.installments.title")}
          </h4>
          <ul className="space-y-1 text-gray-800 mt-1">
            <li>{t("tuition.winter.installments.first")}</li>
            <li>{t("tuition.winter.installments.second")}</li>
          </ul>
        </div>

        {/* Summer Deadlines */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-xl shadow mb-10">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">
            {t("tuition.summer.title")}
          </h3>

          <ul className="space-y-2 text-gray-900">
            <li>{t("tuition.summer.bachelor")}</li>
            <li>{t("tuition.summer.profBachelor")}</li>
            <li>{t("tuition.summer.master")}</li>
          </ul>

          <p className="mt-2 text-gray-700">
            {t("tuition.summer.dorm")}
          </p>

          <h4 className="font-semibold text-blue-700 mt-4">
            {t("tuition.summer.installments.title")}
          </h4>
          <ul className="space-y-1 text-gray-800 mt-1">
            <li>{t("tuition.summer.installments.first")}</li>
            <li>{t("tuition.summer.installments.second")}</li>
          </ul>
        </div>

        {/* Placeholder for table */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            {t("tuition.tableTitle")}
          </h2>

          <div className="border-2 border-dashed border-gray-400 p-6 rounded-xl text-gray-500 text-center">
            {t("tuition.tablePlaceholder")}
          </div>
        </div>
      </section>
    </>
  );
}
