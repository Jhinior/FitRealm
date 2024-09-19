# product/views.py
from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer

class ProductDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    lookup_field = 'slug'  # This should match your model's slug field if needed

    def get_object(self):
        category_slug = self.kwargs.get('category_slug')
        product_slug = self.kwargs.get('product_slug')
        return Product.objects.get(slug=product_slug, category__slug=category_slug)
