from django.urls import path
from .views import GoogleAuthView

urlpatterns = [
    path('auth/google/', GoogleAuthView.as_view(), name='google-auth'), 
]
