import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from appuser.gmail_service import send_contact_form_email

logger = logging.getLogger(__name__)


class ContactFormView(APIView):
    """
    Handle contact form submissions.
    Public endpoint - no authentication required.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Send contact form email.
        
        Expected payload:
        {
            "name": "John Doe",
            "email": "john@example.com",
            "subject": "Question about PhD program",
            "message": "I would like to know more about..."
        }
        """
        # Validate required fields
        required_fields = ['name', 'email', 'subject', 'message']
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        
        if missing_fields:
            return Response(
                {
                    "error": "Missing required fields",
                    "missing_fields": missing_fields
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get form data
        name = request.data.get('name').strip()
        email = request.data.get('email').strip()
        subject = request.data.get('subject').strip()
        message = request.data.get('message').strip()
        
        # Basic validation
        if len(name) < 2:
            return Response(
                {"error": "Name must be at least 2 characters"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if '@' not in email or '.' not in email:
            return Response(
                {"error": "Invalid email address"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(subject) < 3:
            return Response(
                {"error": "Subject must be at least 3 characters"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(message) < 10:
            return Response(
                {"error": "Message must be at least 10 characters"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Rate limiting check (optional but recommended)
        # You can implement Redis-based rate limiting here
        
        try:
            # Send email
            logger.info(f"Sending contact form email from {email}")
            result = send_contact_form_email(name, email, subject, message)
            
            logger.info(f"Contact form email sent successfully. Message ID: {result['message_id']}")
            
            return Response(
                {
                    "success": True,
                    "message": "Your message has been sent successfully!"
                },
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            logger.exception(f"Error sending contact form email: {e}")
            return Response(
                {
                    "error": "Failed to send message. Please try again later.",
                    "details": str(e) if logger.level == logging.DEBUG else None
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )