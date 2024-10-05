from django.urls import path
from .api import PlanList, PlanDetail, SubscriptionViewSet

urlpatterns = [
    path('plans/', PlanList.as_view(), name='plan-list'),
    path('plans/<int:pk>/', PlanDetail.as_view(), name='plan-detail'),
    path('subscriptions/', SubscriptionViewSet.as_view({'get': 'list', 'post': 'create'}), name='subscription-list-create'),
  
]
