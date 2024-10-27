# # views.py

# from .serializers import LoginSerializer
# from rest_framework.permissions import AllowAny
# from .serializers import UserSignupSerializer, UserLoginSerializer, TrainerSignupSerializer, TrainerLoginSerializer, SendCodeSerializer
# from rest_framework import generics, status
# from rest_framework.response import Response
# from .models import Trainer, User
# from .serializers import PlanSerializer, TrainerSerializer, UserSerializer, UserSignupSerializer, UserLoginSerializer
# from .serializers import PlanSerializer, TrainerSerializer, UserSerializer, UserSignupSerializer, UserLoginSerializer, TrainerSignupSerializer, TrainerLoginSerializer, SendCodeSerializer,PasswordResetSerializer
# # SendGrid imports
# from django.utils.crypto import get_random_string
# from django.core.mail import send_mail
# from django.utils.translation import gettext_lazy as _

# from rest_framework.views import APIView
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from .utils import send_email, CodeGenerator
# from django.http import JsonResponse
# from django.views import View
# from django.core.cache import cache
# from django.contrib.auth.hashers import make_password
# import json
# from rest_framework.authtoken.views import ObtainAuthToken
# from rest_framework.authtoken.models import Token


# class TrainerListCreateAPIView(generics.ListCreateAPIView):
#     permission_classes = [AllowAny]
#     queryset = Trainer.objects.all()
#     serializer_class = TrainerSerializer


# class TrainerDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
#     # permission_classes = [AllowAny]
#     # queryset = Trainer.objects.all()
#     # serializer_class = TrainerSerializer
#     # lookup_field = 'pk'
#     permission_classes = [AllowAny]
#     serializer_class = TrainerSerializer
#     lookup_field = 'user_id'  # Specify lookup field for user_id instead of trainer pk

#     def get_queryset(self):
#         # Filter the Trainer objects by the user ID from the URL
#         user_id = self.kwargs['user_id']
#         return Trainer.objects.filter(user__id=user_id)



# class UserListCreateAPIView(generics.ListCreateAPIView):
#     permission_classes = [AllowAny]
#     queryset = User.objects.all()
#     serializer_class = UserSerializer


# class UserDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
#     permission_classes = [AllowAny]
#     queryset = User.objects.all()
#     serializer_class = UserSerializer


# @method_decorator(csrf_exempt, name='dispatch')
# class SendCodeView(generics.GenericAPIView):
#     serializer_class = SendCodeSerializer

#     def post(self, request, *args, **kwargs):
#         # Validate the request data
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         # If email is valid and exists, send response
#         email = serializer.validated_data['email']
#         code = CodeGenerator(email)
#         subject = "Reset Password Code"
#         message = f"Use this code to reset your password \n <h2>{code}</h2> \nDON'T SHARE THIS CODE."
#         print("email: ", email)
#         print("code: ", code)
#         response = send_email(email, subject, message)
#         if response == 202:
#             return Response({
#                 "message": "A code sent to your e-mail",
#                 "status": "success"
#             }, status=status.HTTP_200_OK)
#         else:
#             return Response({"status": "failed", "message": 'Failed to send email.', "resp": response})


# @method_decorator(csrf_exempt, name='dispatch')
# class CodeView(View):

#     def post(self, request, *args, **kwargs):
#         # Get the JSON body from the request
#         try:
#             data = json.loads(request.body)
#             email = data.get('email')
#             input_code = data.get('code')
#         except json.JSONDecodeError:
#             return JsonResponse({"message": "Invalid JSON"}, status=400)

#         # Retrieve the stored code from the cache
#         cache_key = f'verification_code_{email}'
#         stored_code = cache.get(cache_key)

#         if stored_code and str(stored_code) == input_code:
#             # If the code matches, return "ok"
#             return JsonResponse({"message": "ok"}, status=200)
#         else:
#             # If the code doesn't match or has expired, return an error message
#             return JsonResponse({"message": "invalid or expired code"}, status=400)


