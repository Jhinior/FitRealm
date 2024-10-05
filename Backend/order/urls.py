from django.urls import path
from .views import  OrderDetailAPIView, OrderItemListCreateView, OrderItemDetailView,OrderItemsByOrderView
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderListViewSet
router = DefaultRouter()
router.register(r'orders', OrderListViewSet)
urlpatterns = [
    path('list/', include(router.urls)),  # Include the router URLs
    path('orders/<int:pk>/', OrderDetailAPIView.as_view(), name='order-detail'),
    path('order-items/', OrderItemListCreateView.as_view(), name='order-item-list'),
    path('order-items/<int:pk>/', OrderItemDetailView.as_view(), name='order-item-detail'),
    path('orders/<int:order_id>/items/', OrderItemsByOrderView.as_view(), name='order-items-by-order'),  # New route

]