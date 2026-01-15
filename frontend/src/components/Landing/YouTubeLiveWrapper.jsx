import { useEffect, useState } from "react";
import React from "react";

export default function YouTubeLiveWrapper() {
  const [videoId, setVideoId] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLiveStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/api/youtube-live/is-live/`);
        const data = await res.json();

        if (data.is_live && data.video_id) {
          setVideoId(data.video_id);
        } else {
          setVideoId(null);
        }
      } catch (err) {
        console.error("Failed to fetch live status:", err);
        setVideoId(null);
      }
    };

    fetchLiveStatus();
    const interval = setInterval(fetchLiveStatus, 60_000); // optional: refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (!videoId) return null; // nothing to show if not live

  return (
    <div className="youtube-live">
      <iframe
        width="100%"
        height="480"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title="YouTube Live Stream"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  );
}