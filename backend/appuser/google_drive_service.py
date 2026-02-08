from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import logging

logger = logging.getLogger(__name__)

SERVICE_ACCOUNT_FILE = 'appuser/service_account.json'
SCOPES = ['https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/drive']

def get_drive_service(user_email):
    """Get Google Drive service impersonating a user"""
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=SCOPES,
        subject=user_email  # MUST impersonate to get storage quota
    )
    return build('drive', 'v3', credentials=creds)

def get_or_create_folder(service, folder_name, parent_id=None):
    """Get folder ID or create if doesn't exist"""
    query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
    if parent_id:
        query += f" and '{parent_id}' in parents"
    
    results = service.files().list(q=query, fields='files(id, name)').execute()
    folders = results.get('files', [])
    
    if folders:
        return folders[0]['id']
    
    folder_metadata = {
        'name': folder_name,
        'mimeType': 'application/vnd.google-apps.folder'
    }
    if parent_id:
        folder_metadata['parents'] = [parent_id]
    
    folder = service.files().create(body=folder_metadata, fields='id').execute()
    logger.info(f"Created folder: {folder_name} (ID: {folder['id']})")
    return folder['id']

def setup_phd_lab_structure(service):
    """Setup PhD-Lab folder structure"""
    phd_lab_id = get_or_create_folder(service, 'PhD-Lab')
    
    folders = {
        'individual_plans': get_or_create_folder(service, 'Individual Plans', phd_lab_id),
        'publications': get_or_create_folder(service, 'Publications', phd_lab_id),
        'news_media': get_or_create_folder(service, 'News Media', phd_lab_id),
    }
    
    return folders

def upload_file_to_drive(service, file_path, filename, folder_id, mime_type='application/pdf'):
    """Upload file to Google Drive folder"""
    try:
        file_metadata = {
            'name': filename,
            'parents': [folder_id]
        }
        
        media = MediaFileUpload(file_path, mimetype=mime_type, resumable=True)
        
        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id, name, webViewLink'
        ).execute()
        
        logger.info(f"Uploaded file: {filename} (ID: {file['id']})")
        
        return {
            'file_id': file['id'],
            'file_name': file['name'],
            'web_link': file['webViewLink']
        }
        
    except Exception as e:
        logger.exception(f"Error uploading file to Drive: {e}")
        raise

def share_file_with_users(service, file_id, emails, role='reader'):
    """Share a file with multiple users"""
    try:
        for email in emails:
            permission = {
                'type': 'user',
                'role': role,
                'emailAddress': email
            }
            
            service.permissions().create(
                fileId=file_id,
                body=permission,
                sendNotificationEmail=True,
                emailMessage='Your individual plan has been uploaded and shared with you.'
            ).execute()
            
            logger.info(f"Shared file {file_id} with {email}")
        
    except Exception as e:
        logger.exception(f"Error sharing file: {e}")
        raise