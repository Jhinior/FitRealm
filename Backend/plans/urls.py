from django.urls import path
from .api import PlanList, PlanDetail

urlpatterns = [
    # For listing and creating plans
    path('plans/', PlanList.as_view(), name='plan-list'),
    # For retrieving, updating, and deleting a specific plan
    path('plans/<int:pk>/', PlanDetail.as_view(), name='plan-detail')
  
]
