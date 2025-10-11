from django.db import models

# Create your models here.
class News(models.Model):
    author = models.CharField(max_length=100, default="anonymous")
    title = models.CharField(max_length=200)
    content = models.TextField()
    published_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
