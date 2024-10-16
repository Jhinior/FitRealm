from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import PlanList, PlanDetail, SubscriptionViewSet,SubscriptionViewSetById,SubscriptionByUserView

subscription_list = SubscriptionViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

subscription_detail = SubscriptionViewSetById.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

urlpatterns = [
    path('plans/', PlanList.as_view(), name='plan-list'),
    path('plans/<int:pk>/', PlanDetail.as_view(), name='plan-detail'),

    path('subscriptions/', SubscriptionViewSet.as_view({'get': 'list', 'post': 'create'}), name='subscription-list-create'),
    path('subscriptions/<int:pk>/', subscription_detail, name='subscription-detail'),

        path('subscriptions/user/<int:user_id>/', SubscriptionByUserView.as_view(), name='subscriptions-by-user'),
]