import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BackButton({ to = "/" }) {
  const { t } = useTranslation();

  return (
    <div className="mt-4">
      <Link
        to={to}
        className="primary_object w-full sm:w-auto block text-center px-6 py-3 rounded-lg font-semibold  transition"
      >
        {t("contact.back_button")}
      </Link>
    </div>
  );
}
