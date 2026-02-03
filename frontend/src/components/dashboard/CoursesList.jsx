import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import qs from "qs";

function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.email) {
          setError("No user logged in");
          setLoading(false);
          return;
        }
  
        const res = await axios.get(
          "http://localhost:8000/classroom/visible-courses/",
          { params: { email: user.email } }
        );
  
        const coursesData = res.data.courses || [];
        setCourses(coursesData);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourses();
  }, []);

  if (loading)
    return <p className="normal_text text-center mt-10">{t("dashboard.loading")}</p>;
  if (error)
    return (
      <p className="normal_text text-center mt-10 text-red-500">{t("dashboard.error")}</p>
    );

    return (
      <section className="primary_object py-6 mt-8 mb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="primary_text mb-8 text-center">{t("dashboard.courses_title")}</h2>
  
          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="primary_object p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
              >
                {/* CARD HEADER */}
                <div className="text-center">
                  <h3 className="secondary_text text-m mb-2">
                    {course.name}
                  </h3>
                  <p className="normal_text mb-4">{course.subject}</p>
                </div>
  
                {/* CARD META */}
                <div className="text-center mb-6">
                  <p className="normal_text text-gray-500 text-sm mb-1">
                    Status: <span className="font-medium">{course.courseState}</span>
                  </p>
                  <p className="normal_text text-gray-400 text-sm">
                    Created:{" "}
                    {new Date(course.creationTime).toLocaleDateString()}
                  </p>
                </div>
  
                {/* CARD ACTION */}
                <a
                  href={course.alternateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="custom_button w-full text-center"
                >
                  Go to Classroom
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  export default CoursesList;