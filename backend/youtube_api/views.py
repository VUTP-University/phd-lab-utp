from django.http import JsonResponse
from .services import is_channel_live

def youtube_is_live(request):
    return JsonResponse({
        "isLive": is_channel_live()
    })