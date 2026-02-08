from django.db import models
from django.contrib.auth import get_user_model
from PIL import Image
from django.core.exceptions import ValidationError
from appuser.models import CustomUser
from django.utils.text import slugify
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


class News(models.Model):

    title = models.CharField(max_length=255)
    description = models.TextField()

    title_en = models.CharField(max_length=255, blank=True, null=True)
    desc_en = models.TextField(blank=True, null=True)
    slug =  models.SlugField(max_length=255, blank=True, null=True)
    slug_en = models.SlugField(max_length=255, blank=True, null=True)

    author = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="news"
    )
    def save(self, *args, **kwargs):
        if not self.slug_en and self.title_en:
            self.slug = slugify(self.title_en)

        if not self.slug and self.title:
            self.slug = slugify(self.title)    
        super().save(*args, **kwargs)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title



class NewsImage(models.Model):

    news = models.ForeignKey(
        News,
        related_name="images",
        on_delete=models.CASCADE
    )

    image = models.ImageField(
        upload_to="news_images/",
        validators=[validate_image]
    )

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # Auto resize + optimize
        img = Image.open(self.image.path)

        if img.width > MAX_WIDTH or img.height > MAX_HEIGHT:
            img.thumbnail((MAX_WIDTH, MAX_HEIGHT))
            img.save(self.image.path, optimize=True, quality=85)

    def __str__(self):
        return f"Image for {self.news.title}"
