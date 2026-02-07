from googleapiclient.discovery import build
from google.oauth2 import service_account
from django.conf import settings



# Load service account file 
SERVICE_ACCOUNT_FILE = settings.SERVICE_ACCOUNT_FILE

# Define the required scopes for Google Admin SDK
SCOPES = ['https://www.googleapis.com/auth/admin.directory.group',
            'https://www.googleapis.com/auth/admin.directory.group.member',
            'https://www.googleapis.com/auth/admin.directory.group.readonly',]

# Create credentials using the service account file and impersonate the admin user
creds = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE,
    scopes=SCOPES,
    subject = settings.GOOGLE_ADMIN_EMAIL
)

def get_group_members(group_email):
    """Get all members of a Google Group"""
    service = build('admin', 'directory_v1', credentials=creds)
    members = service.members().list(groupKey=group_email).execute()
    return [m['email'] for m in members.get('members', [])]

def add_user_to_group(email, group_email):
    """Add user to Google Group"""
    service = build('admin', 'directory_v1', credentials=creds)
    body = {"email": email, "role": "MEMBER"}
    service.members().insert(groupKey=group_email, body=body).execute()
    return True

def remove_user_from_group(email, group_email):
    """Remove user from Google Group"""
    service = build('admin', 'directory_v1', credentials=creds)
    service.members().delete(groupKey=group_email, memberKey=email).execute()
    return True