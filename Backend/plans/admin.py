from django.contrib import admin

# Register your models here.

from .models import Plan, Subscription

admin.site.register(Plan) 
admin.site.register(Subscription) 
