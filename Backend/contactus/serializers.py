from rest_framework import serializers
from .models import Info


   

class ContactSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    message = serializers.CharField()
