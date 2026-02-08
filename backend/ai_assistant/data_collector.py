from classroom.google_service import get_classroom_service
from classroom_admin.models import DisplayedCourse
from user_management.models import StudentIndividualPlan
import logging

logger = logging.getLogger(__name__)


def collect_student_data(user):
    """Gather all student data for AI analysis"""
    
    try:
        service = get_classroom_service(user.email)
        
        # Get visible courses
        visible_courses = DisplayedCourse.objects.all()
        course_ids = [c.course_id for c in visible_courses]
        
        courses_data = []
        
        for course_id in course_ids:
            try:
                # Get course details
                course = service.courses().get(id=course_id).execute()
                
                # Get coursework
                coursework_response = service.courses().courseWork().list(
                    courseId=course_id
                ).execute()
                coursework_list = coursework_response.get('courseWork', [])
                
                open_count = 0
                graded_count = 0
                grades = []
                
                for work in coursework_list:
                    try:
                        submissions_response = service.courses().courseWork().studentSubmissions().list(
                            courseId=course_id,
                            courseWorkId=work['id'],
                            userId='me'
                        ).execute()
                        
                        submissions = submissions_response.get('studentSubmissions', [])
                        if submissions:
                            sub = submissions[0]
                            state = sub.get('state')
                            
                            if state in ['NEW', 'CREATED']:
                                open_count += 1
                            elif state == 'RETURNED':
                                graded_count += 1
                                if sub.get('assignedGrade'):
                                    grades.append(sub['assignedGrade'])
                    except:
                        continue
                
                # Calculate average grade
                average_grade = sum(grades) / len(grades) if grades else None
                
                courses_data.append({
                    'name': course['name'],
                    'open_assignments': open_count,
                    'graded_count': graded_count,
                    'average_grade': round(average_grade, 1) if average_grade else 'N/A',
                    'total_assignments': len(coursework_list)
                })
                
            except Exception as e:
                logger.warning(f"Error fetching course {course_id}: {e}")
                continue
        
        # Get individual plan
        plan = StudentIndividualPlan.objects.filter(
            student_email=user.email
        ).first()
        
        plan_status = "Individual plan uploaded" if plan else "No individual plan yet"
        
        return {
            'name': user.first_name or user.email.split('@')[0],
            'email': user.email,
            'courses': courses_data,
            'plan_status': plan_status,
            'has_plan': plan is not None
        }
        
    except Exception as e:
        logger.exception(f"Error collecting student data for {user.email}")
        raise


def collect_course_data(user, course_id):
    """Gather data for a specific course"""
    
    try:
        service = get_classroom_service(user.email)
        
        # Get course
        course = service.courses().get(id=course_id).execute()
        
        # Get coursework
        coursework_response = service.courses().courseWork().list(
            courseId=course_id
        ).execute()
        coursework_list = coursework_response.get('courseWork', [])
        
        open_assignments = []
        graded_assignments = []
        recent_grades = []
        
        for work in coursework_list:
            try:
                submissions_response = service.courses().courseWork().studentSubmissions().list(
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
                            'title': work['title'],
                            'due_date': work.get('dueDate')
                        })
                    elif state == 'RETURNED':
                        grade = sub.get('assignedGrade')
                        max_points = work.get('maxPoints')
                        if grade and max_points:
                            recent_grades.append(f"{grade}/{max_points}")
                            graded_assignments.append({
                                'title': work['title'],
                                'grade': grade,
                                'max_points': max_points
                            })
            except:
                continue
        
        return {
            'name': course['name'],
            'open_assignments': len(open_assignments),
            'graded_assignments': len(graded_assignments),
            'recent_grades': ', '.join(recent_grades[:3]) if recent_grades else 'N/A',
            'upcoming_deadlines': [a['title'] for a in open_assignments[:3]]
        }
        
    except Exception as e:
        logger.exception(f"Error collecting course data for {course_id}")
        raise