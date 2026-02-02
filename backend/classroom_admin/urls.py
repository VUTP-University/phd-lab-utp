from django.urls import path
from .views import AdminCoursesListView, DisplayedCourseToggleView, DisplayedCoursesListView

urlpatterns = [
    path("courses/", AdminCoursesListView.as_view(), name="admin-courses-list"),
    path("displayed-course/toggle/", DisplayedCourseToggleView.as_view(), name="displayed-course-toggle"),
    path("displayed-courses/", DisplayedCoursesListView.as_view(), name="displayed-courses-list"),
    
]