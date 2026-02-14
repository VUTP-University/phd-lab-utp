// NewsDetail.jsx - Page to display detailed view of a single news item, 
// including image gallery and sharing options

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, ArrowLeft, Calendar } from "lucide-react";
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
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-6 normal_text hover:text-blue-600 transition"
        >
          <ArrowLeft size={20} />
          {t("news.back_to_news")}
        </button>

        {/* News Content */}
        <article className="primary_object rounded-lg p-8">
          {/* Type Badge */}
          <span
            className={`inline-block text-xs px-3 py-1 rounded mb-4 ${
              news.news_type === "news"
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                : "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400"
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
              <span className="normal_text font-medium">Share this news:</span>
              
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <button
                  onClick={shareOnFacebook}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 shadow-md shadow-gray-200 dark:shadow-gray-900 group transition-all duration-300 cursor-pointer"
                  title="Share on Facebook"
                >
                  <svg
                    className="transition-all duration-300 group-hover:scale-110"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 72 72"
                    fill="none"
                  >
                    <path
                      d="M46.4927 38.6403L47.7973 30.3588H39.7611V24.9759C39.7611 22.7114 40.883 20.4987 44.4706 20.4987H48.1756V13.4465C46.018 13.1028 43.8378 12.9168 41.6527 12.8901C35.0385 12.8901 30.7204 16.8626 30.7204 24.0442V30.3588H23.3887V38.6403H30.7204V58.671H39.7611V38.6403H46.4927Z"
                      fill="#337FFF"
                    />
                  </svg>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={shareOnLinkedIn}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 shadow-md shadow-gray-200 dark:shadow-gray-900 group transition-all duration-300 cursor-pointer"
                  title="Share on LinkedIn"
                >
                  <svg
                    className="rounded-md transition-all duration-300 group-hover:scale-110"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 72 72"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.6975 11C12.6561 11 11 12.6057 11 14.5838V57.4474C11 59.4257 12.6563 61.03 14.6975 61.03H57.3325C59.3747 61.03 61.03 59.4255 61.03 57.4468V14.5838C61.03 12.6057 59.3747 11 57.3325 11H14.6975ZM26.2032 30.345V52.8686H18.7167V30.345H26.2032ZM26.6967 23.3793C26.6967 25.5407 25.0717 27.2703 22.4615 27.2703L22.4609 27.2701H22.4124C19.8998 27.2701 18.2754 25.5405 18.2754 23.3791C18.2754 21.1686 19.9489 19.4873 22.5111 19.4873C25.0717 19.4873 26.6478 21.1686 26.6967 23.3793ZM37.833 52.8686H30.3471L30.3469 52.8694C30.3469 52.8694 30.4452 32.4588 30.3475 30.3458H37.8336V33.5339C38.8288 31.9995 40.6098 29.8169 44.5808 29.8169C49.5062 29.8169 53.1991 33.0363 53.1991 39.9543V52.8686H45.7133V40.8204C45.7133 37.7922 44.6293 35.7269 41.921 35.7269C39.8524 35.7269 38.6206 37.1198 38.0796 38.4653C37.8819 38.9455 37.833 39.6195 37.833 40.2918V52.8686Z"
                      fill="#006699"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}