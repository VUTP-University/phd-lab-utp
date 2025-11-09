import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const COURSE_ID = import.meta.env.VITE_COURSE_ID;

const MyPhDLab = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.email) return;

      try {
        const res = await axios.get(`${API_URL}/classroom/courses/`, {
          params: { email: user.email, course_id: COURSE_ID},
        });
        setCourses(res.data.courses ? res.data.courses : [res.data]);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">My PhD Lab</h1>
      <p>This is your dedicated lab environment for PhD projects and tools.</p>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Your Courses</h2>

        {loading && <p>Loading courses...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && courses.length === 0 && <p>No courses found.</p>}

        <ul className="list-disc ml-6">
          {courses.map((course) => (
            <li key={course.id}>
              <strong>{course.name}</strong> - {course.section || "No section"} 
              <br />
              {course.descriptionHeading && <em>{course.descriptionHeading}</em>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyPhDLab;