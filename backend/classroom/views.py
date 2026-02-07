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
    
    # classroom/views.py
from classroom.google_service import get_classroom_service

class CourseDetailsView(APIView):
    """Get detailed info about a course for the student"""
    permission_classes = [IsLabAdminOrStudent]
    
    def get(self, request, course_id):
        user = request.user
        
        try:
            classroom_service = get_classroom_service(user.email)
            
            # Get calendar service
            from google.oauth2 import service_account
            from googleapiclient.discovery import build
            creds = service_account.Credentials.from_service_account_file(
                'appuser/service_account.json',
                scopes=['https://www.googleapis.com/auth/calendar.readonly'],
                subject=user.email
            )
            calendar_service = build('calendar', 'v3', credentials=creds)
            
            # Get coursework
            coursework_response = classroom_service.courses().courseWork().list(
                courseId=course_id
            ).execute()
            coursework_list = coursework_response.get('courseWork', [])
            
            # Process assignments
            open_assignments = []
            graded_assignments = []
            
            for work in coursework_list:
                try:
                    submissions_response = classroom_service.courses().courseWork().studentSubmissions().list(
                        courseId=course_id,
                        courseWorkId=work['id'],
                        userId='me'
                    ).execute()
                    
                    submissions = submissions_response.get('studentSubmissions', [])
                    if submissions:
                        sub = submissions[0]
                        state = sub.get('state')
                        
                        if state in ['NEW', 'CREATED']:
                            open_assignments.append({
                                'id': work['id'],
                                'title': work['title'],
                                'dueDate': work.get('dueDate'),
                                'maxPoints': work.get('maxPoints'),
                            })
                        elif state == 'RETURNED':
                            graded_assignments.append({
                                'id': work['id'],
                                'title': work['title'],
                                'grade': sub.get('assignedGrade'),
                                'maxPoints': work.get('maxPoints')
                            })
                except Exception as e:
                    logger.warning(f"Error fetching submission for work {work['id']}: {e}")
                    continue
            
            # Get announcements
            announcements_response = classroom_service.courses().announcements().list(
                courseId=course_id
            ).execute()
            announcements = announcements_response.get('announcements', [])
            
            # Get calendar events for this course
            course_name = classroom_service.courses().get(id=course_id).execute().get('name')
            
            from datetime import datetime, timedelta
            import re
            
            now = datetime.utcnow()
            time_min = now.isoformat() + 'Z'
            time_max = (now + timedelta(days=30)).isoformat() + 'Z'
            
            events_result = calendar_service.events().list(
                calendarId='primary',
                timeMin=time_min,
                timeMax=time_max,
                q=course_name,
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            # Process calendar events
            calendar_events = []
            for event in events_result.get('items', []):
                calendar_events.append({
                    'title': event.get('summary'),
                    'start': event.get('start', {}).get('dateTime') or event.get('start', {}).get('date'),
                    'end': event.get('end', {}).get('dateTime') or event.get('end', {}).get('date'),
                    'link': event.get('htmlLink'),
                    'description': event.get('description', '')
                })
            
            # Extract Meet links from multiple sources
            meet_links = []
            
            # 1. From calendar events - conferenceData (official Meet events)
            for event in events_result.get('items', []):
                if 'conferenceData' in event and event['conferenceData'].get('entryPoints'):
                    for entry in event['conferenceData']['entryPoints']:
                        if entry.get('entryPointType') == 'video':
                            meet_links.append({
                                'link': entry.get('uri'),
                                'title': event.get('summary'),
                                'start': event.get('start', {}).get('dateTime'),
                                'source': 'calendar'
                            })
                
                # 2. From calendar event descriptions
                description = event.get('description', '')
                if 'meet.google.com' in description:
                    links = re.findall(r'https://meet\.google\.com/[a-z\-]+', description)
                    for link in links:
                        meet_links.append({
                            'link': link,
                            'title': event.get('summary'),
                            'start': event.get('start', {}).get('dateTime'),
                            'source': 'calendar_description'
                        })
            
            # 3. From announcements
            for announcement in announcements:
                text = announcement.get('text', '')
                if 'meet.google.com' in text:
                    links = re.findall(r'https://meet\.google\.com/[a-z\-]+', text)
                    for link in links:
                        meet_links.append({
                            'link': link,
                            'announcement': text[:100] + '...',
                            'creationTime': announcement.get('creationTime'),
                            'source': 'announcement'
                        })
            
            # Remove duplicate Meet links
            unique_meets = []
            seen_links = set()
            for meet in meet_links:
                if meet['link'] not in seen_links:
                    seen_links.add(meet['link'])
                    unique_meets.append(meet)
            
            return Response({
                'open_assignments': open_assignments,
                'graded_assignments': graded_assignments,
                'meet_links': unique_meets,
                'calendar_events': calendar_events,
                'open_count': len(open_assignments),
                'graded_count': len(graded_assignments),
                'events_count': len(calendar_events)
            })
            
        except Exception as e:
            logger.exception(f"Error fetching course details for {course_id}")
            return Response({"error": str(e)}, status=500)


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