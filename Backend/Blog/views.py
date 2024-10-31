from rest_framework import viewsets, permissions, status
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

    @action(detail=True, methods=['post'], url_path='like')
    def like_post(self, request, pk=None):
        post = self.get_object()
        user = request.user

        if post.likes.filter(id=user.id).exists():
            # If user has already liked the post, remove the like
            post.likes.remove(user)
            liked = False
        else:
            # Otherwise, add the like
            post.likes.add(user)
            liked = True

        # Return the updated count of likes and the like status
        return Response({
            "liked": liked,
            "likes_count": post.likes.count()
        }, status=status.HTTP_200_OK)

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
    permission_classes = [AllowAny]  # Change this to IsAuthenticated if needed
    queryset = Bookmark.objects.all()
    serializer_class = BookmarkSerializer

    def create(self, request, *args, **kwargs):
        user = request.data.get('user')
        post = request.data.get('post')

        # Check if the bookmark already exists
        if Bookmark.objects.filter(user_id=user, post_id=post).exists():
            return Response(
                {"detail": "Bookmark already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Proceed to create the bookmark
        return super(BookmarkViewSet, self).create(request, *args, **kwargs)


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




from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Bookmark
from .serializers import BookmarkSerializer

class BookmarkViewSetDELETE(viewsets.ViewSet):  # Using ViewSet for custom actions
    permission_classes = [AllowAny]  # Change this to IsAuthenticated if needed

    def destroy(self, request, user_id, post_id):
        try:
            # Attempt to get the bookmark based on user_id and post_id
            bookmark = Bookmark.objects.get(user_id=user_id, post_id=post_id)
            bookmark.delete()  # Delete the bookmark
            return Response(
                {"detail": "Bookmark deleted successfully."},
                status=status.HTTP_204_NO_CONTENT
            )
        except Bookmark.DoesNotExist:
            return Response(
                {"detail": "Bookmark not found."},
                status=status.HTTP_404_NOT_FOUND
            )