from django.shortcuts import render
from django.core.mail import send_mail
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ContactSerializer  

@method_decorator(csrf_exempt, name='dispatch')  
class ContactUsView(APIView):
    
    def get(self, request):
        return Response({'message': 'GET request successful. Ready to send a message via POST.'}, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ContactSerializer(data=request.data)  
        if serializer.is_valid():  
            subject = serializer.validated_data['subject']
            email = serializer.validated_data['email']
            message = serializer.validated_data['message']

            send_mail(
                subject,
                message,
                email,
                ['any'], 
            )

            return Response({'message': 'Email sent successfully'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
