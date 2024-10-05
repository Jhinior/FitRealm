from django.urls import path
from .views import get_contact_info, send_feedback

urlpatterns = [
    path('contactinfo/', get_contact_info, name='contact_info'),
    path('contactus/', send_feedback, name='send_feedback'),
]