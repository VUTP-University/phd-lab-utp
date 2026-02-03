import logging
from rest_framework.views import APIView
from googleapiclient.errors import HttpError
from rest_framework.response import Response
from rest_framework import status
from classroom.google_service import get_classroom_service
from appuser.models import CustomUser
from appuser.permissions import IsAuthenticatedUTP, IsAdminUTP
from classroom_admin.models import DisplayedCourse

class ClassroomCoursesView(APIView):
    """
    Get Google Classroom courses for a user. Used only by admins to fetch all Google Classroom courses.
    """
    permission_classes = [IsAuthenticatedUTP]
    
    def get(self, request):
        user_email = request.query_params.get("email")
        course_ids = request.query_params.getlist("course_ids")


        if not user_email:
            return Response({"error": "No user email provided"}, status=400)

        user = CustomUser.objects.filter(email=user_email).first()
        if not user:
            return Response({"error": "User not found"}, status=404)

        try:
            service = get_classroom_service(user.email)

            if course_ids:
                courses = []
                for cid in course_ids:
                    course = service.courses().get(id=cid).execute()
                    courses.append(course)

                return Response({"courses": courses}, status=200)
            
            courses = service.courses().list().execute()
            return Response(courses)

        except Exception as e:
            logging.exception("Classroom error")
            return Response(
                {"error": "Internal error"},
                status=500
            )
            
            
class VisibleCoursesView(APIView):
    """
    Returns only courses marked as visible (DisplayedCourse) for all users.
    """
    permission_classes = [IsAuthenticatedUTP]
    def get(self, request):
        user_email = request.query_params.get("email")

        if not user_email:
            return Response({"error": "No user email provided"}, status=400)

        user = CustomUser.objects.filter(email=user_email).first()
        if not user:
            return Response({"error": "User not found"}, status=404)

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
                    logging.warning(f"Failed to fetch course {cid}: {e}")

            return Response({"courses": courses}, status=200)

        except Exception as e:
            logging.exception("Classroom error")
            return Response({"error": "Internal error"}, status=500)