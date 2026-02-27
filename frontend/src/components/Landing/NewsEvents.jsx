// NewsEvents.jsx - Component to display recent news and events on the landing page, with sharing options
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Calendar, Facebook, Linkedin, Images } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorDisplay from "../../components/ErrorDisplay";
import EmptyState from "../../components/EmptyState";
import api from "../../../api.js";

// Strip markdown/HTML syntax for plain text previews in cards
function stripMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/<!--[\s\S]*?-->/g, "")          // HTML comments
    .replace(/```[\s\S]*?```/g, "")            // fenced code blocks
    .replace(/`([^`]+)`/g, "$1")              // inline code
    .replace(/~~([^~]+)~~/g, "$1")            // ~~strikethrough~~
    .replace(/\*\*([^*]+)\*\*/g, "$1")        // **bold**
    .replace(/__([^_]+)__/g, "$1")            // __bold__
    .replace(/\*([^*]+)\*/g, "$1")            // *italic*
    .replace(/_([^_]+)_/g, "$1")              // _italic_
    .replace(/#{1,6}\s+/g, "")               // # headings
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")  // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [links](url)
    .replace(/^[-*+]\s+/gm, "")              // - bullet lists
    .replace(/^\d+\.\s+/gm, "")              // 1. ordered lists
    .replace(/^>\s*/gm, "")                  // > blockquotes
    .replace(/^-{3,}$/gm, "")               // --- hr
    .replace(/<[^>]+>/g, "")                 // remaining HTML tags
    .replace(/https?:\/\/\S+/g, "")          // bare URLs
    .replace(/^\|[\s|:-]+$/gm, "")           // table separator rows  |---|---|
    .replace(/\|/g, " ")                     // table cell pipes
    .replace(/\s+/g, " ")
    .trim();
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
function driveThumb(fileId) {
  return `${API_BASE}/api/news/media/${fileId}/`;
}

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
      const response = await api.get("/api/news/");
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
    const shareUrl = `${window.location.origin}/api/news/${newsItem.id}/share/`;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareOnLinkedIn = (newsItem) => {
    const shareUrl = `${window.location.origin}/api/news/${newsItem.id}/share/`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "width=600,height=400"
    );
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
              <NewsCard
                key={item.id}
                item={item}
                t={t}
                onOpen={() => navigate(`/news/${item.id}/`)}
                onShareFacebook={(e) => {
                  e.stopPropagation();
                  shareOnFacebook(item);
                }}
                onShareLinkedIn={(e) => {
                  e.stopPropagation();
                  shareOnLinkedIn(item);
                }}
              />
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

function NewsCard({ item, t, onOpen, onShareFacebook, onShareLinkedIn }) {
  const preview = stripMarkdown(item.description);

  return (
    <div
      className="primary_object card rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={onOpen}
    >
      {/* Image */}
      {item.images.length > 0 ? (
        <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={driveThumb(item.images[0].drive_file_id, "w600")}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.style.visibility = "hidden";
            }}
          />
          {item.images.length > 1 && (
            <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
              <Images size={12} />
              {item.images.length}
            </span>
          )}
        </div>
      ) : (
        <div className="h-52 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Calendar size={48} className="text-gray-300 dark:text-gray-600" />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Type Badge */}
        <span
          className={`inline-block text-xs px-2.5 py-1 rounded-full mb-3 font-medium ${
            item.news_type === "news"
              ? "badge badge--blue text-blue-800 dark:text-blue-400"
              : "badge badge--purple text-purple-800 dark:text-purple-400"
          }`}
        >
          {item.news_type === "news" ? t("news.news") : t("news.event")}
        </span>

        {/* Title */}
        <h3 className="secondary_text font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {item.title}
        </h3>

        {/* Description preview (markdown stripped) */}
        <p className="normal_text text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
          {preview}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500">
            {new Date(item.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>

          {/* Share Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onShareFacebook}
              className="w-8 h-8 flex items-center justify-center rounded-lg group/btn transition-all duration-300 cursor-pointer social_media_button"
              title={t("news.share_on_facebook")}
            >
              <Facebook
                className="transition-all duration-300 group-hover/btn:scale-110"
                size={17}
              />
            </button>

            <button
              onClick={onShareLinkedIn}
              className="w-8 h-8 flex items-center justify-center rounded-lg group/btn transition-all duration-300 cursor-pointer social_media_button"
              title={t("news.share_on_linkedin")}
            >
              <Linkedin
                className="transition-all duration-300 group-hover/btn:scale-110"
                size={17}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
