import React from "react";
import { useTranslation } from "react-i18next";
import { Users, Book, Newspaper, FileText } from "lucide-react"; // optional icons

export default function AdminSidebar({ active, onSelect, open, onClose }) {
  const { t } = useTranslation();

  const items = [
    { key: "users", label: "admin_dashboard.sidebar.users", icon: <Users className="w-5 h-5" /> },
    { key: "courses", label: "admin_dashboard.sidebar.courses", icon: <Book className="w-5 h-5" /> },
    { key: "news", label: "admin_dashboard.sidebar.news", icon: <Newspaper className="w-5 h-5" /> },
    { key: "publications", label: "admin_dashboard.sidebar.publications", icon: <FileText className="w-5 h-5" /> },
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
          bg-white shadow-lg md:shadow-none
          border-r border-gray-200
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-left">
          <h2 className="text-l font-bold normal_text">{t("admin_dashboard.title")}</h2>
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
                    ? "bg-primary normal_text shadow-lg"
                    : "hover:bg-gray-200 normal_text"
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