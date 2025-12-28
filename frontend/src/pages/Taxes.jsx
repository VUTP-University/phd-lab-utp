import React from "react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";
import Footer from "../components/Footer";
import TaxesTables from "../components/Taxes/TaxesTables";


export default function Taxes() {
  const { t } = useTranslation();

  // Bulgarian Taxes Table
  const titleBG = t("tax.BGtitle");
  const columnsBG = [
    { key: "tax", label: `${t("tax.name")}` },
    { key: "amount", label: `${t("tax.amount")}` }
  ];
  const dataBG = [
    {"tax": `${t("tax.taxesBG.application_fee")}`, "amount": "25.56 EUR"},
    {"tax": `${t("tax.taxesBG.exam_tax")}`, "amount": "15.34 EUR"},
    {"tax": `${t("tax.taxesBG.anual_fees")}`, "amount": ""},
    {"tax": `${t("tax.taxesBG.anual_fees3_1")}`, "amount": "306.78 EUR"},
    {"tax": `${t("tax.taxesBG.anual_fees3_2")}`, "amount": "409.03 EUR"},
    {"tax": `${t("tax.taxesBG.anula_fees3_3")}`, "amount": "409.03 EUR"},
    {"tax": `${t("tax.taxesBG.anual_fees2")}`, "amount": ""},
    {"tax": `${t("tax.taxesBG.anual_fees2_1")}`, "amount": "230.08 EUR"},
    {"tax": `${t("tax.taxesBG.anual_fees2_2")}`, "amount": "306.78 EUR"},
    {"tax": `${t("tax.taxesBG.anual_fees2_3")}`, "amount": "306.78 EUR"},
    {"tax": `${t("tax.taxesBG.anual_fees3")}`, "amount": ""},
    {"tax": `${t("tax.taxesBG.anual_fees3_1")}`, "amount": "1288.46 EUR"},
    {"tax": `${t("tax.taxesBG.anual_fees3_2")}`, "amount": "2975.72 EUR"},
    {"tax": `${t("tax.taxesBG.anual_fees3_3")}`, "amount": "2259.91 EUR"},
    {"tax": `${t("tax.taxesBG.anual_fees4")}`, "amount": ""},
    {"tax": `${t("tax.taxesBG.anual_fees4_1")}`, "amount": "511.29 EUR"},
    {"tax": `${t("tax.taxesBG.anual_fees4_2")}`, "amount": "1022.58 EUR"},
    {"tax": `${t("tax.taxesBG.anual_fees4_3")}`, "amount": "843.63 EUR"},
    {"tax": `${t("tax.taxesBG.anual_fees5")}`, "amount": ""},
    {"tax": `${t("tax.taxesBG.anual_fees5_1")}`, "amount": "255.65 EUR"},
    {"tax": `${t("tax.taxesBG.anual_fees5_2")}`, "amount": "1022.58 EUR"},
  ];

  // Non-Bulgarian Taxes Table
  const titleNonBG = t("tax.NonBGtitle");
  const columnsNonBG = [
    { key: "tax", label: `${t("tax.name")}` },
    { key: "amount", label: `${t("tax.amount")}` }
  ];
  const dataNonBG = [];

  
    return (
      <>
        <header className="flex justify-end p-4">
          <div className="space-x-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
            <TaxesTables title={titleBG} columns={columnsBG} data={dataBG} />
            {/* <TaxesTables columns={columnsNonBG} data={dataNonBG}/> */}
        <footer>
            <Footer />
        </footer>
      </>
    );
  }