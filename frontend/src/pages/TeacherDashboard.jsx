import React, { useState } from "react";
import Footer from "../components/Footer";
import TeacherSidebar from "../components/TeacherDashboard/TeacherSidebar";
import TeacherCourses from "../components/TeacherDashboard/TeacherCourses";
import TeacherPlans from "../components/TeacherDashboard/TeacherPlans";
import TeacherStudents from "../components/TeacherDashboard/TeacherStudents";
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";

export default function TeacherDashboard() {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState("courses");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case "plans":
        return <TeacherPlans />;
      case "students":
        return <TeacherStudents />;
      case "courses":
      default:
        return <TeacherCourses />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b">
        <h1 className="text-lg font-bold primary_text">
          {t("teacher_dashboard.title")}
        </h1>
        <button onClick={() => setSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <TeacherSidebar
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
