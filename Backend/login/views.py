from rest_framework import generics, status
from rest_framework.response import Response
from .models import Trainer, User
from .serializers import PlanSerializer, TrainerSerializer, UserSerializer, UserSignupSerializer, UserLoginSerializer
from .serializers import PlanSerializer, TrainerSerializer, UserSerializer, UserSignupSerializer, UserLoginSerializer, TrainerSignupSerializer, TrainerLoginSerializer, SendCodeSerializer

# SendGrid imports
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .utils import send_email, CodeGenerator
from django.http import JsonResponse
from django.views import View
from django.core.cache import cache
from django.contrib.auth.hashers import make_password
import json


# # List all plans
# class PlanList(generics.ListCreateAPIView):
#     queryset = Plan.objects.all()
#     serializer_class = PlanSerializer


# # Retrieve, update, or delete a single plan
# class PlanDetail(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Plan.objects.all()
#     serializer_class = PlanSerializer


class TrainerListCreateAPIView(generics.ListCreateAPIView):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer


class TrainerDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer


class UserListCreateAPIView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserSignupView(generics.CreateAPIView):
    serializer_class = UserSignupSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()  # Save the new user
        return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)


class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data  # This returns the user instance
        return Response({
            "message": "Login successful!",
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "phone": user.phone,
                "gender": user.gender,
                "role": "user",

            }
        }, status=status.HTTP_200_OK)


class TrainerSignupView(generics.CreateAPIView):
    serializer_class = TrainerSignupSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        trainer = serializer.save()  # Save the new trainer
        return Response({"message": "Trainer created successfully!"}, status=status.HTTP_201_CREATED)


class TrainerLoginView(generics.GenericAPIView):
    serializer_class = TrainerLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        trainer = serializer.validated_data  # This returns the trainer instance
        return Response({
            "message": "Login successful!",
            "trainer": {
                "id": trainer.id,
                "first_name": trainer.first_name,
                "last_name": trainer.last_name,
                "email": trainer.email,
                "phone": trainer.phone,
                "gender": trainer.gender,
                "reviews": trainer.reviews,
                "years_of_experience": trainer.years_of_experience,
                "avg_rating": trainer.avg_rating,
                "salary": trainer.salary,
                "active_users": trainer.active_users,
                "role": "trainer",
            }
        }, status=status.HTTP_200_OK)

# Forget Password - Send Verfication Code 
@method_decorator(csrf_exempt, name='dispatch')
class SendCodeView(generics.GenericAPIView):
    serializer_class = SendCodeSerializer

    def post(self, request, *args, **kwargs):
        # Validate the request data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # If email is valid and exists, send response
        email = serializer.validated_data['email']
        code = CodeGenerator(email)
        subject = "Reset Password Code"
        message = f"Use this code to reset your password \n <h2>{code}</h2> \nDON'T SHARE THIS CODE."
        print("email: ",email)
        print("code: ",code)
        response = send_email(email, subject, message)
        if response == 202:
            return Response({
            "message": "A code sent to your e-mail",
            "status" : "success"
        }, status=status.HTTP_200_OK)
        else:
            return Response({"status":"failed","message": 'Failed to send email.', "resp": response})

@method_decorator(csrf_exempt, name='dispatch')
class CodeView(View):

    def post(self, request, *args, **kwargs):
        # Get the JSON body from the request
        try:
            data = json.loads(request.body)
            email = data.get('email')
            input_code = data.get('code')
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON"}, status=400)

        # Retrieve the stored code from the cache
        cache_key = f'verification_code_{email}'
        stored_code = cache.get(cache_key)

        if stored_code and str(stored_code) == input_code:
            # If the code matches, return "ok"
            return JsonResponse({"message": "ok"}, status=200)
        else:
            # If the code doesn't match or has expired, return an error message
            return JsonResponse({"message": "invalid or expired code"}, status=400)


@method_decorator(csrf_exempt, name='dispatch')  # Disable CSRF for this view
class UpdatePasswordView(APIView):
    def post(self, request):
        data = request.data

        email = data.get("email")
        new_password = data.get("password")

        if not email or not new_password:
            return JsonResponse({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # First, check if the email belongs to a User
            user = User.objects.filter(email=email).first()

            if not user:
                # If no User is found, check if it's a Trainer
                user = Trainer.objects.filter(email=email).first()

            if not user:
                return JsonResponse({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

            # Update and hash the password
            user.password = make_password(new_password)
            user.save()

            # Send email confirmation
            subject = "Password Changed"
            message = f"Your password has been updated."
            resp = send_email(email, subject, message)

            if resp == 202:
                return JsonResponse({"status": "ok", "message": "Password updated successfully."}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({"status": "failed", "resp": resp})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# create an API view to filter trainers with active_users__lt=10
class AvailableTrainersList(generics.ListAPIView):
    serializer_class = TrainerSerializer

    def get_queryset(self):
        return Trainer.objects.filter(active_users__lt=10)