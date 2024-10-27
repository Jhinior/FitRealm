# serializers.py
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import authenticate
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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class UserSerializer2(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name', 'last_name', 'email', 'phone', 'weight', 'height',
                  'plan', 'subscribed_date', 'end_date', 'assigned_trainer', 'gender', 'image']
        # Make email read-only to avoid updating it
        read_only_fields = ['email']

    def update(self, instance, validated_data):
        # Prevent email field from being updated if it's already set
        validated_data.pop('email', None)

        return super().update(instance, validated_data)


User = get_user_model()


class TrainerSerializer(serializers.ModelSerializer):
    user = UserSerializer2()  # This allows editing the related User data

    class Meta:
        model = Trainer
        fields = ['user', 'reviews', 'years_of_experience', 'id',
                  'avg_rating', 'salary', 'active_users', 'plan']

    # Override the update method to handle updates for both Trainer and nested User
    def update(self, instance, validated_data):
        # Pop the 'user' data out of the validated_data, so we can update the user separately
        user_data = validated_data.pop('user', None)

        # Update the Trainer fields
        instance.reviews = validated_data.get('reviews', instance.reviews)
        instance.years_of_experience = validated_data.get(
            'years_of_experience', instance.years_of_experience)
        instance.avg_rating = validated_data.get(
            'avg_rating', instance.avg_rating)
        instance.salary = validated_data.get('salary', instance.salary)
        instance.active_users = validated_data.get(
            'active_users', instance.active_users)
        instance.plan = validated_data.get('plan', instance.plan)
        instance.save()

        # Update the related User model if data is provided
        if user_data:
            user = instance.user
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            user.email = user_data.get('email', user.email)
            user.gender = user_data.get('gender', user.gender)
            user.image = user_data.get('image', user.image)
            user.phone = user_data.get('phone', user.phone)
            user.weight = user_data.get('weight', user.weight)
            user.height = user_data.get('height', user.height)
            user.plan = user_data.get('plan', user.plan)
            user.subscribed_date = user_data.get(
                'subscribed_date', user.subscribed_date)
            user.end_date = user_data.get('end_date', user.end_date)
            user.assigned_trainer = user_data.get(
                'assigned_trainer', user.assigned_trainer)
            user.save()

        return instance


class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password',
                  'password_confirm', 'weight', 'height', 'gender', 'phone')

    def validate(self, attrs):
        # Check if password and password_confirm match
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

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
        fields = ['first_name', 'last_name', 'email', 'phone', 'password', 'reviews',
                  'years_of_experience', 'avg_rating', 'salary', 'active_users', 'plan']

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
        # Retrieve the user associated with the trainer by email
        user = User.objects.filter(email=attrs['email']).first()

        if user is None or not user.check_password(attrs['password']):
            raise serializers.ValidationError("Invalid email or password.")

        # Check if the user is a trainer
        try:
            trainer = user.trainer
        except Trainer.DoesNotExist:
            raise serializers.ValidationError("User is not a trainer.")

        return trainer


class SendCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists() and not Trainer.objects.filter(email=value).exists():
            raise ValidationError("Email not found in the database.")
        return value


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        # Authenticate user using email and password
        user = authenticate(request=self.context.get(
            'request'), email=email, password=password)

        if not user:
            raise serializers.ValidationError(_("Invalid login credentials."))

        # Ensure the user is active
        if not user.is_active:
            raise serializers.ValidationError(_("User account is disabled."))

        # Add user instance to validated data
        attrs['user'] = user
        return attrs


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError(_('User with this email does not exist.'))
        return value