import logging
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .services import check_youtube_live_status, get_quota_usage_estimate
import os

logger = logging.getLogger(__name__)


@require_http_methods(["GET"])
def youtube_live_status(request):
    """
    API endpoint to check if the configured YouTube channel is live.
    
    Returns:
        JSON: {"is_live": bool, "video_id": str or None}
    """
    channel_id = os.getenv("YOUTUBE_CHANNEL_ID")
    
    if not channel_id:
        logger.error("YOUTUBE_CHANNEL_ID not configured in environment")
        return JsonResponse({
            "error": "YouTube channel not configured",
            "is_live": False,
            "video_id": None,
        }, status=500)
    
    try:
        result = check_youtube_live_status(channel_id)
        return JsonResponse(result)
        
    except Exception as e:
        logger.exception(f"Error in youtube_live_status view: {e}")
        return JsonResponse({
            "error": "Failed to check live status",
            "is_live": False,
            "video_id": None,
        }, status=500)


@require_http_methods(["GET"])
def youtube_quota_usage(request):
    """
    API endpoint to check current quota usage (for monitoring).
    """
    usage = get_quota_usage_estimate()
    return JsonResponse(usage)