# user_management/urls.py
from django.urls import path
from .views import GroupMembersView, ManageGroupMemberView, UploadStudentPlanView
from django.urls import include

urlpatterns = [
    path('group-members/', GroupMembersView.as_view()),
    path('manage-member/', ManageGroupMemberView.as_view()),
    path('upload-plan/', UploadStudentPlanView.as_view()),
]