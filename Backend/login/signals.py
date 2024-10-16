# #signals.py

# from django.conf import settings
# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from rest_framework.authtoken.models import Token
# from .models import User, Trainer
# from django.contrib.auth.tokens import default_token_generator

# from django.db.models.signals import post_delete

# @receiver(post_delete, sender=User)
# def delete_user_token(sender, instance, **kwargs):
#     Token.objects.filter(user=instance).delete()


# @receiver(post_save, sender=settings.AUTH_USER_MODEL)
# def create_user_auth_token(sender, instance=None, created=False, **kwargs):
#     if created:
#         Token.objects.create(user=instance)

# # Signal to create token for both User and Trainer
# @receiver(post_save, sender=Trainer)
# def create_trainer_auth_token(sender, instance, created, **kwargs):
#     if created:
#         # Create token for Trainer instance
#         Token.objects.create(user=instance)

# @receiver(post_save, sender=User)
# def create_user_auth_token(sender, instance, created, **kwargs):
#     if created:
#         # Create token for User instance
#         Token.objects.create(user=instance)

# def create_user_with_token(email, first_name, last_name, password=None):
#     user = User.objects.create_user(email=email, first_name=first_name, last_name=last_name, password=password)
    
#     # Check if a token already exists for the user
#     token, created = Token.objects.get_or_create(user=user)
    
#     return user, token


from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from .models import SuperUser, User, Trainer
from django.conf import settings
from rest_framework.authtoken.models import Token

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.get_or_create(user=instance)

