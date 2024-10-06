from rest_framework import generics, viewsets
from .models import Plan, Subscription
from .serializers import PlanSerializer, SubscriptionSerializer    
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
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def active_users_min_10(self, request):
        # Filter trainers with at least 10 active users
        trainers = Trainer.objects.filter(active_users__gte=1)
        serializer = self.get_serializer(trainers, many=True)
        return Response(serializer.data)
