from django.urls import path
from .views import youtube_is_live

urlpatterns = [
    path("is-live/", youtube_is_live),
]