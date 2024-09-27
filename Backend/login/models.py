from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

class Plan(models.Model):
    class PlanNames(models.TextChoices):
        BASIC = "BASIC"
        STANDARD = "STANDARD"
        PREMIUM = "PREMIUM"
        
    plan_name = models.CharField(max_length=10, choices=PlanNames.choices)
    description = models.CharField(max_length=250)    
    cost = models.FloatField()
    image = models.ImageField(upload_to="plans", null=True)

class SuperUser(AbstractBaseUser):
    class Gender(models.TextChoices):
        MALE = "Male"
        FEMALE = "Female"

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=254, unique=True)
    gender = models.CharField(max_length=6, choices=Gender.choices)
    image = models.ImageField(upload_to="SuperUser", null=True)
    phone = models.CharField(max_length=15)  # Adjusted to CharField for a single phone number
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        abstract = False


class User(SuperUser):
    weight = models.FloatField(null=True, blank=True)
    height = models.FloatField(null=True, blank=True)
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, related_name="users", null=True)
    subscribed_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    assigned_trainer = models.ForeignKey('Trainer', on_delete=models.SET_NULL, related_name="users", null=True)

    def save(self, *args, **kwargs):
        # Additional logic for saving user if needed
        super(User, self).save(*args, **kwargs)

class Trainer(SuperUser):
    reviews = models.CharField(max_length=250)
    years_of_experience = models.IntegerField()
    avg_rating = models.FloatField()
    salary = models.FloatField()
    active_users = models.IntegerField()
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, related_name="trainers", null=True)
