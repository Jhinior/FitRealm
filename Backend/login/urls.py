#urls.py

from django.urls import path
from .views import (TrainerListCreateAPIView,
                    TrainerDetailAPIView,
                    UserListCreateAPIView,
                    UserDetailAPIView,
                    UserSignupView,
                    UserLoginView,
                    TrainerSignupView,
                    TrainerLoginView,
                    SendCodeView,
                    CodeView,
                    UpdatePasswordView,
                    AvailableTrainersList,
                    UserLoginView,
                    LoginView,
                    PasswordResetView
                    )

urlpatterns = [
    # path('plans/', PlanList.as_view(), name='plan-list'),  # For listing and creating plans
    # path('plans/<int:pk>/', PlanDetail.as_view(), name='plan-detail'),  # For retrieving, updating, and deleting a specific plan

    path('trainers/', TrainerListCreateAPIView.as_view(),
         name='trainer-list-create'),
    path('trainers/<int:user_id>/', TrainerDetailAPIView.as_view(), name='trainer-detail'),

    path('users/', UserListCreateAPIView.as_view(), name='user-list-create'),
    #hwa da
    path('users/<int:pk>/', UserDetailAPIView.as_view(), name='user-detail'),

    path('signup/', UserSignupView.as_view(), name='signup'),
    # path('login/', UserLoginView.as_view(), name='login'),

    # path('signup/trainer/', TrainerSignupView.as_view(), name='trainer-signup'),
    path('login/trainer/', TrainerLoginView.as_view(), name='trainer-login'),

    path('reset-password/', SendCodeView.as_view(), name='send-code'),
    path('pass-code/', CodeView.as_view(), name='code'),
    path('update-password/', UpdatePasswordView.as_view(), name='update-password'),

    path('available-trainers/', AvailableTrainersList.as_view(), name='available-trainers'),

    path('loginall/', UserLoginView.as_view(), name='user_login'),


    path('signup/trainer/', TrainerSignupView.as_view(), name='trainer-signup'),

    path('login/', LoginView.as_view(), name='login'),

    path('api/password-reset/', PasswordResetView.as_view(), name='password_reset'),
]