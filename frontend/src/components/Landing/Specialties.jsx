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
    page: "tfct",
  },
  {
    code: "5.3",
    field: "communication_computer_engineering",
    program: "it_networks_cybersecurity",
    fullTime: 3,
    partTime: 2,
    page: "itnc",
  },
  {
    code: "5.13",
    field: "general_engineering",
    program: "industrial_engineering",
    fullTime: 1,
    partTime: 1,
    page: "ie",
  },
  {
    code: "3.7",
    field: "administration_management",
    program: "organization_and_management_of_telecommunication_and_post",
    fullTime: 2,
    partTime: 2,
    page: "omtp",
  }
];


export default function Specialties() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="primary_object py-6">
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
              <div className="flex-1">
                <p className="secondary_text">
                  {t(`specialties.programs.${spec.program}`)}
                </p>

                <p className="mt-2 mb-2 normal_text">
                  {t("specialties.field")}: {spec.code} -{" "}
                  {t(`specialties.fields.${spec.field}`)}
                </p>

                <button
                  className="w-full sm:w-auto px-6 py-2 transition custom_button"
                  onClick={() => navigate(`/specialties/${spec.page}`)}
                >
                  {t("specialties.moreinfo")}
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-2 pt-8 border-t border-blue/10">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
            <button
              className="custom_button w-full sm:w-auto px-6 py-3 transition"
              onClick={() => navigate("/apply")}
            >
              {t("specialties.application")}
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
