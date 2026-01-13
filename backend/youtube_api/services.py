import time
import requests
from django.conf import settings
import os

CACHE_TTL = 300  # 5 minutes
_last_check = 0
_cached_is_live = False

def is_channel_live():
    global _last_check, _cached_is_live
    
    # DEV / testing override
    if getattr(settings, "FORCE_YOUTUBE_LIVE", False):
        print("FORCE_YOUTUBE_LIVE is enabled → returning True")
        return True

    now = time.time()
    if now - _last_check < CACHE_TTL:
        return _cached_is_live

    params = {
        "part": "snippet",
        "id": os.getenv("YOUTUBE_CHANNEL_ID"),
        "key": os.getenv("YOUTUBE_API_KEY"),
    }

    print("Checking YouTube live status...")
    print("Params:", params)
    
    try:
        res = requests.get(
            "https://www.googleapis.com/youtube/v3/channels",
            params=params,
            timeout=5,
        )
        res.raise_for_status()
        data = res.json()

        items = data.get("items", [])
        if not items:
            _cached_is_live = False
        else:
            status = items[0]["snippet"].get("liveBroadcastContent")
            _cached_is_live = status == "live"

    except Exception as e:
        print("YouTube check failed:", e)
        _cached_is_live = False

    _last_check = now
    return _cached_is_live