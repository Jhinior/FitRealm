from rest_framework import generics,status
from rest_framework.response import Response
from .models import Plan, Trainer, User
from .serializers import PlanSerializer, TrainerSerializer, UserSerializer, UserSignupSerializer, UserLoginSerializer



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