import React from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function ErrorDisplay({ 
  error, 
  onRetry, 
  fullScreen = false,
  showHomeButton = false 
}) {
  const { t } = useTranslation();

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
            <AlertCircle className="text-red-600 dark:text-red-400" size={48} />
          </div>
          
          <h2 className="secondary_text text-2xl font-bold mb-4">
            {t("common.error_title")}
          </h2>
          
          <p className="normal_text text-gray-600 dark:text-gray-400 mb-6">
            {error || t("common.error_generic")}
          </p>
          
          <div className="flex gap-3 justify-center">
            {onRetry && (
              <button 
                onClick={onRetry}
                className="custom_button custom_button--medium flex items-center gap-2"
              >
                <RefreshCw size={18} />
                {t("common.try_again")}
              </button>
            )}
            
            {showHomeButton && (
              <a 
                href="/"
                className="custom_button custom_button--secondary custom_button--medium flex items-center gap-2"
              >
                <Home size={18} />
                {t("common.go_home")}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-10">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
        <AlertCircle className="text-red-600 dark:text-red-400" size={32} />
      </div>
      
      <p className="normal_text text-red-600 dark:text-red-400 mb-4">
        {error || t("common.error_generic")}
      </p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="custom_button custom_button--small flex items-center gap-2 mx-auto"
        >
          <RefreshCw size={16} />
          {t("common.try_again")}
        </button>
      )}
    </div>
  );
}