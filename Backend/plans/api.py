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
    def perform_create(self, serializer):
        # Save the subscription
        subscription = serializer.save()

        # Get the assigned trainer
        trainer = subscription.trainer

        # Increment the trainer's active_users count
        if trainer:
            trainer.active_users += 1
            trainer.save()
            
            