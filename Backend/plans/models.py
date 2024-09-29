from django.db import models
# from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
# from django.db import models
# from django.contrib.postgres.fields import ArrayField
# Create your models here.


class Plan(models.Model):
    class PlanNames(models.TextChoices):
        BASIC = "BASIC"
        STANDARD = "STANDARD"
        PREMIUM = "PREMIUM"
    plan_name = models.CharField(max_length=10, choices=PlanNames.choices)
    description = models.CharField(max_length=250)
    cost = models.FloatField()
    image = models.ImageField(upload_to="plans", null=True)
