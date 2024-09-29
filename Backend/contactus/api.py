# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from .models import Info
from .serializers import ContactSerializer
from rest_framework import generics  # type: ignore
from django.core.mail import send_mail
from django.conf import settings





class Contact(generics.ListCreateAPIView):
    queryset = Info.objects.all()
    serializer_class = ContactSerializer
    def create(self, request):
        serializer = ContactSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            
            subject = request.data.get('subject')  
            email = request.data.get('email')
            text_area = request.data.get('textarea')
            print(subject)
            print(email)
            print(text_area)


            send_mail(
                subject,  
                text_area,  
                settings.EMAIL_HOST_USER,  
                [email]  
                
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

