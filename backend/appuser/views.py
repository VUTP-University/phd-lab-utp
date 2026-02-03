from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token, service_account
from googleapiclient.discovery import build
from google.auth.transport import requests
from django.conf import settings
from django.contrib.auth import login
from rest_framework.permissions import AllowAny
from rest_framework.parsers import JSONParser
import os
from dotenv import load_dotenv
import logging

load_dotenv()

from appuser.models import CustomUser


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVICE_ACCOUNT_FILE = os.path.join(BASE_DIR, 'appuser', 'service_account.json')
ADMIN_EMAIL = os.getenv('GOOGLE_ADMIN_EMAIL')
TARGET_GROUP = os.getenv('GOOGLE_TARGET_GROUP_EMAIL')
ADMIN_GROUP = os.getenv('GOOGLE_ADMIN_GROUP')
STUDENT_GROUP = os.getenv('GOOGLE_STUDENTS_GROUP')


def is_user_in_group(user_email, group_email):
    """
    Check if user is member of UTP Lab Admins/Students Google Group.
    """
    SCOPES = ['https://www.googleapis.com/auth/admin.directory.group.readonly']
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    ).with_subject(ADMIN_EMAIL)
    
    service = build('admin', 'directory_v1', credentials=creds)

    try:
        result = service.members().hasMember(
            groupKey=group_email,
            memberKey=user_email
        ).execute()
        return result.get('isMember', False)
    except Exception as e:
        return False


class GoogleAuthView(APIView):
    
    authentication_classes = []
    permission_classes = [AllowAny]
    def post(self, request):
        
        print("Request body type:", type(request.data))
        print("Request body content:", request.data)
        
        
        token_str = request.data.get("access_token")
        print("Received token:", token_str)  # Debugging line
        if not token_str:
            return Response({"error": "No token provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            idinfo = id_token.verify_oauth2_token(
                token_str,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

            email = idinfo.get("email")

            # 1️⃣ Enforce domain
            if not email.endswith("@utp.bg"):
                return Response(
                    {"error": "Unauthorized domain"},
                    status=status.HTTP_403_FORBIDDEN
                )

            # 2️⃣ Check groups
            is_admin = is_user_in_group(email, ADMIN_GROUP)
            is_student = is_user_in_group(email, STUDENT_GROUP)

            # 3️⃣ Deny if in neither group
            if not is_admin and not is_student:
                return Response(
                    {"error": "User not allowed"},
                    status=status.HTTP_403_FORBIDDEN
                )

            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    "first_name": idinfo.get("given_name", ""),
                    "family_name": idinfo.get("family_name", ""),
                    "google_sub": idinfo.get("sub"),
                    "is_admin": is_admin,
                    "is_staff": is_admin,
                }
            )
            
            login(request, user)

            if not created:
                user.is_admin = is_admin
                user.is_staff = is_admin
                user.save()

            return Response(
                {
                    "email": email,
                    "name": idinfo.get("name"),
                    "picture": idinfo.get("picture"),
                    "is_lab_admin": is_admin,
                    "role": "admin" if is_admin else "student",
                },
                status=status.HTTP_200_OK
            )

        except ValueError:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            logging.exception("Auth error")
            return Response({"error": "Server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)