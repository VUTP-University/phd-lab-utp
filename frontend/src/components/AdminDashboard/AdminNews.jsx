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
  Upload
} from "lucide-react";
import api from "../../../api.js";

export default function AdminNews() {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    news_type: 'news',
    share_facebook: false,
    share_linkedin: false
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api.get('/news/admin/');
      setNews(response.data.news);
    } catch (error) {
      console.error('Error fetching news:', error);
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
      share_linkedin: newsItem.share_linkedin
    });
    setImages([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      description: '',
      news_type: 'news',
      share_facebook: false,
      share_linkedin: false
    });
    setImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('news_type', formData.news_type);
      data.append('share_facebook', formData.share_facebook);
      data.append('share_linkedin', formData.share_linkedin);

      images.forEach(image => {
        data.append('images', image);
      });

      if (editingNews) {
        await api.put(`/news/${editingNews.id}/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/news/', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      handleCancel();
      fetchNews();
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Failed to save news');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleVisibility = async (newsId) => {
    try {
      await api.post(`/news/${newsId}/toggle-visibility/`);
      fetchNews();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 secondary_text">
        {t("admin_dashboard.news.title") || "News & Events Management"}
      </h2>

      {/* Create/Edit Form Section */}
      <section className="primary_object rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold secondary_text mb-6">
          {editingNews ? 'Edit News' : 'Create News'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2 normal_text">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border rounded-lg px-4 py-2 dark:bg-gray-800 dark:border-gray-700 normal_text"
              placeholder="Enter news title"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-2 normal_text">
              Type *
            </label>
            <select
              value={formData.news_type}
              onChange={(e) => setFormData({...formData, news_type: e.target.value})}
              className="w-full border rounded-lg px-4 py-2 dark:bg-gray-800 dark:border-gray-700 normal_text"
            >
              <option value="news">News</option>
              <option value="event">Event</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2 normal_text">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="6"
              className="w-full border rounded-lg px-4 py-2 dark:bg-gray-800 dark:border-gray-700 normal_text resize-none"
              placeholder="Enter news description"
              required
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-2 normal_text">
              Images (optional)
            </label>
            <div className="flex items-center gap-3">
              <label className="custom_button custom_button--medium flex items-center gap-2 cursor-pointer">
                <Upload size={18} />
                Choose Images
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">
                {images.length} image{images.length !== 1 ? 's' : ''} selected
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
                Current Images
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {editingNews.images.map((img) => (
                  <div key={img.id} className="relative">
                    <img
                      src={img.drive_thumbnail_link || img.drive_web_link}
                      alt={img.file_name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Media */}
          <div>
            <label className="block text-sm font-medium mb-2 normal_text">
              Social Media Sharing
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.share_facebook}
                  onChange={(e) => setFormData({...formData, share_facebook: e.target.checked})}
                  className="w-4 h-4"
                />
                <span className="text-sm normal_text">Share on Facebook</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.share_linkedin}
                  onChange={(e) => setFormData({...formData, share_linkedin: e.target.checked})}
                  className="w-4 h-4"
                />
                <span className="text-sm normal_text">Share on LinkedIn</span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            {editingNews && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg py-2 normal_text hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
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
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {editingNews ? 'Update News' : 'Create News'}
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* News List Section */}
      <section className="primary_object rounded-lg p-6">
        <h3 className="text-xl font-semibold secondary_text mb-6">
          All News & Events
        </h3>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : news.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No news created yet</p>
        ) : (
          <div className="space-y-4">
            {news.map((item) => (
              <div
                key={item.id}
                className={`border rounded-lg p-4 flex items-start gap-4 transition ${
                  !item.is_visible ? 'opacity-60 bg-gray-50 dark:bg-gray-800' : ''
                }`}
              >
                {/* Thumbnail */}
                {item.images.length > 0 ? (
                  <img
                    src={item.images[0].drive_thumbnail_link || item.images[0].drive_web_link}
                    alt={item.title}
                    className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
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
                      <h4 className="font-semibold normal_text text-lg">{item.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.news_type === 'news' 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' 
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400'
                        }`}>
                          {item.news_type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.images.length} image{item.images.length !== 1 ? 's' : ''}
                        </span>
                        {item.share_facebook && (
                          <span className="text-xs text-gray-500">📘 Facebook</span>
                        )}
                        {item.share_linkedin && (
                          <span className="text-xs text-gray-500">💼 LinkedIn</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(item.id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                        title={item.is_visible ? "Hide from public" : "Show to public"}
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