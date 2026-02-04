import React from "react";
import { useTranslation } from "react-i18next";

export default function AdminCoursesTable({
  courses,
  displayedCourses,
  onToggle,
}) {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 normal_text">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">
              {t("admin_dashboard.course_name")}
            </th>
            <th className="px-4 py-2 text-left">
              {t("admin_dashboard.course_id")}
            </th>
            <th className="px-4 py-2 text-left">
              {t("admin_dashboard.section")}
            </th>
            <th className="px-4 py-2 text-left">
              {t("admin_dashboard.status")}
            </th>
            <th className="px-4 py-2 text-center">
              {t("admin_dashboard.visible")}
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {courses.map((course) => (
            <tr key={course.id} className="hover:bg-gray-100">
              <td className="px-4 py-2">{course.name}</td>
              <td className="px-4 py-2">{course.id}</td>
              <td className="px-4 py-2">{course.section}</td>
              <td className="px-4 py-2">{course.courseState}</td>
              <td className="px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={displayedCourses[course.id] || false}
                  onChange={(e) => onToggle(course, e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}