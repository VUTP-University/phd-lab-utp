import React from "react";
import Footer from "../components/Footer";
import ContactForm from "../components/Contacts/ContactForm";

export default function Contacts() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <ContactForm />
      </main>
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}
