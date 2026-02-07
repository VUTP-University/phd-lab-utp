import logging
from django.http import JsonResponse
from appuser.models import CustomUser
logger = logging.getLogger(__name__)
class UserAuthenticationMiddleware:
    """
    Optional middleware to log authentication attempts and
    provide additional security checks.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        # Log all API requests
        if request.path.startswith('/api/'):
            user_email = request.GET.get('email') or request.POST.get('email')
            if user_email:
                logger.info(f"API request to {request.path} by {user_email}")
        
        response = self.get_response(request)
        return response