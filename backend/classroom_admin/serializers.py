# classroom/serializers.py
from rest_framework import serializers
from .models import DisplayedCourse

class DisplayedCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisplayedCourse
        fields = '__all__'