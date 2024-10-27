from rest_framework import generics, viewsets
from .models import Plan, Subscription
from .serializers import PlanSerializer, SubscriptionSerializer, TrainerSerializer, SubscriptionSerializer2
from rest_framework.decorators import action
from rest_framework.response import Response
from login.models import Trainer, User
from login.serializers import TrainerSerializer, UserSerializer
from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
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

    if isinstance(trainer_data['user'], dict):
        subject = 'New Trainee Assignment'
        message = f"""
            Hello {trainer_data['user']['first_name']},

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
            [trainer_data['user']['email']],
            fail_silently=False,
        )
    else:
        raise TypeError("Expected a dictionary for 'user' in trainer_data.")

def send_congratulatory_email(trainer, trainee, plan):
    trainee_data = UserSerializer(trainee).data
    trainer_data = TrainerSerializer(trainer).data

    subject = 'Congratulations on Your Subscription!'
    message = f"""
        Hello {trainee_data['first_name']},

        Congratulations on subscribing to the {plan.plan_name} plan! We are excited to help you on your fitness journey.

        Your assigned trainer is {trainer_data['user']['first_name']} {trainer_data['user']['last_name']}.
        Here’s how you can contact them:
        - Email: {trainer_data['user']['email']}
        - Phone: {trainer_data['user']['phone']}

        Feel free to reach out to them if you have any questions or need guidance with your plan.

        Welcome aboard, and let's reach those fitness goals together!

        Best regards,
        FitRealm Team
    """
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [trainee_data['email']],
        fail_silently=False,
    )

class SubscriptionViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer

    def perform_create(self, serializer):
        subscription = serializer.save()
        trainer = subscription.trainer
        plan = subscription.plan

        if trainer:
            trainer.active_users += 1
            trainer.save()
            send_trainer_email(trainer, subscription.user)  
            send_congratulatory_email(trainer, subscription.user, plan)  

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
        send_congratulatory_email(trainer, trainee, trainee.subscription.plan)  # Assumes plan is associated

        return JsonResponse({'message': 'Payment processed, email sent to the trainer and trainee'}, status=200)

    return JsonResponse({'error': 'Invalid data'}, status=400)

class SubscriptionByUserView(generics.ListAPIView):
    serializer_class = SubscriptionSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Subscription.objects.filter(user__id=user_id)

class SubscriptionViewSetById(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer

    def perform_create(self, serializer):
        subscription = serializer.save()
        trainer = subscription.trainer

        if trainer:
            trainer.active_users += 1
            trainer.save()

    @action(detail=True, methods=['get'])
    def get_subscription_by_id(self, request, pk=None):
        try:
            subscription = self.get_object()
            serializer = self.get_serializer(subscription)
            return Response(serializer.data, status=200)
        except Subscription.DoesNotExist:
            return Response({'error': 'Subscription not found'}, status=404)


from rest_framework.exceptions import NotFound
class TrainerSubscriptionsView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = SubscriptionSerializer2
    lookup_field = 'user_id'

    def get_object(self):
        # Retrieve the Trainer object based on the user_id
        try:
            return Trainer.objects.get(user__id=self.kwargs['user_id'])
        except Trainer.DoesNotExist:
            raise NotFound("Trainer not found for this user.")

    def get_queryset(self):
        trainer = self.get_object()
        # Retrieve all subscriptions for users with the same trainer
        return Subscription.objects.filter(trainer=trainer)
