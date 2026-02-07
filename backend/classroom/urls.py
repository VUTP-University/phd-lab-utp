from django.urls import path
from classroom.views import ClassroomCoursesView, VisibleCoursesView, CourseDetailsView

urlpatterns = [
    path("courses/", ClassroomCoursesView.as_view(), name="classroom-courses"),
    path("visible-courses/", VisibleCoursesView.as_view(), name="visible-courses"),
    path("course/<str:course_id>/details/", CourseDetailsView.as_view(), name="course-detail"),
]