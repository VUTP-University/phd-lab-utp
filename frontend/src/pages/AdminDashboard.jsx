import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        // 1️⃣ Fetch all courses from Google Classroom
        const resCourses = await axios.get(
          "http://localhost:8000/classroom/courses/",
          {
            params: { email: user.email },
            paramsSerializer: (params) =>
              qs.stringify(params, { arrayFormat: "repeat" }),
          }
        );

        const allCourses = resCourses.data.courses || [];
        setCourses(allCourses);

        // 2️⃣ Fetch displayed courses from local DB
        const resDisplayed = await axios.get(
          "http://localhost:8000/classroom-admin/displayed-courses/"
        );
        const displayed = resDisplayed.data.displayed_courses || [];

        // Convert to an object for faster lookup
        const displayedMap = {};
        displayed.forEach((c) => {
          displayedMap[c.course_id] = true;
        });
        setDisplayedCourses(displayedMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCourses();
  }, []);

  // Handler for toggling course visibility
  const handleToggle = async (course, visible) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.post(
        "http://localhost:8000/classroom-admin/displayed-course/toggle/",
        {
          course_id: course.id,
          name: course.name,
          section: course.section,
          alternate_link: course.alternateLink,
          visible: visible,
        }
      );

      // Update state based on backend response
      setDisplayedCourses((prev) => {
        const newState = { ...prev };
        if (visible) {
          // Course was added
          newState[course.id] = true;
        } else {
          // Course was removed
          delete newState[course.id];
        }
        return newState;
      });
    } catch (err) {
      console.error("Failed to update course visibility:", err);
    }
  };

  if (loading)
    return <p className="text-center mt-10">{t("dashboard.loading")}</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mt-10 mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <h1 className="text-3xl font-bold mb-6 primary_text">
          {t("admin_dashboard.title")}
        </h1>

        <section className="primary_object p-4 mb-10 sm:p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 secondary_text">
            {t("admin_dashboard.courses_title")}
          </h2>

          {/* Desktop Table */}
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
                        onChange={(e) => handleToggle(course, e.target.checked)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
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
                    onChange={(e) => {
                      handleToggle(course, e.target.checked);
                    }}
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
        </section>
      </main>
      <Footer />
    </div>
  );
}
