from rest_framework import serializers
from .models import Plan, Subscription
from login.models import Trainer



class PlanSerializer(serializers.ModelSerializer):   
    class Meta:
        model = Plan
        fields = '__all__'
class SubscriptionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Showing related user as a string
    trainerswithmin_active_users = serializers.SerializerMethodField()  # Custom field

    class Meta:
        model = Subscription
        fields = '__all__'

    # Correct method name
    def get_trainers_with_min_active_users(self, obj):
        # Filter trainers with at least 10 active users
        trainers = Trainer.objects.filter(active_users__gte=10)
        # You can serialize the trainer data or just return their names
        return [f"{trainer.first_name} {trainer.last_name}" for trainer in trainers]
        
class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = '__all__'