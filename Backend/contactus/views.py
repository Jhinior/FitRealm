from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Info
from .serializers import FeedbackSerializer  
from django.conf import settings  

@api_view(['GET'])
def get_contact_info(request):
    info = Info.objects.first()  
    return Response({
        'address': info.address,
        'phone': info.phone,
        'email': info.email,
    })

@api_view(['POST'])
def send_feedback(request):
    serializer = FeedbackSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    subject = serializer.validated_data['subject']
    email = serializer.validated_data['email']
    message = serializer.validated_data['message']

    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [settings.DEFAULT_FROM_EMAIL]  

    try:
        send_mail(
            subject,
            message,
            from_email,
            recipient_list,
            fail_silently=False,  
        )
    except Exception as e:
        return Response({'error': f'Failed to send feedback: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'success': 'Feedback sent successfully!'})
