import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const specialties = [
  {
    code: "5.3",
    field: "communication_computer_engineering",
    program: "theoretical_foundations_communication_tech",
    fullTime: 2,
    partTime: 2,
  },
  {
    code: "5.3",
    field: "communication_computer_engineering",
    program: "it_networks_cybersecurity",
    fullTime: 3,
    partTime: 2,
  },
  {
    code: "5.13",
    field: "general_engineering",
    program: "industrial_engineering",
    fullTime: 1,
    partTime: 1,
  },
];

export default function Specialties() {
  
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="pb-10 pt-10 mt-10 primary_object">
      <div className="max-w-7xl mx-auto px-6">
        {/* Specialties */}
        <h2 className="text-3xl font-bold text-center primary_text mb-10">
          {t("specialties.title")}
        </h2>
        <ul role="list" className="divide-y divide-blue/10">
          {specialties.map((spec, index) => (
            <li
              key={index}
              className="flex flex-col sm:flex-row justify-between gap-6 py-4"
            >
              {/* Left side */}
              <div className="flex-1">
                <p className="mt-1 secondary_text">
                  {t(`specialties.programs.${spec.program}`)}
                </p>

                <p className="mt-2 normal_text">
                  {t("specialties.field")}: {spec.code} -{" "}
                  {t(`specialties.fields.${spec.field}`)}
                </p>

                <a
                  href={spec.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2
                              text-red-500
                              rounded-md text-sm font-semibold
                              hover:bg-red-500
                              transition"
                >
                  <span className="px-2 py-0.5 bg-red-500 text-white rounded text-xs font-bold">
                    PDF
                  </span>
                  {t("specialties.download")}
                </a>
              </div>

              {/* Right side */}
              <div className="flex gap-6 normal_text">
                <div>
                  <p className="font-semibold">{t("specialties.fullTime")}</p>
                  <p>{spec.fullTime}</p>
                </div>
                <div>
                  <p className="font-semibold">{t("specialties.partTime")}</p>
                  <p>{spec.partTime}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>


        {/* Administrative documents */}
        <div className="mt-2 pt-8 border-t border-blue/10">
          <div className="flex flex-wrap justify-center gap-4">
            {/* Application */}
            <button className="px-6 py-3 border rounded-lg transition" onClick={() => navigate("/apply")}>
              {t("specialties.application")}
            </button>

            {/* Higher Education Act */}
            <button className="px-6 py-3 border rounded-lg transition">
              {t("specialties.law")}
            </button>

            {/* Academic Staff Regulations */}
            <button className="px-6 py-3 border rounded-lg transition">
              {t("specialties.regulations")}
            </button>

            {/* Taxes */}
            <button className="px-6 py-3 border rounded-lg transition" onClick={() => navigate("/taxes")}>
              {t("specialties.taxes")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
