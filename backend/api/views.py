from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.db.models import Sum
from rest_framework import status
from rest_framework.decorators import api_view, APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from datetime import datetime
import json
import random
from api import serializer as api_serializer
from api import models as api_models


class MyTokenObtainPairView(TokenObtainPairView): # Customizes the behavior of the token generation view, allowing for a custom serializer when obtaining JWT tokens.
  serializer_class = api_serializer.MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView): #CreateAPIView = helps in creating new object (user)
  queryset = api_models.User.objects.all()
  permission_classes = (AllowAny,) #any user can access this view
  serializer_class = api_serializer.RegisterSerializer


class ProfileView(generics.RetrieveUpdateAPIView): # RetrieveUpdateAPIView = define how to retrieve the object that will be updated or retrieved.
  permission_classes = (AllowAny,)
  serializer_class = api_serializer.ProfileSerializer

  def get_object(self):
    user_id = self.kwargs['user_id'] #user_id is being extracted from the URL parameters
    user = api_models.User.objects.get(id=user_id) #searching the user who has that id matched
    profile = api_models.Profile.objects.get(user=user) #getting his profile
    return profile


class CategoryListAPIView(generics.ListAPIView): #ListAPIView provides functionality for listing objects
  serializer_class = api_serializer.CategorySerializer
  permission_classes = [AllowAny]

  def get_queryset(self):
    return api_models.Category.objects.all() # will be the list of categories that is serialized and returned in the response.


class PostCategoryListAPIView(generics.ListAPIView): # view will list the posts belonging to a specific category, filtered by the category slug.
  serializer_class = api_serializer.PostSerializer
  permission_classes = [AllowAny]

  def get_queryset(self):
    category_slug = self.kwargs['category_slug']
    category = api_models.Category.objects.get(slug=category_slug)
    return api_models.Post.objects.filter(category=category, status="Active")


class PostListAPIView(generics.ListAPIView): # view will list all posts without any filtering.
  serializer_class = api_serializer.PostSerializer
  permission_classes = [AllowAny]

  def get_queryset(self):
    return api_models.Post.objects.filter(status="Active")
  
  
class PostDetailAPIView(generics.RetrieveAPIView): #class for retrieving a single object
  serializer_class = api_serializer.PostSerializer
  permission_classes = [AllowAny]

  def get_object(self):
    slug = self.kwargs['slug']
    post = api_models.Post.objects.get(slug=slug, status="Active") # It fetches the post with the given slug and ensures the post is active
    post.view += 1
    post.save() # Saves the updated view count back to the database.
    return post # returns the post object, which will be serialized and sent in the response.


class LikePostAPIView(APIView): # handle POST requests to like or dislike a post.
  def post(self, request):
    user_id = request.data.get('user_id') # the ID of the user who is liking or disliking the post
    post_id = request.data.get('post_id') # the ID of the post being liked or disliked

    user = api_models.User.objects.get(id=user_id)
    post = api_models.Post.objects.get(id=post_id)

    if user in post.likes.all():
      post.likes.remove(user)
      return Response({"message": "Post Disliked"}, status=status.HTTP_200_OK)
    else:
      post.likes.add(user)
      api_models.Notification.objects.create(
        user=post.user,
        post=post,
        type="Like",
      )
      return Response({"message": "Post Liked"}, status=status.HTTP_201_CREATED)


class PostCommentAPIView(APIView): # handle POST requests to add comments to posts.
  def post(self, request):
    post_id = request.data['post_id'] #post on which comment is done
    name = request.data['name'] #name of commenter
    email = request.data['email']
    comment = request.data['comment']

    post = api_models.Post.objects.get(id=post_id)

    api_models.Comment.objects.create( #Creates a new Comment object in the database
      post=post,
      name=name,
      email=email,
      comment=comment,
    )

    api_models.Notification.objects.create(
      user=post.user,
      post=post,
      type="Comment",
    )

    return Response({"message": "Comment Sent"}, status=status.HTTP_201_CREATED)


class BookmarkPostAPIView(APIView): # handle POST requests to bookmark or unbookmark a post.
  def post(self, request):
    user_id = request.data['user_id']
    post_id = request.data['post_id']

    user = api_models.User.objects.get(id=user_id)
    post = api_models.Post.objects.get(id=post_id)

    bookmark = api_models.Bookmark.objects.filter(post=post, user=user).first()
    if bookmark:
      bookmark.delete()
      return Response({"message": "Post Un-Bookmarked"}, status=status.HTTP_200_OK)
    else:
      api_models.Bookmark.objects.create(
        user=user,
        post=post
      )

      api_models.Notification.objects.create(
        user=post.user,
        post=post,
        type="Bookmark",
      )
      return Response({"message": "Post Bookmarked"}, status=status.HTTP_201_CREATED)


