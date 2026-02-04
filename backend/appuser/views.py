"""
ENHANCED Google OAuth authentication view with DETAILED LOGGING.

This version logs every step of the authentication process to help
debug 403 errors.

Use this temporarily to figure out exactly where the failure occurs.
"""

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging
import traceback

from appuser.models import CustomUser
from appuser.group_utils import check_user_groups

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class GoogleAuthView(APIView):
    """
    Google OAuth2 Authentication View with detailed logging.
    """
    permission_classes = []  # Allow unauthenticated access to this view
    
    def post(self, request):
        """
        Authenticate user with Google OAuth token.
        """
        
        print("VIEW CALLED: GoogleAuthView.post")
        
        print("\n" + "="*70)
        print("GOOGLE AUTH REQUEST RECEIVED")
        print("="*70)
        
        # Log request details
        print(f"Request method: {request.method}")
        print(f"Request path: {request.path}")
        print(f"Request data keys: {list(request.data.keys())}")
        print(f"Request data: {request.data}")
        
        # Step 1: Extract token
        token_str = request.data.get("credential") or request.data.get("access_token")
        
        if not token_str:
            print("❌ FAILURE: No token provided")
            print(f"Available keys in request.data: {list(request.data.keys())}")
            logger.warning("Authentication attempt without token")
            return Response(
                {
                    "error": "No token provided",
                    "message": "Please provide 'credential' or 'access_token'",
                    "received_keys": list(request.data.keys())
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        print(f"✓ Token received (length: {len(token_str)} chars)")
        print(f"Token preview: {token_str[:50]}...")
        
        try:
            # Step 2: Verify token
            print("\n--- STEP 2: Verifying Google token ---")
            print(f"Using GOOGLE_CLIENT_ID: {settings.GOOGLE_CLIENT_ID[:30]}...")
            
            idinfo = id_token.verify_oauth2_token(
                token_str, 
                requests.Request(), 
                settings.GOOGLE_CLIENT_ID
            )
            
            print("✓ Token verification successful")
            print(f"Token info keys: {list(idinfo.keys())}")
            
            # Step 3: Extract email
            print("\n--- STEP 3: Extracting email ---")
            email = idinfo.get("email")
            
            if not email:
                print("❌ FAILURE: No email in token")
                logger.error("Token verification succeeded but no email in token")
                return Response(
                    {"error": "Invalid token: no email found"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            print(f"✓ Email extracted: {email}")
            print(f"Token subject (sub): {idinfo.get('sub')}")
            print(f"Token issuer: {idinfo.get('iss')}")
            print(f"Token audience: {idinfo.get('aud')}")
            
            # Step 4: Check group membership
            print("\n--- STEP 4: Checking group membership ---")
            logger.info(f"Checking group membership for {email}")
            
            group_info = check_user_groups(email)
            
            print(f"Group check result: {group_info}")
            print(f"  - is_admin: {group_info['is_admin']}")
            print(f"  - is_student: {group_info['is_student']}")
            print(f"  - is_authorized: {group_info['is_authorized']}")
            
            # Step 5: Check authorization
            print("\n--- STEP 5: Checking authorization ---")
            if not group_info['is_authorized']:
                print(f"❌ FAILURE: User {email} is NOT authorized")
                logger.warning(f"Unauthorized login attempt by {email}")
                return Response(
                    {
                        "error": "Access denied", 
                        "message": "You must be a member of the admin or student group to access this application.",
                        "email": email,
                        "checked_groups": {
                            "admin_group": group_info['is_admin'],
                            "student_group": group_info['is_student']
                        }
                    },
                    status=status.HTTP_403_FORBIDDEN
                )
            
            print(f"✓ User {email} IS authorized")
            
            # Step 6: Create or update user
            print("\n--- STEP 6: Creating/updating user in database ---")
            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    "first_name": idinfo.get("given_name", ""),
                    "family_name": idinfo.get("family_name", ""),
                    "google_sub": idinfo.get("sub"),
                    "is_admin": group_info['is_admin'],
                    "is_staff": group_info['is_admin'],
                }
            )

            if not created:
                print(f"User already exists, updating...")
                user.is_admin = group_info['is_admin']
                user.is_staff = group_info['is_admin']
                user.first_name = idinfo.get("given_name", user.first_name)
                user.family_name = idinfo.get("family_name", user.family_name)
                user.save()
                logger.info(f"Updated existing user: {email}")
            else:
                logger.info(f"Created new user: {email}")
            
            print(f"✓ User database record {'created' if created else 'updated'}")
            print(f"  - Email: {user.email}")
            print(f"  - Name: {user.get_full_name()}")
            print(f"  - Is Admin: {user.is_admin}")
            print(f"  - Is Active: {user.is_active}")

            # Step 7: Prepare response
            print("\n--- STEP 7: Preparing response ---")
            response_data = {
                "email": email,
                "name": idinfo.get("name"),
                "picture": idinfo.get("picture"),
                "is_lab_admin": group_info['is_admin'],
                "is_student": group_info['is_student'],
            }
            
            print(f"✓ Response data: {response_data}")
            
            logger.info(
                f"✓✓✓ SUCCESS: User {email} authenticated "
                f"(admin: {group_info['is_admin']}, student: {group_info['is_student']})"
            )
            
            print("\n" + "="*70)
            print("✓✓✓ AUTHENTICATION SUCCESSFUL")
            print("="*70 + "\n")
            
            return Response(response_data, status=status.HTTP_200_OK)

        except ValueError as e:
            print(f"\n❌ FAILURE: Token verification error")
            print(f"Error type: {type(e).__name__}")
            print(f"Error message: {str(e)}")
            print(f"Traceback:")
            traceback.print_exc()
            
            logger.warning(f"Invalid token error: {e}")
            return Response(
                {"error": "Invalid token", "details": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        except Exception as e:
            print(f"\n❌ FAILURE: Unexpected error")
            print(f"Error type: {type(e).__name__}")
            print(f"Error message: {str(e)}")
            print(f"Traceback:")
            traceback.print_exc()
            
            logger.exception("Server error during Google authentication")
            return Response(
                {"error": "Server error", "details": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )