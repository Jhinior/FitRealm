from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Info
from .serializers import FeedbackSerializer  
from django.conf import settings  
from django.http import JsonResponse


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
    
    if serializer.is_valid():
        subject = request.data.get('subject')
        email = request.data.get('email')
        message = request.data.get('message')
        serializer.save()

        
        data = {
            'subject': subject, 
            'email': email,
            'message': message
        }
        
        print(data)
        message = """
            New message: {}
            From: {}
        """.format(data['message'], data['email'])
        send_mail(data['subject'], message, '', ["fitrealm9@gmail.com"  ])
        
        return JsonResponse({'message': 'Feedback received successfully'}, status=200)
    
    return JsonResponse({'error': 'Invalid data'}, status=400)
