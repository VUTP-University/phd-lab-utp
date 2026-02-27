import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AdminCoursesTable from "./AdminCoursesTable";
import AdminCoursesMobile from "./AdminCoursesMobile";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorDisplay from "../../components/ErrorDisplay";
import EmptyState from "../../components/EmptyState";
import { BookOpen } from "lucide-react";
import api from "../../../api.js";

export default function AdminCourses() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch ALL courses
      const resCourses = await api.get("/api/classroom-admin/courses/");
      setCourses(resCourses.data.courses || []);

      // Fetch visible courses
      const resDisplayed = await api.get("/api/classroom-admin/displayed-courses/");

      // Create a map: { courseId: true }
      const map = {};
      resDisplayed.data.displayed_courses.forEach((c) => {
        map[c.course_id] = true;
      });

      setDisplayedCourses(map);
    } catch (error) {
      console.error("Error fetching courses:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else if (error.response?.status === 403) {
        setError("You do not have admin permissions.");
      } else {
        setError("Failed to load courses. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (course, visible) => {
    try {
      await api.post("/api/classroom-admin/displayed-course/toggle/", {
        course_id: course.id,
        name: course.name,
        section: course.section || "",
        alternate_link: course.alternateLink,
        visible,
      });

      // Update local state
      setDisplayedCourses((prev) => {
        const next = { ...prev };
        if (visible) {
          next[course.id] = true;
        } else {
          delete next[course.id];
        }
        return next;
      });
    } catch (error) {
      console.error("Error toggling course:", error);
      alert("Failed to update course visibility. Please try again.");
    }
  };

  if (loading) {
    return <LoadingSpinner message={t("admin_dashboard.loading")} />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchData} />;
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title={t("admin_dashboard.no_courses_title")}
        message={t("admin_dashboard.no_courses_message")}
      />
    );
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6 secondary_text">
        {t("admin_dashboard.courses_title")}
      </h2>

      <AdminCoursesTable
        courses={courses}
        displayedCourses={displayedCourses}
        onToggle={handleToggle}
      />

      <AdminCoursesMobile
        courses={courses}
        displayedCourses={displayedCourses}
        onToggle={handleToggle}
      />
    </>
  );
}