class DashboardStats(generics.ListAPIView):
  serializer_class = api_serializer.AuthorStats
  permission_classes = [AllowAny]

  def get_queryset(self):
    user_id = self.kwargs['user_id']
    user = api_models.User.objects.get(id=user_id)

    views = api_models.Post.objects.filter(user=user).aggregate(view=Sum("view"))['view']
    posts = api_models.Post.objects.filter(user=user).count()
    likes = api_models.Post.objects.filter(user=user).aggregate(total_likes=Sum("likes"))['total_likes']
    bookmarks = api_models.Bookmark.objects.all().count()

    return [{
      "views": views,
      "posts": posts,
      "likes": likes,
      "bookmarks": bookmarks,
    }]
  
  def list(self, request, *args, **kwargs):
    querset = self.get_queryset()
    serializer = self.get_serializer(querset, many=True)
    return Response(serializer.data)


class DashboardPostLists(generics.ListAPIView):
  serializer_class = api_serializer.PostSerializer
  permission_classes = [AllowAny]

  def get_queryset(self):
    user_id = self.kwargs['user_id']
    user = api_models.User.objects.get(id=user_id)

    return api_models.Post.objects.filter(user=user).order_by("-id")


class DashboardCommentLists(generics.ListAPIView):
  serializer_class = api_serializer.CommentSerializer
  permission_classes = [AllowAny]

  def get_queryset(self):
    return api_models.Comment.objects.all()


class DashboardNotificationLists(generics.ListAPIView):
  serializer_class = api_serializer.NotificationSerializer
  permission_classes = [AllowAny]

  def get_queryset(self):
    user_id = self.kwargs['user_id']
    user = api_models.User.objects.get(id=user_id)

    return api_models.Notification.objects.filter(seen=False, user=user)


class DashboardMarkNotiSeenAPIView(APIView):
  def post(self, request):
    noti_id = request.data['noti_id']
    noti = api_models.Notification.objects.get(id=noti_id)

    noti.seen = True
    noti.save()

    return Response({"message": "Noti Marked As Seen"}, status=status.HTTP_200_OK)


class DashboardPostCommentAPIView(APIView):
  def post(self, request):
    comment_id = request.data['comment_id']
    reply = request.data['reply']

    comment = api_models.Comment.objects.get(id=comment_id)
    comment.reply = reply
    comment.save()

    return Response({"message": "Comment Response Sent"}, status=status.HTTP_201_CREATED)


class DashboardPostCreateAPIView(generics.CreateAPIView):
  serializer_class = api_serializer.PostSerializer
  permission_classes = [AllowAny]

  def create(self, request, *args, **kwargs):
    user_id = request.data.get('user_id')
    title = request.data.get('title')
    image = request.data.get('image')
    description = request.data.get('description')
    tags = request.data.get('tags')
    category_id = request.data.get('category')
    post_status = request.data.get('post_status')

    user = api_models.User.objects.get(id=user_id)
    category = api_models.Category.objects.get(id=category_id)

    post = api_models.Post.objects.create(
      user=user,
      title=title,
      image=image,
      description=description,
      tags=tags,
      category=category,
      status=post_status
    )

    return Response({"message": "Post Created Successfully"}, status=status.HTTP_201_CREATED)


class DashboardPostEditAPIView(generics.RetrieveUpdateDestroyAPIView):
  serializer_class = api_serializer.PostSerializer
  permission_classes = [AllowAny]

  def get_object(self):
    user_id = self.kwargs['user_id']
    post_id = self.kwargs['post_id']
    user = api_models.User.objects.get(id=user_id)
    return api_models.Post.objects.get(user=user, id=post_id)

  def update(self, request, *args, **kwargs):
    post_instance = self.get_object()

    title = request.data.get('title')
    image = request.data.get('image')
    description = request.data.get('description')
    tags = request.data.get('tags')
    category_id = request.data.get('category')
    post_status = request.data.get('post_status')

    category = api_models.Category.objects.get(id=category_id)

    post_instance.title = title
    if image != "undefined":
      post_instance.image = image
    post_instance.description = description
    post_instance.tags = tags
    post_instance.category = category
    post_instance.status = post_status
    post_instance.save()

    return Response({"message": "Post Updated Successfully"}, status=status.HTTP_200_OK)
