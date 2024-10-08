from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from plans.models import Plan

class SuperUser(AbstractBaseUser):
    class Gender(models.TextChoices):
        MALE = "Male"
        FEMALE = "Female"

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=254, unique=True)
    gender = models.CharField(max_length=6, choices=Gender.choices, null=True)
    image = models.ImageField(upload_to="SuperUser", null=True, blank=True)
    phone = models.CharField(max_length=15, null=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        abstract = False

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

