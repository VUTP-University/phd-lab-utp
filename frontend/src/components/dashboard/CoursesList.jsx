import React, { useEffect, useState } from "react";
import axios from "axios";

function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          `http://localhost:8000/classroom/courses/?email=${user.email}`
        );

        const coursesData = res.data.courses || res.data.coursesList || res.data;
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

  if (loading) return <p className="normal_text text-center mt-10">Loading courses...</p>;
  if (error) return <p className="normal_text text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center mb-8">
      <h2 className="secondary_text mb-8 text-center">My Courses</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-6xl px-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="primary_object p-6 hover:shadow-xl transition-shadow flex flex-col justify-between w-full"
          >
            <div className="flex flex-col items-center text-center">
              <h3 className="primary_text mb-2 text-xl">{course.name}</h3>
              <p className="normal_text mb-2">{course.subject}</p>
              <p className="normal_text text-gray-500 text-sm mb-1">
                Status: {course.courseState}
              </p>
              <p className="normal_text text-gray-400 text-sm">
                Created: {new Date(course.creationTime).toLocaleDateString()}
              </p>
            </div>

            <a
              href={course.alternateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="custom_button mt-4 w-full text-center"
            >
              Go to Classroom
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoursesList;
