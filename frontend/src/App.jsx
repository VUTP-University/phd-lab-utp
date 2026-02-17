
import "./i18n";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import About from "./pages/About";
import ProjectScope from "./pages/ProjectScope";
import Contacts from "./pages/Contacts";
import Apply from "./pages/Apply";
import Taxes from "./pages/Taxes";
import SpecialtyPage from "./pages/Specialties/SpecialtyPage";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import LawDocuments from "./pages/LawDocuments";
import ScientificDatabases from "./pages/ScientificDatabases";
import NewsDetail from "./pages/NewsDetail";
import AllNews from "./pages/AllNews";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  // Restore language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  // User state
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);


  useEffect(() => {
    const openNewsId = sessionStorage.getItem("openNewsId");
    if (openNewsId) {
      sessionStorage.removeItem("openNewsId");
      navigate(`/news/${openNewsId}`);
    }
  }, [navigate]);  // Add navigate to dependencies

  
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Landing user={user} setUser={setUser} />} />
        <Route path="/about" element={<About />} />
        <Route path="/project-scope" element={<ProjectScope />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/specialties/:page" element={<SpecialtyPage />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/taxes" element={<Taxes />} />

        {/* Documents */}
        <Route path="/law-documents" element={<LawDocuments />} />
        <Route path="/scientific-databases" element={<ScientificDatabases />} />
        
        {/* Admin Dashboard */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard user={user} />
          </ProtectedRoute>
        } />

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard user={user} />
            </ProtectedRoute>
          }
        />

        {/* News Pages */}
        <Route path="/news" element={<AllNews />} />
        <Route path="/news/:id" element={<NewsDetail />} />
      </Routes>
    </>
  );
}

export default App;
