
import "./i18n";
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
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
import CreateNewsPage from "./pages/news/CreateNewsPage"
import { useTranslation } from "react-i18next";
import ProtectedRoute from "./components/ProtectedRoute";
import NewsDetail from "./pages/news/NewsDetail";
import AllNews from "./pages/news/AllNews";

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

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


        <Route path="/admin-dashboard" element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard user={user} />
          </ProtectedRoute>
        } />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route path="/create-news" element={<CreateNewsPage user={user} />} />
        <Route path="/news" element={<AllNews />} />  
        <Route path="/news/:id" element={<NewsDetail />} />

        {/* Future routes */}
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </>
  );
}

export default App;
