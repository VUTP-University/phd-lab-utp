import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import Footer from "../components/Footer";
import AdminCourses from "../components/AdminDashboard/AdminCourses";
import { useTranslation } from "react-i18next";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const resCourses = await axios.get(
          "http://localhost:8000/classroom/courses/",
          {
            params: { email: user.email },
            paramsSerializer: (params) =>
              qs.stringify(params, { arrayFormat: "repeat" }),
          }
        );

        setCourses(resCourses.data.courses || []);

        const resDisplayed = await axios.get(
          "http://localhost:8000/classroom-admin/displayed-courses/"
        );

        const map = {};
        resDisplayed.data.displayed_courses.forEach((c) => {
          map[c.course_id] = true;
        });

        setDisplayedCourses(map);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggle = async (course, visible) => {
    await axios.post(
      "http://localhost:8000/classroom-admin/displayed-course/toggle/",
      {
        course_id: course.id,
        name: course.name,
        section: course.section,
        alternate_link: course.alternateLink,
        visible,
      }
    );

    setDisplayedCourses((prev) => {
      const next = { ...prev };
      visible ? (next[course.id] = true) : delete next[course.id];
      return next;
    });
  };

  if (loading) {
    return <p className="text-center mt-10">{t("dashboard.loading")}</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mt-10 mx-auto px-4 flex-1">
        <h1 className="text-3xl font-bold mb-6 primary_text">
          {t("admin_dashboard.title")}
        </h1>

        <section className="primary_object p-4 mb-10 rounded shadow">
          <AdminCourses
            courses={courses}
            displayedCourses={displayedCourses}
            onToggle={handleToggle}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}