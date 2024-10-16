#models.py

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from plans.models import Plan
from rest_framework.authtoken.models import Token

class CustomUserManager(BaseUserManager):

    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        """Creates and returns a User with an email, first name, last name, and password."""
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        # Create a token for the user
        Token.objects.get_or_create(user=user)

        return user

    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        """Creates and returns a SuperUser with an email, first name, last name, and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, first_name, last_name, password, **extra_fields)

    def create_trainer(self, email, first_name, last_name, password=None, **extra_fields):
        """Creates and returns a Trainer with an email, first name, last name, and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)

        return self.create_user(email, first_name, last_name, password, **extra_fields)


class SuperUser(AbstractBaseUser, PermissionsMixin):  # Inherit PermissionsMixin
    class Gender(models.TextChoices):
        MALE = "Male"
        FEMALE = "Female"

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=254, unique=True)
    gender = models.CharField(max_length=6, choices=Gender.choices, null=True)
    image = models.ImageField(upload_to="SuperUser", null=True, blank=True)
    phone = models.CharField(max_length=15, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Important for admin access

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = CustomUserManager()  # Use the custom user manager

    def has_perm(self, perm, obj=None):
        """Check if the user has a specific permission."""
        return True  # Implement your permission logic here

    def has_module_perms(self, app_label):
        """Check if the user has permissions to view the app's models."""
        return True  # Implement your module permissions logic here


class User(SuperUser):
    weight = models.FloatField(null=True, blank=True)
    height = models.FloatField(null=True, blank=True)
    plan = models.ForeignKey('plans.Plan', on_delete=models.SET_NULL, related_name="users", null=True, blank=True)
    subscribed_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    assigned_trainer = models.ForeignKey('Trainer', on_delete=models.SET_NULL, related_name="users", null=True, blank=True)

    def save(self, *args, **kwargs):
        super(User, self).save(*args, **kwargs)


class Trainer(SuperUser):
    reviews = models.CharField(max_length=250)
    years_of_experience = models.IntegerField()
    avg_rating = models.FloatField(null=True)
    salary = models.FloatField(null=True)
    active_users = models.IntegerField(null=True)
    plan = models.ForeignKey('plans.Plan', on_delete=models.CASCADE, related_name="trainers", null=True)

    def save(self, *args, **kwargs):
        super(Trainer, self).save(*args, **kwargs)

