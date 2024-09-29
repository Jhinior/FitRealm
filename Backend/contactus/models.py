from django.db import models

# Create your models here.
class Info(models.Model):
    address = models.CharField(max_length=100)
    email = models.EmailField(max_length=50)
    phone = models.CharField(max_length=15)
    
    class Meta:
        verbose_name = ("Info")
        
    def __str__(self):
        return self.email