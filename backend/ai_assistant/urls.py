from django.urls import path
from .views import AIAssistantView

urlpatterns = [
    path('analyze/', AIAssistantView.as_view(), name='ai-analyze'),
]