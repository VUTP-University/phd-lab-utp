import React from "react";
import { useTranslation } from "react-i18next";

export default function LoadingSpinner({ message, fullScreen = false }) {
  const { t } = useTranslation();

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="normal_text text-gray-600 dark:text-gray-400">
            {message || t("common.loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-10">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="normal_text text-gray-600 dark:text-gray-400">
        {message || t("common.loading")}
      </p>
    </div>
  );
}