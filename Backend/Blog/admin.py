from django.contrib import admin
from .models import Category, Post, Comment, Bookmark, Notification, User, Profile

# Register your models here.
admin.site.register(Profile)
admin.site.register(Category)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Bookmark)
admin.site.register(Notification)
