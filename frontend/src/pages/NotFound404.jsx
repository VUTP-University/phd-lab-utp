import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound404() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md px-4">
        <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          404
        </h1>
        
        <h2 className="primary_text text-3xl font-bold mb-4">
          {t("common.404_title")}
        </h2>
        
        <p className="normal_text text-gray-600 dark:text-gray-400 mb-8">
          {t("common.404_message")}
        </p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="custom_button custom_button--secondary custom_button--medium flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            {t("common.go_back")}
          </button>
          
          <a
            href="/"
            className="custom_button custom_button--medium flex items-center gap-2"
          >
            <Home size={18} />
            {t("common.go_home")}
          </a>
        </div>
      </div>
    </div>
  );
}