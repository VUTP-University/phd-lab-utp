from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from appuser.permissions import IsLabAdmin
from .group_utils import get_group_members, add_user_to_group, remove_user_from_group
import logging

logger = logging.getLogger(__name__)

class GroupMembersView(APIView):
    """Get members of admin or student group"""
    permission_classes = [IsLabAdmin]
    
    def get(self, request):
        group_email = request.query_params.get('group')  # 'admin' or 'student'
        
        if group_email == 'admin':
            group = settings.ADMIN_GROUP
        elif group_email == 'student':
            group = settings.STUDENTS_GROUP
        else:
            return Response({"error": "Invalid group"}, status=400)
        
        members = get_group_members(group)
        return Response({"members": members}, status=200)

class ManageGroupMemberView(APIView):
    """Add/remove user from group"""
    permission_classes = [IsLabAdmin]
    
    def post(self, request):
        email = request.data.get('email')
        group = request.data.get('group')  # 'admin' or 'student'
        action = request.data.get('action')  # 'add' or 'remove'
        
        if action == 'add':
            success = add_user_to_group(email, group)
        else:
            success = remove_user_from_group(email, group)
        
        return Response({"success": success}, status=200)