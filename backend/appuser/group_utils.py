import os
import logging
from google.oauth2 import service_account
from googleapiclient.discovery import build
from dotenv import load_dotenv
load_dotenv()


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVICE_ACCOUNT_FILE = os.path.join(BASE_DIR, 'appuser', 'service_account.json')
ADMIN_EMAIL = os.getenv('GOOGLE_ADMIN_EMAIL')
ADMIN_GROUP = os.getenv('GOOGLE_ADMIN_GROUP')
STUDENTS_GROUP = os.getenv('GOOGLE_STUDENTS_GROUP')
logger = logging.getLogger(__name__)


def _get_directory_service():
    """Helper function to create Google Directory service."""
    SCOPES = ['https://www.googleapis.com/auth/admin.directory.group.readonly']
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    ).with_subject(ADMIN_EMAIL)
    
    return build('admin', 'directory_v1', credentials=creds)


def is_user_in_group(user_email, group_email):
    """Check if a user is in a specific Google Group.
    Args:
        user_email (str): User's email address.
        group_email (str): Google Group email address.
    Returns:
        bool: True if user is in the group, False otherwise.
    """
    service = _get_directory_service()
    try:
        result = service.members().hasMember(
            groupKey=group_email,
            memberKey=user_email
        ).execute()
        return result.get('isMember', False)
    except Exception as e:
        logger.error(f"Error checking group membership for {user_email} in {group_email}: {e}")
        return False
    
    
def check_user_groups(user_email):
    """Check which groups a user belongs to.
    Args:
        user_email (str): User's email address.
    Returns:
        dict: Dictionary with 'is_admin', 'is_student', and 'is_authorized' keys.
    """
    is_admin = is_user_in_group(user_email, ADMIN_GROUP)
    is_student = is_user_in_group(user_email, STUDENTS_GROUP)
    
    return {
        'is_admin': is_admin,
        'is_student': is_student,
        'is_authorized': is_admin or is_student  # User must be in at least one group
    }