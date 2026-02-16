import React, { useState } from "react";
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

  const renderContent = () => {
    switch (activeView) {
      case "courses":
        return <AdminCourses />;
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