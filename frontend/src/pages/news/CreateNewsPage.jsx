import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateNewsPage({ user }) {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user || !user.is_lab_admin) {
    return (
      <p className="normal_text text-center mt-10 text-red-500">
        You do not have permission to create news.
      </p>
    );
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 5;
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (files.length > maxFiles) {
      setError(`You can upload up to ${maxFiles} images only.`);
      return;
    }

    for (let file of files) {
      if (file.size > maxSize) {
        setError("Each image must be less than 2MB");
        return;
      }
    }

    setError("");
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    images.forEach((img) => formData.append("images", img));
    formData.append("email", user.email);
    console.log(formData, 'formdata')
    

    try {
      await axios.post(`${API_URL}news/`, formData, {
        eaders: { "Content-Type": "multipart/form-data" }
    
      });
      navigate("/news");
    } catch (err) {
      console.error(err);
      setError("Failed to create news.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="secondary_text text-center mb-6">Create News</h2>

      <form
        onSubmit={handleSubmit}
        className="primary_object p-8 flex flex-col gap-6 max-w-3xl mx-auto hover:shadow-xl transition-shadow"
      >
        {error && <p className="text-red-500">{error}</p>}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-[var(--border)] rounded-md p-3 w-full"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-[var(--border)] rounded-md p-3 w-full h-32"
          required
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="border border-[var(--border)] rounded-md p-3 w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="custom_button px-6 py-3 mt-4"
        >
          {loading ? "Creating..." : "Create News"}
        </button>
      </form>
    </main>
  );
}
