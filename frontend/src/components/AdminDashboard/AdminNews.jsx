// AdminNews.jsx - Component for admin dashboard to manage news and events,
// including creation, editing, image uploads, and visibility toggling

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Save,
  Edit2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  X,
  Loader2,
  Upload,
  Info,
} from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import api from "../../../api.js";

// Detect dark mode from html element class
function useColorMode() {
  const [mode, setMode] = useState(
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setMode(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  return mode;
}

// Strip markdown/HTML syntax for plain text previews
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

export default function AdminNews() {
  const { t } = useTranslation();
  const colorMode = useColorMode();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    news_type: "news",
    share_facebook: false,
    share_linkedin: false,
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showMarkdownHelp, setShowMarkdownHelp] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api.get("/news/admin/");
      setNews(response.data.news);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      description: newsItem.description,
      news_type: newsItem.news_type,
      share_facebook: newsItem.share_facebook,
      share_linkedin: newsItem.share_linkedin,
    });
    setImages([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingNews(null);
    setFormData({
      title: "",
      description: "",
      news_type: "news",
      share_facebook: false,
      share_linkedin: false,
    });
    setImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("news_type", formData.news_type);
      data.append("share_facebook", formData.share_facebook);
      data.append("share_linkedin", formData.share_linkedin);

      images.forEach((image) => {
        data.append("images", image);
      });

      if (editingNews) {
        await api.put(`/news/${editingNews.id}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/news/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      handleCancel();
      fetchNews();
    } catch (error) {
      console.error("Error saving news:", error);
      alert("Failed to save news");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleVisibility = async (newsId) => {
    try {
      await api.post(`/news/${newsId}/toggle-visibility/`);
      fetchNews();
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      await api.delete(`/news/${editingNews.id}/`, {
        data: { image_id: imageId },
      });

      setEditingNews({
        ...editingNews,
        images: editingNews.images.filter((img) => img.id !== imageId),
      });

      fetchNews();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 secondary_text">
        {t("admin_dashboard.news.title") || "News & Events Management"}
      </h2>

      {/* Create/Edit Form Section */}
      <section className="primary_object rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold secondary_text mb-6">
          {editingNews
            ? t("admin_dashboard.news.edit")
            : t("admin_dashboard.news.create")}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2 normal_text">
              {t("admin_dashboard.news.news_title")} *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 custom_input dark:border-gray-700 normal_text"
              placeholder={t("admin_dashboard.news.news_title_description")}
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-2 normal_text">
              {t("admin_dashboard.news.news_type")} *
            </label>
            <select
              value={formData.news_type}
              onChange={(e) =>
                setFormData({ ...formData, news_type: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 custom_input dark:border-gray-700 normal_text"
            >
              <option value="news">{t("admin_dashboard.news.news")}</option>
              <option value="event">{t("admin_dashboard.news.event")}</option>
            </select>
          </div>

          {/* Rich Text Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium normal_text">
                {t("admin_dashboard.news.description")} *
              </label>
              <button
                type="button"
                onClick={() => setShowMarkdownHelp((v) => !v)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
              >
                <Info size={14} />
                Formatting tips
              </button>
            </div>

            {/* Markdown Help Panel */}
            {showMarkdownHelp && (
              <div className="mb-3 p-4 rounded-lg border border-blue-200 dark:border-blue-800 text-xs normal_text">
                <p className="font-semibold mb-2 normal_text">
                  Formatting Guide:
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-2">
                  <span>
                    <code className="badge badge--blue px-1 rounded">**text**</code> → <strong>bold</strong>
                  </span>
                  <span>
                    <code className="badge badge--blue px-1 rounded">*text*</code> → <em>italic</em>
                  </span>
                  <span>
                    <code className="badge badge--blue px-1 rounded"># Heading</code> → Large heading
                  </span>
                  <span>
                    <code className="badge badge--blue px-1 rounded">[label](url)</code> → Link
                  </span>
                  <span>
                    <code className="badge badge--blue px-1 rounded">- item</code> → Bullet list
                  </span>
                  <span>
                    <code className="badge badge--blue px-1 rounded">&gt; text</code> → Blockquote
                  </span>
                </div>
                <p className="mt-2 secondary_text">
                  🎬 YouTube embed: paste a YouTube URL on its own line (e.g.{" "}
                  <code className="badge badge--blue px-1 rounded">https://youtu.be/...</code>)
                </p>
                <p className="mt-1 secondary_text">
                  😀 Emoji: use your OS picker (Win+. / Cmd+Ctrl+Space) or type them directly
                </p>
              </div>
            )}

            <div data-color-mode={colorMode}>
              <MDEditor
                value={formData.description}
                onChange={(val) =>
                  setFormData({ ...formData, description: val || "" })
                }
                height={400}
                preview="live"
                visibleDragbar={false}
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-2 normal_text">
              {t("admin_dashboard.news.images")}
            </label>
            <div className="flex items-center gap-3">
              <label className="custom_button custom_button--medium flex items-center gap-2 cursor-pointer">
                <Upload size={18} />
                {t("admin_dashboard.news.choose_images")}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">
                {images.length}{" "}
                {t("admin_dashboard.news.imagenr", { count: images.length })}
              </span>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${idx}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Existing Images (when editing) */}
          {editingNews && editingNews.images.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2 normal_text">
                {t("admin_dashboard.news.existing_images")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {editingNews.images.map((img) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/news/media/${img.drive_file_id}/`}
                      alt={img.file_name}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.visibility = "hidden";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      title={t("admin_dashboard.news.delete_image")}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            {editingNews && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg py-2 normal_text hover:bg-gray-400 dark:hover:bg-gray-500 transition"
              >
                {t("admin_dashboard.news.cancel")}
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 custom_button flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  {t("admin_dashboard.news.saving")}
                </>
              ) : (
                <>
                  <Save size={18} />
                  {editingNews
                    ? t("admin_dashboard.news.update_news")
                    : t("admin_dashboard.news.create_news")}
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* News List Section */}
      <section className="primary_object rounded-lg p-6">
        <h3 className="text-xl font-semibold secondary_text mb-6">
          {t("admin_dashboard.news.all_news")}
        </h3>

        {loading ? (
          <p className="text-center normal_text">
            {t("admin_dashboard.news.loading")}
          </p>
        ) : news.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {t("admin_dashboard.news.no_news")}
          </p>
        ) : (
          <div className="space-y-4">
            {news.map((item) => (
              <div
                key={item.id}
                className={`border rounded-lg p-4 flex items-start gap-4 transition ${
                  !item.is_visible
                    ? "opacity-60 bg-gray-200 dark:bg-gray-500"
                    : ""
                }`}
              >
                {/* Thumbnail */}
                {item.images.length > 0 ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/news/media/${item.images[0].drive_file_id}/`}
                    alt={item.title}
                    className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      e.target.style.visibility = "hidden";
                    }}
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="text-gray-400" size={32} />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold normal_text text-lg">
                        {item.title}
                      </h4>
                      <p className="text-sm normal_text mt-1 line-clamp-2">
                        {stripMarkdown(item.description)}
                      </p>
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            item.news_type === "news"
                              ? "badge badge--blue"
                              : "badge badge--purple"
                          }`}
                        >
                          {t(`admin_dashboard.news.${item.news_type}`)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.images.length === 0
                            ? t("admin_dashboard.news.no_images")
                            : item.images.length === 1
                              ? t("admin_dashboard.news.one_image")
                              : t("admin_dashboard.news.multiple_images", {
                                  count: item.images.length,
                                })}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition"
                        title={t("admin_dashboard.news.edit")}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(item.id)}
                        className="p-2 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition"
                        title={
                          item.is_visible
                            ? t("admin_dashboard.news.hide")
                            : t("admin_dashboard.news.show")
                        }
                      >
                        {item.is_visible ? (
                          <Eye size={18} className="text-green-600" />
                        ) : (
                          <EyeOff size={18} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
