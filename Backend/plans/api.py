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
    
def send_trainer_email(trainer, trainee):
    trainee_data = UserSerializer(trainee).data
    trainer_data = TrainerSerializer(trainer).data

    subject = 'New Trainee Assignment'
    message = f"""
        Hello {trainer_data['first_name']},

        A new trainee has been assigned to you. Here are the details:
        A new trainee has been assigned to you. Here are the details:

        Trainee Name: {trainee_data['first_name']}
        Email: {trainee_data['email']}
        Phone: {trainee_data['phone']}
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

class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer

    def perform_create(self, serializer):
        subscription = serializer.save()
        trainer = subscription.trainer
        trainee = subscription.user
        trainee = subscription.user

        if trainer and trainee:
        if trainer and trainee:
            trainer.active_users += 1
            trainer.save()
            send_trainer_email(trainer, trainee)
            send_trainer_email(trainer, trainee)

    @action(detail=True, methods=['get'])
    def get_subscription_by_id(self, request, pk=None):
        try:
            subscription = self.get_object()
            serializer = self.get_serializer(subscription)
            return Response(serializer.data, status=200)
        except Subscription.DoesNotExist:
            return Response({'error': 'Subscription not found'}, status=404)

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

        send_trainer_email(trainer, trainee)

        return JsonResponse({'message': 'Payment processed, email sent to the trainer'}, status=200)

    return JsonResponse({'error': 'Invalid data'}, status=400)

