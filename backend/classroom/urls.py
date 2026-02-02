from django.urls import path
from classroom.views import ClassroomCoursesView, VisibleCoursesView

urlpatterns = [
    path("courses/", ClassroomCoursesView.as_view(), name="classroom-courses"),
    path("visible-courses/", VisibleCoursesView.as_view(), name="visible-courses"),
]