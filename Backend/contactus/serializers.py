 # serializers.py

from rest_framework import serializers

class FeedbackSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    message = serializers.CharField(max_length=1000)
