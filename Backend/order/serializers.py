from rest_framework import serializers
from login.models import User  # Import User from your login app
from .models import Order, OrderItem

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'gender', 'weight', 'height', 'plan', 'subscribed_date', 'end_date', 'assigned_trainer']

class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Including user information
    email = serializers.EmailField(source='user.email', read_only=True)  # Adding email field

    class Meta:
        model = Order
        fields = ['id', 'user', 'first_name', 'last_name', 'email', 'address', 'zipcode', 'place', 'size', 'created_at']

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'price', 'quantity']
