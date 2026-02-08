import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import ShareButtons from "../ShareButtons";

const API_URL = import.meta.env.VITE_API_URL;

export default function NewsEvents() {
  const {  i18n } = useTranslation();
  const language = i18n.language;
  const navigate = useNavigate(); 

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImages, setCurrentImages] = useState({});

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${API_URL}news/`);
        const latest3 = res.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);

        setNews(latest3);

        const initialImages = {};
        latest3.forEach((item) => {
          initialImages[item.id] = 0;
        });
        setCurrentImages(initialImages);
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // carousel autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImages((prev) => {
        const updated = {};
        news.forEach((item) => {
          if (item.images && item.images.length > 1) {
            updated[item.id] = (prev[item.id] + 1) % item.images.length;
          } else {
            updated[item.id] = 0;
          }
        });
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [news]);

  return (
    <section className="pb-16 pt-20 mt-10 primary_object">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center primary_text mb-12">
          {language === "en" ? "News & Events" : "Новини и събития"}
        </h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading news...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => {
                const titleToShow =
                  language === "en" && item.title_en ? item.title_en : item.title;

                const descToShow =
                  language === "en" && item.desc_en
                    ? item.desc_en
                    : item.description;

                const shortDesc =
                  descToShow.length > 150
                    ? descToShow.slice(0, 150) + "..."
                    : descToShow;

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow"
                  >
                    <h3 className="font-semibold text-xl p-4 border-b">
                      {titleToShow}
                    </h3>

                    {item.images && item.images.length > 0 && (
                      <div className="relative w-full h-64 overflow-hidden rounded">
                        {item.images.map((img, idx) => (
                          <img
                            key={img.id}
                            src={img.image}
                            alt={titleToShow}
                            className={`absolute top-0 left-0 w-full h-full object-contain rounded transition-opacity duration-1000 ${
                              idx === currentImages[item.id]
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    <div className="p-3 flex flex-col flex-1">
                      <p className="text-gray-700 text-sm mb-2">
                        {shortDesc}
                        {descToShow.length > 120 && (
                          <a
                            href={`/news/${item.id}`}
                            className="ml-1 text-blue-500 hover:underline text-sm"
                          >
                            {language === "en"
                              ? "Read full news"
                              : "Виж цялата новина"}
                          </a>
                        )}
                      </p>
                      <p className="text-gray-400 text-xs mb-2">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>

                      <ShareButtons
                        url={`${window.location.origin}/news/${item.id}`}
                        title={titleToShow}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            
            <div className="text-center mt-12 w-full">
              <button
                onClick={() => navigate("/news")}
                className="custom_button px-6 py-3 text-lg w-full"
              >
                {language === "en" ? "All News" : "Всички новини"}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
