import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Contacts from "./pages/Contacts";
import Apply from "./pages/Apply";
import Taxes from "./pages/Taxes";
import SpecialtyPage from "./pages/Specialties/SpecialtyPage";

import "./i18n";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function App() {
  const { i18n } = useTranslation();

  // Restore language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Landing />} />
        <Route path="/specialties/:page" element={<SpecialtyPage />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/taxes" element={<Taxes />} />

        {/* Future routes */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </>
  );
}

export default App;
