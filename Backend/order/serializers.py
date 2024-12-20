# serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Order, OrderItem

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'first_name', 'last_name', 'phone']

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'user', 'first_name', 'last_name', 'email', 'address', 'created_at']

# class OrderItemSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = OrderItem
#         fields = ['id', 'order', 'product', 'price', 'quantity']

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'   # Include product_name in the fields


class OrderItemSerializer2(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    user = UserSerializer(source='order.user', read_only=True)  # Nested serializer for user details
    class Meta:
        model = OrderItem
        fields = ['user','id', 'order', 'product', 'product_name', 'price', 'quantity', 'payment']