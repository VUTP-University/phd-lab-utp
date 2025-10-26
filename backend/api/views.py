from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.conf import settings

from appuser.models import CustomUser
from .models import News
from .serializers import NewsSerializer

# Create your views here.
@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello from UTP Lab"})


class NewsListView(generics.ListAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    queryset = News.objects.all().order_by('-published_at')
    # permission_classes = [permissions.IsAuthenticated]


class NewsCreateView(generics.CreateAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    # permission_classes = [permissions.AllowAny]
    # permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author="john doe")


class GoogleAuthView(APIView):
    def post(self, request):
        token_str = request.data.get("access_token")
        if not token_str:
            return Response({"error": "No token provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            idinfo = id_token.verify_oauth2_token(token_str, requests.Request(), settings.GOOGLE_CLIENT_ID)

            email = idinfo.get("email")
            first_name = idinfo.get("given_name", "")
            family_name = idinfo.get("family_name", "")
            google_sub = idinfo.get("sub")

            user = CustomUser.objects.filter(google_sub=google_sub).first()
            if not user:
                user, created = CustomUser.objects.get_or_create(
                    email=email,
                    defaults={
                        "first_name": first_name,
                        "family_name": family_name,
                        "google_sub": google_sub,
                        "is_admin": email == "mariqn.karastoyanov@gmail.com",
                    }
                )
            else:
                if email == "mariqn.karastoyanov@gmail.com" and not user.is_admin:
                    user.is_admin = True
                    user.save()

            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                "message": "Login successful",
                "token": token.key,
                "user": {
                    "email": user.email,
                    "name": f"{user.first_name} {user.family_name}",
                    "is_admin": user.is_admin
                }
            })

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)