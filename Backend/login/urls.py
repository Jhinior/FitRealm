from django.urls import path
from .views import (TrainerListCreateAPIView,
                    TrainerDetailAPIView,
                    UserListCreateAPIView,
                    UserDetailAPIView,
                    UserSignupView,
                    UserLoginView,
                    TrainerSignupView,
                    TrainerLoginView,
                    # SendCodeView,
                    # CodeView,
                    # UpdatePasswordView
                    )

urlpatterns = [
    # path('plans/', PlanList.as_view(), name='plan-list'),  # For listing and creating plans
    # path('plans/<int:pk>/', PlanDetail.as_view(), name='plan-detail'),  # For retrieving, updating, and deleting a specific plan

    path('trainers/', TrainerListCreateAPIView.as_view(),
         name='trainer-list-create'),
    path('trainers/<int:pk>/', TrainerDetailAPIView.as_view(), name='trainer-detail'),

    path('users/', UserListCreateAPIView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', UserDetailAPIView.as_view(), name='user-detail'),

    path('signup/', UserSignupView.as_view(), name='signup'),
    path('login/', UserLoginView.as_view(), name='login'),

    path('signup/trainer/', TrainerSignupView.as_view(), name='trainer-signup'),
    path('login/trainer/', TrainerLoginView.as_view(), name='trainer-login'),
    # path('reset-password/', ResetPassword, name='reset-password')
]
