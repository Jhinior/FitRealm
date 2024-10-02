from django.db import models
from djmoney.models.fields import MoneyField

class Plan(models.Model):
    class PlanNames(models.TextChoices):
        BASIC = "BASIC"
        STANDARD = "STANDARD"
        PREMIUM = "PREMIUM"

    plan_name = models.CharField(max_length=10, choices=PlanNames.choices)
    description = models.CharField(max_length=355)
    cost = MoneyField(max_digits=14, decimal_places=2, default_currency='USD')  
    image = models.ImageField(upload_to="plans", null=True)

    def __str__(self):
        return f"{self.plan_name} - {self.cost}"
