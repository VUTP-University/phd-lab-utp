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
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-20 mt-6">
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <Hero />
        <Specialties />
        <Documents />
        <NewsEvents />
      </main>

      <footer className="mt-20">
        <Footer />
      </footer>
    </>
  );
}