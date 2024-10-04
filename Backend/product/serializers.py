# product/serializers.py
from rest_framework import serializers
from .models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        
class ProductSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = '__all__'
        
    def get_category(self, obj):
        """Returns the list of related categories."""
        categories = Category.objects.filter(products=obj).order_by("-id")
        return CategorySerializer(categories, many=True).data