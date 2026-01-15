from django.http import JsonResponse
from .services import check_youtube_live_with_video
import os


# def youtube_is_live(request):
#     return JsonResponse(
#         get_live_status_from_video(os.getenv("YOUTUBE_VIDEO_ID")))

CHANNEL_ID = os.getenv("YOUTUBE_CHANNEL_ID")
def youtube_live_status(request):
    data = check_youtube_live_with_video(CHANNEL_ID)
    return JsonResponse(data)