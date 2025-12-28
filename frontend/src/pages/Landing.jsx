import React from "react";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";
import Hero from "../components/Landing/Hero";
import Specialties from "../components/Landing/Specialties";
import Documents from "../components/Landing/Documents";
import NewsEvents from "../components/Landing/NewsEvents";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <>
      <header className="flex justify-end p-4">
        <div className="space-x-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>
      <Hero />
      <Specialties />
      <Documents />
      <NewsEvents />
      <footer>
        <Footer />
      </footer>
    </>
  );
}