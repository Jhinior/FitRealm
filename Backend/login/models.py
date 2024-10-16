from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from rest_framework.authtoken.models import Token  # Import the Token model
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _

# Custom manager for User and SuperUser


class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name,
                          last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, first_name, last_name, password, **extra_fields)

# Gender choices


class Gender(models.TextChoices):
    MALE = 'Male', _('Male')
    FEMALE = 'Female', _('Female')

# SuperUser model inheriting from AbstractBaseUser and PermissionsMixin


class SuperUser(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=254, unique=True)
    gender = models.CharField(max_length=6, choices=Gender.choices, null=True)
    image = models.ImageField(upload_to="SuperUser", null=True, blank=True)
    phone = models.CharField(max_length=15, null=True)

    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

# User model inheriting from SuperUser


class User(SuperUser):
    weight = models.FloatField(null=True, blank=True)
    height = models.FloatField(null=True, blank=True)
    plan = models.ForeignKey('plans.Plan', on_delete=models.SET_NULL,
                             related_name="users", null=True, blank=True)
    subscribed_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    assigned_trainer = models.ForeignKey(
        'Trainer', on_delete=models.SET_NULL, related_name="users", null=True, blank=True)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

# Trainer model inheriting from User


class Trainer(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="trainer")
    reviews = models.CharField(max_length=250, null=True)
    years_of_experience = models.IntegerField()
    avg_rating = models.FloatField(null=True)
    salary = models.FloatField(null=True)
    # Ensure this line is present
    phone = models.CharField(max_length=15, blank=True, null=True)
    active_users = models.IntegerField(null=True)
    plan = models.ForeignKey(
        'plans.Plan', on_delete=models.CASCADE, related_name="trainers", null=True)

    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name}'
