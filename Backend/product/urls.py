# product/urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path('api/products/', ProductListAPIView.as_view(), name='product-list-api'),
    path('api/<slug:category_slug>/<slug:product_slug>/', ProductDetailAPIView.as_view(), name='product-detail-api'),
]
