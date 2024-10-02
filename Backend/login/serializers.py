from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Plan, Trainer, User

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

class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone', 'gender', 'password', 'confirm_password', 'image']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')  # Remove confirm_password before creating the user
        user = User(**validated_data)
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = User.objects.filter(email=attrs['email']).first()
        if user is None:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.check_password(attrs['password']):
            raise serializers.ValidationError("Invalid email or password.")
        return user

class TrainerSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = Trainer
        fields = ['first_name', 'last_name', 'email', 'phone', 'gender', 'password', 'confirm_password', 'image', 'reviews', 'years_of_experience', 'avg_rating', 'salary', 'active_users']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')  # Remove confirm_password before creating the trainer
        trainer = Trainer(**validated_data)
        trainer.set_password(validated_data['password'])  # Hash the password
        trainer.save()
        return trainer
    
class TrainerLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        trainer = Trainer.objects.filter(email=attrs['email']).first()
        if trainer is None:
            raise serializers.ValidationError("Invalid email or password.")
        if not trainer.check_password(attrs['password']):
            raise serializers.ValidationError("Invalid email or password.")
        return trainer
    
class SendCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        # Check if the email exists in the database
        if not User.objects.filter(email=value).exists():
            raise ValidationError("Email not found in the database.")
        return value