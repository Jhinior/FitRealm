from django.urls import path
from .views import OrderListCreateAPIView, OrderDetailAPIView, OrderItemListCreateView, OrderItemDetailView,OrderItemsByOrderView

urlpatterns = [
    path('orders/', OrderListCreateAPIView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', OrderDetailAPIView.as_view(), name='order-detail'),
    path('order-items/', OrderItemListCreateView.as_view(), name='order-item-list'),
    path('order-items/<int:pk>/', OrderItemDetailView.as_view(), name='order-item-detail'),
    path('orders/<int:order_id>/items/', OrderItemsByOrderView.as_view(), name='order-items-by-order'),  # New route

]
