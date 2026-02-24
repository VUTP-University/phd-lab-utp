// NewsDetail.jsx - Page to display detailed view of a single news item,
// including rich markdown content, YouTube embeds, image gallery with lightbox

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Facebook,
  Linkedin,
  X,
  ZoomIn,
  Images,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import api from "../../api.js";

// ─── Utilities ──────────────────────────────────────────────────────────────

// Use backend proxy so images are served via the service account — avoids
// browser CORB errors that occur when Drive files are not publicly shared.
// Absolute URL is required: the Vite dev server runs on a different port
// (5173) than Django (8000), so relative paths would miss the backend.
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
function driveThumb(fileId) {
  return `${API_BASE}/news/media/${fileId}/`;
}

// Extract a YouTube video ID from any common YouTube URL format.
function getYouTubeId(url) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

// ─── Lightbox ───────────────────────────────────────────────────────────────

function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);

  const prev = useCallback(
    () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1)),
    [images.length]
  );
  const next = useCallback(
    () => setIdx((i) => (i === images.length - 1 ? 0 : i + 1)),
    [images.length]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    // Prevent body scroll while lightbox open
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 z-10">
        <span className="text-white/70 text-sm font-medium">
          {idx + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          aria-label="Close"
        >
          <X size={22} />
        </button>
      </div>

      {/* Main image */}
      <img
        src={driveThumb(images[idx].drive_file_id, "w1600")}
        alt=""
        className="max-w-[92vw] max-h-[80vh] object-contain rounded-lg shadow-2xl select-none"
        onClick={(e) => e.stopPropagation()}
        onError={(e) => {
          e.target.style.visibility = "hidden";
        }}
      />

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white p-3 rounded-full transition"
            aria-label="Previous"
          >
            <ChevronLeft size={26} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white p-3 rounded-full transition"
            aria-label="Next"
          >
            <ChevronRight size={26} />
          </button>
        </>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-6 overflow-x-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setIdx(i)}
              className={`flex-shrink-0 w-14 h-10 rounded-md overflow-hidden transition-all duration-200 ${
                i === idx
                  ? "ring-2 ring-white scale-110"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <img
                src={driveThumb(img.drive_file_id, "w200")}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Image Gallery ───────────────────────────────────────────────────────────

function ImageGallery({ images, onOpenLightbox }) {
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div
        className="relative rounded-xl overflow-hidden cursor-zoom-in group mb-8"
        onClick={() => onOpenLightbox(0)}
      >
        <img
          src={driveThumb(images[0].drive_file_id, "w1200")}
          alt=""
          className="w-full max-h-[520px] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          onError={(e) => {
            e.target.style.visibility = "hidden";
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
          <ZoomIn
            size={36}
            className="text-white opacity-0 group-hover:opacity-100 transition drop-shadow-lg"
          />
        </div>
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 mb-8 rounded-xl overflow-hidden">
        {images.map((img, i) => (
          <div
            key={img.id}
            className="relative cursor-zoom-in group overflow-hidden"
            onClick={() => onOpenLightbox(i)}
          >
            <img
              src={driveThumb(img.drive_file_id, "w800")}
              alt=""
              className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.style.visibility = "hidden";
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition flex items-center justify-center">
              <ZoomIn
                size={28}
                className="text-white opacity-0 group-hover:opacity-100 transition"
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 3+ images: hero + grid
  const hero = images[0];
  const rest = images.slice(1, 5); // show up to 4 thumbnails
  const overflow = images.length - 5;

  return (
    <div className="mb-8">
      {/* Hero image */}
      <div
        className="relative rounded-t-xl overflow-hidden cursor-zoom-in group"
        onClick={() => onOpenLightbox(0)}
      >
        <img
          src={driveThumb(hero.drive_file_id, "w1200")}
          alt=""
          className="w-full h-80 sm:h-[440px] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          onError={(e) => {
            e.target.style.visibility = "hidden";
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
          <ZoomIn
            size={36}
            className="text-white opacity-0 group-hover:opacity-100 transition drop-shadow-lg"
          />
        </div>
      </div>

      {/* Thumbnail strip */}
      <div
        className={`grid gap-2 mt-2 rounded-b-xl overflow-hidden ${
          rest.length === 1
            ? "grid-cols-1"
            : rest.length === 2
              ? "grid-cols-2"
              : rest.length === 3
                ? "grid-cols-3"
                : "grid-cols-4"
        }`}
      >
        {rest.map((img, i) => {
          const isLast = i === rest.length - 1 && overflow > 0;
          return (
            <div
              key={img.id}
              className="relative cursor-zoom-in group overflow-hidden"
              onClick={() => onOpenLightbox(i + 1)}
            >
              <img
                src={driveThumb(img.drive_file_id, "w400")}
                alt=""
                className="w-full h-28 object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.style.visibility = "hidden";
                }}
              />
              {isLast ? (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                  <Images size={22} />
                  <span className="text-lg font-bold">+{overflow + 1}</span>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition flex items-center justify-center">
                  <ZoomIn
                    size={22}
                    className="text-white opacity-0 group-hover:opacity-100 transition"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Markdown renderers ──────────────────────────────────────────────────────

const markdownComponents = {
  // Detect bare YouTube URLs in paragraphs and render them as native iframes.
  // remark-gfm auto-links bare URLs, so by render time the paragraph
  // contains a single <a> element — we inspect the raw HAST node to
  // extract the href, then build a standard YouTube embed iframe.
  p({ node, children }) {
    if (
      node.children.length === 1 &&
      node.children[0].type === "element" &&
      node.children[0].tagName === "a"
    ) {
      const href = node.children[0].properties?.href;
      if (href) {
        const videoId = getYouTubeId(href);
        if (videoId) {
          return (
            <div className="my-6 rounded-xl overflow-hidden shadow-md">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full aspect-video border-0"
              />
            </div>
          );
        }
      }
    }
    return <p className="mb-4 leading-relaxed">{children}</p>;
  },
  a({ href, children }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-300 transition"
      >
        {children}
      </a>
    );
  },
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold primary_text mt-8 mb-4">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold secondary_text mt-6 mb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold secondary_text mt-5 mb-2">
      {children}
    </h3>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 space-y-1 ml-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4 space-y-1 ml-2">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600 dark:text-gray-400">
      {children}
    </blockquote>
  ),
  code({ inline, children }) {
    if (inline) {
      return <code className="md-inline-code">{children}</code>;
    }
    return (
      <pre className="md-code-block">
        <code>{children}</code>
      </pre>
    );
  },
  hr: () => (
    <hr className="my-6 border-gray-200 dark:border-gray-700" />
  ),
  strong: ({ children }) => (
    <strong className="font-bold">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    fetchNews();
  }, [id]);

  const fetchNews = async () => {
    try {
      const response = await api.get(`/news/${id}/`);
      setNews(response.data);

      document.title = response.data.title;
      updateMetaTag("og:title", response.data.title);
      updateMetaTag("og:description", response.data.description);
      updateMetaTag("og:url", window.location.href);

      if (response.data.images.length > 0) {
        const imageUrl = driveThumb(
          response.data.images[0].drive_file_id,
          "w800"
        );
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
    const shareUrl = `${window.location.origin}/news/${news.id}/share/`;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareOnLinkedIn = () => {
    const shareUrl = `${window.location.origin}/news/${news.id}/share/`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "width=600,height=400"
    );
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
      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={news.images}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/news")}
          className="flex items-center gap-2 mb-6 normal_text hover:text-blue-600 transition"
        >
          <ArrowLeft size={20} />
          {t("news.news_details.back_to_news")}
        </button>

        {/* Article */}
        <article className="primary_object rounded-2xl p-6 sm:p-10 shadow-sm">
          {/* Type Badge */}
          <span
            className={`inline-block text-xs px-3 py-1 rounded-full mb-4 font-medium ${
              news.news_type === "news"
                ? "badge badge--blue text-blue-800 dark:text-blue-400"
                : "badge badge--purple text-purple-800 dark:text-purple-400"
            }`}
          >
            {news.news_type === "news" ? t("news.news") : t("news.event")}
          </span>

          {/* Title */}
          <h1 className="primary_text text-3xl sm:text-4xl font-bold mb-3 leading-tight">
            {news.title}
          </h1>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Calendar size={15} />
            {new Date(news.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {/* Image Gallery */}
          <ImageGallery
            images={news.images}
            onOpenLightbox={(i) => setLightboxIndex(i)}
          />

          {/* Rich Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none normal_text text-gray-700 dark:text-gray-300">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={markdownComponents}
            >
              {news.description}
            </ReactMarkdown>
          </div>

          {/* Share Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
            <div className="flex items-center justify-between">
              <span className="normal_text font-medium">
                {t("news.news_details.share_this_news")}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={shareOnFacebook}
                  className="w-9 h-9 flex items-center justify-center rounded-xl group transition-all duration-300 cursor-pointer social_media_button"
                  title={t("news.share_on_facebook")}
                >
                  <Facebook
                    className="rounded-md transition-all duration-300 group-hover:scale-110"
                    size={20}
                  />
                </button>

                <button
                  onClick={shareOnLinkedIn}
                  className="w-9 h-9 flex items-center justify-center rounded-xl group transition-all duration-300 cursor-pointer social_media_button"
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
