from rest_framework import serializers
from login.models import User
from .models import Post, Category, Comment, Profile

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'first_name', 'last_name', 'gender', 'image', 'phone', 'weight', 
                  'height', 'subscribed_date', 'end_date', 'plan', 'assigned_trainer']

# Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title', 'slug', 'image']

# Comment Serializer
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'comment', 'reply', 'date']

# Post Serializer
class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Display user details in the post
    # category = CategorySerializer(read_only=True)  # Display category details
    comments = serializers.SerializerMethodField()  # Handle comments as a method field
    likes = serializers.SerializerMethodField()  # Handle likes as a method field

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'description', 'tags', 'image', 'status', 'view', 
            'likes', 'slug', 'date', 'user', 'category', 'comments'
        ]

    def get_comments(self, obj):
        """Returns the list of related comments."""
        comments = Comment.objects.filter(post=obj).order_by("-id")
        return CommentSerializer(comments, many=True).data

    def get_likes(self, obj):
        """Returns the list of users who liked the post."""
        likes = obj.likes.all()
        return UserSerializer(likes, many=True).data

# Profile Serializer
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Display user details in the profile

    class Meta:
        model = Profile
        fields = '__all__'
