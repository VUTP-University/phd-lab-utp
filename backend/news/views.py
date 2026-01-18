from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.exceptions import PermissionDenied
from .models import News, NewsImage, CustomUser
from .serializers import NewsSerializer, NewsImageSerializer

class NewsListCreateView(generics.ListCreateAPIView):
    queryset = News.objects.all().order_by('-created_at')
    serializer_class = NewsSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]  # проверката ще е вътре в create
        return [permissions.AllowAny()]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        if not email:
            raise PermissionDenied("Email is required")

        user = CustomUser.objects.filter(email=email, is_admin=True).first()
        if not user:
            raise PermissionDenied("You are not an admin")

        serializer = self.get_serializer(data=request.data, context={'author': user})
        serializer.is_valid(raise_exception=True)
        news = serializer.save()

        # Обработка на многото снимки
        images = request.FILES.getlist('images')
        for img in images:
            NewsImage.objects.create(news=news, image=img)

        return Response(serializer.data)
