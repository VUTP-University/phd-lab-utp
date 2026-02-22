import React from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function BackButton() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="flex items-center gap-2 mb-6 normal_text hover:text-blue-600 transition"
    >
      <ArrowLeft size={20} />
      {t("common.go_back")}
    </button>
  );
}