# @method_decorator(csrf_exempt, name='dispatch')  # Disable CSRF for this view
# class UpdatePasswordView(APIView):
#     def post(self, request):
#         data = request.data

#         email = data.get("email")
#         new_password = data.get("password")

#         if not email or not new_password:
#             return JsonResponse({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             # First, check if the email belongs to a User
#             user = User.objects.filter(email=email).first()

#             if not user:
#                 # If no User is found, check if it's a Trainer
#                 user = Trainer.objects.filter(email=email).first()

#             if not user:
#                 return JsonResponse({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

#             # Update and hash the password
#             user.password = make_password(new_password)
#             user.save()

#             # Send email confirmation
#             subject = "Password Changed"
#             message = f"Your password has been updated."
#             resp = send_email(email, subject, message)

#             if resp == 202:
#                 return JsonResponse({"status": "ok", "message": "Password updated successfully."}, status=status.HTTP_200_OK)
#             else:
#                 return JsonResponse({"status": "failed", "resp": resp})

#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# # create an API view to filter trainers with active_users__lt=10


# class AvailableTrainersList(generics.ListAPIView):
#     serializer_class = TrainerSerializer

#     def get_queryset(self):
#         return Trainer.objects.filter(active_users__lt=10)


# class UserLoginView2(ObtainAuthToken):
#     def post(self, request, *args, **kwargs):
#         serializer = self.serializer_class(
#             data=request.data, context={'request': request})
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data['user']
#         token, created = Token.objects.get_or_create(user=user)
#         return Response({
#             'token': token.key,
#             'user_id': user.pk,
#             'email': user.email,
#             'role': 'user' if isinstance(user, User) else 'trainer'
#         })


# # class UserSignupView(generics.CreateAPIView):
# #     permission_classes = [AllowAny]
# #     serializer_class = UserSignupSerializer

# #     def create(self, request, *args, **kwargs):
# #         serializer = self.get_serializer(data=request.data)
# #         serializer.is_valid(raise_exception=True)

# #         # Save the user instance
# #         user = serializer.save()

# #         # Avoid creating the token twice
# #         token, created = Token.objects.get_or_create(user=user)

# #         return Response({
# #             "message": "User created successfully!",
# #             "token": token.key  # Return the token key to the user
# #         }, status=status.HTTP_201_CREATED)


# class UserLoginView(generics.GenericAPIView):

#     serializer_class = UserLoginSerializer

#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data
#         return Response({
#             "message": "Login successful!",
#             "user": {
#                 "id": user.id,
#                 "first_name": user.first_name,
#                 "last_name": user.last_name,
#                 "email": user.email,
#             }
#         }, status=status.HTTP_200_OK)


# class TrainerSignupView(generics.CreateAPIView):
#     permission_classes = [AllowAny]

#     serializer_class = TrainerSignupSerializer

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         trainer = serializer.save()
#         return Response({"message": "Trainer created successfully!"}, status=status.HTTP_201_CREATED)


# class TrainerLoginView(generics.GenericAPIView):
#     permission_classes = [AllowAny]
#     serializer_class = TrainerLoginSerializer

#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         trainer = serializer.validated_data
#         token, created = Token.objects.get_or_create(
#             user=trainer.user)  # Ensure using trainer.user

#         return Response({
#             "message": "Login successful!",
#             'token': token.key,
#             'role': "trainer",
#             "trainer": {
#                 "id": trainer.user.id,  # Using trainer.user to get the ID
#                 "first_name": trainer.user.first_name,
#                 "last_name": trainer.user.last_name,
#                 "email": trainer.user.email,
#                 "reviews": trainer.reviews,
#                 "years_of_experience": trainer.years_of_experience,
#                 "avg_rating": trainer.avg_rating,
#                 "active_users": trainer.active_users,
#             }
#         }, status=status.HTTP_200_OK)


