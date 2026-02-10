from django.db import models
from appuser.models import CustomUser

class News(models.Model):
    NEWS_TYPE_CHOICES = [
        ('news', 'News'),
        ('event', 'Event'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    news_type = models.CharField(max_length=10, choices=NEWS_TYPE_CHOICES, default='news')
    author = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    
    # Social media sharing
    share_facebook = models.BooleanField(default=False)
    share_linkedin = models.BooleanField(default=False)
    facebook_post_id = models.CharField(max_length=255, blank=True, null=True)
    linkedin_post_id = models.CharField(max_length=255, blank=True, null=True)
    
    # Visibility
    is_visible = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'News'
    
    def __str__(self):
        return self.title


class NewsImage(models.Model):
    news = models.ForeignKey(News, related_name='images', on_delete=models.CASCADE)
    drive_file_id = models.CharField(max_length=255)
    drive_web_link = models.URLField()
    drive_thumbnail_link = models.URLField(blank=True, null=True)
    file_name = models.CharField(max_length=255)
    order = models.IntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.news.title} - Image {self.order}"