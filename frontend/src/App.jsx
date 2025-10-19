import { useState } from 'react'
import './App.css'
import "./i18n.js";
import Header from "./components/Header";
import Programs from "./components/Programs";
import Requirements from "./components/Requirements";
import Resources from "./components/Resources";
import Documents from "./components/Documents";
import ContactForm from "./components/ContactForm";
import News from "./components/News";
import LoginSection from "./components/LoginSection";
import Footer from "./components/Footer";

// import { Dashboard } from "./components/Panel/Dashboard";

export default function App() {
  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      <Header />
      <main className="space-y-16">
        <Programs />
        <Requirements />
        <LoginSection />
        <Resources />
        <Documents />
        <News />
      </main>
      <Footer />
    </div>
  );
}
