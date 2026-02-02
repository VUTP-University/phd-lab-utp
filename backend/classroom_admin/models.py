from django.db import models


class DisplayedCourse(models.Model):
    course_id = models.CharField(max_length=32, unique=True)
    name = models.CharField(max_length=255)
    section = models.CharField(max_length=255, blank=True)
    alternate_link = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.course_id})"
