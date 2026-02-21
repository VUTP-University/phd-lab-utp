# appuser/views.py

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
import logging

from appuser.models import CustomUser
from appuser.group_utils import check_user_groups

logger = logging.getLogger(__name__)


def get_tokens_for_user(user):
    """Generate JWT tokens for a user."""
    refresh = RefreshToken.for_user(user)
    
    # Add custom claims to the token
    refresh['email'] = user.email
    refresh['is_admin'] = user.is_admin
    refresh['is_teacher'] = user.is_teacher
    refresh['is_student'] = not user.is_admin and not user.is_teacher
    
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@method_decorator(csrf_exempt, name='dispatch')
class GoogleAuthView(APIView):
    """Google OAuth2 Authentication View with JWT token generation."""
    
    permission_classes = []  # Allow unauthenticated access
    
    def post(self, request):
        """
        Authenticate user with Google OAuth token and return JWT tokens.
        """
        token_str = request.data.get("credential") or request.data.get("access_token")
        
        if not token_str:
            logger.warning("Authentication attempt without token")
            return Response(
                {"error": "No token provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Verify the Google OAuth token
            idinfo = id_token.verify_oauth2_token(
                token_str, 
                requests.Request(), 
                settings.GOOGLE_CLIENT_ID
            )
            
            email = idinfo.get("email")
            
            if not email:
                logger.error("Token verification succeeded but no email in token")
                return Response(
                    {"error": "Invalid token: no email found"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            logger.info(f"Token verified for: {email}")
            
            # Check user's group membership
            group_info = check_user_groups(email)
            
            # Reject unauthorized users
            if not group_info['is_authorized']:
                logger.warning(f"Unauthorized login attempt by {email}")
                return Response(
                    {
                        "error": "Access denied", 
                        "message": "You must be a member of the admin, student, or teacher group."
                    },
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Create or update user
            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    "first_name": idinfo.get("given_name", ""),
                    "family_name": idinfo.get("family_name", ""),
                    "google_sub": idinfo.get("sub"),
                    "is_admin": group_info['is_admin'],
                    "is_teacher": group_info['is_teacher'],
                    "is_staff": group_info['is_admin'],
                }
            )

            if not created:
                user.is_admin = group_info['is_admin']
                user.is_teacher = group_info['is_teacher']
                user.is_staff = group_info['is_admin']
                user.first_name = idinfo.get("given_name", user.first_name)
                user.family_name = idinfo.get("family_name", user.family_name)
                user.save()
            
            # Generate JWT tokens
            tokens = get_tokens_for_user(user)
            
            logger.info(f"User {email} authenticated successfully")
            
            # Return tokens and user info
            return Response({
                "access_token": tokens['access'],
                "refresh_token": tokens['refresh'],
                "user": {
                    "email": email,
                    "name": idinfo.get("name"),
                    "picture": idinfo.get("picture"),
                    "is_lab_admin": group_info['is_admin'],
                    "is_teacher": group_info['is_teacher'],
                    "is_student": group_info['is_student'],
                }
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            logger.warning(f"Invalid token error: {e}")
            return Response(
                {"error": "Invalid token"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.exception("Server error during Google authentication")
            return Response(
                {"error": "Server error"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TokenRefreshView(APIView):
    """
    Refresh access token using refresh token.
    """
    permission_classes = []
    
    def post(self, request):
        """
        Get new access token using refresh token.
        """
        refresh_token = request.data.get('refresh_token')
        
        if not refresh_token:
            return Response(
                {"error": "Refresh token required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            refresh = RefreshToken(refresh_token)
            
            return Response({
                "access_token": str(refresh.access_token)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": "Invalid refresh token"},
                status=status.HTTP_401_UNAUTHORIZED
            )