from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from appuser.permissions import IsLabAdmin
from .group_utils import get_group_members, add_user_to_group, remove_user_from_group
import logging
from rest_framework.exceptions import APIException

logger = logging.getLogger(__name__)

class GroupMembersView(APIView):
    """Get members of admin or student group"""
    permission_classes = [IsLabAdmin]
    
    try:
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
    except Exception as e:
        logger.error(f"Error fetching group members: {str(e)}")
        raise APIException("Failed to fetch group members")

class ManageGroupMemberView(APIView):
    permission_classes = [IsLabAdmin]
    
    def post(self, request):
        email = request.data.get('email')
        group = request.data.get('group')  # 'admin' or 'student'
        action = request.data.get('action')
        
        # Convert 'admin'/'student' to actual group email
        if group == 'admin':
            group_email = settings.ADMIN_GROUP
        elif group == 'student':
            group_email = settings.STUDENTS_GROUP
        else:
            return Response({"error": "Invalid group"}, status=400)
        
        if action == 'add':
            success = add_user_to_group(email, group_email)
        else:
            success = remove_user_from_group(email, group_email)
        
        return Response({"success": success}, status=200)