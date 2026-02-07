"""
Classroom views with JWT authentication.

These views use JWT tokens to authenticate users instead of email parameters.
The user's identity is extracted from the verified JWT token.
"""

import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from classroom.google_service import get_classroom_service
from classroom_admin.models import DisplayedCourse
from appuser.permissions import IsLabAdminOrStudent

logger = logging.getLogger(__name__)


class ClassroomCoursesView(APIView):
    """
    Get Google Classroom courses for the authenticated user.
    
    Authentication: JWT token required (user identity from token)
    Authorization: Admin or Student (IsLabAdminOrStudent)
    """
    
    permission_classes = [IsLabAdminOrStudent]
    
    def get(self, request):
        """
        Fetch Google Classroom courses for the authenticated user.
        
        The user is automatically identified from the JWT token in the
        Authorization header. No email parameter needed.
        
        Returns:
            Response: List of courses or error message
        """
        # User is extracted from JWT token by the permission class
        user = request.user
        
        logger.info(f"Fetching courses for {user.email} (admin: {user.is_admin})")
        
        try:
            # Get Google Classroom service using the authenticated user's email
            service = get_classroom_service(user.email)
            
            # Fetch all courses the user has access to
            courses_response = service.courses().list().execute()
            courses = courses_response.get('courses', [])
            
            logger.info(f"Successfully fetched {len(courses)} courses for {user.email}")
            
            return Response({
                "courses": courses,
                "count": len(courses)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.exception(f"Error fetching courses for {user.email}")
            return Response(
                {
                    "error": "Failed to fetch courses",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
            
class VisibleCoursesView(APIView):
    """
    Returns only courses marked as visible (DisplayedCourse).
    
    These are courses that admins have selected to be shown to all users
    in the application. Uses JWT authentication.
    
    Authentication: JWT token required
    Authorization: Admin or Student (IsLabAdminOrStudent)
    """
    
    permission_classes = [IsLabAdminOrStudent]
    
    def get(self, request):
        """
        Fetch visible courses for the authenticated user.
        
        Only returns courses that have been marked as visible in the
        DisplayedCourse table by administrators.
        
        Returns:
            Response: List of visible courses or error message
        """
        # User is extracted from JWT token by the permission class
        user = request.user
        
        logger.info(f"Fetching visible courses for {user.email}")
        
        try:
            # Get Google Classroom service
            service = get_classroom_service(user.email)
            
            # Fetch all visible course IDs from database
            visible_courses = DisplayedCourse.objects.all()
            course_ids = [c.course_id for c in visible_courses]
            
            if not course_ids:
                logger.info(f"No visible courses configured for {user.email}")
                return Response(
                    {
                        "courses": [],
                        "count": 0,
                        "message": "No courses are currently visible"
                    },
                    status=status.HTTP_200_OK
                )
            
            # Fetch each visible course from Google Classroom
            courses = []
            failed_courses = []
            
            for cid in course_ids:
                try:
                    course = service.courses().get(id=cid).execute()
                    courses.append(course)
                except Exception as e:
                    logger.warning(f"Failed to fetch visible course {cid} for {user.email}: {e}")
                    failed_courses.append(cid)
            
            logger.info(
                f"Fetched {len(courses)}/{len(course_ids)} visible courses for {user.email} "
                f"({len(failed_courses)} failed)"
            )
            
            response_data = {
                "courses": courses,
                "count": len(courses),
                "total_visible": len(course_ids)
            }
            
            # Optionally include failed courses in response for debugging
            if failed_courses and user.is_admin:
                response_data["failed_course_ids"] = failed_courses
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.exception(f"Error fetching visible courses for {user.email}")
            return Response(
                {
                    "error": "Internal error",
                    "details": str(e)
                }, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CourseDetailsView(APIView):
    """
    Get detailed information about a specific course.
    
    Authentication: JWT token required
    Authorization: Admin or Student (IsLabAdminOrStudent)
    """
    
    permission_classes = [IsLabAdminOrStudent]
    
    def get(self, request, course_id):
        """
        Fetch details for a specific course.
        
        Args:
            course_id (str): Google Classroom course ID
            
        Returns:
            Response: Course details or error message
        """
        user = request.user
        
        logger.info(f"Fetching course {course_id} for {user.email}")
        
        try:
            service = get_classroom_service(user.email)
            course = service.courses().get(id=course_id).execute()
            
            logger.info(f"Successfully fetched course {course_id} for {user.email}")
            
            return Response(course, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Failed to fetch course {course_id} for {user.email}: {e}")
            return Response(
                {
                    "error": "Course not found or access denied",
                    "course_id": course_id
                },
                status=status.HTTP_404_NOT_FOUND
            )


class CourseWorkView(APIView):
    """
    Get coursework for a specific course.
    
    Authentication: JWT token required
    Authorization: Admin or Student (IsLabAdminOrStudent)
    """
    
    permission_classes = [IsLabAdminOrStudent]
    
    def get(self, request, course_id):
        """
        Fetch coursework/assignments for a course.
        
        Args:
            course_id (str): Google Classroom course ID
            
        Returns:
            Response: List of coursework or error message
        """
        user = request.user
        
        logger.info(f"Fetching coursework for course {course_id} by {user.email}")
        
        try:
            service = get_classroom_service(user.email)
            
            # Fetch coursework
            coursework_response = service.courses().courseWork().list(
                courseId=course_id
            ).execute()
            
            coursework = coursework_response.get('courseWork', [])
            
            logger.info(f"Fetched {len(coursework)} coursework items for course {course_id}")
            
            return Response({
                "coursework": coursework,
                "count": len(coursework),
                "course_id": course_id
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.exception(f"Error fetching coursework for course {course_id}")
            return Response(
                {
                    "error": "Failed to fetch coursework",
                    "course_id": course_id
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )