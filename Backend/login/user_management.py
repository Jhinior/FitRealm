# # user_management.py

# from rest_framework.authtoken.models import Token
# from .models import User  # Replace `your_app` with the name of your app

# def create_user_with_token(email, first_name, last_name, password=None):
#     user = User.objects.create_user(email=email, first_name=first_name, last_name=last_name, password=password)
    
#     # Check if a token already exists for the user
#     token, created = Token.objects.get_or_create(user=user)
    
#     return user, token
