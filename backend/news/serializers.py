from rest_framework import serializers
from .models import News, NewsImage
from django.core.exceptions import ValidationError
from PIL import Image

MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB
MAX_WIDTH = 1920
MAX_HEIGHT = 1080

def validate_image(image):
    if image.size > MAX_FILE_SIZE:
        raise ValidationError("Image size must be less than 2MB")
    
    img = Image.open(image)
    img.verify()
    image.seek(0)
    img = Image.open(image)
    width, height = img.size
    if width > MAX_WIDTH or height > MAX_HEIGHT:
        raise ValidationError("Max resolution allowed is 1920x1080")


class NewsImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsImage
        fields = ['id', 'image', 'uploaded_at']

class NewsSerializer(serializers.ModelSerializer):
    images = NewsImageSerializer(many=True, read_only=True)
    author = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = News
        fields = [
            'id',
            'title',
            'title_en',
            'description',
            'desc_en',
            'slug',
            'author',
            'images',
            'created_at',
            'updated_at'
        ]

        def create(self, validated_data):
            author = self.context.get('author')
            return News.objects.create(author=author, **validated_data)