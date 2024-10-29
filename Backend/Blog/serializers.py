# from rest_framework import serializers
# from login.models import Trainer
# from .models import Post, Category, Comment, Profile, Bookmark

# # User Serializer
# class UserSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = Trainer
#         fields = '__all__'

# # Category Serializer
# class CategorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Category
#         fields = ['id', 'title', 'slug', 'image']

# # Comment Serializer
# class CommentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Comment
#         fields = ['id', 'post', 'user', 'comment', 'reply', 'date']

# # Post Serializer
# class PostSerializer(serializers.ModelSerializer):
#     # user = UserSerializer(read_only=True)  # Display user details in the post
#     # category = CategorySerializer(read_only=True)  # Display category details
#     comments = serializers.SerializerMethodField()  # Handle comments as a method field
#     likes = serializers.SerializerMethodField()  # Handle likes as a method field

#     class Meta:
#         model = Post
#         fields = [
#             'id', 'title', 'description', 'tags', 'image', 'status', 'view', 
#             'likes', 'slug', 'date', 'user', 'category', 'comments'
#         ]

#     def get_comments(self, obj):
#         """Returns the list of related comments."""
#         comments = Comment.objects.filter(post=obj).order_by("-id")
#         return CommentSerializer(comments, many=True).data

#     def get_likes(self, obj):
#         """Returns the list of users who liked the post."""
#         likes = obj.likes.all()
#         return UserSerializer(likes, many=True).data

# # Profile Serializer
# class ProfileSerializer(serializers.ModelSerializer):
#     user = UserSerializer(read_only=True)  # Display user details in the profile

#     class Meta:
#         model = Profile
#         fields = '__all__'

# class BookmarkSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Bookmark
#         fields = ['id', 'user', 'post', 'date']


from rest_framework import serializers
from login.models import Trainer, SuperUser  # Import both Trainer and SuperUser
from .models import Post, Category, Comment, Profile, Bookmark

# Trainer Serializer
class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = '__all__'

# SuperUser Serializer
class SuperUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuperUser
        fields = ['id', 'first_name', 'last_name', 'email', 'gender', 'image', 'phone']  # List only available fields

# User Serializer with Conditional Fields
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'

    def to_representation(self, instance):
        if isinstance(instance, Trainer):
            return TrainerSerializer(instance).data
        elif isinstance(instance, SuperUser):
            return SuperUserSerializer(instance).data
        return super().to_representation(instance)

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

# Bookmark Serializer
class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ['id', 'user', 'post', 'date']


class TopPostSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'image', 'description', 'view', 'likes_count', 'comments_count', 'slug', 'date']

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comment_set.count()