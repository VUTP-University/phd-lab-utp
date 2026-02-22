// NewsEvents.jsx - Component to display recent news and events on the landing page, with sharing options
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Calendar, Facebook, Linkedin
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
                        <Facebook
                          className="rounded-md transition-all duration-300 group-hover:scale-110"
                          size={18}
                        />
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
                        <Linkedin
                          className="rounded-md transition-all duration-300 group-hover:scale-110"
                          size={18}
                        />  
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