# contactus/urls.py
from django.urls import path
from django.urls import path
from .api import Contact

urlpatterns = [
    path('contacts/', Contact.as_view(), name='contact'),
  
]
