from django.urls import path
from .views import (
    TeacherCoursesListView,
    TeacherCourseDetailsView,
    TeacherUploadPlanView,
    TeacherUploadedPlansView
)

urlpatterns = [
    path("courses/", TeacherCoursesListView.as_view(), name="teacher-courses-list"),
    path("course/<str:course_id>/details/", TeacherCourseDetailsView.as_view(), name="teacher-course-details"),
    path("upload-plan/", TeacherUploadPlanView.as_view(), name="teacher-upload-plan"),
    path("uploaded-plans/", TeacherUploadedPlansView.as_view(), name="teacher-uploaded-plans"),
]
