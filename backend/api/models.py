from django.db import models
from appuser.models import CustomUser

class Course(models.Model):
    name = models.CharField(max_length=255)
    credits = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


class DoctoralProgram(models.Model):
    title = models.CharField(max_length=255)
    courses = models.ManyToManyField(Course, related_name="programs", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.title