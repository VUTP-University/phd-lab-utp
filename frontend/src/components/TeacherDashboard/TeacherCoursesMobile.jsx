import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

export default function TeacherCoursesMobile({
  courses,
  displayedCourses,
  onToggle,
  expandedCourseId,
  onExpandCourse,
}) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = courses.slice(startIndex, endIndex);

  return (
    <div className="md:hidden space-y-4">
      {currentCourses.map((course) => (
        <div
          key={course.id}
          className={`primary_object p-4 rounded-lg border ${
            expandedCourseId === course.id ? "border-blue-400" : ""
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="normal_text font-semibold">{course.name}</h3>
              <p className="normal_text_2 text-sm mt-1">{course.section}</p>
            </div>
            <span
              className={`badge ml-2 ${
                course.courseState === "ACTIVE" ? "badge--active" : "badge--inactive"
              }`}
            >
              {course.courseState}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 normal_text_2 text-sm">
              <input
                type="checkbox"
                checked={displayedCourses[course.id] || false}
                onChange={(e) => onToggle(course, e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              {t("teacher_dashboard.visible")}
            </label>

            <button
              onClick={() => onExpandCourse(course.id)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition ${
                expandedCourseId === course.id
                  ? "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200"
                  : "hover:bg-gray-200 dark:hover:bg-gray-600 normal_text_2"
              }`}
            >
              {t("teacher_dashboard.details")}
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  expandedCourseId === course.id ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={16} />
            Prev
          </button>

          <span className="normal_text_2 text-sm">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
