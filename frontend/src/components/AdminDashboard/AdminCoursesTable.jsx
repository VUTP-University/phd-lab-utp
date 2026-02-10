import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminCoursesTable({
  courses,
  displayedCourses,
  onToggle,
}) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination logic
  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = courses.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="hidden md:block">
      <div className="primary_object overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="">
              <tr>
                <th className="px-6 py-4 text-left normal_text font-semibold">
                  {t("admin_dashboard.course_name")}
                </th>
                <th className="px-6 py-4 text-left normal_text font-semibold">
                  {t("admin_dashboard.course_id")}
                </th>
                <th className="px-6 py-4 text-left normal_text font-semibold">
                  {t("admin_dashboard.section")}
                </th>
                <th className="px-6 py-4 text-left normal_text font-semibold">
                  {t("admin_dashboard.status")}
                </th>
                <th className="px-6 py-4 text-center normal_text font-semibold">
                  {t("admin_dashboard.visible")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentCourses.map((course) => (
                <tr
                  key={course.id}
                  className="hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  <td className="px-6 py-4 normal_text font-medium">
                    {course.name}
                  </td>
                  <td className="px-6 py-4 normal_text_2">
                    {course.id}
                  </td>
                  <td className="px-6 py-4 normal_text_2">
                    {course.section}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`badge ${
                        course.courseState === "ACTIVE"
                          ? "badge--active"
                          : "badge--inactive"
                      }`}
                    >
                      {course.courseState}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={displayedCourses[course.id] || false}
                      onChange={(e) => onToggle(course, e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="normal_text_2 text-gray-600 dark:text-gray-400">
              Showing {startIndex + 1} to {Math.min(endIndex, courses.length)} of{" "}
              {courses.length} courses
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  // Show first, last, current, and adjacent pages
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return <span key={page}>...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}