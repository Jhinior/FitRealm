from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer

class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetailAPIView(generics.GenericAPIView):
    serializer_class = ProductSerializer
    lookup_field = 'slug'

    def get_object(self):
        category_slug = self.kwargs.get('category_slug')
        product_slug = self.kwargs.get('product_slug')
        return Product.objects.get(slug=product_slug, category__slug=category_slug)

    def get(self, request, *args, **kwargs):
        product = self.get_object()
        serializer = self.get_serializer(product)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        product = self.get_object()
        serializer = self.get_serializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ProductListByCategoryAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        category_slug = self.kwargs.get('category_slug')
        return Product.objects.filter(category__slug=category_slug)


class ProductCreateAPIView(generics.CreateAPIView):
    serializer_class = ProductSerializer


class ProductDetailAPIView2(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'name'
    def get_object(self):
        name = self.kwargs.get('name')
        try:
            return super().get_object()
        except Product.DoesNotExist:
            print(f"Product with name '{name}' does not exist.")  # Debugging line
            raise