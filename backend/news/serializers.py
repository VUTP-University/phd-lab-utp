from rest_framework import serializers
from .models import News, NewsImage

class NewsImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsImage
        fields = ['id', 'image', 'uploaded_at']


class NewsSerializer(serializers.ModelSerializer):
    images = NewsImageSerializer(many=True, read_only=True)  # за GET
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=100000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    author = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = News
        fields = ['id', 'title', 'description', 'author', 'images', 'uploaded_images', 'created_at', 'updated_at']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        request = self.context.get('request')
        user = request.user
        news = News.objects.create(author=user, **validated_data)
        for image in uploaded_images:
            NewsImage.objects.create(news=news, image=image)

        return news
