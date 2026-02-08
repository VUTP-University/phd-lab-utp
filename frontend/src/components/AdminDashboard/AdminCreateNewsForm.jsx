import React, { useState, useEffect, forwardRef } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL;

const AdminCreateNewsForm = forwardRef(({ user, onCreated, editingNews }, ref) => {
  const { i18n } = useTranslation();
  const language = i18n.language;

  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [description, setDescription] = useState("");
  const [descEn, setDescEn] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingNews) {
      setTitle(editingNews.title || "");
      setTitleEn(editingNews.title_en || "");
      setDescription(editingNews.description || "");
      setDescEn(editingNews.desc_en || "");
      setImages([]);
    } else {
      setTitle("");
      setTitleEn("");
      setDescription("");
      setDescEn("");
      setImages([]);
    }
  }, [editingNews]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 5;
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (files.length > maxFiles) {
      setError(`You can upload up to ${maxFiles} images.`);
      return;
    }

    for (let file of files) {
      if (file.size > maxSize) {
        setError("Each image must be under 2MB.");
        return;
      }
    }

    setError("");
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("title_en", titleEn);
      formData.append("description", description);
      formData.append("desc_en", descEn);
      images.forEach((img) => formData.append("images", img));
      formData.append("email", user.email);

      if (editingNews) {
        
        await axios.put(`${API_URL}news/${editingNews.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire(
          language === "en" ? "Edited!" : "Редактирана!",
          language === "en" ? "The news has been updated." : "Новината е редактирана.",
          "success"
        );
      } else {
        // Create
        await axios.post(`${API_URL}news/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire(
          language === "en" ? "Created!" : "Създадена!",
          language === "en" ? "The news has been created." : "Новината е създадена.",
          "success"
        );
      }

      onCreated();
      setTitle("");
      setTitleEn("");
      setDescription("");
      setDescEn("");
      setImages([]);
    } catch (err) {
      console.error(err);

      let message = "Something went wrong";

    if (err.response) {
    const data = err.response.data;

    
    if (data && typeof data === "object") {
        if (data.error) {
        message = data.error;
        } else {
        
        const firstKey = Object.keys(data)[0];
        if (firstKey) {
            const val = data[firstKey];
            if (Array.isArray(val)) {
            message = val[0];
            } else if (typeof val === "string") {
            message = val;
            }
        }
        }
    } else if (typeof data === "string") {
       
        message = data;
    }
    }

      Swal.fire(language === "en" ? "Error!" : "Грешка!", message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!user?.is_lab_admin) return null;

  return (
    <div ref={ref} className="primary_object p-6 mb-8">

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder={language === "en" ? "Title" : "Заглавие"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-3 rounded"
        />

        <input
          type="text"
          placeholder={language === "en" ? "Title (English)" : "Заглавие (English)"}
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          className="border p-3 rounded"
        />

        <textarea
          placeholder={language === "en" ? "Description" : "Описание"}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border p-3 rounded h-28"
        />

        <textarea
          placeholder={language === "en" ? "Description (English)" : "Описание (English)"}
          value={descEn}
          onChange={(e) => setDescEn(e.target.value)}
          className="border p-3 rounded h-28"
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="custom_button self-start"
        >
          {loading
            ? language === "en"
              ? "Saving..."
              : "Запазване..."
            : editingNews
            ? language === "en"
              ? "Update"
              : "Редактирай"
            : language === "en"
            ? "Create"
            : "Създай"}
        </button>
      </form>
    </div>
  );
});

export default AdminCreateNewsForm;
