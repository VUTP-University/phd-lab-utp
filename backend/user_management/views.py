from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from appuser.permissions import IsLabAdmin, IsLabAdminOrStudent, IsLabTeacherOrAdmin
from .group_utils import get_group_members, add_user_to_group, remove_user_from_group
from appuser.google_drive_service import (
    get_drive_service,
    setup_phd_lab_structure,
    upload_file_to_drive,
    share_file_with_users
)
from .models import StudentIndividualPlan, Supervision
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
            elif group_email == 'teacher':
                group = settings.TEACHERS_GROUP
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
        
        # Convert 'admin'/'student'/'teacher' to actual group email
        if group == 'admin':
            group_email = settings.ADMIN_GROUP
        elif group == 'student':
            group_email = settings.STUDENTS_GROUP
        elif group == 'teacher':
            group_email = settings.TEACHERS_GROUP
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


class MyIndividualPlanView(APIView):
    """Get student's own individual plan"""
    permission_classes = [IsLabAdminOrStudent]
    
    def get(self, request):
        user = request.user
        
        try:
            plan = StudentIndividualPlan.objects.filter(
                student_email=user.email
            ).first()
            
            if not plan:
                return Response(
                    {"message": "No plan found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            return Response({
                "file_name": plan.file_name,
                "drive_web_link": plan.drive_web_link,
                "uploaded_at": plan.uploaded_at,
                "uploaded_by": plan.uploaded_by.email if plan.uploaded_by else None
            })
            
        except Exception as e:
            logger.exception(f"Error fetching plan for {user.email}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SupervisionsView(APIView):
    """Admin: list all supervision pairs, add or remove one."""

    permission_classes = [IsLabAdmin]

    def get(self, request):
        supervisions = Supervision.objects.all()
        data = [
            {"id": s.id, "supervisor_email": s.supervisor_email, "student_email": s.student_email}
            for s in supervisions
        ]
        return Response({"supervisions": data}, status=200)

    def post(self, request):
        supervisor_email = request.data.get('supervisor_email', '').strip()
        student_email = request.data.get('student_email', '').strip()

        if not supervisor_email or not student_email:
            return Response({"error": "Missing supervisor_email or student_email"}, status=400)

        supervision, created = Supervision.objects.get_or_create(
            supervisor_email=supervisor_email,
            student_email=student_email,
        )

        if not created:
            return Response({"error": "This supervision pair already exists"}, status=400)

        logger.info(f"Admin {request.user.email} assigned {supervisor_email} → {student_email}")
        return Response(
            {"id": supervision.id, "supervisor_email": supervisor_email, "student_email": student_email},
            status=201,
        )

    def delete(self, request):
        supervision_id = request.data.get('id')
        if not supervision_id:
            return Response({"error": "Missing id"}, status=400)

        supervision = Supervision.objects.filter(id=supervision_id).first()
        if not supervision:
            return Response({"error": "Supervision not found"}, status=404)

        logger.info(
            f"Admin {request.user.email} removed supervision "
            f"{supervision.supervisor_email} → {supervision.student_email}"
        )
        supervision.delete()
        return Response({"message": "Supervision removed"}, status=200)


class MySupervisionView(APIView):
    """Read-only for students: returns the list of their supervisors."""

    permission_classes = [IsLabAdminOrStudent]

    def get(self, request):
        user = request.user
        supervisions = Supervision.objects.filter(student_email=user.email)
        supervisors = [s.supervisor_email for s in supervisions]
        return Response({"supervisors": supervisors}, status=200)


class MyDoctoralStudentsView(APIView):
    """Read-only for teachers: returns the list of their doctoral students."""

    permission_classes = [IsLabTeacherOrAdmin]

    def get(self, request):
        user = request.user
        supervisions = Supervision.objects.filter(supervisor_email=user.email)
        students = [s.student_email for s in supervisions]
        return Response({"doctoral_students": students}, status=200)