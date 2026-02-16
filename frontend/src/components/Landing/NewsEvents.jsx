// NewsEvents.jsx - Component to display recent news and events on the landing page, with sharing options
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Calendar
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorDisplay from "../../components/ErrorDisplay";
import EmptyState from "../../components/EmptyState";
import api from "../../../api.js";

export default function NewsEvents() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/news/");
      setNews(response.data.news || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError(error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const shareOnFacebook = (newsItem) => {
    // Use the Django template URL for sharing (has meta tags)
    const shareUrl = `${window.location.origin}/news/${newsItem.id}/share/`;
    const url = encodeURIComponent(shareUrl);
    
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "width=600,height=400"
    );
  };
  
  const shareOnLinkedIn = (newsItem) => {
    // Use the Django template URL for sharing (has meta tags)
    const shareUrl = `${window.location.origin}/news/${newsItem.id}/share/`;
    const url = encodeURIComponent(shareUrl);
    
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const openModal = (newsItem) => {
    navigate(`/news/${newsItem.id}/`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchNews} fullScreen />;
  }

  // Calculate recentNews AFTER all early returns
  const recentNews = news.slice(0, 3);

  return (
    <section className="primary_object py-6">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center primary_text mb-10">
          {t("news.title")}
        </h2>

        {news.length === 0 ? (
          <EmptyState
            title={t("news.no_news_title")}
            message={t("news.no_news_message")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentNews.map((item) => (
              <div
                key={item.id}
                className="primary_object card rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => openModal(item)}
              >
                {/* Image */}
                {item.images.length > 0 ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={`https://drive.google.com/thumbnail?id=${item.images[0].drive_file_id}&sz=w400`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to direct thumbnail link
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src =
                          item.images[0].drive_thumbnail_link ||
                          item.images[0].drive_web_link;
                      }}
                    />
                    {item.images.length > 1 && (
                      <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        +{item.images.length - 1} {t("news.more_images")}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Calendar size={48} className="text-gray-400" />
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  {/* Type Badge */}
                  <span
                    className={`inline-block text-xs px-2 py-1 rounded mb-2 ${
                      item.news_type === "news"
                        ? "badge badge--blue text-blue-800 dark:text-blue-400"
                        : "badge badge--purple text-purple-800 dark:text-purple-400"
                    }`}
                  >
                    {item.news_type === "news"
                      ? t("news.news")
                      : t("news.event")}
                  </span>

                  {/* Title */}
                  <h3 className="secondary_text font-semibold text-lg mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="normal_text text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                    {item.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>

                    {/* Share Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Facebook */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent opening modal
                          shareOnFacebook(item); // Share current item, not selectedNews
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg group transition-all duration-300 cursor-pointer social_media_button"
                        title={t("news.share_on_facebook")}
                      >
                        <svg
                          className="transition-all duration-300 group-hover:scale-110"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
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
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent opening modal
                          shareOnLinkedIn(item); // Share current item, not selectedNews
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg group transition-all duration-300 cursor-pointer social_media_button"
                        title={t("news.share_on_linkedin")}
                      >
                        <svg
                          className="rounded-md transition-all duration-300 group-hover:scale-110"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
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
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {news.length > 3 && (
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/news")}
              className="custom_button custom_button--medium"
            >
              {t("news.view_all")} ({news.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}