from rest_framework import serializers
from .models import News, NewsImage

class NewsImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsImage
        fields = ['id', 'drive_file_id', 'drive_web_link', 'drive_thumbnail_link', 'file_name', 'order']


class NewsSerializer(serializers.ModelSerializer):
    images = NewsImageSerializer(many=True, read_only=True)
    author_name = serializers.CharField(source='author.first_name', read_only=True)
    
    class Meta:
        model = News
        fields = [
            'id', 'title', 'description', 'news_type', 
            'author_name', 'share_facebook', 'share_linkedin',
            'is_visible', 'created_at', 'updated_at', 'images'
        ]


class NewsCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ['title', 'description', 'news_type', 'share_facebook', 'share_linkedin', 'is_visible']