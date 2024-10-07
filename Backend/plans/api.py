from rest_framework import generics, viewsets
from .models import Plan, Subscription
from .serializers import PlanSerializer, SubscriptionSerializer, TrainerSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from login.models import Trainer



class PlanList(generics.ListCreateAPIView):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer


class PlanDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer

class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer

