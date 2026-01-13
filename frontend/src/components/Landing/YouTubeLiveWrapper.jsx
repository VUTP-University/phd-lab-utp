import { useEffect, useState } from "react";
import React from "react";
import YouTubeLiveEmbed from "./YouTubeLiveEmbed";

export default function YouTubeLiveWrapper() {
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API_URL}/api/youtube-live/is-live/`);
        const data = await res.json();
        setIsLive(data.isLive);
        console.log("Live check:", data.isLive);
      } catch (e) {
        console.error("Live check failed", e);
      } finally {
        setLoading(false);
      }
    };

    check();
    const interval = setInterval(check, 5 * 60_000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading || !isLive) return null;

  return <YouTubeLiveEmbed />;
}