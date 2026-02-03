import React from "react";
import { useTranslation } from "react-i18next";

export default function AdminCoursesMobile({
  courses,
  displayedCourses,
  onToggle,
}) {
  const { t } = useTranslation();

  return (
    <div className="md:hidden space-y-4">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white rounded-lg shadow p-4 flex flex-col space-y-2"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-md">{course.name}</h3>
            <input
              type="checkbox"
              checked={displayedCourses[course.id] || false}
              onChange={(e) => onToggle(course, e.target.checked)}
            />
          </div>

          <p className="text-gray-500 text-sm">
            <span className="font-medium">
              {t("admin_dashboard.course_id")}:
            </span>{" "}
            {course.id}
          </p>

          <p className="text-gray-500 text-sm">
            <span className="font-medium">
              {t("admin_dashboard.section")}:
            </span>{" "}
            {course.section}
          </p>

          <p className="text-gray-500 text-sm">
            <span className="font-medium">
              {t("admin_dashboard.status")}:
            </span>{" "}
            {course.courseState}
          </p>
        </div>
      ))}
    </div>
  );
}