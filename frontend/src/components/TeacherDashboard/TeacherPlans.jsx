import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload, FileText, CheckCircle, AlertCircle, GraduationCap, ExternalLink } from "lucide-react";
import api from "../../../api.js";

export default function TeacherPlans() {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentEmail, setStudentEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploadedPlans, setUploadedPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    fetchStudents();
    fetchUploadedPlans();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/user-management/my-doctoral-students/");
      setStudents(res.data.doctoral_students || []);
    } catch (err) {
      console.error("Error fetching doctoral students:", err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchUploadedPlans = async () => {
    try {
      setLoadingPlans(true);
      const res = await api.get("/classroom-teacher/uploaded-plans/");
      setUploadedPlans(res.data.uploaded_plans || []);
    } catch (err) {
      console.error("Error fetching uploaded plans:", err);
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!studentEmail || !selectedFile) {
      setMessage({ type: "error", text: t("teacher_dashboard.plans.missing_fields") });
      return;
    }

    if (!selectedFile.name.endsWith(".pdf")) {
      setMessage({ type: "error", text: t("teacher_dashboard.plans.pdf_only") });
      return;
    }

    try {
      setUploading(true);
      setMessage(null);

      const formData = new FormData();
      formData.append("student_email", studentEmail);
      formData.append("file", selectedFile);

      await api.post("/classroom-teacher/upload-plan/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({
        type: "success",
        text: t("teacher_dashboard.plans.upload_success"),
      });
      setStudentEmail("");
      setSelectedFile(null);

      const fileInput = document.getElementById("teacher-plan-file-input");
      if (fileInput) fileInput.value = "";

      fetchUploadedPlans();
    } catch (err) {
      console.error("Error uploading plan:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.error || t("teacher_dashboard.plans.upload_error"),
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 secondary_text">
        {t("teacher_dashboard.plans.title")}
      </h2>

      {loadingStudents ? (
        <p className="text-sm normal_text_2">{t("teacher_dashboard.doctoral_students_loading")}</p>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 normal_text_2">
          <GraduationCap size={48} className="opacity-30" />
          <p className="text-base font-medium">{t("teacher_dashboard.no_doctoral_students")}</p>
          <p className="text-sm opacity-60">{t("teacher_dashboard.plans.no_students_hint")}</p>
        </div>
      ) : (
        <form onSubmit={handleUpload} className="max-w-lg space-y-4">
          {/* Student dropdown */}
          <div>
            <label className="block text-sm font-medium normal_text mb-1">
              {t("teacher_dashboard.plans.select_student")}
            </label>
            <select
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent normal_text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">—</option>
              {students.map((email) => (
                <option key={email} value={email}>{email}</option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium normal_text mb-1">
              {t("teacher_dashboard.plans.select_file")}
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition normal_text_2">
                <Upload size={18} />
                {t("teacher_dashboard.plans.choose_file")}
                <input
                  id="teacher-plan-file-input"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
              {selectedFile && (
                <span className="flex items-center gap-1 text-sm normal_text_2">
                  <FileText size={14} />
                  {selectedFile.name}
                </span>
              )}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                message.type === "success"
                  ? "badge badge--green"
                  : "badge badge--red"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {message.text}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading || !studentEmail || !selectedFile}
            className="custom_button custom_button--medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={18} />
            {uploading
              ? t("teacher_dashboard.plans.uploading")
              : t("teacher_dashboard.plans.upload")}
          </button>
        </form>
      )}

      {/* Uploaded Plans List */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 secondary_text">
          {t("teacher_dashboard.plans.uploaded_plans_title")}
        </h3>
        {loadingPlans ? (
          <p className="text-sm normal_text_2">{t("common.loading")}</p>
        ) : uploadedPlans.length === 0 ? (
          <p className="text-sm normal_text_2">{t("teacher_dashboard.plans.no_uploaded_plans")}</p>
        ) : (
          <ul className="space-y-2">
            {uploadedPlans.map((plan) => (
              <li
                key={plan.id}
                className="flex items-center justify-between p-3 border rounded-lg normal_text_2"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{plan.student_email}</span>
                  <span className="text-xs opacity-60">
                    {plan.file_name} · {new Date(plan.uploaded_at).toLocaleDateString()}
                  </span>
                </div>
                <a
                  href={plan.drive_web_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm custom_button custom_button--small"
                >
                  <ExternalLink size={14} />
                  {t("teacher_dashboard.plans.open")}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
