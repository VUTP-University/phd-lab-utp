import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import ShareButtons from "../../components/ShareButtons";
import AdminCreateNewsForm from "./AdminCreateNewsForm";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminNews({ user }) {
  const { i18n } = useTranslation();
  const language = i18n.language;

  const [news, setNews] = useState([]);
  const [currentImages, setCurrentImages] = useState({});
  const [editingNews, setEditingNews] = useState(null);

  const formRef = useRef(null); // scroll 

  // fetch news
  const fetchNews = () => {
    axios
      .get(`${API_URL}news/`)
      .then((res) => {
        setNews(res.data);

        const initialImages = {};
        res.data.forEach((item) => {
          initialImages[item.id] = 0;
        });
        setCurrentImages(initialImages);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // slide images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImages((prev) => {
        const updated = {};
        news.forEach((item) => {
          if (item.images && item.images.length > 1) {
            updated[item.id] = (prev[item.id] + 1) % item.images.length;
          } else {
            updated[item.id] = 0;
          }
        });
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [news]);

  // scroll 
  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // handle edit
  const handleEdit = (item) => {
    setEditingNews(item);
    setTimeout(scrollToForm, 100);
  };

  // handle delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: language === "en" ? "Are you sure?" : "Сигурни ли сте?",
      text:
        language === "en"
          ? "This will delete the news."
          : "Това ще изтрие новината.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: language === "en" ? "Yes, delete it!" : "Да, изтрий",
      cancelButtonText: language === "en" ? "Cancel" : "Отказ",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}news/${id}/`, {
        data: { email: user.email },
      });
      fetchNews();
      Swal.fire(
        language === "en" ? "Deleted!" : "Изтрита!",
        language === "en"
          ? "The news has been deleted."
          : "Новината е изтрита.",
        "success"
      );
    } catch (err) {
      console.error(err);
      Swal.fire(
        language === "en" ? "Error!" : "Грешка!",
        language === "en"
          ? "Failed to delete news."
          : "Грешка при изтриване.",
        "error"
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* CREATE / EDIT FORM */}
      {user?.is_lab_admin && (
        <AdminCreateNewsForm
          user={user}
          editingNews={editingNews}
          ref={formRef}
          onCreated={() => {
            fetchNews();
            setEditingNews(null); // reset edit mode
          }}
        />
      )}

      {/* NEWS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => {
          const titleToShow =
            language === "en" && item.title_en ? item.title_en : item.title;

          const descToShow =
            language === "en" && item.desc_en ? item.desc_en : item.description;

          const shortDesc =
            descToShow.length > 120
              ? descToShow.slice(0, 120) + "..."
              : descToShow;

          return (
            <div
              key={item.id}
              className="relative bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
            >
              {/* ADMIN ACTIONS */}
              {user?.is_lab_admin && (
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  {/* EDIT */}
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-white/90 text-gray-700 border rounded p-1 hover:text-blue-600 transition"
                    title="Edit"
                  >
                    ✏️
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-white/90 text-red-600 border rounded p-1 hover:bg-red-50 transition"
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              )}

              <h3 className="font-semibold text-lg p-3 border-b">{titleToShow}</h3>

              {item.images && item.images.length > 0 && (
                <div className="relative w-full h-64 overflow-hidden">
                  {item.images.map((img, idx) => (
                    <img
                      key={img.id}
                      src={img.image}
                      alt={titleToShow}
                      className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-1000 ${
                        idx === currentImages[item.id] ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                </div>
              )}

              <div className="p-3 flex flex-col flex-1">
                <p className="text-gray-700 text-sm mb-2">
                  {shortDesc}
                  {descToShow.length > 120 && (
                    <a
                      href={`/news/${item.id}`}
                      className="ml-1 text-blue-500"
                    >
                      {language === "en"
                        ? "Read full news"
                        : "Виж цялата новина"}
                    </a>
                  )}
                </p>

                <p className="text-gray-500 text-xs mb-0.5">{item.author}</p>
                <p className="text-gray-400 text-xs">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>

                <div className="flex gap-2 mt-3 opacity-80 hover:opacity-100 transition">
                  <ShareButtons
                    url={`${window.location.origin}/news/${item.id}`}
                    title={titleToShow}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
