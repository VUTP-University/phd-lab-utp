// AllNews.jsx - Page to display all news and events with filtering and sharing options

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft, Facebook, Linkedin, Images } from "lucide-react";
import api from "../../api.js";

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

export default function AllNews() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api.get("/api/news/");
      setNews(response.data.news);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews =
    filter === "all" ? news : news.filter((item) => item.news_type === filter);

  const shareOnFacebook = (newsItem, e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/api/news/${newsItem.id}/share/`;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareOnLinkedIn = (newsItem, e) => {
    e.stopPropagation();
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
            {[
              { key: "all", label: t("news.all_news.all"), count: news.length },
              {
                key: "news",
                label: t("news.all_news.news"),
                count: news.filter((n) => n.news_type === "news").length,
              },
              {
                key: "event",
                label: t("news.all_news.events"),
                count: news.filter((n) => n.news_type === "event").length,
              },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 font-medium transition ${
                  filter === key
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <p className="text-center normal_text text-gray-500 py-12">
            No {filter === "all" ? "" : filter} items found
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                t={t}
                onOpen={() => navigate(`/news/${item.id}`)}
                onShareFacebook={(e) => shareOnFacebook(item, e)}
                onShareLinkedIn={(e) => shareOnLinkedIn(item, e)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
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
