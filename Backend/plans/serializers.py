from rest_framework import serializers
from .models import Plan, Subscription


class PlanSerializer(serializers.ModelSerializer):   
    class Meta:
        model = Plan
        fields = '__all__'
class SubscriptionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  
   
    class Meta:
        model = Subscription
        fields = '__all__'