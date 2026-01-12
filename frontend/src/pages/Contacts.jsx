import React from "react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";
import Footer from "../components/Footer";
import ContactForm from "../components/Contacts/ContactForm";


export default function Contacts() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* <header className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-20 mt-6">
        <div className="flex items-center space-x-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header> */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <ContactForm />
      </main>
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}