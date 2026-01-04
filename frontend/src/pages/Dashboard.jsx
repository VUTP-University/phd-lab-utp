import React from "react";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
    const { t } = useTranslation();


  return (
    <div className="min-h-screen flex transition-colors">
      
      {/* SIDEBAR */}
      <aside className="w-100 border-r hidden lg:flex flex-col">
        <div className="px-6 py-5 text-xl font-bold secondary_text">
          {t('hero.phd_lab')}
        </div>
        <div className="px-6 py-1 my-1 text-xl font-bold text-center normal_text">
            {t('hero.uni_name')}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            "Dashboard",
            "Challenges",
            "Underworld",
            "Trivia",
            "Achievements",
            "Profile",
          ].map((item) => (
            <button
              key={item}
              className="w-full text-left px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button className="w-full text-left px-4 py-2 rounded-lg transition">
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        
        {/* HEADER */}
        <header className="flex justify-between items-center px-6 py-4">
          <h1 className="text-lg font-semibold primary_text">
            {t('hero.phd_lab')}
          </h1>

          <div className="flex items-center space-x-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 space-y-6">
          
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 secondary_text">
            {[
              { label: "Класни стаи", value: "" },
              { label: "Completed Challenges", value: "42" },
              { label: "Rank", value: "#128" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-6 shadow-sm primary_object"
              >
                <p className="text-sm">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* ACTIVITY */}
            <div className="col-span-12 xl:col-span-7 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Recent Activity
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Your latest submissions, battles, and achievements will appear here.
              </p>
            </div>

            {/* PROFILE CARD */}
            <div className="col-span-12 xl:col-span-5 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Profile Overview
              </h2>
              <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <p><strong>Username:</strong> dev_user</p>
                <p><strong>Level:</strong> 12</p>
                <p><strong>Main Language:</strong> Python</p>
              </div>
            </div>

            {/* PLACEHOLDER */}
            <div className="col-span-12 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Upcoming Features
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Leaderboards, AI mentors, analytics, and more.
              </p>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}