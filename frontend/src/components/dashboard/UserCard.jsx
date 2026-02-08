import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User, Mail, Download, FileText } from "lucide-react";
import api from "../../../api.js";

function StudentCard({ user }) {
  const { t } = useTranslation();
  const [plan, setPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  useEffect(() => {
    const fetchIndividualPlan = async () => {
      try {
        const response = await api.get('/user-management/my-plan/');
        setPlan(response.data);
      } catch (error) {
        console.error('No plan found:', error);
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchIndividualPlan();
  }, []);

  return (
    <div className="primary_object rounded-xl p-6 shadow-lg">
      {/* Header with Avatar */}
      <div className="flex items-center gap-4 mb-6">
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="w-16 h-16 rounded-full border-2 border-blue-500"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <User size={32} className="text-blue-600 dark:text-blue-400" />
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="secondary_text text-lg font-bold">{user.name}</h3>
          <div className="flex items-center gap-2 normal_text text-sm">
            <Mail size={14} />
            <span>{user.email}</span>
          </div>
        </div>
      </div>

      {/* Individual Plan Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="font-semibold normal_text mb-3 flex items-center gap-2">
          <FileText size={18} />
          {t("dashboard.individual_plan") || "Individual Plan"}
        </h4>
        
        {loadingPlan ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : plan ? (
          <div className="rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium normal_text">{plan.file_name}</p>
                <p className="text-xs text-gray-500">
                  Uploaded: {new Date(plan.uploaded_at).toLocaleDateString()}
                </p>
              </div>
              <a
                href={plan.drive_web_link}
                target="_blank"
                rel="noopener noreferrer"
                className="custom_button custom_button--medium flex items-center gap-2"
              >
                <Download size={16} />
                {t("dashboard.download")}
              </a>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            {t("dashboard.no_plan")}
          </p>
        )}
      </div>
    </div>
  );
}

export default StudentCard;