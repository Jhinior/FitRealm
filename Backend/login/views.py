from rest_framework import generics
from .models import Plan
from .serializers import PlanSerializer

# List all plans
class PlanList(generics.ListCreateAPIView):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer

# Retrieve, update, or delete a single plan
class PlanDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
