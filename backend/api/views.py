from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token, service_account
from googleapiclient.discovery import build
from google.auth.transport import requests
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.conf import settings
import os, requests as req
from dotenv import load_dotenv

load_dotenv()

from appuser.models import CustomUser
from .models import News
from .serializers import NewsSerializer

# Create your views here.
@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello from UTP Lab"})

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVICE_ACCOUNT_FILE = os.path.join(BASE_DIR, 'api', 'service_account.json')
ADMIN_EMAIL = os.getenv('GOOGLE_ADMIN_EMAIL')
TARGET_GROUP = os.getenv('GOOGLE_TARGET_GROUP_EMAIL')


def is_user_in_group(user_email):
    '''Check if a given Google Workspace user is in the target group'''
    SCOPES = ['https://www.googleapis.com/auth/admin.directory.group.readonly']
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    ).with_subject(ADMIN_EMAIL)
    
    service = build('admin', 'directory_v1', credentials=creds)

    try:

        service.groups().list(userKey=user_email).execute()
        return True
    except Exception as e:
        return False

class GoogleAuthView(APIView):
    def post(self, request):
        token_str = request.data.get("access_token")
        if not token_str:
            return Response({"error": "No token provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            idinfo = id_token.verify_oauth2_token(token_str, requests.Request(), settings.GOOGLE_CLIENT_ID)
            email = idinfo.get("email")
            is_lab_admin = is_user_in_group(email)
            
            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    "first_name": idinfo.get("given_name", ""),
                    "family_name": idinfo.get("family_name", ""),
                    "google_sub": idinfo.get("sub"),
                    "is_admin": is_lab_admin,
                    "is_staff": True if is_lab_admin else False
                }
            )

            # Update admin status if user already exists
            if not created:
                user.is_admin = is_lab_admin
                user.is_staff = True if is_lab_admin else False
                user.save()


            return Response({"message": "Login successful"}, 201)

        except ValueError as e:
            return Response({"error": "Invalid token", "details": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "Server error", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)