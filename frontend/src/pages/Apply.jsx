import React from "react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";
import Footer from "../components/Footer";
import Procedure from "../components/Apply/Procedure";

export default function Apply() {
    return (
      <>
        <header className="flex justify-end p-4">
          <div className="space-x-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <Procedure />
        <footer>
            <Footer />
        </footer>
      </>
    );
  }