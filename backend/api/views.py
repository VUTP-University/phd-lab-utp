from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics, permissions
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