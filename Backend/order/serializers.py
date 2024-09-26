from rest_framework import serializers
from .models import Order, OrderItem
from product.models import Product

class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'price', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)  # Nested serializer to include order items
    user = serializers.StringRelatedField(read_only=True)  # Show the user's email or username

    class Meta:
        model = Order
        fields = ['id', 'user', 'first_name', 'last_name', 'email', 'address', 'zipcode', 'place', 'phone', 'size', 'created_at', 'items']
