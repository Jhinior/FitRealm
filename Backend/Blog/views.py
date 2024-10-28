from rest_framework import viewsets, permissions
from rest_framework.permissions import AllowAny
from .models import User, Post, Category, Comment, Profile, Bookmark
from .serializers import UserSerializer, PostSerializer, CategorySerializer, CommentSerializer, ProfileSerializer, BookmarkSerializer,TopPostSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CategoryViewSet(viewsets.ModelViewSet):    
    permission_classes = [AllowAny]

    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class PostViewSet(viewsets.ModelViewSet):    
    permission_classes = [AllowAny]

    queryset = Post.objects.all()
    serializer_class = PostSerializer

class CommentViewSet(viewsets.ModelViewSet):    
    permission_classes = [AllowAny]

    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class ProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]

    serializer_class = ProfileSerializer
    # permission_classes = [permissions.IsAuthenticated]  # Optional: require authentication

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        if user_id is not None:
            return Profile.objects.filter(user__id=user_id)
        return Profile.objects.all()  # Return all profiles if no user_id is provided
    

class BookmarkViewSet(viewsets.ModelViewSet):
    queryset = Bookmark.objects.all()
    serializer_class = BookmarkSerializer
    permission_classes = [AllowAny]  

    def get_queryset(self):
        return Bookmark.objects.all()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)  
        else:
            serializer.save()  


class BookmarkViewSet2(viewsets.ViewSet):
    permission_classes = [AllowAny]  
    def list(self, request, user_id=None):
        if user_id is not None:
            bookmarks = Bookmark.objects.filter(user_id=user_id)
            serializer = BookmarkSerializer(bookmarks, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "User ID not provided"}, status=status.HTTP_400_BAD_REQUEST)





from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Post
from .serializers import TopPostSerializer
from django.db import models

class topPostViewSet(viewsets.ViewSet):
    """
    A viewset for listing the top 10 posts by likes, views, and comments.
    """
    permission_classes = [AllowAny] 
    @action(detail=False, methods=['get'])
    def top_liked(self, request):
        permission_classes = [AllowAny] 
        top_liked_posts = Post.objects.annotate(num_likes=models.Count('likes')).order_by('-num_likes')[:10]
        serializer = TopPostSerializer(top_liked_posts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def top_viewed(self, request):
        permission_classes = [AllowAny] 
        top_viewed_posts = Post.objects.order_by('-view')[:10]
        serializer = TopPostSerializer(top_viewed_posts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def top_commented(self, request):
        permission_classes = [AllowAny] 
        top_commented_posts = Post.objects.annotate(num_comments=models.Count('comment')).order_by('-num_comments')[:10]
        serializer = TopPostSerializer(top_commented_posts, many=True)
        return Response(serializer.data)
