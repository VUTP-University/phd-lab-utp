from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import GoogleAuthView, CourseViewSet, DoctoralProgramViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'programs', DoctoralProgramViewSet, basename='program')
urlpatterns = [
    path('auth/google/', GoogleAuthView.as_view(), name='google-auth'),
    path('', include(router.urls)),
]

