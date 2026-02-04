import React from "react";
import AdminCoursesTable from "./AdminCoursesTable";
import AdminCoursesMobile from "./AdminCoursesMobile";

export default function AdminCourses({
  courses,
  displayedCourses,
  onToggle,
}) {
  return (
    <>
      <AdminCoursesTable
        courses={courses}
        displayedCourses={displayedCourses}
        onToggle={onToggle}
      />

      <AdminCoursesMobile
        courses={courses}
        displayedCourses={displayedCourses}
        onToggle={onToggle}
      />
    </>
  );
}