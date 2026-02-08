from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from appuser.permissions import IsLabAdmin
from .group_utils import get_group_members, add_user_to_group, remove_user_from_group
from appuser.google_drive_service import (
    get_drive_service,
    setup_phd_lab_structure,
    upload_file_to_drive,
    share_file_with_users
)
from .models import StudentIndividualPlan
import logging, os
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
    

class UploadStudentPlanView(APIView):
    """Upload student individual plan PDF to Google Drive and share with student
    """
    permission_classes = [IsLabAdmin]
    
    def post(self, request):
        user = request.user
        
        student_email = request.data.get('student_email')
        uploaded_file = request.FILES.get('file')
        
        if not student_email or not uploaded_file:
            return Response(
                {"error": "Missing student_email or file"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not uploaded_file.name.endswith('.pdf'):
            return Response(
                {"error": "Only PDF files are allowed"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Get Drive service (no impersonation)
            service = get_drive_service(user.email)
            
            # Setup folder structure
            folders = setup_phd_lab_structure(service)
            
            # Check and delete existing plan for the student
            existing_plan = StudentIndividualPlan.objects.filter(
                student_email=student_email
            ).first()
            
            if existing_plan:
                # Delete old file from Drive
                try:
                    service.files().delete(fileId=existing_plan.drive_file_id).execute()
                    logger.info(f"Deleted old file: {existing_plan.drive_file_id}")
                except Exception as e:
                    logger.warning(f"Could not delete old file: {e}")
                
                # Delete old database entry
                existing_plan.delete()
                logger.info(f"Removed old plan for {student_email}")
            
            # Save file temporarily
            temp_path = f'/tmp/{uploaded_file.name}'
            with open(temp_path, 'wb+') as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)
            
            # Generate filename
            filename = f"{student_email.split('@')[0]}_individual_plan.pdf"
            
            # Upload to service account's Drive
            result = upload_file_to_drive(
                service,
                temp_path,
                filename,
                folders['individual_plans']
            )
            
            # Share with both admin and student
            share_file_with_users(
                service,
                result['file_id'],
                [user.email, student_email],  # Share with both
                role='reader'
            )
            
            # Save to database
            plan = StudentIndividualPlan.objects.create(
                student_email=student_email,
                file_name=filename,
                drive_file_id=result['file_id'],
                drive_web_link=result['web_link'],
                uploaded_by=user
            )
            
            # Clean up
            os.remove(temp_path)
            
            logger.info(f"Admin {user.email} uploaded plan for {student_email}")
            
            return Response({
                "message": "Plan uploaded and shared successfully",
                "file_id": result['file_id'],
                "file_name": filename,
                "web_link": result['web_link']
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.exception(f"Error uploading plan: {e}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
