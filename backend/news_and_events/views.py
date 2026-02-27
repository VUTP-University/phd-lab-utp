from django.shortcuts import render, get_object_or_404
from django.conf import settings
from django.http import HttpResponse
from rest_framework.views import APIView, View
from rest_framework.response import Response
from rest_framework import status
from appuser.permissions import IsLabAdmin, IsLabAdminOrStudent
from appuser.google_drive_service import get_service_account_drive_service, setup_phd_lab_structure, upload_news_images
from .models import News, NewsImage
from .serializers import NewsSerializer, NewsCreateUpdateSerializer
from googleapiclient.http import MediaIoBaseDownload
import io
import logging

logger = logging.getLogger(__name__)


class NewsListCreateView(APIView):
    """List all visible news (public) or create news (admin only)"""
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return []  # Public access
        return [IsLabAdmin()]
    
    def get(self, request):
        """Get all visible news"""
        news = News.objects.filter(is_visible=True)
        serializer = NewsSerializer(news, many=True)
        return Response({'news': serializer.data})
    
    def post(self, request):
        """Create new news (admin only)"""
        user = request.user
        
        serializer = NewsCreateUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Create news
            news = serializer.save(author=user)
            
            # Handle image uploads if provided
            images = request.FILES.getlist('images')
            
            if images:
                service = get_service_account_drive_service()
                folders = setup_phd_lab_structure(service, admin_group_email=settings.ADMIN_GROUP)

                uploaded_images = upload_news_images(
                    service,
                    images,
                    news.id,
                    folders['news_media'],
                )
                
                # Save image records
                for img_data in uploaded_images:
                    NewsImage.objects.create(
                        news=news,
                        drive_file_id=img_data['file_id'],
                        drive_web_link=img_data['web_link'],
                        drive_thumbnail_link=img_data['thumbnail_link'],
                        file_name=img_data['file_name'],
                        order=img_data['order']
                    )
            
            logger.info(f"Admin {user.email} created news: {news.title}")
            
            return Response(
                NewsSerializer(news).data,
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            logger.exception(f"Error creating news: {e}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class NewsDetailView(APIView):
    """Get, update, or delete specific news"""
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return []  # Public access
        return [IsLabAdmin()]
    
    def get(self, request, news_id):
        """Get news details"""
        try:
            news = News.objects.get(id=news_id)
            
            # Non-admin users can only see visible news
            if not request.user.is_authenticated or not request.user.is_admin:
                if not news.is_visible:
                    return Response(
                        {"error": "News not found"},
                        status=status.HTTP_404_NOT_FOUND
                    )
            
            serializer = NewsSerializer(news)
            return Response(serializer.data)
            
        except News.DoesNotExist:
            return Response(
                {"error": "News not found"},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def put(self, request, news_id):
        """Update news (admin only)"""
        try:
            news = News.objects.get(id=news_id)
            
            serializer = NewsCreateUpdateSerializer(news, data=request.data, partial=True)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            
            # Handle new image uploads
            images = request.FILES.getlist('images')
            if images:
                service = get_service_account_drive_service()
                folders = setup_phd_lab_structure(service, admin_group_email=settings.ADMIN_GROUP)

                uploaded_images = upload_news_images(
                    service,
                    images,
                    news.id,
                    folders['news_media'],
                )
                
                for img_data in uploaded_images:
                    NewsImage.objects.create(
                        news=news,
                        drive_file_id=img_data['file_id'],
                        drive_web_link=img_data['web_link'],
                        drive_thumbnail_link=img_data['thumbnail_link'],
                        file_name=img_data['file_name'],
                        order=img_data['order']
                    )
            
            logger.info(f"Admin {request.user.email} updated news: {news.title}")
            
            return Response(NewsSerializer(news).data)
            
        except News.DoesNotExist:
            return Response(
                {"error": "News not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.exception(f"Error updating news: {e}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def delete(self, request, news_id):
        """Delete image from news (admin only)"""
        try:
            image_id = request.data.get('image_id')
            if not image_id:
                return Response(
                    {"error": "image_id required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            image = NewsImage.objects.get(id=image_id, news_id=news_id)
            
            # Delete from Drive (files are owned by the service account)
            service = get_service_account_drive_service()
            try:
                service.files().delete(fileId=image.drive_file_id).execute()
            except:
                pass  # File might already be deleted
            
            image.delete()
            
            logger.info(f"Admin {request.user.email} deleted image from news {news_id}")
            
            return Response({"message": "Image deleted"})
            
        except NewsImage.DoesNotExist:
            return Response(
                {"error": "Image not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class AdminNewsListView(APIView):
    """List all news for admin (including hidden)"""
    permission_classes = [IsLabAdmin]
    
    def get(self, request):
        news = News.objects.all()
        serializer = NewsSerializer(news, many=True)
        return Response({'news': serializer.data})


class NewsToggleVisibilityView(APIView):
    """Toggle news visibility"""
    permission_classes = [IsLabAdmin]
    
    def post(self, request, news_id):
        try:
            news = News.objects.get(id=news_id)
            news.is_visible = not news.is_visible
            news.save()
            
            logger.info(f"Admin {request.user.email} toggled visibility for news: {news.title}")
            
            return Response({
                "message": "Visibility toggled",
                "is_visible": news.is_visible
            })
            
        except News.DoesNotExist:
            return Response(
                {"error": "News not found"},
                status=status.HTTP_404_NOT_FOUND
            )
            

class NewsDetailTemplateView(View):
    """Serve news detail page with Open Graph meta tags"""
    
    def get(self, request, news_id):
        news = get_object_or_404(News, id=news_id, is_visible=True)
        
        # Get first image for OG tags — use our own proxy so crawlers can access it
        first_image = news.images.first()
        image_url = None
        if first_image:
            image_url = request.build_absolute_uri(f"/api/news/media/{first_image.drive_file_id}/")

        
        context = {
            'news': news,
            'image_url': image_url,
            'page_url': request.build_absolute_uri(),
        }

        return render(request, 'news/news_detail.html', context)


class DriveImageProxyView(View):
    """Stream a Google Drive image through the backend using the service account.

    This avoids CORB / CORS issues in the browser and works regardless of whether
    the file has public sharing enabled (the service account always has access).

    URL: /api/news/media/<file_id>/
    Optional query param: ?size=w400  (used only for cache-key differentiation)
    """

    def get(self, request, file_id):
        try:
            service = get_service_account_drive_service()

            # Fetch MIME type so we return the correct Content-Type header
            file_meta = service.files().get(
                fileId=file_id,
                fields='mimeType'
            ).execute()

            # Download the file content into memory
            media_request = service.files().get_media(fileId=file_id)
            fh = io.BytesIO()
            downloader = MediaIoBaseDownload(fh, media_request)
            done = False
            while not done:
                _, done = downloader.next_chunk()

            fh.seek(0)
            response = HttpResponse(
                fh.read(),
                content_type=file_meta.get('mimeType', 'image/jpeg'),
            )
            # Cache aggressively — images don't change after upload
            response['Cache-Control'] = 'public, max-age=86400'
            return response

        except Exception as e:
            logger.error(f"DriveImageProxy: could not fetch file {file_id}: {e}")
            return HttpResponse(status=404)