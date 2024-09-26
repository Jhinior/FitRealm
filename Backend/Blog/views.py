from rest_framework import viewsets, permissions
from .models import User, Post, Category, Comment, Profile
from .serializers import UserSerializer, PostSerializer, CategorySerializer, CommentSerializer, ProfileSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]  # Optional: require authentication

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        if user_id is not None:
            return Profile.objects.filter(user__id=user_id)
        return Profile.objects.all()  # Return all profiles if no user_id is provided