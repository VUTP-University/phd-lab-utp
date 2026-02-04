import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminNews({ user }) {
  const [news, setNews] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}news/`)
      .then((res) => setNews(res.data))
      .catch((err) => console.error(err));
  }, []);

  const toggleDescription = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((nid) => nid !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {user?.is_lab_admin && (
  <div className="flex justify-end">
    <a
      href="/create-news"
      className="px-6 py-2 custom_button"
    >
      Създай новина
    </a>
  </div>
)}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => {
          const isExpanded = expandedIds.includes(item.id);
          const shortDesc =
            item.description.length > 150
              ? item.description.slice(0, 150) + "..."
              : item.description;

          return (
            <div
              key={item.id}
              className="bg-white border rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
              <h3 className="font-bold text-xl p-4 border-b">{item.title}</h3>

              {item.images && item.images.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2">
                  {item.images.map((img) => (
                    <img
                      key={img.id}
                      src={img.image}
                      alt={item.title}
                      className="w-full object-cover rounded"
                    />
                  ))}
                </div>
              )}
              <div className="p-4 flex flex-col flex-1">
                <p className="text-gray-700 mb-4">
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
                <p className="text-sm text-gray-500">{item.author}</p>
                <p className="text-sm text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
