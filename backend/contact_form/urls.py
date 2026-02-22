from django.urls import path
from . import views

urlpatterns = [
    path('send/', views.ContactFormView.as_view(), name='contact-form-send'),
]