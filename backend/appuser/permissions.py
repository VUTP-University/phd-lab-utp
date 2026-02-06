"""
Custom permission classes for Django REST Framework with JWT authentication.

These permission classes use JWT tokens to authenticate users instead of
email parameters. The user identity is extracted from the verified JWT token.
"""

from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
import logging

logger = logging.getLogger(__name__)


class IsLabAdmin(BasePermission):
    """
    Permission class for admin-only access.
    
    Authenticates using JWT token and checks if user has admin privileges.
    The user object is attached to the request for use in views.
    """
    
    message = "Admin privileges required. You do not have permission to access this resource."
    
    def has_permission(self, request, view):
        """
        Check if user is authenticated via JWT and has admin privileges.
        
        Args:
            request: The request object
            view: The view being accessed
            
        Returns:
            bool: True if user is authenticated and is admin, False otherwise
        """
        # Authenticate using JWT token from Authorization header
        jwt_auth = JWTAuthentication()
        
        try:
            # This returns (user, validated_token) or raises AuthenticationFailed
            user_auth = jwt_auth.authenticate(request)
            
            if user_auth is None:
                logger.warning("JWT authentication returned None")
                return False
            
            user, token = user_auth
            
        except AuthenticationFailed as e:
            logger.warning(f"JWT authentication failed: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error during JWT authentication: {e}")
            return False
        
        # Check if user exists and is active
        if not user or not user.is_active:
            logger.warning(f"User not found or inactive: {user}")
            return False
        
        # Check if user has admin privileges
        if not user.is_admin:
            logger.warning(f"Admin access denied for non-admin user: {user.email}")
            return False
        
        # Attach authenticated user to request
        request.user = user
        logger.debug(f"Admin access granted to: {user.email}")
        
        return True


class IsLabAdminOrStudent(BasePermission):
    """
    Permission class for both admin and student access.
    
    Authenticates using JWT token and allows access to any authenticated user
    (both admins and students). The user object is attached to the request.
    """
    
    message = "Authentication required. Please log in to access this resource."
    
    def has_permission(self, request, view):
        """
        Check if user is authenticated via JWT.
        
        Args:
            request: The request object
            view: The view being accessed
            
        Returns:
            bool: True if user is authenticated, False otherwise
        """
        # Authenticate using JWT token from Authorization header
        jwt_auth = JWTAuthentication()
        
        try:
            # This returns (user, validated_token) or raises AuthenticationFailed
            user_auth = jwt_auth.authenticate(request)
            
            if user_auth is None:
                logger.warning("JWT authentication returned None")
                return False
            
            user, token = user_auth
            
        except AuthenticationFailed as e:
            logger.warning(f"JWT authentication failed: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error during JWT authentication: {e}")
            return False
        
        # Check if user exists and is active
        if not user or not user.is_active:
            logger.warning(f"User not found or inactive: {user}")
            return False
        
        # Attach authenticated user to request
        request.user = user
        
        # Log access with role information
        role = "admin" if user.is_admin else "student"
        logger.debug(f"Access granted to {role}: {user.email}")
        
        return True


class IsLabStudent(BasePermission):
    """
    Permission class for student-only access (excludes admins).
    
    This can be used if you need endpoints that only students can access,
    not admins. Useful for student-specific features.
    """
    
    message = "This resource is only accessible to students."
    
    def has_permission(self, request, view):
        """
        Check if user is authenticated and is a student (not admin).
        
        Args:
            request: The request object
            view: The view being accessed
            
        Returns:
            bool: True if user is authenticated and is student, False otherwise
        """
        # Authenticate using JWT token
        jwt_auth = JWTAuthentication()
        
        try:
            user_auth = jwt_auth.authenticate(request)
            
            if user_auth is None:
                return False
            
            user, token = user_auth
            
        except (AuthenticationFailed, Exception) as e:
            logger.warning(f"Authentication failed: {e}")
            return False
        
        # Check if user exists, is active, and is NOT an admin
        if not user or not user.is_active or user.is_admin:
            logger.warning(
                f"Student access denied for: {user.email if user else 'unknown'} "
                f"(is_admin: {user.is_admin if user else 'N/A'})"
            )
            return False
        
        # Attach user to request
        request.user = user
        logger.debug(f"Student access granted to: {user.email}")
        
        return True


class IsAuthenticatedUser(BasePermission):
    """
    Permission class to check if user is authenticated via JWT.
    
    This is similar to DRF's built-in IsAuthenticated, but uses our
    custom JWT authentication and attaches the user to the request.
    """
    
    message = "Authentication credentials were not provided or are invalid."
    
    def has_permission(self, request, view):
        """
        Check if user has valid JWT token.
        
        Args:
            request: The request object
            view: The view being accessed
            
        Returns:
            bool: True if user is authenticated, False otherwise
        """
        jwt_auth = JWTAuthentication()
        
        try:
            user_auth = jwt_auth.authenticate(request)
            
            if user_auth is None:
                return False
            
            user, token = user_auth
            
            if not user or not user.is_active:
                return False
            
            request.user = user
            return True
            
        except (AuthenticationFailed, Exception):
            return False