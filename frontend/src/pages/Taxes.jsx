import React from "react";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import TaxesTables from "../components/Taxes/TaxesTables";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Taxes() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns = [
    { key: "tax", label: t("tax.name") },
    { key: "amount", label: t("tax.amount") }
  ];

  // Bulgarian / EU Citizens Table
  const dataBG = [
    { tax: t("tax.taxesBG.application_fee"), amount: "25.56 EUR" },
    { tax: t("tax.taxesBG.exam_tax"), amount: "15.34 EUR" },
    { tax: t("tax.taxesBG.anual_fees"), amount: "" },
    { tax: t("tax.taxesBG.anual_fees_1"), amount: "306.78 EUR" },
    { tax: t("tax.taxesBG.anual_fees_2"), amount: "409.03 EUR" },
    { tax: t("tax.taxesBG.anual_fees_3"), amount: "409.03 EUR" },
    { tax: t("tax.taxesBG.anual_fees2"), amount: "" },
    { tax: t("tax.taxesBG.anual_fees2_1"), amount: "230.08 EUR" },
    { tax: t("tax.taxesBG.anual_fees2_2"), amount: "306.78 EUR" },
    { tax: t("tax.taxesBG.anual_fees2_3"), amount: "306.78 EUR" },
    { tax: t("tax.taxesBG.anual_fees3"), amount: "" },
    { tax: t("tax.taxesBG.anual_fees3_1"), amount: "1 288.46 EUR" },
    { tax: t("tax.taxesBG.anual_fees3_2"), amount: "2 975.72 EUR" },
    { tax: t("tax.taxesBG.anual_fees3_3"), amount: "2 259.91 EUR" },
    { tax: t("tax.taxesBG.anual_fees4"), amount: "" },
    { tax: t("tax.taxesBG.anual_fees4_1"), amount: "511.29 EUR" },
    { tax: t("tax.taxesBG.anual_fees4_2"), amount: "1 022.58 EUR" },
    { tax: t("tax.taxesBG.anual_fees4_3"), amount: "843.63 EUR" },
    { tax: t("tax.taxesBG.anual_fees5"), amount: "" },
    { tax: t("tax.taxesBG.anual_fees5_1"), amount: "255.65 EUR" },
    { tax: t("tax.taxesBG.anual_fees5_2"), amount: "1 022.58 EUR" },
  ];

  // Non-EU / Non-EEA Citizens Table
  const dataNonBG = [
    { tax: t("tax.taxesNonEU.application_fee"), amount: "EUR 50.00" },
    { tax: t("tax.taxesNonEU.exam_tax"), amount: "EUR 30.00" },
    { tax: t("tax.taxesNonEU.admin_fulltime"), amount: "EUR 1 400.00" },
    { tax: t("tax.taxesNonEU.admin_parttime"), amount: "EUR 700.00" },
    { tax: t("tax.taxesNonEU.it_fulltime"), amount: "EUR 3 000.00" },
    { tax: t("tax.taxesNonEU.it_parttime"), amount: "EUR 1 500.00" },
    { tax: t("tax.taxesNonEU.eng_fulltime"), amount: "EUR 2 300.00" },
    { tax: t("tax.taxesNonEU.eng_parttime"), amount: "EUR 1 150.00" },
    { tax: t("tax.taxesNonEU.foreign_lang_header"), amount: "" },
    { tax: t("tax.taxesNonEU.foreign_lang_english"), amount: "EUR 500.00" },
  ];

  return (
    <>
      <main className="container mt-10 mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                  {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-6 md:mb-8 normal_text hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <ArrowLeft size={20} />
            {t("common.go_back")}
          </button>
        <div className="mb-10 text-center">
          <h1 className="secondary_text" style={{ fontSize: "clamp(24px, 4vw, 36px)" }}>
            {t("specialties.taxes")}
          </h1>
        </div>

        <div className="flex flex-col gap-8">
          <TaxesTables title={t("tax.BGtitle")} columns={columns} data={dataBG} />
          <TaxesTables title={t("tax.NonBGtitle")} columns={columns} data={dataNonBG} />
        </div>

        {/* <div className="mt-8">
          <BackButton />
        </div> */}
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
