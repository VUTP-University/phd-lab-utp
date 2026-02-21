from django.db import models


class TeacherDisplayedCourse(models.Model):
    """Courses that a teacher has chosen to display in their dashboard."""
    course_id = models.CharField(max_length=255)
    name = models.CharField(max_length=500)
    section = models.CharField(max_length=255, blank=True, default="")
    alternate_link = models.URLField(max_length=500)
    teacher_email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('course_id', 'teacher_email')

    def __str__(self):
        return f"{self.name} ({self.teacher_email})"
