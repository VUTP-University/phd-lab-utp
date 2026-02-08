from django.db import models
from appuser.models import CustomUser

class AIAnalysis(models.Model):
    """Store AI analysis results to avoid repeated API calls"""
    
    ANALYSIS_TYPES = [
        ('overall', 'Overall Performance'),
        ('course', 'Course Specific'),
        ('plan', 'Individual Plan'),
        ('chat', 'Chat Response'),
    ]
    
    student_email = models.EmailField()
    analysis_type = models.CharField(max_length=20, choices=ANALYSIS_TYPES)
    course_id = models.CharField(max_length=255, null=True, blank=True)  # For course-specific
    result = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.student_email} - {self.analysis_type} - {self.created_at}"


class AIUsageLog(models.Model):
    """Track API usage for rate limiting"""
    
    student_email = models.EmailField()
    analysis_type = models.CharField(max_length=20)
    tokens_used = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']