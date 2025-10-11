from django.urls import path
from .views import hello_world, NewsCreateView, NewsListView

urlpatterns = [
    path('hello/', hello_world, name = "hello"),
    path('news/view/', NewsListView.as_view(), name='news-create'),
    path('news/create/', NewsCreateView.as_view(), name='news-create')
    
]

