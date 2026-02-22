import os
import requests
import logging
from django.core.cache import cache
from datetime import datetime

logger = logging.getLogger(__name__)


def check_youtube_live_status(channel_id: str):
    """
    Check if a YouTube channel is currently live streaming.
    Uses YouTube Data API v3 with aggressive caching to minimize quota usage.
    
    Quota usage: ~144 requests/day (1.44% of 10,000 daily quota)
    - When live: checks every 1 minute
    - When not live: checks every 10 minutes
    
    Args:
        channel_id: YouTube channel ID (e.g., "UCLA_DiR1FfKNvjuUpBHmylQ")
    
    Returns:
        dict: {"is_live": bool, "video_id": str or None}
    """
    cache_key = f"youtube_live_status:{channel_id}"
    cached_result = cache.get(cache_key)
    
    # Return cached result if available
    if cached_result is not None:
        logger.info(f"✅ Returning cached result for {channel_id}: {cached_result}")
        return cached_result

    # Default result
    result = {
        "is_live": False,
        "video_id": None,
    }

    # Get API key from environment
    api_key = os.getenv("YOUTUBE_API_KEY")
    if not api_key:
        logger.error("❌ YOUTUBE_API_KEY not found in environment variables")
        cache.set(cache_key, result, timeout=600)  # Cache for 10 minutes
        return result

    try:
        # Call YouTube Data API v3 Search endpoint
        url = "https://www.googleapis.com/youtube/v3/search"
        params = {
            "part": "snippet",
            "channelId": channel_id,
            "eventType": "live",  # Only return live broadcasts
            "type": "video",
            "maxResults": 1,
            "key": api_key,
        }
        
        logger.info(f"Calling YouTube API for channel: {channel_id}")
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        items = data.get("items", [])
        
        if items:
            # Live stream found
            video_id = items[0]["id"]["videoId"]
            title = items[0]["snippet"]["title"]
            thumbnail = items[0]["snippet"]["thumbnails"]["default"]["url"]
            
            logger.info(f"LIVE STREAM FOUND!")
            logger.info(f"   Video ID: {video_id}")
            logger.info(f"   Title: {title}")
            
            result = {
                "is_live": True,
                "video_id": video_id,
                "title": title,
                "thumbnail": thumbnail,
            }
            
            # Cache for 1 minute when live (allows frequent updates)
            cache.set(cache_key, result, timeout=60)
            logger.info(f"Cached as LIVE for 60 seconds")
            
        else:
            # No live stream
            logger.info(f"No live stream found for channel: {channel_id}")
            
            # Cache for 10 minutes when not live (saves quota)
            cache.set(cache_key, result, timeout=600)
            logger.info(f"Cached as NOT LIVE for 600 seconds (10 minutes)")

    except requests.exceptions.HTTPError as e:
        logger.error(f"YouTube API HTTP Error: {e}")
        logger.error(f"   Response: {e.response.text if e.response else 'No response'}")
        
        # Check if quota exceeded
        if e.response and e.response.status_code == 403:
            error_data = e.response.json()
            if "quotaExceeded" in str(error_data):
                logger.error("QUOTA EXCEEDED! Caching for 1 hour.")
                cache.set(cache_key, result, timeout=3600)
            else:
                cache.set(cache_key, result, timeout=300)
        else:
            cache.set(cache_key, result, timeout=300)
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Network error calling YouTube API: {e}")
        cache.set(cache_key, result, timeout=300)
        
    except Exception as e:
        logger.exception(f"Unexpected error checking YouTube live status: {e}")
        cache.set(cache_key, result, timeout=300)

    return result


def get_quota_usage_estimate():
    """
    Estimate current daily quota usage.
    Useful for monitoring.
    """
    cache_key = "youtube_api_quota_usage"
    usage = cache.get(cache_key, 0)
    return {
        "calls_today": usage,
        "quota_used": usage * 100,  # Each search call = 100 quota units
        "quota_limit": 10000,
        "percentage": (usage * 100 / 10000) * 100,
    }


def increment_quota_usage():
    """
    Track API calls for monitoring.
    Resets at midnight UTC.
    """
    cache_key = "youtube_api_quota_usage"
    
    # Get current usage
    current_usage = cache.get(cache_key, 0)
    
    # Increment
    new_usage = current_usage + 1
    
    # Calculate seconds until midnight UTC
    now = datetime.utcnow()
    midnight = datetime(now.year, now.month, now.day, 23, 59, 59)
    seconds_until_midnight = int((midnight - now).total_seconds())
    
    # Cache until midnight
    cache.set(cache_key, new_usage, timeout=max(seconds_until_midnight, 60))
    
    return new_usage