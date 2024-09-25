from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.contrib.postgres.fields import ArrayField
<<<<<<< HEAD

=======
from django.contrib.auth.hashers import make_password, check_password

# Create your models here.
>>>>>>> 854a673 (add images field)
class Plan(models.Model):
    class PlanNames(models.TextChoices):
        BASIC = "BASIC"
        STANDARD = "STANDARD"
        PREMIUM = "PREMIUM"
        
<<<<<<< HEAD
    plan_name = models.CharField(max_length=10, choices=PlanNames.choices)
=======
    plan_name = models.CharField(max_length=10,choices=PlanNames.choices)
>>>>>>> 854a673 (add images field)
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
<<<<<<< HEAD
    gender = models.CharField(max_length=6, choices=Gender.choices)
    image = models.ImageField(upload_to="SuperUser", null=True)
    phone = ArrayField(models.CharField(max_length=11), size=2)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        abstract = False

=======
    gender = models.CharField(max_length=6,choices=Gender.choices)
    image = models.ImageField(upload_to="uploads",null=True)
    phone = ArrayField(models.CharField(max_length=11),size=2)
    
>>>>>>> 854a673 (add images field)
class Trainer(SuperUser):
    reviews = models.CharField(max_length=250)
    years_of_experience = models.IntegerField()
    avg_rating = models.FloatField()
    salary = models.FloatField()
    active_users = models.IntegerField()
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, related_name="trainers", null=True)

class User(SuperUser):
<<<<<<< HEAD
    weight = models.FloatField()
    height = models.FloatField()
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, related_name="users", null=True)
    subscribed_date = models.DateField()
    end_date = models.DateField()
    assigned_trainer = models.ForeignKey(Trainer, on_delete=models.SET_NULL, related_name="users", null=True)
=======
    
    weight = models.FloatField()
    height = models.FloatField()
    plan = models.ForeignKey(Plan,on_delete=models.SET_NULL, related_name="users",null=True)
    subscribed_date = models.DateField()
    end_date = models.DateField()
    trainer = models.ForeignKey(Trainer,on_delete=models.SET_NULL,related_name="users",null=True)
    


    
    
    
    
    
    
   
    
    
>>>>>>> 854a673 (add images field)
