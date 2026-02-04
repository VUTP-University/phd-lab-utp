import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL;

export default function NewsEvents() {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${API_URL}news/`);
        const latest3 = res.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);
        setNews(latest3);
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const toggleDescription = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((nid) => nid !== id) : [...prev, id]
    );
  };

  return (
    <section className="pb-16 pt-20 mt-10 primary_object">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center primary_text mb-12">
          {t("news.title")}
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading news...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => {
              const isExpanded = expandedIds.includes(item.id);
              const shortDesc =
                item.description.length > 150
                  ? item.description.slice(0, 150) + "..."
                  : item.description;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow"
                >
                  <h3 className="font-semibold text-xl p-4 border-b">{item.title}</h3>

                  {item.images && item.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-2">
                      {item.images.map((img) => (
                        <img
                          key={img.id}
                          src={img.image}
                          alt={item.title}
                          className="w-full object-cover rounded max-h-60" 
                        />
                      ))}
                    </div>
                  )}

                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-gray-700 mb-3 text-sm">
                      {isExpanded ? item.description : shortDesc}
                      {item.description.length > 150 && (
                        <button
                          onClick={() => toggleDescription(item.id)}
                          className="ml-1 text-blue-500 hover:underline"
                        >
                          {isExpanded ? "Скрий" : "Виж още"}
                        </button>
                      )}
                    </p>

                    <p className="text-gray-500 text-xs mb-1">{item.author}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
