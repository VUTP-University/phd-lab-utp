from django.urls import path
from .views import hello_world, NewsCreateView, NewsListView, GoogleAuthView

urlpatterns = [
    path('hello/', hello_world, name = "hello"),
    path('auth/google/', GoogleAuthView.as_view(), name='google-auth'),
    path('news/view/', NewsListView.as_view(), name='news-create'),
    path('news/create/', NewsCreateView.as_view(), name='news-create')
    
]

