from rest_framework import generics, viewsets
from .models import Plan, Subscription
from .serializers import PlanSerializer, SubscriptionSerializer, TrainerSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from login.models import Trainer
from login.serializers import TrainerSerializer
from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from login.serializers import TrainerSerializer, UserSerializer
from plans.serializers import TrainerSerializer
from login.models import Trainer, User

from django.views.decorators.csrf import csrf_exempt





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


@csrf_exempt
@api_view(['POST'])
def process_payment(request):
    serializer = TrainerSerializer(data=request.data)
    
    if serializer.is_valid():
        trainee_id = request.data.get('id')
        trainer_id = request.data.get('id')

        try:
            trainee = User.objects.get(id=trainee_id)
            trainer = Trainer.objects.get(id=trainer_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Trainee not found'}, status=404)
        except Trainer.DoesNotExist:
            return JsonResponse({'error': 'Trainer not found'}, status=404)
        
        trainee_data = UserSerializer(trainee).data
        trainer_data = TrainerSerializer(trainer).data
        
        subject = 'New Trainee Assignment'
        message = f"""
            Hello {trainer_data['first_name']},

            A new trainee has been assigned to you. Here are the details:

            Trainee Name: {trainee_data['first_name']}
            Email: {trainee_data['email']}
            Phone: {trainee_data['phone']}

            Please get in touch with them soon!
        """
        
        send_mail(
            subject, 
            message, 
            settings.DEFAULT_FROM_EMAIL,  
            [trainer_data['email']],  
            fail_silently=False,
        )
        
        return JsonResponse({'message': 'Payment processed, email sent to the trainer'}, status=200)
    
    return JsonResponse({'error': 'Invalid data'}, status=400)



class SubscriptionViewSetById(viewsets.ModelViewSet):
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

    # Custom action to retrieve subscription by ID
    @action(detail=True, methods=['get'])
    def get_subscription_by_id(self, request, pk=None):
        try:
            subscription = self.get_object()
            serializer = self.get_serializer(subscription)
            return Response(serializer.data, status=200)
        except Subscription.DoesNotExist:
            return Response({'error': 'Subscription not found'}, status=404)
        

class SubscriptionByUserView(generics.ListAPIView):
    serializer_class = SubscriptionSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Subscription.objects.filter(user__id=user_id)