# product/urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path('api/products/add', ProductCreateAPIView.as_view(), name='product-create-api'),
    path('api/products/<slug:category_slug>/', ProductListByCategoryAPIView.as_view(), name='product-list-by-category-api'),
    path('api/products/', ProductListAPIView.as_view(), name='product-list-api'),
    path('api/<slug:category_slug>/<slug:product_slug>/', ProductDetailAPIView.as_view(), name='product-detail-api'),
]
