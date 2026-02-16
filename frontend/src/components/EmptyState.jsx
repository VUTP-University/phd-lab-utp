import React from "react";
import { useTranslation } from "react-i18next";
import { Inbox } from "lucide-react";

export default function EmptyState({ 
  icon: Icon = Inbox,
  title,
  message,
  action
}) {
  const { t } = useTranslation();

  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
        <Icon className="text-gray-400 dark:text-gray-600" size={40} />
      </div>
      
      {title && (
        <h3 className="secondary_text text-xl font-semibold mb-2">
          {title}
        </h3>
      )}
      
      <p className="normal_text text-gray-600 dark:text-gray-400 mb-6">
        {message || t("common.no_data")}
      </p>
      
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}