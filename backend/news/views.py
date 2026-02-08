from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.exceptions import PermissionDenied
from .models import News, NewsImage, CustomUser
from .serializers import NewsSerializer, NewsImageSerializer
from rest_framework.generics import RetrieveAPIView
from rest_framework.exceptions import ValidationError, PermissionDenied

class NewsListCreateView(generics.ListCreateAPIView):
    queryset = News.objects.all().order_by("-created_at")
    serializer_class = NewsSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        email = self.request.data.get("email")
        title = self.request.data.get("title")
        title_en = self.request.data.get('title_en')

        if not email:
            raise ValidationError({"error": "Email is required"})

        if not title:
            raise ValidationError({"error": "Title is required"})

        if News.objects.filter(title=title).exists():
            raise ValidationError({"error": "A news with this title already exists"})
        
        if News.objects.filter(title_en=title_en).exists():
            raise ValidationError({"error": "A news with this title_en already exists"})

        user = CustomUser.objects.filter(email=email, is_admin=True).first()
        if not user:
            raise PermissionDenied("You are not an admin")

        news = serializer.save(author=user)

        images = self.request.FILES.getlist("images")
        if len(images) > 5:
            raise ValidationError({"error": "You can upload up to 5 images"})

        for img in images:
            NewsImage.objects.create(news=news, image=img)

        return Response(serializer.data)


class NewsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [permissions.AllowAny]

    def perform_update(self, serializer):
        email = self.request.data.get("email")

        if not email:
            raise ValidationError({"error": "Email is required"})

        user = CustomUser.objects.filter(email=email, is_admin=True).first()
        if not user:
            raise PermissionDenied("You are not an admin")

        serializer.save(author=user)

    def perform_destroy(self, instance):
        email = self.request.data.get("email")

        if not email:
            raise ValidationError({"error": "Email is required"})

        user = CustomUser.objects.filter(email=email, is_admin=True).first()
        if not user:
            raise PermissionDenied("You are not an admin")

        instance.delete()
