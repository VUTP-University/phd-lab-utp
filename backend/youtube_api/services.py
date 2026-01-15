import os
import requests
from django.core.cache import cache

def check_youtube_live_with_video(channel_id: str):
    """
    Check if a YouTube channel is currently live and return video_id if so.
    Uses caching to reduce API calls and avoid quota waste.
    """
    
    YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
    
    cache_key = f"youtube_live_status:{channel_id}"
    cached = cache.get(cache_key)
    
    if cached is not None:
        return cached

    result = {
        "is_live": False,
        "video_id": None,
    }

    api_key = os.getenv("YOUTUBE_API_KEY")
    if not api_key:
        cache.set(cache_key, result, timeout=60)
        return result

    params = {
        "part": "snippet",
        "channelId": channel_id,
        "eventType": "live",
        "type": "video",
        "maxResults": 1,
        "key": api_key,
    }

    # try:
    #     print("Making YouTube API request for live status...")
    #     response = requests.get(YOUTUBE_SEARCH_URL, params=params, timeout=8)
    #     response.raise_for_status()
    #     items = response.json().get("items", [])

    #     if items:
    #         video_id = items[0]["id"]["videoId"]
    #         result = {
    #             "is_live": True,
    #             "video_id": video_id,
    #         }
    #         # Live stream → short cache (60s)
    #         cache.set(cache_key, result, timeout=60)
    #     else:
    #         # No live stream → cache longer to save quota
    #         cache.set(cache_key, result, timeout=300)

    # except requests.RequestException as e:
    #     # API error → cache a short time to retry soon
    #     cache.set(cache_key, result, timeout=60)

    return result