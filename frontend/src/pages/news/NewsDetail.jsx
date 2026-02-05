import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import ShareButtons from "../../components/ShareButtons";

const API_URL = import.meta.env.VITE_API_URL;

export default function NewsDetail() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const language = i18n.language;

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    axios
      .get(`${API_URL}news/${id}/`)
      .then((res) => setNews(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!news?.images || news.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        (prev + 1) % news.images.length
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [news]);

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  if (!news) {
    return <p className="text-center mt-20">News not found</p>;
  }

  const titleToShow =
    language === "en" && news.title_en ? news.title_en : news.title;

  const descToShow =
    language === "en" && news.desc_en ? news.desc_en : news.description;

  return (
    <section className="pt-24 pb-16 primary_object">
      <div className="max-w-5xl mx-auto px-6">

        {/* Title */}
        <h1 className="text-4xl font-extrabold primary_text mb-8">
          {titleToShow}
        </h1>

        {/* Images */}
        {news.images && news.images.length > 0 && (
          <div className="relative w-full h-[420px] mb-10 overflow-hidden rounded-xl shadow-md">
            {news.images.map((img, idx) => (
              <img
                key={img.id}
                src={img.image}
                alt={titleToShow}
                className={`
                  absolute top-0 left-0 w-full h-full object-contain
                  transition-opacity duration-1000
                  ${idx === currentImage ? "opacity-100" : "opacity-0"}
                `}
              />
            ))}
          </div>
        )}

        {/* Description */}
        <div className="text-gray-800 leading-relaxed whitespace-pre-line text-base mb-6">
          {descToShow}
        </div>

        {/* Author + date (moved here & slightly bigger) */}
        <div className="text-gray-600 text-sm md:text-[15px] mb-8">
          <span className="font-medium">{news.author}</span>
          <span className="mx-2">•</span>
          <p>
            {new Date(news.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Share */}
        <ShareButtons
          url={window.location.href}
          title={titleToShow}
        />

      </div>
    </section>
  );
}
