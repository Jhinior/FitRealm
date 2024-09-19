from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.contrib.auth.hashers import make_password, check_password


# Create your models here.

class Plan(models.Model):
    
    class PlanNames(models.TextChoices):
        BASIC = "BASIC"
        STANDARD = "STANDARD"
        PREMIUM = "PREMIUM"
        
    plan_name = models.CharField(max_length=10,choices=PlanNames.choices)    
    cost = models.FloatField()

class SuperUser(AbstractBaseUser):
    
    class Gender(models.TextChoices):
        MALE = "Male" ,  
        FEMALE = "Female" , 
        
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=254, unique=True)
    gender = models.CharField(max_length=6,choices=Gender.choices)
    password = models.CharField(max_length=128)
    # image = models.ImageField(upload_to="posts",null=True)
    payment = models.CharField(max_length=150)
    
    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self.save()

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

class User(SuperUser):
    
    weight = models.FloatField()
    height = models.FloatField()
    
    
class Trainer(SuperUser):
    
    reviews = models.CharField(max_length=250)
    years_of_experience = models.IntegerField()
    avg_rating = models.FloatField()
    salary = models.FloatField()
    active_users = models.IntegerField()
    plan = models.ForeignKey(Plan,on_delete=models.SET_NULL, related_name="trainers",null=True)


    
    
    
    
    
    
   
    
    