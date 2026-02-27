import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  ExternalLink,
  X,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../../api.js";

export default function TeacherCourseDetails({ courseId, onClose }) {
  const { t } = useTranslation();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("current");

  useEffect(() => {
    fetchDetails();
  }, [courseId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(
        `/api/classroom-teacher/course/${courseId}/details/`
      );
      setDetails(response.data);
    } catch (err) {
      console.error("Failed to fetch course details:", err);
      setError("Failed to load course details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-4 primary_object p-6 rounded-lg border">
        <LoadingSpinner message={t("teacher_dashboard.loading_details")} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 primary_object p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
            <X size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (!details) return null;

  const assignments = (
    activeTab === "current"
      ? details.current_assignments
      : details.previous_assignments
  ) || [];

  return (
    <div className="mt-4 primary_object p-6 rounded-lg border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 normal_text_2">
            <Users size={18} />
            <span>
              {t("teacher_dashboard.total_students")}: {details.total_students ?? 0}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("current")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "current"
              ? "bg-blue-600 text-white"
              : "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 normal_text_2"
          }`}
        >
          <span className="flex items-center gap-2">
            <AlertCircle size={16} />
            {t("teacher_dashboard.current_assignments")} ({details.current_count ?? 0})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("previous")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "previous"
              ? "bg-blue-600 text-white"
              : "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 normal_text_2"
          }`}
        >
          <span className="flex items-center gap-2">
            <CheckCircle size={16} />
            {t("teacher_dashboard.previous_assignments")} ({details.previous_count ?? 0})
          </span>
        </button>
      </div>

      {/* Assignments List */}
      {assignments.length === 0 ? (
        <p className="normal_text_2 text-center py-4">
          {t("teacher_dashboard.no_assignments")}
        </p>
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment) => {
            const submissionPercent =
              assignment.total_students > 0
                ? Math.round(
                    (assignment.turned_in_count / assignment.total_students) * 100
                  )
                : 0;

            return (
              <div
                key={assignment.id}
                className="p-4 rounded-lg border dark:border-gray-600"
              >
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium normal_text">
                      {assignment.title}
                    </h4>
                    {assignment.dueDate && (
                      <p className="text-sm normal_text_2 flex items-center gap-1 mt-1">
                        <Clock size={14} />
                        {t("teacher_dashboard.due_date")}:{" "}
                        {new Date(
                          assignment.dueDate.year,
                          assignment.dueDate.month - 1,
                          assignment.dueDate.day
                        ).toLocaleDateString()}
                      </p>
                    )}
                    {assignment.maxPoints && (
                      <p className="text-sm normal_text_2 mt-1">
                        {t("teacher_dashboard.max_points")}: {assignment.maxPoints}
                      </p>
                    )}
                  </div>

                  {assignment.alternateLink && (
                    <a
                      href={assignment.alternateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="custom_button custom_button--small flex items-center gap-1"
                    >
                      <ExternalLink size={14} />
                      <span className="hidden sm:inline">{t("teacher_dashboard.open_in_classroom")}</span>
                    </a>
                  )}
                </div>

                {/* Submission Progress */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="normal_text_2 flex items-center gap-1">
                      <Users size={14} />
                      {t("teacher_dashboard.submissions")}:{" "}
                      {assignment.turned_in_count}/{assignment.total_students}
                    </span>
                    <span className="normal_text_2">
                      {t("teacher_dashboard.graded")}: {assignment.graded_count}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        submissionPercent === 100
                          ? "bg-green-500"
                          : submissionPercent >= 50
                          ? "bg-blue-500"
                          : "bg-orange-500"
                      }`}
                      style={{ width: `${submissionPercent}%` }}
                    />
                  </div>
                  <p className="text-xs normal_text_2 mt-1 text-right">
                    {submissionPercent}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
