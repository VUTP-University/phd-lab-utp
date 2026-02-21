import logging
import os
from datetime import datetime, timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from classroom.google_service import get_classroom_service, ADMIN_EMAIL
from appuser.permissions import IsLabTeacher
from appuser.google_drive_service import (
    get_drive_service,
    setup_phd_lab_structure,
    upload_file_to_drive,
    share_file_with_users,
)
from user_management.models import StudentIndividualPlan
from classroom_admin.models import DisplayedCourse
from classroom_admin.serializers import DisplayedCourseSerializer

logger = logging.getLogger(__name__)


class TeacherCoursesListView(APIView):
    """List all courses available for the teacher from Google Classroom."""

    permission_classes = [IsLabTeacher]

    def get(self, request):
        user = request.user
        logger.info(f"Teacher {user.email} fetching all courses")

        try:
            service = get_classroom_service(ADMIN_EMAIL)
            courses_response = service.courses().list(courseStates=["ACTIVE"]).execute()
            courses = courses_response.get("courses", [])

            logger.info(f"Teacher {user.email} fetched {len(courses)} courses via admin account")

            return Response({
                "courses": courses,
                "count": len(courses),
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception(f"Error fetching courses for teacher {user.email}")
            return Response(
                {"error": "Failed to fetch courses", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class TeacherDisplayedCoursesListView(APIView):
    """List courses the teacher has marked as visible."""

    permission_classes = [IsLabTeacher]

    def get(self, request):
        user = request.user
        logger.info(f"Teacher {user.email} retrieving displayed courses")

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

            return Response({
                "displayed_courses": data,
                "count": len(data),
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception(f"Error retrieving displayed courses for teacher {user.email}")
            return Response(
                {"error": "Failed to retrieve displayed courses", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class TeacherDisplayedCourseToggleView(APIView):
    """Toggle a course's visibility for the teacher."""

    permission_classes = [IsLabTeacher]

    def post(self, request):
        user = request.user
        data = request.data
        course_id = data.get("course_id")
        name = data.get("name")
        section = data.get("section", "")
        alternate_link = data.get("alternate_link")
        visible = data.get("visible", True)

        if not course_id or not name or not alternate_link:
            return Response(
                {"error": "Missing required fields", "required": ["course_id", "name", "alternate_link"]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            if visible:
                course, created = DisplayedCourse.objects.get_or_create(
                    course_id=course_id,
                    defaults={
                        "name": name,
                        "section": section,
                        "alternate_link": alternate_link,
                    },
                )
                if not created:
                    course.name = name
                    course.section = section
                    course.alternate_link = alternate_link
                    course.save()

                serializer = DisplayedCourseSerializer(course)
                action = "created" if created else "updated"

                logger.info(f"Teacher {user.email} {action} visible course: {course_id} ({name})")

                return Response(
                    {"message": f"Course {action} successfully", "action": action, "course": serializer.data},
                    status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
                )
            else:
                course = DisplayedCourse.objects.filter(course_id=course_id).first()

                if course:
                    course.delete()
                    logger.info(f"Teacher {user.email} removed visible course: {course_id}")
                    return Response(
                        {"message": "Course removed successfully", "action": "removed", "course_id": course_id},
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {"message": "Course not found in displayed courses", "course_id": course_id},
                        status=status.HTTP_404_NOT_FOUND,
                    )

        except Exception as e:
            logger.exception(f"Error toggling course for teacher {user.email}")
            return Response(
                {"error": "Internal server error", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class TeacherCourseDetailsView(APIView):
    """
    Get detailed information about a course for the teacher.
    Shows all assignments with student submission counts.
    """

    permission_classes = [IsLabTeacher]

    def get(self, request, course_id):
        user = request.user

        try:
            service = get_classroom_service(ADMIN_EMAIL)

            # Get coursework
            coursework_response = service.courses().courseWork().list(
                courseId=course_id
            ).execute()
            coursework_list = coursework_response.get("courseWork", [])

            # Get enrolled students count
            students_response = service.courses().students().list(
                courseId=course_id
            ).execute()
            total_students = len(students_response.get("students", []))

            now = datetime.utcnow()
            current_assignments = []
            previous_assignments = []

            for work in coursework_list:
                try:
                    # Fetch ALL student submissions for this assignment
                    submissions_response = service.courses().courseWork().studentSubmissions().list(
                        courseId=course_id,
                        courseWorkId=work["id"],
                    ).execute()
                    submissions = submissions_response.get("studentSubmissions", [])

                    turned_in_count = sum(
                        1 for s in submissions if s.get("state") in ["TURNED_IN", "RETURNED"]
                    )
                    graded_count = sum(
                        1 for s in submissions if s.get("assignedGrade") is not None
                    )

                    assignment_data = {
                        "id": work["id"],
                        "title": work.get("title", ""),
                        "description": work.get("description", ""),
                        "dueDate": work.get("dueDate"),
                        "maxPoints": work.get("maxPoints"),
                        "state": work.get("state", ""),
                        "total_students": total_students,
                        "turned_in_count": turned_in_count,
                        "graded_count": graded_count,
                        "alternateLink": work.get("alternateLink", ""),
                    }

                    # Determine if current or previous based on due date
                    due_date = work.get("dueDate")
                    is_past_due = False
                    if due_date:
                        try:
                            due = datetime(
                                due_date.get("year", now.year),
                                due_date.get("month", 1),
                                due_date.get("day", 1),
                            )
                            is_past_due = due < now
                        except (ValueError, TypeError):
                            pass

                    if is_past_due:
                        previous_assignments.append(assignment_data)
                    else:
                        current_assignments.append(assignment_data)

                except Exception as e:
                    logger.warning(f"Error fetching submissions for work {work['id']}: {e}")
                    continue

            return Response({
                "current_assignments": current_assignments,
                "previous_assignments": previous_assignments,
                "total_students": total_students,
                "current_count": len(current_assignments),
                "previous_count": len(previous_assignments),
            })

        except Exception as e:
            logger.exception(f"Error fetching course details for teacher {user.email}, course {course_id}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TeacherUploadPlanView(APIView):
    """Upload student individual plan PDF to Google Drive."""

    permission_classes = [IsLabTeacher]

    def post(self, request):
        user = request.user
        student_email = request.data.get("student_email")
        uploaded_file = request.FILES.get("file")

        if not student_email or not uploaded_file:
            return Response(
                {"error": "Missing student_email or file"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not uploaded_file.name.endswith(".pdf"):
            return Response(
                {"error": "Only PDF files are allowed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            service = get_drive_service(user.email)
            folders = setup_phd_lab_structure(service)

            # Check and delete existing plan
            existing_plan = StudentIndividualPlan.objects.filter(
                student_email=student_email
            ).first()

            if existing_plan:
                try:
                    service.files().delete(fileId=existing_plan.drive_file_id).execute()
                    logger.info(f"Deleted old file: {existing_plan.drive_file_id}")
                except Exception as e:
                    logger.warning(f"Could not delete old file: {e}")
                existing_plan.delete()

            # Save file temporarily
            temp_path = f"/tmp/{uploaded_file.name}"
            with open(temp_path, "wb+") as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)

            filename = f"{student_email.split('@')[0]}_individual_plan.pdf"

            result = upload_file_to_drive(
                service, temp_path, filename, folders["individual_plans"]
            )

            share_file_with_users(
                service, result["file_id"], [user.email, student_email], role="reader"
            )

            plan = StudentIndividualPlan.objects.create(
                student_email=student_email,
                file_name=filename,
                drive_file_id=result["file_id"],
                drive_web_link=result["web_link"],
                uploaded_by=user,
            )

            os.remove(temp_path)

            logger.info(f"Teacher {user.email} uploaded plan for {student_email}")

            return Response(
                {
                    "message": "Plan uploaded and shared successfully",
                    "file_id": result["file_id"],
                    "file_name": filename,
                    "web_link": result["web_link"],
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            logger.exception(f"Error uploading plan: {e}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
