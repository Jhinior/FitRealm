#serializers.py
from django.contrib.auth.password_validation import validate_password
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
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password', 'password_confirm', 'weight', 'height', 'gender', 'phone')
        
    def validate(self, attrs):
        # Check if password and password_confirm match
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        return attrs

    def create(self, validated_data):
        # Remove password_confirm from validated data as it is not needed in the creation
        validated_data.pop('password_confirm')

        # Create a new user instance and set the password
        user = User.objects.create(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            weight=validated_data.get('weight'),
            height=validated_data.get('height'),
            gender=validated_data.get('gender'),
            phone=validated_data.get('phone'),
        )
        
        user.set_password(validated_data['password'])  # Hash the password
        user.save()

        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = User.objects.filter(email=attrs['email']).first()
        if user is None or not user.check_password(attrs['password']):
            raise serializers.ValidationError("Invalid email or password.")
        return user


User = get_user_model()  # Get the custom User model

class TrainerSignupSerializer(serializers.ModelSerializer):
    # Nested serializer to handle user fields
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.EmailField(source='user.email')
    phone = serializers.CharField(source='user.phone')
    password = serializers.CharField(write_only=True, source='user.password')
    
    class Meta:
        model = Trainer
        fields = ['first_name', 'last_name', 'email', 'phone', 'password', 'reviews', 'years_of_experience', 'avg_rating', 'salary', 'active_users', 'plan']

    def create(self, validated_data):
        # Extract user-related data
        user_data = validated_data.pop('user')
        password = user_data.pop('password')
        
        # Create the User instance
        user = User.objects.create_user(**user_data)
        user.set_password(password)
        user.save()

        # Create the Trainer instance
        trainer = Trainer.objects.create(user=user, **validated_data)
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



from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework.authtoken.models import Token

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        # Authenticate user using email and password
        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if not user:
            raise serializers.ValidationError(_("Invalid login credentials."))

        # Ensure the user is active
        if not user.is_active:
            raise serializers.ValidationError(_("User account is disabled."))

        # Add user instance to validated data
        attrs['user'] = user
        return attrs
