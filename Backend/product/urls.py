# product/urls.py
from django.urls import path
from .views import ProductDetailAPIView

urlpatterns = [
    path('api/<slug:category_slug>/<slug:product_slug>/', ProductDetailAPIView.as_view(), name='product-detail-api'),
]
