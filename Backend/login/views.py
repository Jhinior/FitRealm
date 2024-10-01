from rest_framework import generics,status
from rest_framework.response import Response
from .models import Plan, Trainer, User
from .serializers import PlanSerializer, TrainerSerializer, UserSerializer, UserSignupSerializer, UserLoginSerializer
from .serializers import PlanSerializer, TrainerSerializer, UserSerializer, UserSignupSerializer, UserLoginSerializer, TrainerSignupSerializer, TrainerLoginSerializer

# SendGrid imports
from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .utils import send_email



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
            }
        }, status=status.HTTP_200_OK)
        
        

        
# Use the send_email function to send an email
# Email system Testing 
# @csrf_exempt
# def send_test_email(request):
#     to_email = 'fadyoops@gmail.com'
#     subject = 'Test Email'
#     html_content = '<p>Hello, this is a test email!</p>'
#     response = send_email(to_email, subject, html_content)
#     if response == 202:
#         return HttpResponse('Email sent successfully!')
#     else:
#         return JsonResponse({"message": 'Failed to send email.', "resp": response})