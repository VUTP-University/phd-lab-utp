import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NewsPage({ user }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL ;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${API_URL}/news/`);
        setNews(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p className="normal_text text-center mt-10">Loading news...</p>;
  if (error) return <p className="normal_text text-center mt-10 text-red-500">{error}</p>;

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-10">
      {user && user.is_lab_admin && (
        <div className="flex justify-end mb-4">
          <button
            className="custom_button px-6 py-2"
            onClick={() => navigate("/create-news")}
          >
            Create new
          </button>
        </div>
      )}

      <h2 className="secondary_text mb-6 text-center">Latest News</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item) => (
          <div
            key={item.id}
            className="primary_object p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow"
          >
            <h3 className="primary_text text-xl mb-2">{item.title}</h3>
            <p className="normal_text mb-4">{item.description}</p>
            <p className="normal_text text-gray-500 text-sm mb-2">By {item.author}</p>

            {item.images && item.images.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {item.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.image}
                    alt={item.title}
                    className="w-32 h-32 object-cover rounded-md border border-[var(--border)]"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
