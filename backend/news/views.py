from rest_framework import generics, permissions
from .models import News
from .serializers import NewsSerializer

# Custom permission: само админ
class IsAdminUserCustom(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin


class NewsListCreateView(generics.ListCreateAPIView):
    queryset = News.objects.all().order_by('-created_at')
    serializer_class = NewsSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUserCustom()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save()
