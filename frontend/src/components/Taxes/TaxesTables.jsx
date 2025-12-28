import React from "react";
import { useTranslation } from "react-i18next";


export default function TaxesTable({ columns, data, title }) {
    
    return (
    <section className="pb-10 pt-20 mt-10 primary_object">
        <h2 className="text-3xl font-bold px-30 text-center primary_text">
            {useTranslation().t("tax.BGtitle")}
        </h2>
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full divide-y divide-blue/10 rounded-xl border border-blue/10 bg-white/5">
          {/* Table Head */}
          <thead className="bg-white/10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold tracking-wider secondary_text"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
  
          {/* Table Body */}
          <tbody className="divide-y divide-blue/10 normal_text">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="transition-colors rounded-md"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 font-medium text-sm"
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