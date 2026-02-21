import React from "react";
import { useTranslation } from "react-i18next";
import { Book, FileText, GraduationCap } from "lucide-react";

export default function TeacherSidebar({ active, onSelect, open, onClose }) {
  const { t } = useTranslation();

  const items = [
    { key: "courses", label: "teacher_dashboard.sidebar.courses", icon: <Book className="w-5 h-5" /> },
    { key: "students", label: "teacher_dashboard.sidebar.students", icon: <GraduationCap className="w-5 h-5" /> },
    { key: "plans", label: "teacher_dashboard.sidebar.plans", icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:static z-50 md:z-auto
          top-0 left-0 h-full w-90
          shadow-lg md:shadow-none
          border-r border-gray-200
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-left">
          <h2 className="text-l font-bold normal_text_3 normal_text_3--large">{t("teacher_dashboard.title")}</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200
                ${
                  active === item.key
                    ? "bg-primary normal_text_3 shadow-lg"
                    : "hover:bg-blue-200 dark:hover:bg-blue-500 normal_text_3"
                }
              `}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span className="font-medium">{t(item.label)}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
