import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GraduationCap, Mail } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../../api.js";

export default function TeacherStudents() {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/api/user-management/my-doctoral-students/");
        setStudents(res.data.doctoral_students || []);
      } catch (err) {
        console.error("Error fetching doctoral students:", err);
        setError(t("teacher_dashboard.doctoral_students_error"));
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) {
    return <LoadingSpinner message={t("teacher_dashboard.doctoral_students_loading")} />;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 secondary_text">
        {t("teacher_dashboard.doctoral_students_title")}
      </h2>

      {error && (
        <p className="text-sm text-red-500 mb-4">{error}</p>
      )}

      {students.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 normal_text_2">
          <GraduationCap size={48} className="opacity-30" />
          <p className="text-base font-medium">{t("teacher_dashboard.no_doctoral_students")}</p>
          <p className="text-sm opacity-60">{t("teacher_dashboard.no_doctoral_students_hint")}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {students.map((email) => (
            <li
              key={email}
              className="flex items-center gap-3 p-3 border rounded-lg normal_text_2"
            >
              <GraduationCap size={18} className="shrink-0 opacity-60" />
              <div className="flex items-center gap-2">
                <Mail size={14} className="opacity-50" />
                <span>{email}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
