import os
from django.conf import settings
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError
import logging

logger = logging.getLogger(__name__)

SERVICE_ACCOUNT_FILE = 'appuser/service_account.json'
SCOPES = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive',
]


def get_service_account_drive_service():
    """Return a Drive service that stores files in the designated admin account's Drive.

    Service accounts have no storage quota of their own (Google limitation), so we
    use OAuth delegation to impersonate the GOOGLE_ADMIN_EMAIL account as the fixed
    storage owner. This means PhD-Lab always lives in one place regardless of who
    triggers an upload — the central Drive of the designated admin account.
    """
    admin_email = settings.GOOGLE_ADMIN_EMAIL
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=SCOPES,
        subject=admin_email,  # Fixed owner — not the uploading user.
    )
    return build('drive', 'v3', credentials=creds)


def get_drive_service(user_email):
    """Return a Drive service impersonating a specific user (legacy helper).

    Prefer get_service_account_drive_service() for file storage so that the
    folder structure lives in one place regardless of who triggers the upload.
    """
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=SCOPES,
        subject=user_email,
    )
    return build('drive', 'v3', credentials=creds)


def get_or_create_folder(service, folder_name, parent_id=None):
    """Return the ID of an existing folder, creating it if it does not exist.

    The 'me' in owners filter ensures we only match folders owned by the
    authenticated user (GOOGLE_ADMIN_EMAIL), never folders that were merely
    shared with them by someone else. Without this, Drive would find a shared
    folder with the same name and then fail with 'insufficientParentPermissions'
    when we try to write into it.
    """
    query = (
        f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder'"
        " and trashed=false and 'me' in owners"
    )
    if parent_id:
        query += f" and '{parent_id}' in parents"

    results = service.files().list(q=query, fields='files(id, name)').execute()
    folders = results.get('files', [])

    if folders:
        return folders[0]['id']

    folder_metadata = {
        'name': folder_name,
        'mimeType': 'application/vnd.google-apps.folder',
    }
    if parent_id:
        folder_metadata['parents'] = [parent_id]

    folder = service.files().create(body=folder_metadata, fields='id').execute()
    logger.info(f"Created folder: {folder_name} (ID: {folder['id']})")
    return folder['id']


def _grant_permission(service, file_id, perm_type, email, role):
    """Create a Drive permission, silently ignoring duplicates or policy errors.

    perm_type: 'user' | 'group' | 'anyone'
    role:      'reader' | 'writer' | 'commenter'
    """
    try:
        body = {'type': perm_type, 'role': role}
        if email:
            body['emailAddress'] = email

        service.permissions().create(
            fileId=file_id,
            body=body,
            sendNotificationEmail=False,
        ).execute()
        logger.info(f"Granted {role} to {perm_type} {email or '*'} on {file_id}")
    except HttpError as e:
        if e.resp.status in (400, 403):
            # 400 = already shared / bad request
            # 403 = cannot share outside domain or permission denied
            logger.debug(
                f"Permission already exists or not allowed for {email} on {file_id}: {e}"
            )
        else:
            logger.exception(
                f"Unexpected error granting {perm_type} permission to {email} on {file_id}"
            )
            raise


def setup_phd_lab_structure(service, admin_group_email=None):
    """Create the PhD-Lab folder hierarchy inside the service account's Drive.

    Controlled by the GOOGLE_DRIVE_ROOT_FOLDER environment variable.

    If admin_group_email is supplied, the ROOT folder is shared with that group.
    Because Google Drive permission inheritance flows downward, all sub-folders
    and files created inside the root become visible to the group automatically —
    admins can browse the entire directory tree from their own Drive, not just
    see isolated files in "Shared with me".
    """
    root_folder_name = getattr(settings, 'GOOGLE_DRIVE_ROOT_FOLDER', 'PhD-Lab')
    phd_lab_id = get_or_create_folder(service, root_folder_name)

    # Share root with the admin group — inherits to all children.
    if admin_group_email:
        _grant_permission(service, phd_lab_id, 'group', admin_group_email, 'reader')

    folders = {
        'root': phd_lab_id,
        'individual_plans': get_or_create_folder(service, 'Individual Plans', phd_lab_id),
        'publications': get_or_create_folder(service, 'Publications', phd_lab_id),
        'news_media': get_or_create_folder(service, 'News Media', phd_lab_id),
    }

    return folders


def upload_file_to_drive(service, file_path, filename, folder_id, mime_type='application/pdf'):
    """Upload a file to a Google Drive folder and return its metadata."""
    try:
        file_metadata = {'name': filename, 'parents': [folder_id]}
        media = MediaFileUpload(file_path, mimetype=mime_type, resumable=True)

        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id, name, webViewLink',
        ).execute()

        logger.info(f"Uploaded file: {filename} (ID: {file['id']})")
        return {
            'file_id': file['id'],
            'file_name': file['name'],
            'web_link': file['webViewLink'],
        }

    except Exception as e:
        logger.exception(f"Error uploading file to Drive: {e}")
        raise


def share_file_with_users(service, file_id, emails, role='reader'):
    """Share a Drive item (file or folder) with individual users.

    No email notifications are sent. Duplicate grants are silently ignored.
    """
    for email in emails:
        _grant_permission(service, file_id, 'user', email, role)


def share_file_with_group(service, file_id, group_email, role='reader'):
    """Share a Drive item (file or folder) with a Google Group.

    No email notifications are sent. Duplicate grants are silently ignored.
    """
    _grant_permission(service, file_id, 'group', group_email, role)


def upload_news_images(service, images, news_id, news_media_folder_id):
    """Upload images to a per-news subfolder inside News Media.

    Images are made publicly viewable so they can be embedded in the public
    news page. Admin access is inherited from the root folder that was shared
    with the admin group in setup_phd_lab_structure — no per-file sharing needed.
    """
    news_folder_id = get_or_create_folder(service, f"news_{news_id}", news_media_folder_id)

    uploaded_images = []

    for idx, image in enumerate(images):
        try:
            temp_path = f'/tmp/{image.name}'
            with open(temp_path, 'wb+') as destination:
                for chunk in image.chunks():
                    destination.write(chunk)

            file_metadata = {'name': image.name, 'parents': [news_folder_id]}
            media = MediaFileUpload(temp_path, mimetype=image.content_type, resumable=True)

            file = service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id, name, webViewLink, thumbnailLink',
            ).execute()

            # Make publicly viewable for embedding in the public news page.
            _grant_permission(service, file['id'], 'anyone', None, 'reader')

            uploaded_images.append({
                'file_id': file['id'],
                'file_name': file['name'],
                'web_link': file['webViewLink'],
                'thumbnail_link': file.get('thumbnailLink', ''),
                'order': idx,
            })

            os.remove(temp_path)
            logger.info(f"Uploaded image: {image.name} to news_{news_id}")

        except Exception as e:
            logger.exception(f"Error uploading image {image.name}: {e}")
            continue

    return uploaded_images
