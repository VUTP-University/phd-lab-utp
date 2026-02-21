from django.urls import path
from .views import (
    TeacherCourseDetailsView,
    TeacherUploadPlanView,
)

urlpatterns = [
    path("course/<str:course_id>/details/", TeacherCourseDetailsView.as_view(), name="teacher-course-details"),
    path("upload-plan/", TeacherUploadPlanView.as_view(), name="teacher-upload-plan"),
]
