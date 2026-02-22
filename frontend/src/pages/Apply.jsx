import React from "react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";
import Footer from "../components/Footer";
import Procedure from "../components/Apply/Procedure";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


export default function Apply() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">


      {/* Main Content */}
      <main className="flex-1 mt-10 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                  {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-6 md:mb-8 normal_text hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <ArrowLeft size={20} />
            {t("common.go_back")}
          </button>
        <Procedure />
      </main>
      {/* Footer */}
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}