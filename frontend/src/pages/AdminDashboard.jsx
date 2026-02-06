import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import AdminSidebar from "../components/AdminDashboard/AdminSidebar";
import AdminUsers from "../components/AdminDashboard/AdminUsers";
import AdminCourses from "../components/AdminDashboard/AdminCourses";
import AdminNews from "../components/AdminDashboard/AdminNews";
import AdminPublications from "../components/AdminDashboard/AdminPublications";
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";
import api from "../../api.js";  // ← Use api utility, not axios!

export default function AdminDashboard() {
  const { t } = useTranslation();

  const [activeView, setActiveView] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [courses, setCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Fetching admin data...');

        // Fetch ALL courses (JWT token automatically added by api interceptor)
        const resCourses = await api.get('/classroom-admin/courses/');
        
        console.log('✅ Courses fetched:', resCourses.data);
        setCourses(resCourses.data.courses || []);

        // Fetch which courses are currently marked as visible
        const resDisplayed = await api.get('/classroom-admin/displayed-courses/');
        
        console.log('✅ Displayed courses fetched:', resDisplayed.data);

        // Create a map for quick lookup: { courseId: true }
        const map = {};
        resDisplayed.data.displayed_courses.forEach((c) => {
          map[c.course_id] = true;
        });

        setDisplayedCourses(map);
        
      } catch (error) {
        console.error('❌ Error fetching admin data:', error);
        
        if (error.response?.status === 401) {
          setError('Session expired. Please log in again.');
        } else if (error.response?.status === 403) {
          setError('You do not have admin permissions.');
        } else {
          setError('Failed to load admin data. Please try again.');
        }
        
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggle = async (course, visible) => {
    try {
      console.log(`${visible ? 'Showing' : 'Hiding'} course:`, course.name);

      // Toggle course visibility (JWT token automatically added)
      await api.post('/classroom-admin/displayed-course/toggle/', {
        course_id: course.id,
        name: course.name,
        section: course.section || '',
        alternate_link: course.alternateLink,
        visible,
        // NO email parameter needed - user comes from JWT token!
      });

      console.log('✅ Course visibility updated');

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
      console.error('❌ Error toggling course:', error);
      alert('Failed to update course visibility. Please try again.');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center mt-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p>{t("dashboard.loading")}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center mt-10">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="custom_button"
          >
            Try Again
          </button>
        </div>
      );
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