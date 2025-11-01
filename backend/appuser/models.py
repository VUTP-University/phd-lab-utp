from django.db import models

class CustomUser(models.Model):
    email = models.EmailField(unique=True, null=False, blank=False)
    first_name = models.CharField(max_length=150, blank=True)
    family_name = models.CharField(max_length=150, blank=True)
    google_sub = models.CharField(max_length=255, unique=True, null=True, blank=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = "email"
    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.family_name}"