import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from django.conf import settings

SERVICE_ACCOUNT_FILE = settings.SERVICE_ACCOUNT_FILE
ADMIN_EMAIL = settings.GOOGLE_ADMIN_EMAIL

CLASSROOM_SCOPES = [
    "https://www.googleapis.com/auth/classroom.courses.readonly",
    "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
    "https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly",
    "https://www.googleapis.com/auth/classroom.coursework.students.readonly",
    "https://www.googleapis.com/auth/classroom.rosters.readonly",
    "https://www.googleapis.com/auth/classroom.announcements.readonly",

]

def get_classroom_service(user_email):
    """
    Returns a Google Classroom service object impersonating the given user.
    """
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=CLASSROOM_SCOPES,
    ).with_subject(user_email)

    service = build("classroom", "v1", credentials=creds)
    return service