from django.urls import path
from .views import NewsListCreateView

urlpatterns = [
    path('', NewsListCreateView.as_view(), name='news-list-create'),
]
