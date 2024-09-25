from django.urls import path
from .views import (PlanList, PlanDetail, TrainerListCreateAPIView,
    TrainerDetailAPIView,
    UserListCreateAPIView,
    UserDetailAPIView,
    )

urlpatterns = [
    path('plans/', PlanList.as_view(), name='plan-list'),  # For listing and creating plans
    path('plans/<int:pk>/', PlanDetail.as_view(), name='plan-detail'),  # For retrieving, updating, and deleting a specific plan
    
    path('trainers/', TrainerListCreateAPIView.as_view(), name='trainer-list-create'),
    path('trainers/<int:pk>/', TrainerDetailAPIView.as_view(), name='trainer-detail'),
    
    path('users/', UserListCreateAPIView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', UserDetailAPIView.as_view(), name='user-detail'),
]
