import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from classroom.google_service import get_classroom_service
from appuser.models import CustomUser

class ClassroomCoursesView(APIView):
    """
    Returns all courses or a specific Google Classroom course if course_id is provided.
    """

    def get(self, request):
        print(request)
        user_email = request.query_params.get("email")
        course_id = request.query_params.get("course_id")

        if not user_email:
            return Response({"error": "No user email provided"}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.filter(email=user_email).first()
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            service = get_classroom_service(user.email)

            # If course_id is provided, fetch only that course
            if course_id:
                courses = service.courses().get(id=course_id).execute()
                return Response(courses, status=status.HTTP_200_OK)

            # Otherwise, list all courses
            courses = service.courses().list().execute()
            return Response(courses, status=status.HTTP_200_OK)

        except Exception as e:
            logging.exception("An error occurred in ClassroomCoursesView.get: %s", e)
            return Response({"error": "An internal error has occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)