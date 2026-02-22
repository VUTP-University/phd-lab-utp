// NewsDetail.jsx - Page to display detailed view of a single news item, 
// including image gallery and sharing options

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, ArrowLeft, Calendar, Facebook, Linkedin } from "lucide-react";
import api from "../../api.js";

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchNews();
  }, [id]);

  const fetchNews = async () => {
    try {
      const response = await api.get(`/news/${id}/`);
      setNews(response.data);
      
      // Set Open Graph meta tags dynamically
      document.title = response.data.title;
      updateMetaTag("og:title", response.data.title);
      updateMetaTag("og:description", response.data.description);
      updateMetaTag("og:url", window.location.href);
      
      if (response.data.images.length > 0) {
        const imageUrl = `https://drive.google.com/thumbnail?id=${response.data.images[0].drive_file_id}&sz=w800`;
        updateMetaTag("og:image", imageUrl);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateMetaTag = (property, content) => {
    let element = document.querySelector(`meta[property="${property}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute("property", property);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  };

  const shareOnFacebook = () => {
    // Use the Django template URL for sharing (has meta tags)
    // ${window.location.origin} or grok temp URL for debug
    const shareUrl = `${window.location.origin}/news/${news.id}/share/`;
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "width=600,height=400"
    );
  };

  
  
  const shareOnLinkedIn = () => {
    // Use the Django template URL for sharing (has meta tags)
    const shareUrl = `${window.location.origin}/news/${news.id}/share/`;
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const nextImage = () => {
    if (news && news.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === news.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (news && news.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? news.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="normal_text">{t("news.loading")}</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="normal_text text-red-500">{t("news.no_news")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/news")}
          className="flex items-center gap-2 mb-6 normal_text hover:text-blue-600 transition"
        >
          <ArrowLeft size={20} />
          {t("news.news_details.back_to_news")}
        </button>

        {/* News Content */}
        <article className="primary_object rounded-lg p-8">
          {/* Type Badge */}
          <span
            className={`inline-block text-xs px-3 py-1 rounded mb-4 ${
              news.news_type === "news"
                ? "badge badge--blue text-blue-800 dark:text-blue-400"
                : "badge badge--purple text-purple-800 dark:text-purple-400"
            }`}
          >
            {news.news_type === "news" ? t("news.news") : t("news.event")}
          </span>

          {/* Title */}
          <h1 className="primary_text text-3xl font-bold mb-4">
            {news.title}
          </h1>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Calendar size={16} />
            {new Date(news.created_at).toLocaleDateString()}
          </div>

          {/* Image Gallery */}
          {news.images.length > 0 && (
            <div className="relative mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={`https://drive.google.com/thumbnail?id=${news.images[currentImageIndex].drive_file_id}&sz=w1000`}
                alt={news.title}
                className="w-full max-h-[600px] object-contain"
                onError={(e) => {
                  e.target.src = news.images[currentImageIndex].drive_web_link;
                }}
              />

              {news.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                    {currentImageIndex + 1} / {news.images.length}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Description */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <p className="normal_text text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {news.description}
            </p>
          </div>

          {/* Share Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center justify-between">
              <span className="normal_text font-medium">{t("news.news_details.share_this_news")}</span>
              
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <button
                  onClick={shareOnFacebook}
                  className="w-8 h-8 flex items-center justify-center rounded-lg group transition-all duration-300 cursor-pointer social_media_button"
                  title={t("news.share_on_facebook")}
                >
                  <Facebook
                    className="rounded-md transition-all duration-300 group-hover:scale-110"
                    size={20}
                  />
                </button>

                {/* LinkedIn */}
                <button
                  onClick={shareOnLinkedIn}
                  className="w-8 h-8 flex items-center justify-center rounded-lg group transition-all duration-300 cursor-pointer social_media_button"
                  title={t("news.share_on_linkedin")}
                >
                  <Linkedin
                    className="rounded-md transition-all duration-300 group-hover:scale-110"
                    size={20}
                  />
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}