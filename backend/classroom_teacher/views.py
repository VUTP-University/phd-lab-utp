import logging
import os
from datetime import datetime

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

logger = logging.getLogger(__name__)


class TeacherCoursesListView(APIView):
    """List only the courses where the logged-in teacher is a teacher in Google Classroom."""

    permission_classes = [IsLabTeacher]

    def get(self, request):
        user = request.user
        logger.info(f"Teacher {user.email} fetching their courses")

        try:
            service = get_classroom_service(user.email)
            courses_response = service.courses().list(
                courseStates=["ACTIVE"],
                teacherId="me",
            ).execute()
            courses = courses_response.get("courses", [])

            logger.info(f"Teacher {user.email} fetched {len(courses)} courses")

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


class TeacherCourseDetailsView(APIView):
    """
    Get detailed information about a course for the teacher.
    Shows all assignments with student submission counts.
    Uses admin account to access all submissions across all students.
    """

    permission_classes = [IsLabTeacher]

    def get(self, request, course_id):
        user = request.user

        try:
            service = get_classroom_service(ADMIN_EMAIL)

            coursework_response = service.courses().courseWork().list(
                courseId=course_id
            ).execute()
            coursework_list = coursework_response.get("courseWork", [])

            students_response = service.courses().students().list(
                courseId=course_id
            ).execute()
            total_students = len(students_response.get("students", []))

            now = datetime.utcnow()
            current_assignments = []
            previous_assignments = []

            for work in coursework_list:
                try:
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

            StudentIndividualPlan.objects.create(
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
