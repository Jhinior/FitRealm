from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import PlanList, PlanDetail, SubscriptionViewSet, SubscriptionByUserView

router = DefaultRouter()
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')

urlpatterns = [
    path('plans/', PlanList.as_view(), name='plan-list'),
    path('plans/<int:pk>/', PlanDetail.as_view(), name='plan-detail'),
    path('', include(router.urls)),
    path('subscriptions/user/<int:user_id>/',
         SubscriptionByUserView.as_view(), name='subscriptions-by-user'),
]
