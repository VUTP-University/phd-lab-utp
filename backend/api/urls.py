from django.urls import path
from .views import hello_world, GoogleAuthView

urlpatterns = [
    path('hello/', hello_world, name = "hello"),
    path('auth/google/', GoogleAuthView.as_view(), name='google-auth')
    
]

