from django.urls import path
from .views import youtube_live_status

urlpatterns = [
    path("is-live/", youtube_live_status),
]