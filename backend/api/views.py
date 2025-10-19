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
        print("Request body:", request.data)
        token = request.data.get("access_token")
        print("Received token:", token)

        if not token:
            return Response({"error": "No token provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verify token with Google
            idinfo = id_token.verify_oauth2_token(
                token, requests.Request(), settings.GOOGLE_CLIENT_ID
            )

            email = idinfo.get("email")
            name = idinfo.get("name", "")
            
            # Optional domain restriction:
            # if not email.endswith("@yourdomain.com"):
            #     return Response({"error": "Unauthorized domain"}, status=status.HTTP_403_FORBIDDEN)

            # Create or get user
            user, created = User.objects.get_or_create(username=email, defaults={"email": email, "first_name": name})

            # Generate DRF token
            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                "message": "Login successful",
                "token": token.key,
                "user": {"email": user.email, "name": user.first_name}
            })

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)