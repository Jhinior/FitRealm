from rest_framework import serializers
from .models import Plan, Subscription
from login.models import Trainer



class PlanSerializer(serializers.ModelSerializer):   
    class Meta:
        model = Plan
        fields = '__all__'

class SubscriptionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Display user as a string representation
    trainer = serializers.PrimaryKeyRelatedField(queryset=Trainer.objects.filter(active_users__lt=10))
    class Meta:
        model = Subscription
        fields = '__all__'
        
class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = '__all__'