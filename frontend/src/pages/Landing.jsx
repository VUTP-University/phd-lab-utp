import React from "react";
import YouTubeLiveWrapper from "../components/Landing/YouTubeLiveWrapper";
import Hero from "../components/Landing/Hero";
import Specialties from "../components/Landing/Specialties";
import Documents from "../components/Landing/Documents";
import NewsEvents from "../components/Landing/NewsEvents";
import Footer from "../components/Footer";

export default function Landing({ user, setUser }) {
  return (
    <>
      <div className="mt-10 px-4">
        <div className="max-w-4xl mx-auto">
          <YouTubeLiveWrapper />
        </div>
      </div>
      <main className="container mt-10 mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <Hero user={user} setUser={setUser} />
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
