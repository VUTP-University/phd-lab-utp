from rest_framework.permissions import BasePermission
from appuser.models import CustomUser

class IsAuthenticatedUTP(BasePermission):
    """
    Any authenticated user from UTP (admin or student)
    """
    def has_permission(self, request, view):
        email = request.query_params.get("email")
        return CustomUser.objects.filter(email=email).exists()


class IsAdminUTP(BasePermission):
    """
    Only admin users from UTP
    """
    def has_permission(self, request, view):
        email = request.query_params.get("email")
        user = CustomUser.objects.filter(email=email).first()
        return bool(user and user.is_admin)