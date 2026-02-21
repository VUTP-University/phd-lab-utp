from django.urls import path
from .views import (
    TeacherCoursesListView,
    TeacherDisplayedCoursesListView,
    TeacherDisplayedCourseToggleView,
    TeacherCourseDetailsView,
    TeacherUploadPlanView,
)

urlpatterns = [
    path("courses/", TeacherCoursesListView.as_view(), name="teacher-courses-list"),
    path("displayed-courses/", TeacherDisplayedCoursesListView.as_view(), name="teacher-displayed-courses"),
    path("displayed-course/toggle/", TeacherDisplayedCourseToggleView.as_view(), name="teacher-displayed-course-toggle"),
    path("course/<str:course_id>/details/", TeacherCourseDetailsView.as_view(), name="teacher-course-details"),
    path("upload-plan/", TeacherUploadPlanView.as_view(), name="teacher-upload-plan"),
]
