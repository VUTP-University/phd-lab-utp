"""
Admin views for managing displayed courses with JWT authentication.

These views are ADMIN ONLY and handle course visibility management.
User identity comes from JWT token instead of email parameters.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import DisplayedCourse
from .serializers import DisplayedCourseSerializer
from classroom.google_service import get_classroom_service
from appuser.permissions import IsLabAdmin
import logging

logger = logging.getLogger(__name__)


class AdminCoursesListView(APIView):
    """
    Returns all courses available for the admin.
    Only LISTS courses - doesn't automatically mark them as visible.
    """
    
    permission_classes = [IsLabAdmin]

    def get(self, request):
        user = request.user
        logger.info(f"Admin {user.email} fetching all courses")
        
        try:
            # Get Google Classroom service
            service = get_classroom_service(user.email)

            # Fetch all active courses
            courses_response = service.courses().list(courseStates=["ACTIVE"]).execute()
            courses = courses_response.get("courses", [])

            # DON'T auto-create DisplayedCourse entries
            # Just return the courses list
            
            logger.info(f"Admin {user.email} fetched {len(courses)} courses")
            
            return Response({
                "courses": courses,
                "count": len(courses),
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception(f"Error in AdminCoursesListView for {user.email}")
            return Response(
                {"error": "Failed to fetch courses", "details": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DisplayedCourseToggleView(APIView):
    """
    Toggle a course's visibility in the DisplayedCourse table.
    
    ADMIN ONLY - Students cannot access this view.
    Admins use this to control which courses are visible to all users.
    
    Authentication: JWT token required
    Authorization: Admin only (IsLabAdmin)
    """
    
    permission_classes = [IsLabAdmin]

    def post(self, request):
        """
        Toggle course visibility (show/hide).
        
        The admin is identified from the JWT token.
        
        Request Body:
            course_id (str): Google Classroom course ID (required)
            name (str): Course name (required)
            section (str): Course section (optional)
            alternate_link (str): Link to course in Google Classroom (required)
            visible (bool): True to show, False to hide (default: True)
            
        Returns:
            Response: Course information or error message
        """
        # User is extracted from JWT token by the permission class
        user = request.user
        
        data = request.data
        course_id = data.get("course_id")
        name = data.get("name")
        section = data.get("section", "")
        alternate_link = data.get("alternate_link")
        visible = data.get("visible", True)

        if not course_id or not name or not alternate_link:
            logger.warning(f"Admin {user.email} sent incomplete course data")
            return Response(
                {
                    "error": "Missing required fields",
                    "required": ["course_id", "name", "alternate_link"]
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if visible:
                # Create or update the course (make it visible)
                course, created = DisplayedCourse.objects.get_or_create(
                    course_id=course_id,
                    defaults={
                        "name": name,
                        "section": section,
                        "alternate_link": alternate_link,
                    }
                )
                
                # Update course details if it already exists
                if not created:
                    course.name = name
                    course.section = section
                    course.alternate_link = alternate_link
                    course.save()
                
                serializer = DisplayedCourseSerializer(course)
                action = "created" if created else "updated"
                
                logger.info(
                    f"Admin {user.email} {action} visible course: "
                    f"{course_id} ({name})"
                )
                
                return Response(
                    {
                        "message": f"Course {action} successfully",
                        "action": action,
                        "course": serializer.data
                    },
                    status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
                )
            else:
                # Remove course (make it invisible)
                course = DisplayedCourse.objects.filter(course_id=course_id).first()
                
                if course:
                    course_name = course.name
                    course.delete()
                    
                    logger.info(
                        f"Admin {user.email} removed visible course: "
                        f"{course_id} ({course_name})"
                    )
                    
                    return Response(
                        {
                            "message": "Course removed successfully",
                            "action": "removed",
                            "course_id": course_id
                        }, 
                        status=status.HTTP_200_OK
                    )
                else:
                    logger.warning(
                        f"Admin {user.email} tried to remove non-existent course: "
                        f"{course_id}"
                    )
                    
                    return Response(
                        {
                            "message": "Course not found in displayed courses",
                            "course_id": course_id
                        }, 
                        status=status.HTTP_404_NOT_FOUND
                    )
                    
        except Exception as e:
            logger.exception(f"Error in DisplayedCourseToggleView for admin {user.email}")
            return Response(
                {
                    "error": "Internal server error",
                    "details": str(e)
                }, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        
class DisplayedCoursesListView(APIView):
    """
    Returns all displayed courses (saved as visible in local DB).
    
    ADMIN ONLY - Students cannot access this view.
    Shows admins which courses are currently visible to all users.
    
    Authentication: JWT token required
    Authorization: Admin only (IsLabAdmin)
    """
    
    permission_classes = [IsLabAdmin]
    
    def get(self, request):
        """
        Get list of all visible courses.
        
        The admin is identified from the JWT token.
        
        Returns:
            Response: List of displayed courses
        """
        # User is extracted from JWT token
        user = request.user
        
        logger.info(f"Admin {user.email} retrieving displayed courses list")
        
        try:
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
            
            logger.info(f"Admin {user.email} retrieved {len(data)} displayed courses")
            
            return Response(
                {
                    "displayed_courses": data,
                    "count": len(data)
                }, 
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            logger.exception(f"Error retrieving displayed courses for admin {user.email}")
            return Response(
                {
                    "error": "Failed to retrieve displayed courses",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class BulkCourseVisibilityView(APIView):
    """
    Update visibility for multiple courses at once.
    
    ADMIN ONLY - Allows batch operations for efficiency.
    
    Authentication: JWT token required
    Authorization: Admin only (IsLabAdmin)
    """
    
    permission_classes = [IsLabAdmin]
    
    def post(self, request):
        """
        Bulk update course visibility.
        
        Request Body:
            course_ids (list): List of course IDs to make visible
            hide_others (bool): If True, hide all other courses (default: False)
            
        Returns:
            Response: Summary of changes
        """
        user = request.user
        
        course_ids = request.data.get("course_ids", [])
        hide_others = request.data.get("hide_others", False)
        
        if not isinstance(course_ids, list):
            return Response(
                {"error": "course_ids must be a list"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            removed_count = 0
            
            if hide_others:
                # Remove all courses not in the list
                removed = DisplayedCourse.objects.exclude(course_id__in=course_ids)
                removed_count = removed.count()
                removed.delete()
                
                logger.info(
                    f"Admin {user.email} hid {removed_count} courses "
                    f"(keeping: {course_ids})"
                )
            
            # Mark courses as visible (ensure they exist in DisplayedCourse)
            added = 0
            for course_id in course_ids:
                _, created = DisplayedCourse.objects.get_or_create(course_id=course_id)
                if created:
                    added += 1
            
            total_visible = DisplayedCourse.objects.count()
            
            logger.info(
                f"Admin {user.email} bulk updated course visibility: "
                f"{added} added, {removed_count} removed, {total_visible} total visible"
            )
            
            return Response({
                "message": "Bulk update successful",
                "courses_added": added,
                "courses_removed": removed_count,
                "total_visible": total_visible
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.exception(f"Error in bulk update for admin {user.email}")
            return Response(
                {
                    "error": "Internal server error",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )