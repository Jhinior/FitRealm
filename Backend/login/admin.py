from django.contrib import admin
from .models import Plan, Trainer, User

# # Register your models here.

admin.site.register(Plan)
admin.site.register(User)
admin.site.register(Trainer)