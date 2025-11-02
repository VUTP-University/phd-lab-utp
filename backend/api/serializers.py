from rest_framework import serializers
from .models import Course, DoctoralProgram

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["id", "name", "credits"]


class DoctoralProgramSerializer(serializers.ModelSerializer):
    courses = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Course.objects.all()
    )

    class Meta:
        model = DoctoralProgram
        fields = ["id", "title", "courses", "created_at", "created_by"]
        read_only_fields = ["created_by", "created_at"]

    def create(self, validated_data):
        courses = validated_data.pop("courses", [])
        program = DoctoralProgram.objects.create(**validated_data)
        program.courses.set(courses)
        return program
