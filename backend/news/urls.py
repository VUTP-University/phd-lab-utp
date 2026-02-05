from django.urls import path
from .views import NewsListCreateView, NewsDetailView

urlpatterns = [
    path('', NewsListCreateView.as_view(), name='news-list-create'),
    path("<int:pk>/", NewsDetailView.as_view(), name="news-detail"),
]
