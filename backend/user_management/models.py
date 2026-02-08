from django.db import models
from appuser.models import CustomUser


class StudentIndividualPlan(models.Model):
    student_email = models.EmailField()
    file_name = models.CharField(max_length=255)
    drive_file_id = models.CharField(max_length=255)
    drive_web_link = models.URLField()
    uploaded_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.student_email} - {self.file_name}"