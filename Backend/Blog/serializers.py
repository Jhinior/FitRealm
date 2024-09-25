from rest_framework import serializers
from .models import User, Post, Category, Comment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'mobile', 'full_name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title', 'slug', 'image']


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'post', 'name', 'email', 'comment', 'reply', 'date']

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # To show user details in the post
    category = CategorySerializer(read_only=True)  # To show category details
    comments = CommentSerializer(many=True, read_only=True)  # To show related comments

    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'tags', 'image', 'status', 'view', 'likes', 'slug', 'date', 'user', 'category', 'comments']
