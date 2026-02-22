import React from "react";
import { useTranslation } from "react-i18next";


const DO_SPACE_BASE_URL = import.meta.env.VITE_DO_SPACES_ENDPOINT;

const procedureSteps = [
  { key: "step1", file: "https://www.utp.bg/wp-content/uploads/2025/09/zayavlenie-po-obrazec-redovna-zadochna-doktorantura.docx" },
  { key: "step2" },
  { key: "step3" },
  { key: "step4" },
  { key: "step5", file: "https://www.utp.bg/wp-content/uploads/2025/09/deklaraciya-po-chl-91.docx" },
  { key: "step6" },
  { key: "step7", file: "https://www.utp.bg/wp-content/uploads/2025/09/formulyar-saglasie-sabirane-obrabotka-ld-kopie.pdf" },
  { key: "step8", file: "https://www.utp.bg/wp-content/uploads/2025/09/deklaraciya-dostovernost-predstavenite-dokumenti.docx" },
];

export default function Procedure() {
  const { t } = useTranslation();

  return (
    <section className="primary_object py-4">
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
                  className="
                    inline-flex items-center gap-2
                    px-3 py-1.5
                    border border-red-500
                    text-red-600
                    rounded-md
                    text-sm font-medium
                    hover:bg-red-500 hover:text-white
                    transition
                    w-fit">
                  <span className="px-1.5 py-0.5 bg-red-500 text-white rounded text-xs font-bold">
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
