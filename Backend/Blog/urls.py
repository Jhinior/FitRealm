from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, PostViewSet, CategoryViewSet, CommentViewSet ,ProfileViewSet, BookmarkViewSet, BookmarkViewSet2,topPostViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'posts', PostViewSet)
router.register(r'TopPosts', topPostViewSet, basename='toppost')
router.register(r'categories', CategoryViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'profiles', ProfileViewSet, basename='profiles')
router.register(r'bookmarks', BookmarkViewSet)
urlpatterns = [
    path('bookmarks/<int:user_id>/', BookmarkViewSet2.as_view({'get': 'list'}), name='user-bookmarks'),
    path('api/user/profile/<int:user_id>/', ProfileViewSet.as_view({'get': 'list'}), name='user-profile-list'),
    path('', include(router.urls)),
]
