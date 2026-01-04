import React from "react";
import { useTranslation } from "react-i18next";

export default function TaxesTable({ columns, data, title }) {
  const { t } = useTranslation();

  return (
    <section className="primary_object p-6 sm:p-8 rounded-2xl">
      <h2 className="text-3xl font-bold text-center primary_text mb-6">
        {t("tax.BGtitle")}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse rounded-lg overflow-hidden">
          <thead className="">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="px-4 py-2 text-left text-sm font-semibold tracking-wide secondary_text border-b border-blue/20"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-white/5 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-2 text-sm font-medium border-b border-blue/20"
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
