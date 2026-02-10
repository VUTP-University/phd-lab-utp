from django.urls import path
from .views import (
    NewsListCreateView,
    NewsDetailView,
    AdminNewsListView,
    NewsToggleVisibilityView,
    NewsDetailTemplateView
)

urlpatterns = [
    path('', NewsListCreateView.as_view(), name='news-list-create'),
    path('admin/', AdminNewsListView.as_view(), name='admin-news-list'),
    path('<int:news_id>/', NewsDetailView.as_view(), name='news-detail'),
    path('<int:news_id>/toggle-visibility/', NewsToggleVisibilityView.as_view(), name='news-toggle-visibility'),
    
     # Template view for social media crawlers
    path('<int:news_id>/share/', NewsDetailTemplateView.as_view(), name='news-share'),
]