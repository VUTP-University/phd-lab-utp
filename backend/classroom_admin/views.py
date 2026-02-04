from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import DisplayedCourse
from .serializers import DisplayedCourseSerializer
from classroom.google_service import get_classroom_service
import logging

class AdminCoursesListView(APIView):
    """
    Returns all courses available for the admin (teacher) with their IDs
    """

    def get(self, request):
        user_email = request.query_params.get("email")
        if not user_email:
            return Response({"error": "No user email provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            service = get_classroom_service(user_email)

            courses_response = service.courses().list(courseStates=["ACTIVE"]).execute()
            courses = courses_response.get("courses", [])

            # Store courses in the DisplayedCourse model in local database
            for course in courses:
                DisplayedCourse.objects.get_or_create(
                    course_id=course['id'],
                    defaults={
                        "name": course.get("name"),
                        "section": course.get("section", ""),
                        "alternate_link": course.get("alternateLink")
                    }
                )

            return Response(courses, status=status.HTTP_200_OK)

        except Exception as e:
            logging.exception("An error occurred in AdminCoursesListView: %s", e)
            return Response({"error": "An internal error has occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class DisplayedCourseToggleView(APIView):
    """
    Toggle a course in the DisplayedCourse table.
    """

    def post(self, request):
        data = request.data
        course_id = data.get("course_id")
        name = data.get("name")
        section = data.get("section", "")
        alternate_link = data.get("alternate_link")
        visible = data.get("visible", True)

        if not course_id or not name or not alternate_link:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if visible:
                # Create or get the course
                course, created = DisplayedCourse.objects.get_or_create(
                    course_id=course_id,
                    defaults={
                        "name": name,
                        "section": section,
                        "alternate_link": alternate_link,
                    }
                )
                serializer = DisplayedCourseSerializer(course)
                return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
            else:
                # Remove course if exists
                course = DisplayedCourse.objects.filter(course_id=course_id).first()
                if course:
                    course.delete()
                    return Response({"message": "Course removed"}, status=status.HTTP_200_OK)
                return Response({"message": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class DisplayedCoursesListView(APIView):
    """
    Returns all displayed courses (already saved in local DB).
    """
    def get(self, request):
        courses = DisplayedCourse.objects.all()
        data = [
            {
                "course_id": c.course_id,
                "name": c.name,
                "section": c.section,
                "alternate_link": c.alternate_link,
            }
            for c in courses
        ]
        return Response({"displayed_courses": data})