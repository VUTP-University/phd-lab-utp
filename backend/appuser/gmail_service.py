import os
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from googleapiclient.discovery import build
from google.oauth2 import service_account

def get_gmail_service(user_email: str):
    """
    Create Gmail API service with domain-wide delegation.
    """
    SERVICE_ACCOUNT_FILE = os.path.join(
        os.path.dirname(__file__), 
        'service_account.json'
    )
    
    SCOPES = ['https://www.googleapis.com/auth/gmail.send']
    
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=SCOPES,
        subject=user_email  # Impersonate this user
    )
    
    service = build('gmail', 'v1', credentials=credentials)
    return service


def send_contact_form_email(name: str, email: str, subject: str, message: str):
    """
    Send contact form submission via Gmail API.
    
    Args:
        name: Sender's name
        email: Sender's email
        subject: Email subject
        message: Email message body
    
    Returns:
        dict: Gmail API response
    """
    # Email to send FROM (your domain email)
    sender_email = os.getenv('CONTACT_FORM_EMAIL', 'admission@utp.bg')
    
    # Email to send TO (can be same or different)
    recipient_email = os.getenv('CONTACT_FORM_RECIPIENT', 'admission@utp.bg')
    
    try:
        # Get Gmail service impersonating the sender email
        service = get_gmail_service(sender_email)
        
        # Create message
        mime_message = MIMEMultipart('alternative')
        mime_message['From'] = sender_email
        mime_message['To'] = recipient_email
        mime_message['Subject'] = f"Contact Form: {subject}"
        
        # HTML email body
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                        New Contact Form Submission
                    </h2>
                    
                    <div style="margin: 20px 0;">
                        <p style="margin: 10px 0;">
                            <strong style="color: #555;">Name:</strong> {name}
                        </p>
                        <p style="margin: 10px 0;">
                            <strong style="color: #555;">Email:</strong> 
                            <a href="mailto:{email}" style="color: #2563eb;">{email}</a>
                        </p>
                        <p style="margin: 10px 0;">
                            <strong style="color: #555;">Subject:</strong> {subject}
                        </p>
                    </div>
                    
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0; font-weight: bold; color: #555;">Message:</p>
                        <p style="margin: 10px 0; white-space: pre-wrap;">{message}</p>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #888;">
                        <p>This email was sent from the UTP PhD Lab contact form.</p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        # Plain text fallback
        text_body = f"""
New Contact Form Submission

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}

---
This email was sent from the UTP PhD Lab contact form.
        """
        
        # Attach both HTML and plain text
        mime_message.attach(MIMEText(text_body, 'plain'))
        mime_message.attach(MIMEText(html_body, 'html'))
        
        # Encode message
        raw_message = base64.urlsafe_b64encode(mime_message.as_bytes()).decode('utf-8')
        
        # Send via Gmail API
        message_body = {'raw': raw_message}
        sent_message = service.users().messages().send(
            userId='me',
            body=message_body
        ).execute()
        
        return {
            'success': True,
            'message_id': sent_message['id'],
        }
        
    except Exception as e:
        raise Exception(f"Failed to send email: {str(e)}")