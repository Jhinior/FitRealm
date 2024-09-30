# models.py
from django.db import models
from django.contrib.auth import get_user_model
from login.models import User
from product.models import Product

class Order(models.Model):
    user = models.ForeignKey(User, related_name='orders', on_delete=models.CASCADE) 
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    address = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=20)
    place = models.CharField(max_length=100)
    size = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def _str_(self):
        return f"Order {self.id} by {self.first_name} {self.last_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.IntegerField(default=1)

    def _str_(self):
        return f"{self.quantity} x {self.product.name}"