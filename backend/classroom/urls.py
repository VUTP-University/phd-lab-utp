from django.urls import path
from classroom.views import ClassroomCoursesView

urlpatterns = [
    path("courses/", ClassroomCoursesView.as_view(), name="classroom-courses"),
]