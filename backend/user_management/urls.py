# user_management/urls.py
from django.urls import path
from .views import (
    GroupMembersView, ManageGroupMemberView, UploadStudentPlanView, MyIndividualPlanView,
    SupervisionsView, MySupervisionView, MyDoctoralStudentsView, AdminAllIndividualPlansView, AdminUsersWithPlansView,
)

urlpatterns = [
    path('group-members/', GroupMembersView.as_view()),
    path('manage-member/', ManageGroupMemberView.as_view()),
    path('upload-plan/', UploadStudentPlanView.as_view()),
    path('my-plan/', MyIndividualPlanView.as_view()),
    path('supervisions/', SupervisionsView.as_view()),
    path('my-supervisors/', MySupervisionView.as_view()),
    path('my-doctoral-students/', MyDoctoralStudentsView.as_view()),
    path('admin/all-individual-plans/', AdminAllIndividualPlansView.as_view()),
    path('admin/users-with-plans/', AdminUsersWithPlansView.as_view()),
]
