from rest_framework import serializers
from .models import TeacherDisplayedCourse


class TeacherDisplayedCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherDisplayedCourse
        fields = ['id', 'course_id', 'name', 'section', 'alternate_link', 'teacher_email', 'created_at']
