#serializers.py

from rest_framework import serializers
from rest_framework.authtoken.models import Token
from .models import Trainer, User
from plans.models import Plan
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__' 

class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

User = get_user_model()

class UserSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # Create user
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password'],
        )
        # Return the user without saving the token here
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = User.objects.filter(email=attrs['email']).first()
        if user is None or not user.check_password(attrs['password']):
            raise serializers.ValidationError("Invalid email or password.")
        return user

class TrainerSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = Trainer
        fields = ['first_name', 'last_name', 'email', 'phone', 'gender', 'password', 'confirm_password', 'image', 'years_of_experience']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        trainer = Trainer(**validated_data)
        trainer.set_password(validated_data['password'])
        trainer.save()
        Token.objects.create(user=trainer)
        return trainer

class TrainerLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        trainer = Trainer.objects.filter(email=attrs['email']).first()
        if trainer is None or not trainer.check_password(attrs['password']):
            raise serializers.ValidationError("Invalid email or password.")
        return trainer

class SendCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists() and not Trainer.objects.filter(email=value).exists():
            raise ValidationError("Email not found in the database.")
        return value
