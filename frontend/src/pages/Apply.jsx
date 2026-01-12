import React from "react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";
import Footer from "../components/Footer";
import Procedure from "../components/Apply/Procedure";
import BackButton from "../components/BackButton";

export default function Apply() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      {/* <header className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-20 mt-6">
        <div className="flex items-center space-x-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header> */}

      {/* Main Content */}
      <main className="flex-1 mt-10 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Procedure />
        <BackButton />
      </main>
      {/* Footer */}
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}