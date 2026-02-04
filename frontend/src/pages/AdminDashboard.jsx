import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import Footer from "../components/Footer";

import AdminSidebar from "../components/AdminDashboard/AdminSidebar";
import AdminUsers from "../components/AdminDashboard/AdminUsers";
import AdminCourses from "../components/AdminDashboard/AdminCourses";
import AdminNews from "../components/AdminDashboard/AdminNews";
import AdminPublications from "../components/AdminDashboard/AdminPublications";

import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";

export default function AdminDashboard() {
  const { t } = useTranslation();

  const [activeView, setActiveView] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [courses, setCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const resCourses = await axios.get(
          "http://localhost:8000/classroom/courses/",
          { params: { email: user.email } }
        );

        setCourses(resCourses.data.courses || []);

        const resDisplayed = await axios.get(
          "http://localhost:8000/classroom-admin/displayed-courses/",
          { params: { email: user.email } }
          
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
        email: user.email
      }
    );

    setDisplayedCourses((prev) => {
      const next = { ...prev };
      visible ? (next[course.id] = true) : delete next[course.id];
      return next;
    });
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-center mt-10">{t("dashboard.loading")}</p>;
    }

    switch (activeView) {
      case "courses":
        return (
          <AdminCourses
            courses={courses}
            displayedCourses={displayedCourses}
            onToggle={handleToggle}
          />
        );
      case "news":
        return <AdminNews />;
      case "publications":
        return <AdminPublications />;
      case "users":
      default:
        return <AdminUsers />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b">
        <h1 className="text-lg font-bold primary_text">
          {t("admin_dashboard.title")}
        </h1>
        <button onClick={() => setSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <AdminSidebar
          active={activeView}
          onSelect={(view) => {
            setActiveView(view);
            setSidebarOpen(false);
          }}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <main className="flex-1 px-4 py-6 md:py-10 md:px-8">
          <section className="primary_object p-4 md:p-6 rounded shadow">
            {renderContent()}
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}