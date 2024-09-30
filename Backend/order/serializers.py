# serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Order, OrderItem

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'first_name', 'last_name', 'mobile', 'full_name']

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'user', 'first_name', 'last_name', 'email', 'address', 'zipcode', 'place', 'size', 'created_at']

# class OrderItemSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = OrderItem
#         fields = ['id', 'order', 'product', 'price', 'quantity']

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'price', 'quantity']   # Include product_name in the fields