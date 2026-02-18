import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, ArrowLeft, Search, BookOpen, BookOpenText, Compass, GraduationCap } from "lucide-react";

export default function NotFound404() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const floatingIcons = [
    { Icon: BookOpen, delay: 0, position: { left: "15%", top: "15%" } },
    { Icon: GraduationCap, delay: 1.5, position: { left: "60%", top: "10%" } },
    { Icon: BookOpenText, delay: 1, position: { left: "75%", top: "20%" } },
    { Icon: Search, delay: 2, position: { left: "25%", top: "70%" } },
    { Icon: Compass, delay: 0.5, position: { left: "80%", top: "65%" } },
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden" 
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map(({ Icon, delay, position }, index) => (
          <div
            key={index}
            className="absolute opacity-10 dark:opacity-5"
            style={{
              left: position.left,
              top: position.top,
              color: "var(--primary)",
              animation: `float ${3 + delay}s ease-in-out infinite`,
              animationDelay: `${delay}s`,
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            <Icon size={120 + index * 30} strokeWidth={1.5} />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl px-4 py-4">
        {/* 404 Illustration */}
        <div className="mb-12 relative animate-fade-in">
          <div className="relative inline-block">
            <h1 
              className="font-black leading-none"
              style={{
                fontSize: "clamp(50px, 35vw, 100px)",
                color: "var(--text)",
                textShadow: "4px 8px 16px rgba(37, 99, 235, 0.15)",
                letterSpacing: "-0.05em",
                fontFamily: '"Sofia Sans", sans-serif',
              }}
            >
              404
            </h1>
            
            {/* Floating graduation cap */}
            <div
              className="absolute animate-bounce"
              style={{ 
                top: "70%",
                right: "-8%",
                animationDuration: "3s",
                color: "var(--primary)",
              }}
            >
              <GraduationCap 
                size={100} 
                className="transform rotate-12"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-10 primary_object p-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="secondary_text font-bold mb-4">
            {t("common.title_404") }
          </h2>
          
          <p className="normal_text mb-4">
            {t("common.message_404") || "This page seems to have graduated to another location."}
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <p className="font-semibold mb-5 secondary_text" style={{ fontSize: "20px" }}>
            {t("common.quick_links")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/about" className="custom_button custom_button--outline custom_button--medium">
              <BookOpen size={18} />
              {t("about.about_title")}
            </a>
            <a href="/project-scope" className="custom_button custom_button--outline custom_button--medium">
              <BookOpenText size={18} />
              {t("project_scope.title")}
            </a>
            <a href="/contacts" className="custom_button custom_button--outline custom_button--medium">
              <Compass size={18} />
              {t("contact.title")}
            </a>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <a
            href="/"
            className="custom_button custom_button--medium"
          >
            <Home size={18} />
            {t("common.go_home") || "Go Home"}
          </a>
        </div>

        {/* Fun fact */}
        <div 
          className="primary_object p-5 animate-fade-in" 
          style={{ 
            animationDelay: "0.8s",
            borderLeft: "4px solid var(--primary)",
          }}
        >
          <p className="normal_text_3 normal_text_3--small italic flex items-center justify-center gap-2">
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <span style={{ color: "var(--text-muted)" }}>
              {t("common.fun_facts.random")}
            </span>
          </p>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(8deg);
          }
        }
      `}</style>
    </div>
  );
}