import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminCoursesMobile({
  courses,
  displayedCourses,
  onToggle,
}) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination logic
  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = courses.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="md:hidden space-y-4">
      {currentCourses.map((course) => (
        <div
          key={course.id}
          className="primary_object p-4 space-y-3"
        >
          <div className="flex justify-between items-start gap-3">
            <h3 className="secondary_text text-lg font-semibold flex-1">
              {course.name}
            </h3>
            <input
              type="checkbox"
              checked={displayedCourses[course.id] || false}
              onChange={(e) => onToggle(course, e.target.checked)}
              className="w-5 h-5 mt-1 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="normal_text_2 font-semibold text-gray-600 dark:text-gray-400">
                {t("admin_dashboard.course_id")}:
              </span>
              <span className="normal_text_2">{course.id}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="normal_text_2 font-semibold text-gray-600 dark:text-gray-400">
                {t("admin_dashboard.section")}:
              </span>
              <span className="normal_text_2">{course.section}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="normal_text_2 font-semibold text-gray-600 dark:text-gray-400">
                {t("admin_dashboard.status")}:
              </span>
              <span
                className={`badge ${
                  course.courseState === "ACTIVE"
                    ? "badge--active"
                    : "badge--inactive"
                }`}
              >
                {course.courseState}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="primary_object p-4 flex items-center justify-between">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="normal_text_2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}