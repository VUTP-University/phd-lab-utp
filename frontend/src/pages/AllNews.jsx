// AllNews.jsx - Page to display all news and events with filtering and sharing options


import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft, Facebook, Linkedin } from "lucide-react";
import api from "../../api.js";

export default function AllNews() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'news', 'event'

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api.get("/news/");
      setNews(response.data.news);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = filter === 'all' 
    ? news 
    : news.filter(item => item.news_type === filter);

  const shareOnFacebook = (newsItem, e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/news/${newsItem.id}/share/`;
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareOnLinkedIn = (newsItem, e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/news/${newsItem.id}/share/`;
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "width=600,height=400"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="normal_text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-6 normal_text hover:text-blue-600 transition"
          >
            <ArrowLeft size={20} />
            {t("news.all_news.back_home")}
          </button>

          <h1 className="text-4xl font-bold primary_text mb-4">
            {t("news.all_news.title")}
          </h1>

          {/* Filter Tabs */}
          <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 font-medium transition ${
                filter === 'all'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {t("news.all_news.all")} ({news.length})
            </button>
            <button
              onClick={() => setFilter('news')}
              className={`px-4 py-2 font-medium transition ${
                filter === 'news'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {t("news.all_news.news")} ({news.filter(n => n.news_type === 'news').length})
            </button>
            <button
              onClick={() => setFilter('event')}
              className={`px-4 py-2 font-medium transition ${
                filter === 'event'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {t("news.all_news.events")} ({news.filter(n => n.news_type === 'event').length})
            </button>
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <p className="text-center normal_text text-gray-500 py-12">
            No {filter === 'all' ? '' : filter} items found
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                className="primary_object card rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/news/${item.id}`)}
              >
                {/* Image */}
                {item.images.length > 0 ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={`https://drive.google.com/thumbnail?id=${item.images[0].drive_file_id}&sz=w400`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = item.images[0].drive_thumbnail_link || item.images[0].drive_web_link;
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
                        onClick={(e) => shareOnFacebook(item, e)}
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
                        onClick={(e) => shareOnLinkedIn(item, e)}
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
      </div>
    </div>
  );
}