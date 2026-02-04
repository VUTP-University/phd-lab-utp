import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from classroom.google_service import get_classroom_service
from appuser.models import CustomUser
from classroom_admin.models import DisplayedCourse
from appuser.permissions import IsLabAdminOrStudent
logger = logging.getLogger(__name__)


class ClassroomCoursesView(APIView):
    """
    Get Google Classroom courses for a user.
    Accessible by both admins and students.
    """
    permission_classes = [IsLabAdminOrStudent]
    
    def get(self, request):
        user_email = request.query_params.get("email")
        course_ids = request.query_params.getlist("course_ids")
        # Permission class already validates user_email and user existence
        user = request.user_obj
        try:
            service = get_classroom_service(user.email)
            if course_ids:
                courses = []
                for cid in course_ids:
                    try:
                        course = service.courses().get(id=cid).execute()
                        courses.append(course)
                    except Exception as e:
                        logger.warning(f"Failed to fetch course {cid}: {e}")
                return Response({"courses": courses}, status=status.HTTP_200_OK)
            
            courses = service.courses().list().execute()
            return Response(courses, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception("Classroom error")
            return Response(
                {"error": "Internal error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
            
class VisibleCoursesView(APIView):
    """
    Returns only courses marked as visible (DisplayedCourse).
    Accessible by both admins and students.
    """
    permission_classes = [IsLabAdminOrStudent]
    def get(self, request):
        user_email = request.query_params.get("email")
        
        # Permission class already validates user
        user = request.user_obj
        try:
            service = get_classroom_service(user.email)
            # Fetch all visible courses
            visible_courses = DisplayedCourse.objects.all()
            course_ids = [c.course_id for c in visible_courses]
            courses = []
            for cid in course_ids:
                try:
                    course = service.courses().get(id=cid).execute()
                    courses.append(course)
                except Exception as e:
                    logger.warning(f"Failed to fetch course {cid}: {e}")
            return Response({"courses": courses}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception("Classroom error")
            return Response(
                {"error": "Internal error"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )