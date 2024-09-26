from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, PostViewSet, CategoryViewSet, CommentViewSet ,ProfileViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'posts', PostViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'profiles', ProfileViewSet, basename='profiles')
urlpatterns = [
     path('api/user/profile/<int:user_id>/', ProfileViewSet.as_view({'get': 'list'}), name='user-profile-list'),
    path('', include(router.urls)),
]
