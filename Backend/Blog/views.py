from rest_framework import viewsets, permissions
from rest_framework.permissions import AllowAny
from .models import User, Post, Category, Comment, Profile, Bookmark
from .serializers import UserSerializer, PostSerializer, CategorySerializer, CommentSerializer, ProfileSerializer, BookmarkSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotAuthenticated

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