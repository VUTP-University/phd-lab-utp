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
    pdf: "#", //link for pdf
  },
  {
    code: "5.3",
    field: "communication_computer_engineering",
    program: "it_networks_cybersecurity",
    fullTime: 3,
    partTime: 2,
    pdf: "#",
  },
  {
    code: "5.13",
    field: "general_engineering",
    program: "industrial_engineering",
    fullTime: 1,
    partTime: 1,
    pdf: "#",
  },
];

export default function Specialties() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="primary_object py-12 sm:py-6 mt-5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl mb-10 sm:text-4xl font-bold text-center primary_text ">
          {t("specialties.title")}
        </h2>
        <ul role="list" className="divide-y divide-blue/10">
          {specialties.map((spec, index) => (
            <li
              key={index}
              className="flex flex-col sm:flex-row justify-between gap-6 py-6 px-4 sm:px-6"
            >
              {/* Лява част */}
              <div className="flex-1">
                <p className="secondary_text">
                  {t(`specialties.programs.${spec.program}`)}
                </p>

                <p className="mt-2 normal_text">
                  {t("specialties.field")}: {spec.code} -{" "}
                  {t(`specialties.fields.${spec.field}`)}
                </p>

                {spec.pdf && (
                  <a
                    href={spec.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full sm:w-auto flex-col sm:flex-row items-center sm:items-center gap-2 mt-4 rounded-md text-sm font-semibold transition"
                  >
                    <span className="px-2 py-1 bg-red-500 text-white rounded text-xs font-bold">
                      PDF
                    </span>
                    <span className="sm:ml-2">{t("specialties.download")}</span>
                  </a>
                )}
              </div>
              <div className="flex gap-6 sm:mt-0 normal_text justify-center sm:justify-end">
                <div className="text-center">
                  <p className="font-semibold">{t("specialties.fullTime")}</p>
                  <p>{spec.fullTime}</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{t("specialties.partTime")}</p>
                  <p>{spec.partTime}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-8 border-t border-blue/10">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
            <button
              className="custom_button w-full sm:w-auto px-6 py-3 transition"
              onClick={() => navigate("/apply")}
            >
              {t("specialties.application")}
            </button>

            <button className="custom_button w-full sm:w-auto px-6 py-3 transition">
              {t("specialties.law")}
            </button>

            <button className="custom_button w-full sm:w-auto px-6 py-3 transition">
              {t("specialties.regulations")}
            </button>

            <button
              className="custom_button w-full sm:w-auto px-6 py-3 transition"
              onClick={() => navigate("/taxes")}
            >
              {t("specialties.taxes")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
