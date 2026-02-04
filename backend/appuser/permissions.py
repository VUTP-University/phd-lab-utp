from rest_framework.permissions import BasePermission
from appuser.models import CustomUser
class IsAuthenticatedUser(BasePermission):
    """
    Permission class to check if the user email is provided
    and exists in the database (authenticated via Google).
    """
    
    def has_permission(self, request, view):
        user_email = request.query_params.get("email") or request.data.get("email")
        
        if not user_email:
            return False
        
        # Check if user exists in database (means they've authenticated)
        user = CustomUser.objects.filter(email=user_email, is_active=True).first()
        
        if user:
            # Attach user to request for later use
            request.user_obj = user
            return True
        
        return False
class IsLabAdmin(BasePermission):
    """
    Permission class to check if the user is a lab admin.
    Requires IsAuthenticatedUser to be used first.
    """
    
    def has_permission(self, request, view):
        user_email = request.query_params.get("email") or request.data.get("email")
        
        if not user_email:
            return False
        
        user = CustomUser.objects.filter(
            email=user_email, 
            is_admin=True, 
            is_active=True
        ).first()
        
        if user:
            request.user_obj = user
            return True
        
        return False
class IsLabAdminOrStudent(BasePermission):
    """
    Permission class to check if the user is either a lab admin or student.
    This essentially checks if they're authorized users.
    """
    
    def has_permission(self, request, view):
        user_email = request.query_params.get("email") or request.data.get("email")
        
        if not user_email:
            return False
        
        # Any user in the database is authorized (students or admins)
        user = CustomUser.objects.filter(email=user_email, is_active=True).first()
        
        if user:
            request.user_obj = user
            return True
        
        return False