import React from "react";
import { useTranslation } from "react-i18next";

const procedureSteps = [
  { key: "step1", file: "/" },
  { key: "step2" },
  { key: "step3"},
  { key: "step4" },
  { key: "step5", file: "/" },
  { key: "step6" },
  { key: "step7", file: "/" },
  { key: "step8", file: "/" },
];

export default function Procedure() {
  const { t } = useTranslation();

  return (
    <section className="pb-10 pt-20 mt-10 primary_object">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center primary_text mb-10">
          {t("apply.procedure.title")}
        </h2>

        <div className="space-y-8 normal_text">
          {procedureSteps.map((step, index) => (
            <div key={step.key} className="flex flex-col gap-2">
              {/* Step text */}
              <p>
                {index + 1}. {t(`apply.procedure.${step.key}`)}
              </p>

              {/* PDF Button (optional) */}
              {step.file && (
                <a
                href={step.file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2
                            text-red-500
                            rounded-md text-sm font-semibold
                            hover:bg-red-500
                            transition w-45"
              >
                <span className="px-2 py-0.5 bg-red-500 text-white rounded text-xs font-bold">
                  PDF
                </span>
                {t("apply.download")}
              </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}