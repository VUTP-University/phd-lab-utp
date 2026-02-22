import React from "react";
import { useTranslation } from "react-i18next";

const MoneyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h1.5m-1.5 0a3 3 0 1 0-6 0M6 10.5H4.5m1.5 0a3 3 0 1 1 6 0" />
  </svg>
);

export default function TaxesTable({ data, title }) {
  const { t } = useTranslation();
  let rowCounter = 0;

  const isHeaderRow = (row) => !row.amount || row.amount.trim() === "";

  return (
    <section
      className="primary_object"
      style={{ padding: 0, overflow: "hidden" }}
    >
      {/* Gradient card header */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "white",
          }}
        >
          <MoneyIcon />
        </div>
        <h2
          style={{
            color: "white",
            fontFamily: "'Sofia Sans', sans-serif",
            fontSize: "clamp(15px, 2.5vw, 19px)",
            fontWeight: 700,
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>

      {/* Table wrapper — horizontal scroll on small screens */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                background: "var(--surface-hover)",
                borderBottom: "2px solid var(--border)",
              }}
            >
              <th
                style={{
                  width: "52px",
                  padding: "10px 16px",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontFamily: "'Sofia Sans', sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                #
              </th>
              <th
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  color: "var(--text-muted)",
                  fontFamily: "'Sofia Sans', sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {t("tax.name")}
              </th>
              <th
                style={{
                  padding: "10px 16px",
                  textAlign: "right",
                  color: "var(--text-muted)",
                  fontFamily: "'Sofia Sans', sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  whiteSpace: "nowrap",
                }}
              >
                {t("tax.amount")}
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => {
              if (isHeaderRow(row)) {
                rowCounter = 0;
                return (
                  <tr
                    key={rowIndex}
                    style={{
                      background: "var(--surface-hover)",
                      borderTop: "2px solid var(--border)",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <td colSpan={3} style={{ padding: "10px 16px" }}>
                      <span
                        className="badge badge--blue"
                        style={{
                          fontSize: "11px",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                        }}
                      >
                        {row.tax}
                      </span>
                    </td>
                  </tr>
                );
              }

              rowCounter++;
              const num = rowCounter;
              const isEven = num % 2 === 0;

              return (
                <DataRow
                  key={rowIndex}
                  num={num}
                  tax={row.tax}
                  amount={row.amount}
                  isEven={isEven}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DataRow({ num, tax, amount, isEven }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <tr
      style={{
        borderBottom: "1px solid var(--border)",
        background: hovered
          ? "var(--badge-blue-bg)"
          : isEven
          ? "var(--surface-hover)"
          : "transparent",
        transition: "background 0.15s ease",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Row number */}
      <td style={{ padding: "13px 16px", textAlign: "center", width: "52px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: "var(--badge-blue-bg)",
            color: "var(--badge-blue-text)",
            fontSize: "11px",
            fontWeight: 700,
            fontFamily: "'Sofia Sans', sans-serif",
            flexShrink: 0,
          }}
        >
          {num}
        </span>
      </td>

      {/* Tax description */}
      <td
        style={{
          padding: "13px 16px",
          color: "var(--text-two)",
          fontFamily: "'Sofia Sans', sans-serif",
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: 1.55,
        }}
      >
        {tax}
      </td>

      {/* Amount badge */}
      <td style={{ padding: "13px 16px", textAlign: "right", whiteSpace: "nowrap" }}>
        <span
          className="badge badge--green"
          style={{ fontSize: "13px", fontWeight: 700 }}
        >
          {amount}
        </span>
      </td>
    </tr>
  );
}
