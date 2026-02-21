import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TeacherCoursesTable from "./TeacherCoursesTable";
import TeacherCoursesMobile from "./TeacherCoursesMobile";
import TeacherCourseDetails from "./TeacherCourseDetails";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorDisplay from "../../components/ErrorDisplay";
import EmptyState from "../../components/EmptyState";
import { BookOpen } from "lucide-react";
import api from "../../../api.js";

export default function TeacherCourses() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const resCourses = await api.get("/classroom-teacher/courses/");
      setCourses(resCourses.data.courses || []);

      const resDisplayed = await api.get("/classroom-admin/displayed-courses/");
      const map = {};
      (resDisplayed.data?.displayed_courses || []).forEach((c) => {
        map[c.course_id] = true;
      });
      setDisplayedCourses(map);
    } catch (error) {
      console.error("Error fetching courses:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else if (error.response?.status === 403) {
        setError("You do not have teacher permissions.");
      } else {
        setError("Failed to load courses. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (course, visible) => {
    try {
      await api.post("/classroom-admin/displayed-course/toggle/", {
        course_id: course.id,
        name: course.name,
        section: course.section || "",
        alternate_link: course.alternateLink,
        visible,
      });

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

  const handleExpandCourse = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  if (loading) {
    return <LoadingSpinner message={t("teacher_dashboard.loading")} />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchData} />;
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title={t("teacher_dashboard.no_courses_title")}
        message={t("teacher_dashboard.no_courses_message")}
      />
    );
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6 secondary_text">
        {t("teacher_dashboard.courses_title")}
      </h2>

      <TeacherCoursesTable
        courses={courses}
        displayedCourses={displayedCourses}
        onToggle={handleToggle}
        expandedCourseId={expandedCourseId}
        onExpandCourse={handleExpandCourse}
      />

      <TeacherCoursesMobile
        courses={courses}
        displayedCourses={displayedCourses}
        onToggle={handleToggle}
        expandedCourseId={expandedCourseId}
        onExpandCourse={handleExpandCourse}
      />

      {/* Course Details Panel */}
      {expandedCourseId && (
        <TeacherCourseDetails
          courseId={expandedCourseId}
          onClose={() => setExpandedCourseId(null)}
        />
      )}
    </>
  );
}