# class TrainerSignupView(generics.CreateAPIView):
#     permission_classes = [AllowAny]
#     queryset = Trainer.objects.all()
#     serializer_class = TrainerSignupSerializer

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)
#         headers = self.get_success_headers(serializer.data)
#         return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


# class LoginView(generics.GenericAPIView):
#     permission_classes = [AllowAny]
#     serializer_class = LoginSerializer

#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         user = serializer.validated_data['user']

#         # Get or create token for the user
#         token, created = Token.objects.get_or_create(user=user)

#         # Determine user role: 'trainer' or 'user'
#         if hasattr(user, 'trainer'):  # Check if the user is a Trainer
#             role = 'trainer'
#         else:
#             role = 'user'

#         return Response({
#             'token': token.key,
#             'user_id': user.id,
#             'email': user.email,
#             'role': role,  # Return the role in the response
#             'message': "Login successful!",
#         }, status=status.HTTP_200_OK)


# class UserSignupView(generics.GenericAPIView):
#     permission_classes = [AllowAny]
#     serializer_class = UserSignupSerializer
#     permission_classes = []  # Allow any user to sign up

#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.save()  # Save the user if validation passes

#         return Response({
#             "user": {
#                 "id": user.id,
#                 "email": user.email,
#                 "first_name": user.first_name,
#                 "last_name": user.last_name,
#             },
#             "message": "User created successfully!"
#         }, status=status.HTTP_201_CREATED)


# import random
# import string
# class PasswordResetView(generics.GenericAPIView):
#     permission_classes = [AllowAny]
#     serializer_class = PasswordResetSerializer

#     def generate_temp_password(self, length=8):
#         """Generate a random temporary password."""
#         characters = string.ascii_letters + string.digits + string.punctuation
#         return ''.join(random.choice(characters) for _ in range(length))

#     def post(self, request):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         email = serializer.validated_data['email']

#         # Generate a temporary password
#         temp_password = self.generate_temp_password()

#         # Update the user's password (make sure to hash it)
#         user = User.objects.get(email=email)
#         user.set_password(temp_password)
#         user.save()

#         # Send the email with the temporary password
#         send_mail(
#             'Password Reset Request',
#             f'Your temporary password is: {temp_password}\nPlease change it after logging in.',
#             'noreply@yourdomain.com',  # Replace with your actual email
#             [email],
#             fail_silently=False,
#         )

#         return Response({'detail': _('Temporary password sent.')}, status=status.HTTP_200_OK)
# views.py

from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.utils.translation import gettext_lazy as _
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.core.cache import cache
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views import View
import json
import random
import string
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound
from .models import Trainer, User
from .utils import send_email, CodeGenerator
from .serializers import (
    LoginSerializer, UserSignupSerializer, UserLoginSerializer,
    TrainerSignupSerializer, TrainerLoginSerializer, SendCodeSerializer,
    PasswordResetSerializer, PlanSerializer, TrainerSerializer, UserSerializer
)


# Trainer Views
class TrainerListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer


class TrainerDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    serializer_class = TrainerSerializer
    lookup_field = 'user_id'

    def get_object(self):
        return Trainer.objects.get(user__id=self.kwargs['user_id'])


class AvailableTrainersList(generics.ListAPIView):
    serializer_class = TrainerSerializer

    def get_queryset(self):
        return Trainer.objects.filter(active_users__lt=10)


# User Views
class UserListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserSignupView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSignupSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
            "message": "User created successfully!"
        }, status=status.HTTP_201_CREATED)


class TrainerSignupView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = TrainerSignupSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        trainer = serializer.save()
        return Response({"message": "Trainer created successfully!"}, status=status.HTTP_201_CREATED)


# Login Views
class UserLoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "message": "Login successful!",
            "token": token.key,
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
            }
        }, status=status.HTTP_200_OK)


class TrainerLoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = TrainerLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        trainer = serializer.validated_data
        token, created = Token.objects.get_or_create(user=trainer.user)
        return Response({
            "message": "Login successful!",
            'token': token.key,
            'role': "trainer",
            "trainer": {
                "id": trainer.user.id,
                "first_name": trainer.user.first_name,
                "last_name": trainer.user.last_name,
                "email": trainer.user.email,
                "reviews": trainer.reviews,
                "years_of_experience": trainer.years_of_experience,
                "avg_rating": trainer.avg_rating,
                "active_users": trainer.active_users,
            }
        }, status=status.HTTP_200_OK)


class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        role = 'trainer' if hasattr(user, 'trainer') else 'user'
        return Response({
            'token': token.key,
            'user_id': user.id,
            'email': user.email,
            'role': role,
            'message': "Login successful!",
        }, status=status.HTTP_200_OK)


# Password and Verification Code Management
@method_decorator(csrf_exempt, name='dispatch')
class SendCodeView(generics.GenericAPIView):
    serializer_class = SendCodeSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        code = CodeGenerator(email)
        subject = "Reset Password Code"
        message = f"Use this code to reset your password \n <h2>{code}</h2> \nDON'T SHARE THIS CODE."
        response = send_email(email, subject, message)
        if response == 202:
            return Response({"message": "A code sent to your e-mail", "status": "success"}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "failed", "message": 'Failed to send email.', "resp": response})


@method_decorator(csrf_exempt, name='dispatch')
class CodeView(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            email = data.get('email')
            input_code = data.get('code')
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON"}, status=400)

        cache_key = f'verification_code_{email}'
        stored_code = cache.get(cache_key)
        if stored_code and str(stored_code) == input_code:
            return JsonResponse({"message": "ok"}, status=200)
        else:
            return JsonResponse({"message": "invalid or expired code"}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class UpdatePasswordView(APIView):
    def post(self, request):
        data = request.data
        email = data.get("email")
        new_password = data.get("password")
        if not email or not new_password:
            return JsonResponse({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.filter(email=email).first() or Trainer.objects.filter(email=email).first()
            if not user:
                return JsonResponse({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
            
            user.set_password(new_password)
            user.save()

            subject = "Password Changed"
            message = "Your password has been updated."
            resp = send_email(email, subject, message)
            return JsonResponse(
                {"status": "ok", "message": "Password updated successfully."} if resp == 202 else {"status": "failed", "resp": resp},
                status=status.HTTP_200_OK if resp == 202 else status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PasswordResetView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetSerializer

    def generate_temp_password(self, length=8):
        characters = string.ascii_letters + string.digits + string.punctuation
        return ''.join(random.choice(characters) for _ in range(length))

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        temp_password = self.generate_temp_password()
        user = User.objects.get(email=email)
        user.set_password(temp_password)
        user.save()
        send_mail(
            'Password Reset Request',
            f'Your temporary password is: {temp_password}\nPlease change it after logging in.',
            'noreply@yourdomain.com',
            [email],
            fail_silently=False,
        )
        return Response({'detail': _('Temporary password sent.')}, status=status.HTTP_200_OK)


# class UsersByTrainerView(generics.ListAPIView):
#     serializer_class = UserSerializer
#     permission_classes = [AllowAny]

#     def get_queryset(self):
#         trainer_id = self.kwargs.get('trainer_id')
#         return User.objects.filter(assigned_trainer__id=trainer_id)


class UsersByTrainerUserIDView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def get_queryset(self):
        # Get the trainer based on the `user_id` in the URL
        try:
            trainer = Trainer.objects.get(user__id=self.kwargs['user_id'])
        except Trainer.DoesNotExist:
            raise NotFound("Trainer with the specified user_id does not exist.")

        # Filter users with the retrieved trainer as `assigned_trainer`
        return User.objects.filter(assigned_trainer=trainer)
    

class TrainerDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer
    lookup_field = 'id'  # Use 'id' as the lookup field