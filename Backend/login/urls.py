from django.urls import path
from .views import PlanList, PlanDetail

urlpatterns = [
    path('plans/', PlanList.as_view(), name='plan-list'),  # For listing and creating plans
    path('plans/<int:pk>/', PlanDetail.as_view(), name='plan-detail'),  # For retrieving, updating, and deleting a specific plan
]
