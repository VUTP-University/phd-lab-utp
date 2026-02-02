import logging
from rest_framework.views import APIView
from googleapiclient.errors import HttpError
from rest_framework.response import Response
from rest_framework import status
from classroom.google_service import get_classroom_service
from appuser.models import CustomUser

class ClassroomCoursesView(APIView):

    def get(self, request):
        user_email = request.query_params.get("email")
        course_ids = request.query_params.getlist("course_ids")


        # print("RAW QUERY PARAMS:", request.query_params)
        # print("COURSE IDS:", request.query_params.getlist("course_ids"))
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